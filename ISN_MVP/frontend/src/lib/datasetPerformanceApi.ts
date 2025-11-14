import { supabase } from './supabase';

export interface DatasetMetrics {
  id: string;
  name: string;
  slug: string;
  type: string;
  qualityScore: number;
  totalDownloads: number;
  totalAccesses: number;
  sizeGb: number;
  activeUsers: number;
  errorRate: number;
  samples: number;
  version: string;
  lastUpdated: string;
}

export interface QualityTrend {
  date: string;
  [key: string]: string | number;
}

export interface UsageTrend {
  date: string;
  [key: string]: string | number;
}

export interface LanguageCoverage {
  language: string;
  sampleCount: number;
  qualityScore: number;
}

export const fetchDatasetMetrics = async (): Promise<DatasetMetrics[]> => {
  const { data: datasets, error: datasetsError } = await supabase
    .from('datasets')
    .select('*')
    .eq('status', 'active');

  if (datasetsError) throw datasetsError;

  const datasetMetrics = await Promise.all(
    (datasets || []).map(async (dataset) => {
      const { data: latestMetric } = await supabase
        .from('dataset_performance_metrics')
        .select('*')
        .eq('dataset_id', dataset.id)
        .order('timestamp', { ascending: false })
        .limit(1)
        .maybeSingle();

      const lastUpdated = dataset.updated_at
        ? getRelativeTime(new Date(dataset.updated_at))
        : 'N/A';

      return {
        id: dataset.id,
        name: dataset.name,
        slug: dataset.slug,
        type: dataset.type,
        qualityScore: latestMetric?.quality_score
          ? Number(latestMetric.quality_score.toFixed(1))
          : dataset.quality_score || 0,
        totalDownloads: latestMetric?.total_downloads || 0,
        totalAccesses: latestMetric?.total_accesses || 0,
        sizeGb: latestMetric?.size_gb
          ? Number(latestMetric.size_gb.toFixed(1))
          : dataset.size_gb || 0,
        activeUsers: latestMetric?.active_users || 0,
        errorRate: latestMetric?.error_rate
          ? Number(latestMetric.error_rate.toFixed(2))
          : 0,
        samples: latestMetric?.total_samples || dataset.samples || 0,
        version: dataset.version || 'N/A',
        lastUpdated,
      };
    })
  );

  return datasetMetrics;
};

export const fetchQualityTrend = async (period: string = '7d'): Promise<QualityTrend[]> => {
  const days = period === '24h' ? 1 : period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: datasets, error: datasetsError } = await supabase
    .from('datasets')
    .select('id, name, slug')
    .eq('status', 'active');

  if (datasetsError) throw datasetsError;

  const { data: metrics, error: metricsError } = await supabase
    .from('dataset_performance_metrics')
    .select('dataset_id, timestamp, quality_score')
    .gte('timestamp', startDate.toISOString())
    .order('timestamp', { ascending: true });

  if (metricsError) throw metricsError;

  const dateMap = new Map<string, Record<string, number>>();

  metrics?.forEach((metric) => {
    const date = new Date(metric.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const dataset = datasets?.find((d) => d.id === metric.dataset_id);

    if (dataset) {
      if (!dateMap.has(date)) {
        dateMap.set(date, { date });
      }
      const entry = dateMap.get(date)!;
      entry[dataset.name] = Number(metric.quality_score.toFixed(1));
    }
  });

  return Array.from(dateMap.values());
};

export const fetchUsageTrend = async (period: string = '7d'): Promise<UsageTrend[]> => {
  const days = period === '24h' ? 1 : period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: datasets, error: datasetsError } = await supabase
    .from('datasets')
    .select('id, name, slug')
    .eq('status', 'active');

  if (datasetsError) throw datasetsError;

  const { data: usageHistory, error: usageError } = await supabase
    .from('dataset_usage_history')
    .select('dataset_id, date, downloads, accesses')
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (usageError) throw usageError;

  const dateMap = new Map<string, Record<string, number>>();

  usageHistory?.forEach((usage) => {
    const date = new Date(usage.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const dataset = datasets?.find((d) => d.id === usage.dataset_id);

    if (dataset) {
      if (!dateMap.has(date)) {
        dateMap.set(date, { date });
      }
      const entry = dateMap.get(date)!;
      entry[dataset.name] = usage.downloads;
    }
  });

  return Array.from(dateMap.values());
};

export const fetchLanguageCoverage = async (): Promise<LanguageCoverage[]> => {
  const { data, error } = await supabase
    .from('dataset_language_coverage')
    .select('language, sample_count, quality_score')
    .order('sample_count', { ascending: false })
    .limit(10);

  if (error) throw error;

  const languageMap = new Map<string, { sampleCount: number; qualityScore: number; count: number }>();

  data?.forEach((item) => {
    if (languageMap.has(item.language)) {
      const existing = languageMap.get(item.language)!;
      existing.sampleCount += item.sample_count;
      existing.qualityScore += Number(item.quality_score);
      existing.count += 1;
    } else {
      languageMap.set(item.language, {
        sampleCount: item.sample_count,
        qualityScore: Number(item.quality_score),
        count: 1,
      });
    }
  });

  return Array.from(languageMap.entries())
    .map(([language, stats]) => ({
      language,
      sampleCount: stats.sampleCount,
      qualityScore: Number((stats.qualityScore / stats.count).toFixed(1)),
    }))
    .sort((a, b) => b.sampleCount - a.sampleCount)
    .slice(0, 8);
};

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}
