export type OnboardingStep =
  | 'welcome'
  | 'profile_setup'
  | 'demo_workflow'
  | 'api_key_setup'
  | 'first_workflow'
  | 'complete';

export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export type AnnouncementType = 'new_feature' | 'improvement' | 'update';

export type ActivityType =
  | 'login'
  | 'logout'
  | 'workflow_created'
  | 'api_key_generated'
  | 'demo_viewed'
  | 'feature_used';

export interface UserOnboarding {
  id: string;
  user_id: string;
  step: OnboardingStep;
  completed_steps: OnboardingStep[];
  is_completed: boolean;
  skipped: boolean;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  show_tooltips: boolean;
  show_welcome_message: boolean;
  theme: 'light' | 'dark' | 'auto';
  notifications_enabled: boolean;
  email_notifications: boolean;
  tutorial_completed: boolean;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  action_url?: string;
  action_label?: string;
  is_read: boolean;
  is_dismissed: boolean;
  priority: number;
  expires_at?: string;
  created_at: string;
}

export interface FeatureAnnouncement {
  id: string;
  title: string;
  description: string;
  type: AnnouncementType;
  target_roles: string[];
  image_url?: string;
  action_url?: string;
  action_label?: string;
  is_active: boolean;
  priority: number;
  published_at: string;
  expires_at?: string;
  created_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: ActivityType;
  activity_data: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface OnboardingContextType {
  onboarding: UserOnboarding | null;
  preferences: UserPreferences | null;
  notifications: UserNotification[];
  announcements: FeatureAnnouncement[];
  loading: boolean;
  startOnboarding: () => Promise<void>;
  completeStep: (step: OnboardingStep) => Promise<void>;
  skipOnboarding: () => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  dismissNotification: (id: string) => Promise<void>;
  logActivity: (type: ActivityType, data?: Record<string, any>) => Promise<void>;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action: () => void;
  icon: React.ComponentType<{ className?: string }>;
}

export interface TourStep {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  disableBeacon?: boolean;
}
