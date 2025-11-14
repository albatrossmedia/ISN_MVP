/*
  # Create Dataset Performance Metrics Tables

  ## Overview
  This migration creates tables for tracking dataset performance metrics including
  quality scores, usage statistics, download patterns, and language-specific coverage over time.

  ## New Tables

  ### 1. `dataset_performance_metrics`
  Stores timestamped performance metrics for each dataset.

  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for the metric entry
  - `dataset_id` (uuid, not null, foreign key) - Reference to datasets table
  - `timestamp` (timestamptz, not null) - When the metric was recorded
  - `quality_score` (numeric) - Dataset quality score percentage (0-100)
  - `total_downloads` (integer) - Total number of downloads
  - `total_accesses` (integer) - Total number of accesses/views
  - `total_samples` (integer) - Number of samples in the dataset at this time
  - `size_gb` (numeric) - Dataset size in gigabytes
  - `active_users` (integer) - Number of active users using this dataset
  - `error_rate` (numeric) - Data error/corruption rate percentage (0-100)
  - `created_at` (timestamptz, default now()) - Record creation timestamp

  ### 2. `dataset_language_coverage`
  Stores language-specific coverage and quality metrics for datasets.

  **Columns:**
  - `id` (uuid, primary key) - Unique identifier
  - `dataset_id` (uuid, not null, foreign key) - Reference to datasets table
  - `language` (text, not null) - Language code or name
  - `sample_count` (integer) - Number of samples for this language
  - `quality_score` (numeric) - Language-specific quality percentage
  - `coverage_percentage` (numeric) - Percentage of total dataset (0-100)
  - `last_updated` (timestamptz, default now()) - Last update timestamp
  - `updated_at` (timestamptz, default now()) - Record update timestamp

  ### 3. `dataset_usage_history`
  Tracks usage patterns and download history for datasets.

  **Columns:**
  - `id` (uuid, primary key) - Unique identifier
  - `dataset_id` (uuid, not null, foreign key) - Reference to datasets table
  - `date` (date, not null) - Date of the usage record
  - `downloads` (integer, default 0) - Number of downloads on this date
  - `accesses` (integer, default 0) - Number of accesses on this date
  - `unique_users` (integer, default 0) - Number of unique users on this date
  - `created_at` (timestamptz, default now()) - Record creation timestamp

  ## Security

  1. Enable RLS on all tables
  2. Allow public read access for viewing metrics
  3. Restrict write access to authenticated users only

  ## Indexes

  - Index on dataset_id and timestamp for time-series queries
  - Index on language for language-specific lookups
  - Index on date for usage trend queries
  - Composite indexes for common query patterns
*/

-- Create dataset_performance_metrics table
CREATE TABLE IF NOT EXISTS dataset_performance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  timestamp timestamptz NOT NULL DEFAULT now(),
  quality_score numeric CHECK (quality_score >= 0 AND quality_score <= 100),
  total_downloads integer DEFAULT 0,
  total_accesses integer DEFAULT 0,
  total_samples integer DEFAULT 0,
  size_gb numeric CHECK (size_gb >= 0),
  active_users integer DEFAULT 0,
  error_rate numeric CHECK (error_rate >= 0 AND error_rate <= 100) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create dataset_language_coverage table
CREATE TABLE IF NOT EXISTS dataset_language_coverage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  language text NOT NULL,
  sample_count integer DEFAULT 0,
  quality_score numeric CHECK (quality_score >= 0 AND quality_score <= 100),
  coverage_percentage numeric CHECK (coverage_percentage >= 0 AND coverage_percentage <= 100),
  last_updated timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(dataset_id, language)
);

-- Create dataset_usage_history table
CREATE TABLE IF NOT EXISTS dataset_usage_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  date date NOT NULL,
  downloads integer DEFAULT 0,
  accesses integer DEFAULT 0,
  unique_users integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(dataset_id, date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_dataset_perf_metrics_dataset_timestamp ON dataset_performance_metrics(dataset_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_dataset_perf_metrics_timestamp ON dataset_performance_metrics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_dataset_lang_coverage_dataset_id ON dataset_language_coverage(dataset_id);
CREATE INDEX IF NOT EXISTS idx_dataset_lang_coverage_language ON dataset_language_coverage(language);
CREATE INDEX IF NOT EXISTS idx_dataset_usage_history_dataset_id ON dataset_usage_history(dataset_id);
CREATE INDEX IF NOT EXISTS idx_dataset_usage_history_date ON dataset_usage_history(date DESC);
CREATE INDEX IF NOT EXISTS idx_dataset_usage_history_dataset_date ON dataset_usage_history(dataset_id, date DESC);

-- Enable Row Level Security
ALTER TABLE dataset_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE dataset_language_coverage ENABLE ROW LEVEL SECURITY;
ALTER TABLE dataset_usage_history ENABLE ROW LEVEL SECURITY;

-- Policies for dataset_performance_metrics
CREATE POLICY "Anyone can view dataset performance metrics"
  ON dataset_performance_metrics FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert dataset performance metrics"
  ON dataset_performance_metrics FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for dataset_language_coverage
CREATE POLICY "Anyone can view dataset language coverage"
  ON dataset_language_coverage FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert dataset language coverage"
  ON dataset_language_coverage FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update dataset language coverage"
  ON dataset_language_coverage FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for dataset_usage_history
CREATE POLICY "Anyone can view dataset usage history"
  ON dataset_usage_history FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert dataset usage history"
  ON dataset_usage_history FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update dataset usage history"
  ON dataset_usage_history FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample performance metrics for the last 7 days
INSERT INTO dataset_performance_metrics (dataset_id, timestamp, quality_score, total_downloads, total_accesses, total_samples, size_gb, active_users, error_rate)
SELECT
  d.id,
  now() - (interval '1 day' * generate_series(6, 0, -1)),
  CASE d.slug
    WHEN 'indic-speech-corpus' THEN 97.0 + (random() * 1.0)
    WHEN 'cineling-dataset' THEN 93.5 + (random() * 1.5)
    WHEN 'eduling-dataset' THEN 95.5 + (random() * 1.0)
    WHEN 'civicling-dataset' THEN 97.5 + (random() * 0.8)
    WHEN 'asialing-corpus' THEN 91.8 + (random() * 1.5)
    ELSE 90.0 + (random() * 5)
  END,
  CASE d.slug
    WHEN 'indic-speech-corpus' THEN 1200 + (random() * 100)::integer
    WHEN 'cineling-dataset' THEN 850 + (random() * 80)::integer
    WHEN 'eduling-dataset' THEN 620 + (random() * 60)::integer
    WHEN 'civicling-dataset' THEN 280 + (random() * 30)::integer
    WHEN 'asialing-corpus' THEN 940 + (random() * 90)::integer
    ELSE 500
  END,
  CASE d.slug
    WHEN 'indic-speech-corpus' THEN 5400 + (random() * 300)::integer
    WHEN 'cineling-dataset' THEN 3200 + (random() * 200)::integer
    WHEN 'eduling-dataset' THEN 2100 + (random() * 150)::integer
    WHEN 'civicling-dataset' THEN 890 + (random() * 80)::integer
    WHEN 'asialing-corpus' THEN 4100 + (random() * 250)::integer
    ELSE 2000
  END,
  d.samples,
  d.size_gb,
  CASE d.slug
    WHEN 'indic-speech-corpus' THEN 340 + (random() * 30)::integer
    WHEN 'cineling-dataset' THEN 280 + (random() * 25)::integer
    WHEN 'eduling-dataset' THEN 190 + (random() * 20)::integer
    WHEN 'civicling-dataset' THEN 85 + (random() * 10)::integer
    WHEN 'asialing-corpus' THEN 320 + (random() * 28)::integer
    ELSE 150
  END,
  CASE d.slug
    WHEN 'indic-speech-corpus' THEN 0.05 + (random() * 0.05)
    WHEN 'cineling-dataset' THEN 0.08 + (random() * 0.07)
    WHEN 'eduling-dataset' THEN 0.03 + (random() * 0.04)
    WHEN 'civicling-dataset' THEN 0.02 + (random() * 0.03)
    WHEN 'asialing-corpus' THEN 0.10 + (random() * 0.08)
    ELSE 0.05
  END
FROM datasets d
WHERE d.slug IN ('indic-speech-corpus', 'cineling-dataset', 'eduling-dataset', 'civicling-dataset', 'asialing-corpus');

-- Insert sample language coverage data
INSERT INTO dataset_language_coverage (dataset_id, language, sample_count, quality_score, coverage_percentage)
SELECT
  d.id,
  lang,
  CASE d.slug
    WHEN 'indic-speech-corpus' THEN (d.samples / ARRAY_LENGTH(d.languages, 1) + (random() * 10000 - 5000))::integer
    WHEN 'cineling-dataset' THEN (d.samples / ARRAY_LENGTH(d.languages, 1) + (random() * 8000 - 4000))::integer
    WHEN 'eduling-dataset' THEN (d.samples / ARRAY_LENGTH(d.languages, 1) + (random() * 6000 - 3000))::integer
    WHEN 'civicling-dataset' THEN (d.samples / ARRAY_LENGTH(d.languages, 1) + (random() * 4000 - 2000))::integer
    WHEN 'asialing-corpus' THEN (d.samples / ARRAY_LENGTH(d.languages, 1) + (random() * 7000 - 3500))::integer
    ELSE 10000
  END,
  92 + (random() * 6),
  (100.0 / ARRAY_LENGTH(d.languages, 1)) + (random() * 10 - 5)
FROM datasets d
CROSS JOIN unnest(d.languages) AS lang
WHERE d.slug IN ('indic-speech-corpus', 'cineling-dataset', 'eduling-dataset', 'civicling-dataset', 'asialing-corpus')
ON CONFLICT (dataset_id, language) DO NOTHING;

-- Insert sample usage history for the last 30 days
INSERT INTO dataset_usage_history (dataset_id, date, downloads, accesses, unique_users)
SELECT
  d.id,
  CURRENT_DATE - generate_series(29, 0, -1),
  CASE d.slug
    WHEN 'indic-speech-corpus' THEN 40 + (random() * 20)::integer
    WHEN 'cineling-dataset' THEN 28 + (random() * 15)::integer
    WHEN 'eduling-dataset' THEN 22 + (random() * 12)::integer
    WHEN 'civicling-dataset' THEN 10 + (random() * 8)::integer
    WHEN 'asialing-corpus' THEN 32 + (random() * 18)::integer
    ELSE 20
  END,
  CASE d.slug
    WHEN 'indic-speech-corpus' THEN 180 + (random() * 50)::integer
    WHEN 'cineling-dataset' THEN 110 + (random() * 40)::integer
    WHEN 'eduling-dataset' THEN 75 + (random() * 30)::integer
    WHEN 'civicling-dataset' THEN 30 + (random() * 15)::integer
    WHEN 'asialing-corpus' THEN 140 + (random() * 45)::integer
    ELSE 80
  END,
  CASE d.slug
    WHEN 'indic-speech-corpus' THEN 60 + (random() * 15)::integer
    WHEN 'cineling-dataset' THEN 45 + (random() * 12)::integer
    WHEN 'eduling-dataset' THEN 35 + (random() * 10)::integer
    WHEN 'civicling-dataset' THEN 18 + (random() * 8)::integer
    WHEN 'asialing-corpus' THEN 55 + (random() * 14)::integer
    ELSE 30
  END
FROM datasets d
WHERE d.slug IN ('indic-speech-corpus', 'cineling-dataset', 'eduling-dataset', 'civicling-dataset', 'asialing-corpus')
ON CONFLICT (dataset_id, date) DO NOTHING;
