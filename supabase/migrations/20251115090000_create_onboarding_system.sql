/*
  # Create Onboarding and User Experience System

  1. New Tables
    - `user_onboarding`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `step` (text, current onboarding step)
      - `completed_steps` (jsonb, array of completed steps)
      - `is_completed` (boolean, overall completion status)
      - `skipped` (boolean, user skipped onboarding)
      - `started_at` (timestamp)
      - `completed_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `show_tooltips` (boolean, enable contextual help)
      - `show_welcome_message` (boolean)
      - `theme` (text, light/dark/auto)
      - `notifications_enabled` (boolean)
      - `email_notifications` (boolean)
      - `tutorial_completed` (boolean)
      - `preferences` (jsonb, additional settings)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `type` (text, info/warning/success/error)
      - `title` (text)
      - `message` (text)
      - `action_url` (text, optional link)
      - `action_label` (text, button text)
      - `is_read` (boolean)
      - `is_dismissed` (boolean)
      - `priority` (integer, 1-5)
      - `expires_at` (timestamp)
      - `created_at` (timestamp)

    - `feature_announcements`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `type` (text, new_feature/improvement/update)
      - `target_roles` (text[], which roles should see this)
      - `image_url` (text)
      - `action_url` (text)
      - `action_label` (text)
      - `is_active` (boolean)
      - `priority` (integer)
      - `published_at` (timestamp)
      - `expires_at` (timestamp)
      - `created_at` (timestamp)

    - `user_activity_log`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `activity_type` (text, login/logout/feature_used)
      - `activity_data` (jsonb)
      - `ip_address` (text)
      - `user_agent` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
    - Admins can view activity logs for their organization
*/

-- Create user_onboarding table
CREATE TABLE IF NOT EXISTS user_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  step text NOT NULL DEFAULT 'welcome',
  completed_steps jsonb DEFAULT '[]'::jsonb,
  is_completed boolean DEFAULT false,
  skipped boolean DEFAULT false,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  show_tooltips boolean DEFAULT true,
  show_welcome_message boolean DEFAULT true,
  theme text DEFAULT 'auto',
  notifications_enabled boolean DEFAULT true,
  email_notifications boolean DEFAULT true,
  tutorial_completed boolean DEFAULT false,
  preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user_notifications table
CREATE TABLE IF NOT EXISTS user_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'info',
  title text NOT NULL,
  message text NOT NULL,
  action_url text,
  action_label text,
  is_read boolean DEFAULT false,
  is_dismissed boolean DEFAULT false,
  priority integer DEFAULT 3,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create feature_announcements table
CREATE TABLE IF NOT EXISTS feature_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL DEFAULT 'new_feature',
  target_roles text[] DEFAULT ARRAY['super_admin', 'admin', 'client_user']::text[],
  image_url text,
  action_url text,
  action_label text,
  is_active boolean DEFAULT true,
  priority integer DEFAULT 3,
  published_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create user_activity_log table
CREATE TABLE IF NOT EXISTS user_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  activity_data jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_onboarding_user_id ON user_onboarding(user_id);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_completed ON user_onboarding(is_completed);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_read ON user_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_feature_announcements_active ON feature_announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_created_at ON user_activity_log(created_at);

-- Enable Row Level Security
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_onboarding

-- Users can view and update their own onboarding
CREATE POLICY "Users can view their own onboarding"
  ON user_onboarding FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own onboarding"
  ON user_onboarding FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert their own onboarding"
  ON user_onboarding FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for user_preferences

-- Users can manage their own preferences
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for user_notifications

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON user_notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON user_notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins can create notifications for users in their org
CREATE POLICY "Admins can create notifications"
  ON user_notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('super_admin', 'admin')
      AND user_roles.is_active = true
    )
  );

-- RLS Policies for feature_announcements

-- All authenticated users can view active announcements for their role
CREATE POLICY "Users can view announcements for their role"
  ON feature_announcements FOR SELECT
  TO authenticated
  USING (
    is_active = true AND
    (published_at IS NULL OR published_at <= now()) AND
    (expires_at IS NULL OR expires_at > now()) AND
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = ANY(target_roles)
    )
  );

-- Super admins can manage announcements
CREATE POLICY "Super admins can manage announcements"
  ON feature_announcements FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'super_admin'
      AND user_roles.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'super_admin'
      AND user_roles.is_active = true
    )
  );

-- RLS Policies for user_activity_log

-- Users can view their own activity
CREATE POLICY "Users can view their own activity"
  ON user_activity_log FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can view activity for their organization
CREATE POLICY "Admins can view organization activity"
  ON user_activity_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur1
      JOIN user_roles ur2 ON ur2.organization_id = ur1.organization_id
      WHERE ur1.user_id = auth.uid()
      AND ur2.user_id = user_activity_log.user_id
      AND ur1.role IN ('super_admin', 'admin')
      AND ur1.is_active = true
    )
  );

-- System can insert activity logs
CREATE POLICY "System can insert activity logs"
  ON user_activity_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_user_onboarding_updated_at BEFORE UPDATE ON user_onboarding
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user preferences on signup
CREATE OR REPLACE FUNCTION create_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO user_onboarding (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create preferences on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_preferences();

-- Insert sample feature announcements
INSERT INTO feature_announcements (title, description, type, target_roles, priority)
VALUES
(
  'Welcome to IndicSubtitleNet!',
  'Get started by exploring our demo workflows or creating your first subtitle generation workflow. Check out the quick start guide to learn the basics.',
  'new_feature',
  ARRAY['client_user']::text[],
  5
),
(
  'API Keys Now Available',
  'Generate your API keys to integrate subtitle generation into your applications. Go to API Keys section to create your first key.',
  'new_feature',
  ARRAY['client_user', 'admin']::text[],
  4
),
(
  'Organization Management',
  'Super admins can now manage multiple organizations, set quotas, and monitor usage across all clients.',
  'new_feature',
  ARRAY['super_admin']::text[],
  3
)
ON CONFLICT DO NOTHING;
