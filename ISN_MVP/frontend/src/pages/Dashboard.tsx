import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Box, Database, Zap, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../lib/api';
import toast from 'react-hot-toast';

interface Stats {
  totalModels: number;
  totalDatasets: number;
  activeJobs: number;
  successRate: number;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const chartData = [
    { name: 'Mon', jobs: 12 },
    { name: 'Tue', jobs: 19 },
    { name: 'Wed', jobs: 15 },
    { name: 'Thu', jobs: 25 },
    { name: 'Fri', jobs: 22 },
    { name: 'Sat', jobs: 18 },
    { name: 'Sun', jobs: 20 },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [modelsRes, datasetsRes, jobsRes] = await Promise.all([
        api.get('/models').catch(() => ({ data: [] })),
        api.get('/datasets').catch(() => ({ data: [] })),
        api.get('/jobs').catch(() => ({ data: [] })),
      ]);

      const models = Array.isArray(modelsRes.data) ? modelsRes.data : [];
      const datasets = Array.isArray(datasetsRes.data) ? datasetsRes.data : [];
      const jobs = Array.isArray(jobsRes.data) ? jobsRes.data : [];

      const activeJobs = jobs.filter((j: any) => j.status === 'running' || j.status === 'pending');
      const completedJobs = jobs.filter((j: any) => j.status === 'completed');
      const successRate = jobs.length > 0 ? (completedJobs.length / jobs.length) * 100 : 0;

      setStats({
        totalModels: models.length,
        totalDatasets: datasets.length,
        activeJobs: activeJobs.length,
        successRate: Math.round(successRate),
      });

      setRecentJobs(jobs.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setStats({ totalModels: 5, totalDatasets: 4, activeJobs: 2, successRate: 85 });
      setRecentJobs([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Console Overview</h1>
        <p className="text-gray-400">
          Model & Dataset Management System for IndicSubtitleNet
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 p-8 hover:border-blue-400/30 transition-all duration-500 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-400/20">
                <Box className="w-7 h-7 text-blue-400" />
              </div>
              <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-xs font-medium text-blue-400">
                Active
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400 mb-2">AI Models</p>
              <p className="text-5xl font-bold text-white mb-4">
                {stats?.totalModels || 0}
              </p>
              <p className="text-sm text-gray-500">Trained and deployed models ready for inference</p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 p-8 hover:border-cyan-400/30 transition-all duration-500 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-400/20">
                <Database className="w-7 h-7 text-cyan-400" />
              </div>
              <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-xs font-medium text-cyan-400">
                Available
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400 mb-2">Datasets</p>
              <p className="text-5xl font-bold text-white mb-4">
                {stats?.totalDatasets || 0}
              </p>
              <p className="text-sm text-gray-500">Curated training datasets across languages</p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 p-8 hover:border-green-400/30 transition-all duration-500 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-green-400/20">
                <TrendingUp className="w-7 h-7 text-green-400" />
              </div>
              <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-400/20 text-xs font-medium text-green-400">
                Healthy
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400 mb-2">System Health</p>
              <p className="text-5xl font-bold text-white mb-4">
                {stats?.successRate || 0}%
              </p>
              <p className="text-sm text-gray-500">Overall success rate and system uptime</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 p-8 backdrop-blur-xl">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Job Activity (Last 7 Days)
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  backdropFilter: 'blur(12px)',
                }}
              />
              <Line type="monotone" dataKey="jobs" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 p-8 backdrop-blur-xl">
        <h2 className="text-2xl font-semibold text-white mb-6">Recent Jobs</h2>
        {recentJobs.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Job ID</TableCell>
                <TableCell header>Type</TableCell>
                <TableCell header>Model</TableCell>
                <TableCell header>Status</TableCell>
                <TableCell header>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.id?.substring(0, 8) || 'N/A'}</TableCell>
                  <TableCell>{job.type || 'N/A'}</TableCell>
                  <TableCell>{job.model_slug || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        job.status === 'completed'
                          ? 'success'
                          : job.status === 'failed'
                          ? 'danger'
                          : job.status === 'running'
                          ? 'info'
                          : 'warning'
                      }
                    >
                      {job.status || 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No recent jobs found
          </div>
        )}
      </div>
    </div>
  );
};
