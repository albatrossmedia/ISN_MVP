/*
  # Create Model Performance Metrics Tables

  ## Overview
  This migration creates tables for tracking AI model performance metrics including
  accuracy, latency, throughput, cost, and error rates over time.

  ## New Tables

  ### 1. `model_performance_metrics`
  Stores timestamped performance metrics for each model.

  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for the metric entry
  - `model_id` (uuid, not null, foreign key) - Reference to models table
  - `timestamp` (timestamptz, not null) - When the metric was recorded
  - `accuracy` (numeric) - Model accuracy percentage (0-100)
  - `latency_ms` (integer) - Average response time in milliseconds
  - `throughput_per_min` (integer) - Number of requests processed per minute
  - `cost_per_1k` (numeric) - Cost per 1000 requests in USD
  - `error_rate` (numeric) - Error rate percentage (0-100)
  - `total_requests` (integer) - Total number of requests processed
  - `successful_requests` (integer) - Number of successful requests
  - `failed_requests` (integer) - Number of failed requests
  - `created_at` (timestamptz, default now()) - Record creation timestamp

  ### 2. `model_language_performance`
  Stores language-specific performance metrics for models.

  **Columns:**
  - `id` (uuid, primary key) - Unique identifier
  - `model_id` (uuid, not null, foreign key) - Reference to models table
  - `language` (text, not null) - Language code or name
  - `accuracy` (numeric) - Language-specific accuracy percentage
  - `total_requests` (integer) - Total requests for this language
  - `avg_latency_ms` (integer) - Average latency for this language
  - `updated_at` (timestamptz, default now()) - Last update timestamp

  ### 3. `model_version_history`
  Tracks version changes and deployments for models.

  **Columns:**
  - `id` (uuid, primary key) - Unique identifier
  - `model_id` (uuid, not null, foreign key) - Reference to models table
  - `version` (text, not null) - Version identifier
  - `deployed_at` (timestamptz, not null) - When this version was deployed
  - `notes` (text) - Version notes and changes
  - `is_active` (boolean, default false) - Whether this is the current active version
  - `created_at` (timestamptz, default now()) - Record creation timestamp

  ## Security

  1. Enable RLS on all tables
  2. Allow public read access for viewing metrics
  3. Restrict write access to authenticated users only

  ## Indexes

  - Index on model_id and timestamp for time-series queries
  - Index on language for language-specific lookups
  - Composite indexes for common query patterns
*/

-- Create model_performance_metrics table
CREATE TABLE IF NOT EXISTS model_performance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  timestamp timestamptz NOT NULL DEFAULT now(),
  accuracy numeric CHECK (accuracy >= 0 AND accuracy <= 100),
  latency_ms integer CHECK (latency_ms >= 0),
  throughput_per_min integer CHECK (throughput_per_min >= 0),
  cost_per_1k numeric CHECK (cost_per_1k >= 0),
  error_rate numeric CHECK (error_rate >= 0 AND error_rate <= 100),
  total_requests integer DEFAULT 0,
  successful_requests integer DEFAULT 0,
  failed_requests integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create model_language_performance table
CREATE TABLE IF NOT EXISTS model_language_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  language text NOT NULL,
  accuracy numeric CHECK (accuracy >= 0 AND accuracy <= 100),
  total_requests integer DEFAULT 0,
  avg_latency_ms integer CHECK (avg_latency_ms >= 0),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(model_id, language)
);

-- Create model_version_history table
CREATE TABLE IF NOT EXISTS model_version_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  version text NOT NULL,
  deployed_at timestamptz NOT NULL DEFAULT now(),
  notes text,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_perf_metrics_model_timestamp ON model_performance_metrics(model_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_perf_metrics_timestamp ON model_performance_metrics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_lang_perf_model_id ON model_language_performance(model_id);
CREATE INDEX IF NOT EXISTS idx_lang_perf_language ON model_language_performance(language);
CREATE INDEX IF NOT EXISTS idx_version_history_model_id ON model_version_history(model_id);
CREATE INDEX IF NOT EXISTS idx_version_history_active ON model_version_history(model_id, is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE model_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_language_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_version_history ENABLE ROW LEVEL SECURITY;

-- Policies for model_performance_metrics
CREATE POLICY "Anyone can view performance metrics"
  ON model_performance_metrics FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert performance metrics"
  ON model_performance_metrics FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for model_language_performance
CREATE POLICY "Anyone can view language performance"
  ON model_language_performance FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert language performance"
  ON model_language_performance FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update language performance"
  ON model_language_performance FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for model_version_history
CREATE POLICY "Anyone can view version history"
  ON model_version_history FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert version history"
  ON model_version_history FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert sample performance metrics for the last 7 days
INSERT INTO model_performance_metrics (model_id, timestamp, accuracy, latency_ms, throughput_per_min, cost_per_1k, error_rate, total_requests, successful_requests, failed_requests)
SELECT
  m.id,
  now() - (interval '1 day' * generate_series(6, 0, -1)),
  CASE m.slug
    WHEN 'isn-asr' THEN 94.2 + (random() * 0.6)
    WHEN 'isn-mt' THEN 91.8 + (random() * 0.6)
    WHEN 'isn-qa' THEN 96.3 + (random() * 0.5)
    WHEN 'isn-contextnet' THEN 88.9 + (random() * 0.4)
    WHEN 'isn-lexicon' THEN 97.8 + (random() * 0.3)
    ELSE 90.0 + (random() * 5)
  END,
  CASE m.slug
    WHEN 'isn-asr' THEN 1280 - (random() * 30)::integer
    WHEN 'isn-mt' THEN 920 - (random() * 30)::integer
    WHEN 'isn-qa' THEN 360 - (random() * 20)::integer
    WHEN 'isn-contextnet' THEN 690 - (random() * 20)::integer
    WHEN 'isn-lexicon' THEN 130 - (random() * 10)::integer
    ELSE 500
  END,
  CASE m.slug
    WHEN 'isn-asr' THEN 125
    WHEN 'isn-mt' THEN 180
    WHEN 'isn-qa' THEN 450
    WHEN 'isn-contextnet' THEN 210
    WHEN 'isn-lexicon' THEN 820
    ELSE 200
  END,
  CASE m.slug
    WHEN 'isn-asr' THEN 0.45
    WHEN 'isn-mt' THEN 0.32
    WHEN 'isn-qa' THEN 0.15
    WHEN 'isn-contextnet' THEN 0.28
    WHEN 'isn-lexicon' THEN 0.08
    ELSE 0.20
  END,
  CASE m.slug
    WHEN 'isn-asr' THEN 0.12
    WHEN 'isn-mt' THEN 0.08
    WHEN 'isn-qa' THEN 0.03
    WHEN 'isn-contextnet' THEN 0.15
    WHEN 'isn-lexicon' THEN 0.02
    ELSE 0.10
  END,
  (random() * 10000 + 5000)::integer,
  (random() * 9800 + 4900)::integer,
  (random() * 200 + 100)::integer
FROM models m
WHERE m.slug IN ('isn-asr', 'isn-mt', 'isn-qa', 'isn-contextnet', 'isn-lexicon');

-- Insert sample language performance data
INSERT INTO model_language_performance (model_id, language, accuracy, total_requests, avg_latency_ms)
SELECT
  m.id,
  lang,
  90 + (random() * 8),
  (random() * 40000 + 10000)::integer,
  CASE m.slug
    WHEN 'isn-asr' THEN 1250
    WHEN 'isn-mt' THEN 890
    WHEN 'isn-qa' THEN 340
    WHEN 'isn-contextnet' THEN 670
    WHEN 'isn-lexicon' THEN 120
    ELSE 500
  END
FROM models m
CROSS JOIN unnest(ARRAY['Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam']) AS lang
WHERE m.slug IN ('isn-asr', 'isn-mt', 'isn-qa', 'isn-contextnet', 'isn-lexicon')
  AND lang = ANY(m.languages)
ON CONFLICT (model_id, language) DO NOTHING;

-- Insert version history
INSERT INTO model_version_history (model_id, version, deployed_at, notes, is_active)
SELECT
  m.id,
  m.version,
  now() - interval '2 hours',
  'Current production version with improved performance',
  true
FROM models m
WHERE m.slug IN ('isn-asr', 'isn-mt', 'isn-qa', 'isn-contextnet', 'isn-lexicon');
