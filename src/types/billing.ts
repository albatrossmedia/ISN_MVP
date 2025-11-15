export interface UsageParams {
  start_date?: string;
  end_date?: string;
  provider?: string;
  group_by?: 'day' | 'week' | 'month';
}

export interface UsageData {
  total_minutes: number;
  total_cost: number;
  breakdown: UsageBreakdown[];
  trends: UsageTrend[];
}

export interface UsageBreakdown {
  provider: string;
  minutes: number;
  cost: number;
  percentage: number;
}

export interface UsageTrend {
  date: string;
  minutes: number;
  cost: number;
  jobs: number;
}

export interface EstimateRequest {
  duration_minutes: number;
  source_language: string;
  target_languages: string[];
  models: {
    asr?: string;
    mt?: string;
  };
  provider?: string;
}

export interface EstimateResult {
  estimated_cost: number;
  breakdown: CostBreakdown[];
  duration_estimate: number;
  currency: string;
}

export interface CostBreakdown {
  service: string;
  provider: string;
  cost: number;
  unit: string;
}

export interface ForecastRequest {
  historical_days: number;
  forecast_days: number;
  growth_rate?: number;
}

export interface ForecastResult {
  forecast: ForecastPoint[];
  confidence_interval: {
    lower: number;
    upper: number;
  };
  total_projected: number;
}

export interface ForecastPoint {
  date: string;
  projected_cost: number;
  projected_minutes: number;
}

export interface Invoice {
  invoice_id: string;
  period_start: string;
  period_end: string;
  total_amount: number;
  status: 'pending' | 'paid' | 'overdue';
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}
