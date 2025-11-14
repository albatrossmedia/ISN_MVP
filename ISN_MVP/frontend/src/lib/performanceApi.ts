import { supabase } from './supabase';

export interface ModelMetrics {
  id: string;
  name: string;
  slug: string;
  type: string;
  accuracy: number;
  latency: number;
  throughput: number;
  costPer1k: number;
  errorRate: number;
  version: string;
  lastUpdated: string;
}

export interface PerformanceTrend {
  date: string;
  [key: string]: string | number;
}

export interface LanguagePerformance {
  language: string;
  accuracy: number;
  requests: number;
}

export const fetchModelMetrics = async (): Promise<ModelMetrics[]> => {
  const { data: models, error: modelsError } = await supabase
    .from('models')
    .select('*')
    .eq('status', 'active');

  if (modelsError) throw modelsError;

  const modelMetrics = await Promise.all(
    (models || []).map(async (model) => {
      const { data: latestMetric } = await supabase
        .from('model_performance_metrics')
        .select('*')
        .eq('model_id', model.id)
        .order('timestamp', { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data: versionData } = await supabase
        .from('model_version_history')
        .select('deployed_at')
        .eq('model_id', model.id)
        .eq('is_active', true)
        .maybeSingle();

      const lastUpdated = versionData?.deployed_at
        ? getRelativeTime(new Date(versionData.deployed_at))
        : 'N/A';

      return {
        id: model.id,
        name: model.name,
        slug: model.slug,
        type: model.type,
        accuracy: latestMetric?.accuracy ? Number(latestMetric.accuracy.toFixed(1)) : model.accuracy || 0,
        latency: latestMetric?.latency_ms || 0,
        throughput: latestMetric?.throughput_per_min || 0,
        costPer1k: latestMetric?.cost_per_1k ? Number(latestMetric.cost_per_1k.toFixed(2)) : 0,
        errorRate: latestMetric?.error_rate ? Number(latestMetric.error_rate.toFixed(2)) : 0,
        version: model.version || 'N/A',
        lastUpdated,
      };
    })
  );

  return modelMetrics;
};

export const fetchAccuracyTrend = async (period: string = '7d'): Promise<PerformanceTrend[]> => {
  const days = period === '24h' ? 1 : period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: models, error: modelsError } = await supabase
    .from('models')
    .select('id, name, slug')
    .eq('status', 'active');

  if (modelsError) throw modelsError;

  const { data: metrics, error: metricsError } = await supabase
    .from('model_performance_metrics')
    .select('model_id, timestamp, accuracy')
    .gte('timestamp', startDate.toISOString())
    .order('timestamp', { ascending: true });

  if (metricsError) throw metricsError;

  const dateMap = new Map<string, Record<string, number>>();

  metrics?.forEach((metric) => {
    const date = new Date(metric.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const model = models?.find((m) => m.id === metric.model_id);

    if (model) {
      if (!dateMap.has(date)) {
        dateMap.set(date, { date });
      }
      const entry = dateMap.get(date)!;
      entry[model.name] = Number(metric.accuracy.toFixed(1));
    }
  });

  return Array.from(dateMap.values());
};

export const fetchLatencyTrend = async (period: string = '7d'): Promise<PerformanceTrend[]> => {
  const days = period === '24h' ? 1 : period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: models, error: modelsError } = await supabase
    .from('models')
    .select('id, name, slug')
    .eq('status', 'active');

  if (modelsError) throw modelsError;

  const { data: metrics, error: metricsError } = await supabase
    .from('model_performance_metrics')
    .select('model_id, timestamp, latency_ms')
    .gte('timestamp', startDate.toISOString())
    .order('timestamp', { ascending: true });

  if (metricsError) throw metricsError;

  const dateMap = new Map<string, Record<string, number>>();

  metrics?.forEach((metric) => {
    const date = new Date(metric.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const model = models?.find((m) => m.id === metric.model_id);

    if (model) {
      if (!dateMap.has(date)) {
        dateMap.set(date, { date });
      }
      const entry = dateMap.get(date)!;
      entry[model.name] = metric.latency_ms;
    }
  });

  return Array.from(dateMap.values());
};

export const fetchLanguagePerformance = async (): Promise<LanguagePerformance[]> => {
  const { data, error } = await supabase
    .from('model_language_performance')
    .select('language, accuracy, total_requests')
    .order('total_requests', { ascending: false })
    .limit(8);

  if (error) throw error;

  const languageMap = new Map<string, { accuracy: number; requests: number; count: number }>();

  data?.forEach((item) => {
    if (languageMap.has(item.language)) {
      const existing = languageMap.get(item.language)!;
      existing.accuracy += Number(item.accuracy);
      existing.requests += item.total_requests;
      existing.count += 1;
    } else {
      languageMap.set(item.language, {
        accuracy: Number(item.accuracy),
        requests: item.total_requests,
        count: 1,
      });
    }
  });

  return Array.from(languageMap.entries())
    .map(([language, stats]) => ({
      language,
      accuracy: Number((stats.accuracy / stats.count).toFixed(1)),
      requests: stats.requests,
    }))
    .sort((a, b) => b.requests - a.requests)
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
