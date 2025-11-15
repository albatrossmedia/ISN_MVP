export interface EvaluationRequest {
  reference_text: string;
  hypothesis_text: string;
  language?: string;
  metrics?: string[];
}

export interface EvaluationResult {
  wer?: number;
  cer?: number;
  bleu?: number;
  comet?: number;
  details?: {
    insertions: number;
    deletions: number;
    substitutions: number;
  };
}

export interface ComparisonRequest {
  job_id: string;
  providers: string[];
  metrics: string[];
}

export interface ComparisonResult {
  job_id: string;
  comparisons: ProviderComparison[];
  winner: string;
  timestamp: string;
}

export interface ProviderComparison {
  provider: string;
  metrics: Record<string, number>;
  output: string;
  cost: number;
  duration: number;
}

export interface EvaluationReport {
  report_id: string;
  job_id: string;
  created_at: string;
  metrics: Record<string, number>;
  summary: string;
  recommendations: string[];
}
