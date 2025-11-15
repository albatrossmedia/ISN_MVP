import { apiClient } from './client';
import type {
  EvaluationRequest,
  EvaluationResult,
  ComparisonRequest,
  ComparisonResult,
  EvaluationReport
} from '../../types/evaluation';

export const evaluationApi = {
  evaluateAsr: async (data: EvaluationRequest) => {
    const response = await apiClient.post<EvaluationResult>('/evaluate', data);
    return response.data;
  },

  evaluateMt: async (data: EvaluationRequest) => {
    const response = await apiClient.post<EvaluationResult>('/evaluate/mt', data);
    return response.data;
  },

  compareProviders: async (data: ComparisonRequest) => {
    const response = await apiClient.post<ComparisonResult>('/evaluate/compare', data);
    return response.data;
  },

  getReports: async (params?: { start_date?: string; end_date?: string }) => {
    const response = await apiClient.get<EvaluationReport[]>('/evaluate/reports', { params });
    return response.data;
  },

  getQaMetrics: async (jobId: string) => {
    const response = await apiClient.post('/qa/metrics', { job_id: jobId });
    return response.data;
  },

  getSqiScore: async (jobId: string) => {
    const response = await apiClient.get('/sqi/score', { params: { job_id: jobId } });
    return response.data;
  },

  getSqiTrend: async (days: number = 7) => {
    const response = await apiClient.get('/sqi/trend', { params: { days } });
    return response.data;
  },
};
