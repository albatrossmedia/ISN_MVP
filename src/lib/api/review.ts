import { apiClient } from './client';
import type {
  ReviewQueueItem,
  ReviewSubmission,
  ReviewDiff,
  ReviewAnalytics
} from '../../types/review';

export const reviewApi = {
  getQueue: async (filters?: { status?: string; priority?: string; assigned_to?: string }) => {
    const response = await apiClient.get<ReviewQueueItem[]>('/review/queue', { params: filters });
    return response.data;
  },

  queueJob: async (jobId: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    const response = await apiClient.post('/review/queue', { job_id: jobId, priority });
    return response.data;
  },

  submitReview: async (data: ReviewSubmission) => {
    const response = await apiClient.post('/review/submit', data);
    return response.data;
  },

  getDiff: async (jobId: string) => {
    const response = await apiClient.get<ReviewDiff>('/review/diff', { params: { job_id: jobId } });
    return response.data;
  },

  getAnalytics: async (params?: { start_date?: string; end_date?: string }) => {
    const response = await apiClient.get<ReviewAnalytics>('/review/analytics', { params });
    return response.data;
  },

  assignReviewer: async (reviewId: string, reviewerId: string) => {
    const response = await apiClient.post(`/review/${reviewId}/assign`, { reviewer_id: reviewerId });
    return response.data;
  },

  updatePriority: async (reviewId: string, priority: 'low' | 'medium' | 'high') => {
    const response = await apiClient.patch(`/review/${reviewId}/priority`, { priority });
    return response.data;
  },
};
