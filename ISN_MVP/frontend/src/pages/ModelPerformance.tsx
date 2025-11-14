import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Zap, Clock, Target, DollarSign, Activity, AlertTriangle, RefreshCw } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  fetchModelMetrics,
  fetchAccuracyTrend,
  fetchLatencyTrend,
  fetchLanguagePerformance,
  type ModelMetrics,
  type PerformanceTrend,
  type LanguagePerformance,
} from '../lib/performanceApi';

export const ModelPerformance: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics[]>([]);
  const [accuracyTrend, setAccuracyTrend] = useState<PerformanceTrend[]>([]);
  const [latencyTrend, setLatencyTrend] = useState<PerformanceTrend[]>([]);
  const [languagePerformance, setLanguagePerformance] = useState<LanguagePerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPerformanceData();
  }, [selectedPeriod]);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      const [metrics, accuracy, latency, language] = await Promise.all([
        fetchModelMetrics(),
        fetchAccuracyTrend(selectedPeriod),
        fetchLatencyTrend(selectedPeriod),
        fetchLanguagePerformance(),
      ]);

      setModelMetrics(metrics);
      setAccuracyTrend(accuracy);
      setLatencyTrend(latency);
      setLanguagePerformance(language);
    } catch (error) {
      console.error('Error loading performance data:', error);
      toast.error('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPerformanceData();
    setRefreshing(false);
    toast.success('Performance data refreshed');
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
            Model Performance Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Real-time metrics and analytics for IndicSubtitleNet AI models
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
        {modelMetrics.map((model) => (
          <Card key={model.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {model.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full font-mono">
                    {model.version}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {model.lastUpdated}
                  </span>
                </div>
              </div>
              <div
                className={`p-2 rounded-lg ${
                  model.accuracy >= 95
                    ? 'bg-green-500/10'
                    : model.accuracy >= 90
                    ? 'bg-yellow-500/10'
                    : 'bg-red-500/10'
                }`}
              >
                <Target
                  className={`h-5 w-5 ${
                    model.accuracy >= 95
                      ? 'text-green-600 dark:text-green-400'
                      : model.accuracy >= 90
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Accuracy</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {model.accuracy}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    model.accuracy >= 95
                      ? 'bg-green-600'
                      : model.accuracy >= 90
                      ? 'bg-yellow-600'
                      : 'bg-red-600'
                  }`}
                  style={{ width: `${model.accuracy}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <Clock className="h-3 w-3" />
                    <span>Latency</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {model.latency}ms
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <Zap className="h-3 w-3" />
                    <span>Throughput</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {model.throughput}/min
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <DollarSign className="h-3 w-3" />
                    <span>Cost</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    ${model.costPer1k}/1k
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Error Rate</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {model.errorRate}%
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {accuracyTrend.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                Accuracy Trend
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Model accuracy over time (higher is better)
              </p>
            </div>
            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={accuracyTrend}>
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
              {Object.keys(accuracyTrend[0] || {})
                .filter((key) => key !== 'date')
                .map((key, idx) => {
                  const colors = ['#06B6D4', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
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

      {latencyTrend.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                Latency Trend
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Average response time in milliseconds (lower is better)
              </p>
            </div>
            <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={latencyTrend}>
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
              {Object.keys(latencyTrend[0] || {})
                .filter((key) => key !== 'date')
                .map((key, idx) => {
                  const colors = ['#06B6D4', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
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

      {languagePerformance.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                Performance by Language
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Accuracy and request volume across Indian languages
              </p>
            </div>
            <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={languagePerformance}>
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
              <Bar yAxisId="left" dataKey="accuracy" fill="#8B5CF6" name="Accuracy (%)" />
              <Bar yAxisId="right" dataKey="requests" fill="#06B6D4" name="Requests" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
};
