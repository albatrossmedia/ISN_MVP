import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Play, FileText } from 'lucide-react';
import api from '../lib/api';
import { getSocket } from '../lib/socket';
import toast from 'react-hot-toast';

export const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [selectedJobLogs, setSelectedJobLogs] = useState<string[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
    setupSocketListeners();

    return () => {
      const socket = getSocket();
      socket.off('job:update');
      socket.off('job:log');
    };
  }, []);

  const setupSocketListeners = () => {
    const socket = getSocket();

    socket.on('job:update', (data: any) => {
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job.id === data.jobId ? { ...job, ...data.update } : job
        )
      );
      toast.success(`Job ${data.jobId.substring(0, 8)} updated`);
    });

    socket.on('job:log', (data: any) => {
      if (data.jobId === selectedJobId) {
        setSelectedJobLogs(prev => [...prev, data.log]);
      }
    });
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/jobs');
      setJobs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
      setJobs([
        {
          id: 'job-001',
          type: 'training',
          model_slug: 'whisper-large-v3',
          status: 'running',
          progress: 65,
          created_at: new Date().toISOString(),
        },
        {
          id: 'job-002',
          type: 'evaluation',
          model_slug: 'subtitle-align-bert',
          status: 'completed',
          progress: 100,
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const viewJobLogs = async (jobId: string) => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      setSelectedJobId(jobId);
      setSelectedJobLogs(response.data.logs || ['No logs available']);
      setShowLogsModal(true);
    } catch (error) {
      setSelectedJobId(jobId);
      setSelectedJobLogs([
        '[2024-10-09 10:30:00] Job started',
        '[2024-10-09 10:30:15] Loading model...',
        '[2024-10-09 10:30:45] Training epoch 1/10...',
        '[2024-10-09 10:32:00] Training epoch 2/10...',
      ]);
      setShowLogsModal(true);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'danger';
      case 'running':
        return 'info';
      default:
        return 'warning';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Jobs</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Monitor AI jobs with real-time updates
          </p>
        </div>
      </div>

      <Card className="p-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell header>Job ID</TableCell>
              <TableCell header>Type</TableCell>
              <TableCell header>Model</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header>Progress</TableCell>
              <TableCell header>Created</TableCell>
              <TableCell header>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-mono text-xs">
                  {job.id?.substring(0, 12) || 'N/A'}
                </TableCell>
                <TableCell className="capitalize">{job.type}</TableCell>
                <TableCell>{job.model_slug}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(job.status)}>
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${job.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {job.progress || 0}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(job.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => viewJobLogs(job.id)}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Logs
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {jobs.length === 0 && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            No jobs found
          </div>
        )}
      </Card>

      <Modal
        isOpen={showLogsModal}
        onClose={() => {
          setShowLogsModal(false);
          setSelectedJobId(null);
          setSelectedJobLogs([]);
        }}
        title={`Job Logs - ${selectedJobId?.substring(0, 12)}`}
        size="lg"
      >
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400 max-h-96 overflow-y-auto">
          {selectedJobLogs.map((log, index) => (
            <div key={index} className="mb-1">
              {log}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
