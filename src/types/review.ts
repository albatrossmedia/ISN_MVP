export interface ReviewQueueItem {
  review_id: string;
  job_id: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  language: string;
  assigned_to?: string;
  created_at: string;
  due_date?: string;
  quality_score?: number;
}

export interface ReviewSubmission {
  review_id: string;
  job_id: string;
  edits: SubtitleEdit[];
  comments?: string;
  approved: boolean;
}

export interface SubtitleEdit {
  segment_index: number;
  original_text: string;
  edited_text: string;
  start_time?: number;
  end_time?: number;
  change_type: 'text' | 'timing' | 'both';
}

export interface ReviewDiff {
  job_id: string;
  original: SubtitleSegment[];
  edited: SubtitleSegment[];
  changes: Change[];
}

export interface SubtitleSegment {
  index: number;
  start_time: number;
  end_time: number;
  text: string;
}

export interface Change {
  segment_index: number;
  type: 'added' | 'removed' | 'modified';
  field: 'text' | 'timing';
  old_value?: string | number;
  new_value?: string | number;
}

export interface ReviewAnalytics {
  total_reviews: number;
  completed_reviews: number;
  avg_review_time: number;
  reviewers: ReviewerStats[];
  quality_improvements: QualityImprovement[];
}

export interface ReviewerStats {
  reviewer_id: string;
  reviewer_name: string;
  reviews_completed: number;
  avg_time: number;
  accuracy_score: number;
}

export interface QualityImprovement {
  metric: string;
  before: number;
  after: number;
  improvement_percentage: number;
}
