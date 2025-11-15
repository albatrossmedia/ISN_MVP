import { useEffect, useState } from 'react';
import { getSocket } from '../lib/socket';
import type { JobStatus } from '../types/workflow';

export const useJobMonitor = (jobId: string | undefined) => {
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    const socket = getSocket();

    const handleConnect = () => {
      setConnected(true);
      socket.emit('subscribe:job', { job_id: jobId });
    };

    const handleDisconnect = () => {
      setConnected(false);
    };

    const handleJobUpdate = (data: JobStatus) => {
      if (data.job_id === jobId) {
        setJobStatus(data);
      }
    };

    const handleJobProgress = (data: { job_id: string; progress: number; stage?: string }) => {
      if (data.job_id === jobId) {
        setJobStatus((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            progress: data.progress,
          };
        });
      }
    };

    const handleStageUpdate = (data: { job_id: string; stage: string; status: string; progress: number }) => {
      if (data.job_id === jobId) {
        setJobStatus((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            stages: prev.stages.map((s) =>
              s.stage === data.stage
                ? { ...s, status: data.status as any, progress: data.progress }
                : s
            ),
          };
        });
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('job:update', handleJobUpdate);
    socket.on('job:progress', handleJobProgress);
    socket.on('job:stage:update', handleStageUpdate);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.emit('unsubscribe:job', { job_id: jobId });
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('job:update', handleJobUpdate);
      socket.off('job:progress', handleJobProgress);
      socket.off('job:stage:update', handleStageUpdate);
    };
  }, [jobId]);

  return { jobStatus, connected };
};
