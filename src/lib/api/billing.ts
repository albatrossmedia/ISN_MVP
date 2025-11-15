import { apiClient } from './client';
import type {
  UsageParams,
  UsageData,
  EstimateRequest,
  EstimateResult,
  ForecastRequest,
  ForecastResult,
  Invoice
} from '../../types/billing';

export const billingApi = {
  getUsage: async (params?: UsageParams) => {
    const response = await apiClient.get<UsageData>('/billing/usage', { params });
    return response.data;
  },

  estimate: async (data: EstimateRequest) => {
    const response = await apiClient.post<EstimateResult>('/billing/estimate', data);
    return response.data;
  },

  forecast: async (data: ForecastRequest) => {
    const response = await apiClient.post<ForecastResult>('/billing/forecast', data);
    return response.data;
  },

  getInvoices: async () => {
    const response = await apiClient.get<Invoice[]>('/billing/invoice');
    return response.data;
  },

  getInvoiceById: async (invoiceId: string) => {
    const response = await apiClient.get<Invoice>(`/billing/invoice/${invoiceId}`);
    return response.data;
  },

  exportUsage: async (format: 'csv' | 'pdf', params?: UsageParams) => {
    const response = await apiClient.get('/billing/export', {
      params: { ...params, format },
      responseType: 'blob',
    });
    return response.data;
  },
};
