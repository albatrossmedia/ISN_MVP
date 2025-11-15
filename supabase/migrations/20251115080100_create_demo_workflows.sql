/*
  # Create Demo Workflows Schema

  1. New Tables
    - `demo_workflows`
      - `id` (uuid, primary key)
      - `name` (text, workflow name)
      - `description` (text)
      - `category` (text, e.g., tutorial, showcase)
      - `difficulty` (text, beginner/intermediate/advanced)
      - `duration_seconds` (integer, estimated time)
      - `input_video_url` (text, sample video URL)
      - `output_srt_url` (text, result SRT URL)
      - `config` (jsonb, workflow configuration)
      - `stages` (jsonb, step-by-step stages)
      - `metrics` (jsonb, quality metrics)
      - `is_active` (boolean)
      - `sort_order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `workflow_templates`
      - `id` (uuid, primary key)
      - `name` (text, template name)
      - `description` (text)
      - `use_case` (text, what it's for)
      - `config` (jsonb, default configuration)
      - `required_models` (jsonb, ASR, MT, etc.)
      - `estimated_cost_per_minute` (numeric)
      - `is_public` (boolean)
      - `organization_id` (uuid, references organizations)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_workflow_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `organization_id` (uuid, references organizations)
      - `workflow_type` (text, demo/production)
      - `template_id` (uuid, references workflow_templates)
      - `input_file` (text, file path or URL)
      - `output_file` (text, result path or URL)
      - `status` (text, pending/running/completed/failed)
      - `progress` (integer, 0-100)
      - `config` (jsonb, workflow config used)
      - `stages_completed` (jsonb, stage progress)
      - `metrics` (jsonb, quality scores)
      - `error_message` (text)
      - `started_at` (timestamp)
      - `completed_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Public read access for demo workflows
    - Users can only access their own workflow history
    - Admins can manage templates
*/

-- Create demo_workflows table
CREATE TABLE IF NOT EXISTS demo_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'tutorial',
  difficulty text NOT NULL DEFAULT 'beginner',
  duration_seconds integer NOT NULL DEFAULT 60,
  input_video_url text,
  output_srt_url text,
  config jsonb DEFAULT '{}'::jsonb,
  stages jsonb DEFAULT '[]'::jsonb,
  metrics jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create workflow_templates table
CREATE TABLE IF NOT EXISTS workflow_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  use_case text NOT NULL,
  config jsonb DEFAULT '{}'::jsonb,
  required_models jsonb DEFAULT '{}'::jsonb,
  estimated_cost_per_minute numeric(10,4) DEFAULT 0.05,
  is_public boolean DEFAULT false,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_workflow_history table
CREATE TABLE IF NOT EXISTS user_workflow_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  workflow_type text NOT NULL DEFAULT 'production',
  template_id uuid REFERENCES workflow_templates(id) ON DELETE SET NULL,
  input_file text,
  output_file text,
  status text NOT NULL DEFAULT 'pending',
  progress integer DEFAULT 0,
  config jsonb DEFAULT '{}'::jsonb,
  stages_completed jsonb DEFAULT '[]'::jsonb,
  metrics jsonb DEFAULT '{}'::jsonb,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_demo_workflows_category ON demo_workflows(category);
CREATE INDEX IF NOT EXISTS idx_demo_workflows_difficulty ON demo_workflows(difficulty);
CREATE INDEX IF NOT EXISTS idx_demo_workflows_active ON demo_workflows(is_active);
CREATE INDEX IF NOT EXISTS idx_workflow_templates_org_id ON workflow_templates(organization_id);
CREATE INDEX IF NOT EXISTS idx_workflow_templates_public ON workflow_templates(is_public);
CREATE INDEX IF NOT EXISTS idx_user_workflow_history_user_id ON user_workflow_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_workflow_history_org_id ON user_workflow_history(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_workflow_history_status ON user_workflow_history(status);
CREATE INDEX IF NOT EXISTS idx_user_workflow_history_created_at ON user_workflow_history(created_at);

-- Enable Row Level Security
ALTER TABLE demo_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workflow_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for demo_workflows

-- Anyone can view active demo workflows
CREATE POLICY "Anyone can view active demo workflows"
  ON demo_workflows FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Super admins can manage demo workflows
CREATE POLICY "Super admins can manage demo workflows"
  ON demo_workflows FOR ALL
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

-- RLS Policies for workflow_templates

-- Users can view public templates
CREATE POLICY "Users can view public workflow templates"
  ON workflow_templates FOR SELECT
  TO authenticated
  USING (is_public = true);

-- Users can view templates in their organization
CREATE POLICY "Users can view organization templates"
  ON workflow_templates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.organization_id = workflow_templates.organization_id
      AND user_roles.is_active = true
    )
  );

-- Admins can create templates in their organization
CREATE POLICY "Admins can create workflow templates"
  ON workflow_templates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.organization_id = workflow_templates.organization_id
      AND user_roles.role IN ('super_admin', 'admin')
      AND user_roles.is_active = true
    )
  );

-- Admins can update templates in their organization
CREATE POLICY "Admins can update workflow templates"
  ON workflow_templates FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.organization_id = workflow_templates.organization_id
      AND user_roles.role IN ('super_admin', 'admin')
      AND user_roles.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.organization_id = workflow_templates.organization_id
      AND user_roles.role IN ('super_admin', 'admin')
      AND user_roles.is_active = true
    )
  );

-- RLS Policies for user_workflow_history

-- Users can view their own workflow history
CREATE POLICY "Users can view their own workflow history"
  ON user_workflow_history FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can view all workflows in their organization
CREATE POLICY "Admins can view organization workflow history"
  ON user_workflow_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.organization_id = user_workflow_history.organization_id
      AND user_roles.role IN ('super_admin', 'admin')
      AND user_roles.is_active = true
    )
  );

-- Users can create their own workflow records
CREATE POLICY "Users can create their own workflow history"
  ON user_workflow_history FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.organization_id = user_workflow_history.organization_id
      AND user_roles.is_active = true
    )
  );

-- Users can update their own workflow records
CREATE POLICY "Users can update their own workflow history"
  ON user_workflow_history FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create triggers for updated_at
CREATE TRIGGER update_demo_workflows_updated_at BEFORE UPDATE ON demo_workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_templates_updated_at BEFORE UPDATE ON workflow_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample demo workflows
INSERT INTO demo_workflows (name, description, category, difficulty, duration_seconds, config, stages, metrics, sort_order)
VALUES
(
  'Quick Start: English to Hindi Subtitles',
  'Learn the basics of subtitle generation by converting English audio to Hindi subtitles in under 2 minutes',
  'tutorial',
  'beginner',
  120,
  '{"source_language": "en", "target_languages": ["hi"], "models": {"asr": "whisper-large-v3", "mt": "google-nmt"}}'::jsonb,
  '[
    {"name": "ASR Processing", "duration": 30, "status": "completed", "description": "Converting speech to text"},
    {"name": "Translation", "duration": 20, "status": "completed", "description": "Translating to Hindi"},
    {"name": "Alignment", "duration": 15, "status": "completed", "description": "Syncing with video"},
    {"name": "Quality Check", "duration": 10, "status": "completed", "description": "Validating output"}
  ]'::jsonb,
  '{"wer": 0.12, "bleu": 0.78, "quality_score": 0.85}'::jsonb,
  1
),
(
  'Multi-Language Support',
  'Generate subtitles in multiple Indian languages simultaneously from English source',
  'showcase',
  'intermediate',
  180,
  '{"source_language": "en", "target_languages": ["hi", "ta", "te", "bn"], "models": {"asr": "whisper-large-v3", "mt": "mbart"}}'::jsonb,
  '[
    {"name": "ASR Processing", "duration": 40, "status": "completed"},
    {"name": "Parallel Translation", "duration": 60, "status": "completed"},
    {"name": "Multi-Language Alignment", "duration": 50, "status": "completed"},
    {"name": "Quality Assurance", "duration": 30, "status": "completed"}
  ]'::jsonb,
  '{"avg_wer": 0.14, "avg_bleu": 0.76}'::jsonb,
  2
),
(
  'Advanced: Context-Aware Translation',
  'Experience AI-powered contextual translation for better cultural adaptation',
  'showcase',
  'advanced',
  240,
  '{"source_language": "en", "target_languages": ["hi"], "models": {"asr": "isn-asr", "mt": "isn-mt", "context": "gemini-pro"}}'::jsonb,
  '[
    {"name": "Speech Recognition", "duration": 50, "status": "completed"},
    {"name": "Context Analysis", "duration": 60, "status": "completed"},
    {"name": "Contextual Translation", "duration": 70, "status": "completed"},
    {"name": "Style Formatting", "duration": 30, "status": "completed"},
    {"name": "Final QA", "duration": 30, "status": "completed"}
  ]'::jsonb,
  '{"wer": 0.09, "bleu": 0.82, "context_score": 0.91}'::jsonb,
  3
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample workflow templates
INSERT INTO workflow_templates (name, description, use_case, config, required_models, estimated_cost_per_minute, is_public)
VALUES
(
  'Basic Subtitle Generation',
  'Standard subtitle generation workflow for single language',
  'Quick subtitle generation for videos up to 30 minutes',
  '{"quality_threshold": 0.8, "streaming": false}'::jsonb,
  '{"asr": "whisper-large-v3", "mt": "google-nmt", "qa": "isn-qa"}'::jsonb,
  0.05,
  true
),
(
  'High Quality Multi-Language',
  'Premium workflow with context-aware translation for multiple languages',
  'Professional subtitle generation for films and documentaries',
  '{"quality_threshold": 0.9, "streaming": false, "use_context": true}'::jsonb,
  '{"asr": "isn-asr", "mt": "isn-mt", "context": "gemini-pro", "qa": "isn-qa"}'::jsonb,
  0.15,
  true
),
(
  'Real-Time Streaming',
  'Live subtitle generation with streaming support',
  'Live events, webinars, and real-time broadcasts',
  '{"quality_threshold": 0.75, "streaming": true, "latency_mode": "low"}'::jsonb,
  '{"asr": "google-stt", "mt": "google-nmt"}'::jsonb,
  0.08,
  true
)
ON CONFLICT (id) DO NOTHING;
