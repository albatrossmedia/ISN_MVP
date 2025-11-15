import { apiClient } from './client';
import type { WorkflowRequest, JobStatus, JobPreview, StreamingSession } from '../../types/workflow';

export const workflowsApi = {
  run: async (data: WorkflowRequest) => {
    const response = await apiClient.post<{ job_id: string }>('/models/run', data);
    return response.data;
  },

  getJobStatus: async (jobId: string) => {
    const response = await apiClient.get<JobStatus>(`/jobs/${jobId}`);
    return response.data;
  },

  getJobPreview: async (jobId: string) => {
    const response = await apiClient.get<JobPreview>(`/jobs/${jobId}/preview`);
    return response.data;
  },

  terminateJob: async (jobId: string) => {
    const response = await apiClient.post(`/jobs/${jobId}/terminate`);
    return response.data;
  },

  getJobSegments: async (jobId: string) => {
    const response = await apiClient.get(`/jobs/${jobId}/segments`);
    return response.data;
  },

  mergeSegments: async (jobId: string, segmentIds: string[]) => {
    const response = await apiClient.post(`/jobs/${jobId}/segments/merge`, { segment_ids: segmentIds });
    return response.data;
  },

  startAsrStream: async (config: { language: string; model?: string }) => {
    const response = await apiClient.post<StreamingSession>('/asr/stream/start', config);
    return response.data;
  },

  pushAudioChunk: async (sessionId: string, chunk: Blob) => {
    const formData = new FormData();
    formData.append('audio', chunk);
    const response = await apiClient.post(`/asr/stream/push`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { session_id: sessionId },
    });
    return response.data;
  },

  stopAsrStream: async (sessionId: string) => {
    const response = await apiClient.post('/asr/stream/stop', { session_id: sessionId });
    return response.data;
  },

  streamMtToken: async (sessionId: string, token: string) => {
    const response = await apiClient.post('/mt/stream/token', { session_id: sessionId, token });
    return response.data;
  },

  getLiveQa: async (jobId: string) => {
    const response = await apiClient.get(`/qa/live`, { params: { job_id: jobId } });
    return response.data;
  },
};
