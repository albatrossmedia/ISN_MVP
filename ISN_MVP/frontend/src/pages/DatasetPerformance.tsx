import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Database, Clock, Target, Users, Activity, AlertTriangle, RefreshCw, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  fetchDatasetMetrics,
  fetchQualityTrend,
  fetchUsageTrend,
  fetchLanguageCoverage,
  type DatasetMetrics,
  type QualityTrend,
  type UsageTrend,
  type LanguageCoverage,
} from '../lib/datasetPerformanceApi';

export const DatasetPerformance: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [datasetMetrics, setDatasetMetrics] = useState<DatasetMetrics[]>([]);
  const [qualityTrend, setQualityTrend] = useState<QualityTrend[]>([]);
  const [usageTrend, setUsageTrend] = useState<UsageTrend[]>([]);
  const [languageCoverage, setLanguageCoverage] = useState<LanguageCoverage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPerformanceData();
  }, [selectedPeriod]);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      const [metrics, quality, usage, language] = await Promise.all([
        fetchDatasetMetrics(),
        fetchQualityTrend(selectedPeriod),
        fetchUsageTrend(selectedPeriod),
        fetchLanguageCoverage(),
      ]);

      setDatasetMetrics(metrics);
      setQualityTrend(quality);
      setUsageTrend(usage);
      setLanguageCoverage(language);
    } catch (error) {
      console.error('Error loading dataset performance data:', error);
      toast.error('Failed to load dataset performance data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPerformanceData();
    setRefreshing(false);
    toast.success('Dataset performance data refreshed');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Dataset Performance Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Real-time metrics and analytics for IndicSubtitleNet datasets
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="flex gap-2">
        {(['24h', '7d', '30d', '90d'] as const).map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              selectedPeriod === period
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {period === '24h' && 'Last 24 Hours'}
            {period === '7d' && 'Last 7 Days'}
            {period === '30d' && 'Last 30 Days'}
            {period === '90d' && 'Last 90 Days'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {datasetMetrics.map((dataset) => (
          <Card key={dataset.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {dataset.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full font-mono">
                    {dataset.version}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {dataset.lastUpdated}
                  </span>
                </div>
              </div>
              <div
                className={`p-2 rounded-lg ${
                  dataset.qualityScore >= 95
                    ? 'bg-green-500/10'
                    : dataset.qualityScore >= 90
                    ? 'bg-yellow-500/10'
                    : 'bg-orange-500/10'
                }`}
              >
                <Target
                  className={`h-5 w-5 ${
                    dataset.qualityScore >= 95
                      ? 'text-green-600 dark:text-green-400'
                      : dataset.qualityScore >= 90
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-orange-600 dark:text-orange-400'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Quality Score</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {dataset.qualityScore}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    dataset.qualityScore >= 95
                      ? 'bg-green-600'
                      : dataset.qualityScore >= 90
                      ? 'bg-yellow-600'
                      : 'bg-orange-600'
                  }`}
                  style={{ width: `${dataset.qualityScore}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <Database className="h-3 w-3" />
                    <span>Size</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {dataset.sizeGb} GB
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <Activity className="h-3 w-3" />
                    <span>Samples</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {dataset.samples.toLocaleString()}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <Download className="h-3 w-3" />
                    <span>Downloads</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {dataset.totalDownloads.toLocaleString()}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <Users className="h-3 w-3" />
                    <span>Active Users</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {dataset.activeUsers}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {qualityTrend.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                Quality Score Trend
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Dataset quality scores over time (higher is better)
              </p>
            </div>
            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={qualityTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis dataKey="date" className="text-slate-600 dark:text-slate-400" />
              <YAxis domain={[85, 100]} className="text-slate-600 dark:text-slate-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                }}
              />
              <Legend />
              {Object.keys(qualityTrend[0] || {})
                .filter((key) => key !== 'date')
                .map((key, idx) => {
                  const colors = ['#10B981', '#06B6D4', '#8B5CF6', '#F59E0B', '#EF4444'];
                  return (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={colors[idx % colors.length]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  );
                })}
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {usageTrend.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                Download Trend
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Number of downloads per dataset over time
              </p>
            </div>
            <Download className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={usageTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis dataKey="date" className="text-slate-600 dark:text-slate-400" />
              <YAxis className="text-slate-600 dark:text-slate-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                }}
              />
              <Legend />
              {Object.keys(usageTrend[0] || {})
                .filter((key) => key !== 'date')
                .map((key, idx) => {
                  const colors = ['#10B981', '#06B6D4', '#8B5CF6', '#F59E0B', '#EF4444'];
                  return (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={colors[idx % colors.length]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  );
                })}
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {languageCoverage.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                Language Coverage
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Sample count and quality score across Indian languages
              </p>
            </div>
            <BarChart3 className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={languageCoverage}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis dataKey="language" className="text-slate-600 dark:text-slate-400" />
              <YAxis yAxisId="left" className="text-slate-600 dark:text-slate-400" />
              <YAxis yAxisId="right" orientation="right" className="text-slate-600 dark:text-slate-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                }}
              />
              <Legend />
              <Bar yAxisId="right" dataKey="sampleCount" fill="#06B6D4" name="Sample Count" />
              <Bar yAxisId="left" dataKey="qualityScore" fill="#10B981" name="Quality Score (%)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
};
