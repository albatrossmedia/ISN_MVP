export interface WorkflowRequest {
  input: {
    video_path?: string;
    audio_path?: string;
    source_language: string;
    target_languages: string[];
  };
  models: {
    asr?: string;
    mt?: string;
    context?: string;
    qa?: string;
  };
  config?: {
    streaming?: boolean;
    chunk_size?: number;
    quality_threshold?: number;
  };
}

export interface JobStatus {
  job_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  stages: StageStatus[];
  created_at: string;
  updated_at: string;
  result?: JobResult;
  error?: string;
}

export interface StageStatus {
  stage: 'asr' | 'mt' | 'context' | 'align' | 'qa';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  started_at?: string;
  completed_at?: string;
  error?: string;
}

export interface JobResult {
  output_path: string;
  subtitle_format: string;
  duration: number;
  segment_count: number;
  quality_score?: number;
}

export interface JobPreview {
  job_id: string;
  segments: SubtitleSegment[];
  metadata: {
    duration: number;
    language: string;
    format: string;
  };
}

export interface SubtitleSegment {
  index: number;
  start_time: number;
  end_time: number;
  text: string;
  translation?: string;
  confidence?: number;
}

export interface StreamingSession {
  session_id: string;
  status: 'active' | 'stopped' | 'error';
  chunks_processed: number;
  started_at: string;
}
