import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, XCircle, RefreshCw, Eye, ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ProgressTracker } from '../components/ui/ProgressTracker';
import { workflowsApi } from '../lib/api';
import type { JobStatus, JobPreview } from '../types/workflow';
import toast from 'react-hot-toast';

export const JobMonitor = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobStatus | null>(null);
  const [preview, setPreview] = useState<JobPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [terminating, setTerminating] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    fetchJobStatus();
    const interval = setInterval(fetchJobStatus, 3000);

    return () => clearInterval(interval);
  }, [jobId]);

  const fetchJobStatus = async () => {
    if (!jobId) return;

    try {
      const data = await workflowsApi.getJobStatus(jobId);
      setJob(data);

      if (data.status === 'completed' && !preview) {
        fetchPreview();
      }
    } catch (err: any) {
      console.error('Failed to fetch job status:', err);
      toast.error('Failed to fetch job status');
    } finally {
      setLoading(false);
    }
  };

  const fetchPreview = async () => {
    if (!jobId) return;

    try {
      const data = await workflowsApi.getJobPreview(jobId);
      setPreview(data);
    } catch (err: any) {
      console.error('Failed to fetch preview:', err);
    }
  };

  const handleTerminate = async () => {
    if (!jobId) return;

    if (!confirm('Are you sure you want to cancel this job?')) return;

    setTerminating(true);
    try {
      await workflowsApi.terminateJob(jobId);
      toast.success('Job cancelled successfully');
      fetchJobStatus();
    } catch (err: any) {
      toast.error('Failed to cancel job');
    } finally {
      setTerminating(false);
    }
  };

  const handleDownload = () => {
    if (!job?.result?.output_path) return;
    window.open(job.result.output_path, '_blank');
    toast.success('Download started');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'running':
        return 'primary';
      case 'failed':
        return 'danger';
      case 'cancelled':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Job not found</p>
        <Button onClick={() => navigate('/dashboard/jobs')} className="mt-4">
          Back to Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/dashboard/jobs')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Job Monitor
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Job ID: {jobId}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Badge variant={getStatusBadgeVariant(job.status)}>
            {job.status.toUpperCase()}
          </Badge>
          {job.status === 'running' && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleTerminate}
              disabled={terminating}
            >
              {terminating ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Job
                </>
              )}
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={fetchJobStatus}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Workflow Progress
          </h2>

          {job.status === 'running' && (
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Overall Progress</span>
                <span>{job.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${job.progress}%` }}
                />
              </div>
            </div>
          )}

          <ProgressTracker stages={job.stages} />
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Job Details
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Created</dt>
                <dd className="text-gray-900 dark:text-white font-medium">
                  {new Date(job.created_at).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Last Updated</dt>
                <dd className="text-gray-900 dark:text-white font-medium">
                  {new Date(job.updated_at).toLocaleString()}
                </dd>
              </div>
              {job.result && (
                <>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Duration</dt>
                    <dd className="text-gray-900 dark:text-white font-medium">
                      {formatDuration(job.result.duration)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Segments</dt>
                    <dd className="text-gray-900 dark:text-white font-medium">
                      {job.result.segment_count}
                    </dd>
                  </div>
                  {job.result.quality_score && (
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">Quality Score</dt>
                      <dd className="text-gray-900 dark:text-white font-medium">
                        {(job.result.quality_score * 100).toFixed(1)}%
                      </dd>
                    </div>
                  )}
                </>
              )}
            </dl>
          </Card>

          {job.status === 'completed' && job.result && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Actions
              </h2>
              <div className="space-y-2">
                <Button
                  variant="primary"
                  onClick={handleDownload}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Subtitles
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
              </div>
            </Card>
          )}

          {job.error && (
            <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <h2 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
                Error Details
              </h2>
              <p className="text-sm text-red-700 dark:text-red-300">{job.error}</p>
            </Card>
          )}
        </div>
      </div>

      {showPreview && preview && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Subtitle Preview
          </h2>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {preview.segments.map((segment) => (
              <div
                key={segment.index}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    #{segment.index}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {segment.start_time.toFixed(2)}s - {segment.end_time.toFixed(2)}s
                  </span>
                </div>
                <p className="text-sm text-gray-900 dark:text-white">{segment.text}</p>
                {segment.translation && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 italic">
                    {segment.translation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
