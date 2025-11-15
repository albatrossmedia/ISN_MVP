/*
  # Create Explore Datasets and Models Schema

  ## Overview
  This migration creates tables for managing datasets and AI models in the IndicSubtitleNet platform,
  along with their relationships and metadata.

  ## New Tables

  ### 1. `datasets`
  Stores information about training datasets used across the platform.
  
  ### 2. `models`
  Stores information about AI models in the platform.
  
  ### 3. `model_dataset_relations`
  Links models with the datasets they were trained on.

  ## Security
  
  1. Enable RLS on all tables
  2. Add policies for authenticated users to read data
  3. Restrict insert/update/delete to authenticated users only

  ## Indexes
  
  - Index on dataset slug for fast lookups
  - Index on model slug for fast lookups
  - Index on dataset type and status for filtering
  - Index on model type and status for filtering
*/

-- Create datasets table
CREATE TABLE IF NOT EXISTS datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('audio', 'text', 'video', 'mixed')),
  size_gb numeric,
  samples integer,
  languages text[],
  version text,
  quality_score numeric CHECK (quality_score >= 0 AND quality_score <= 100),
  license text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deprecated', 'processing')),
  downloadable boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create models table
CREATE TABLE IF NOT EXISTS models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('ASR', 'MT', 'QA', 'ContextNet', 'Lexicon', 'NLP', 'Translation')),
  version text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'training', 'deprecated')),
  accuracy numeric CHECK (accuracy >= 0 AND accuracy <= 100),
  languages text[],
  parameters text,
  framework text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create model-dataset relationship table
CREATE TABLE IF NOT EXISTS model_dataset_relations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  dataset_id uuid NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(model_id, dataset_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_datasets_slug ON datasets(slug);
CREATE INDEX IF NOT EXISTS idx_datasets_type ON datasets(type);
CREATE INDEX IF NOT EXISTS idx_datasets_status ON datasets(status);
CREATE INDEX IF NOT EXISTS idx_models_slug ON models(slug);
CREATE INDEX IF NOT EXISTS idx_models_type ON models(type);
CREATE INDEX IF NOT EXISTS idx_models_status ON models(status);
CREATE INDEX IF NOT EXISTS idx_model_dataset_model_id ON model_dataset_relations(model_id);
CREATE INDEX IF NOT EXISTS idx_model_dataset_dataset_id ON model_dataset_relations(dataset_id);

-- Enable Row Level Security
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_dataset_relations ENABLE ROW LEVEL SECURITY;

-- Policies for datasets table
CREATE POLICY "Anyone can view datasets"
  ON datasets FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert datasets"
  ON datasets FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update datasets"
  ON datasets FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete datasets"
  ON datasets FOR DELETE
  TO authenticated
  USING (true);

-- Policies for models table
CREATE POLICY "Anyone can view models"
  ON models FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert models"
  ON models FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update models"
  ON models FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete models"
  ON models FOR DELETE
  TO authenticated
  USING (true);

-- Policies for model_dataset_relations table
CREATE POLICY "Anyone can view model-dataset relations"
  ON model_dataset_relations FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create model-dataset relations"
  ON model_dataset_relations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete model-dataset relations"
  ON model_dataset_relations FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample datasets
INSERT INTO datasets (name, slug, description, type, size_gb, samples, languages, version, quality_score, license, status, downloadable) VALUES
('IndicSpeech Corpus', 'indic-speech-corpus', 'Large-scale speech corpus covering 30+ Indian languages with diverse accents, dialects, and speaking styles', 'audio', 2400, 850000, ARRAY['Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Odia', 'Assamese', 'Urdu'], 'v3.2', 97.8, 'MIT', 'active', true),
('CineLing Dataset', 'cineling-dataset', 'Movie and TV subtitle corpus with cultural annotations, idioms, and contextual metadata from Indian cinema', 'text', 180, 450000, ARRAY['Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam'], 'v2.8', 94.5, 'Apache-2.0', 'active', true),
('EduLing Dataset', 'eduling-dataset', 'Educational content corpus including lectures, tutorials, and academic materials with quality annotations', 'mixed', 520, 320000, ARRAY['Hindi', 'English', 'Tamil', 'Telugu', 'Bengali', 'Marathi'], 'v1.9', 96.2, 'MIT', 'active', true),
('CivicLing Dataset', 'civicling-dataset', 'Government and civic content including official documents, public announcements, and policy texts', 'text', 95, 180000, ARRAY['Hindi', 'English', 'Tamil', 'Telugu', 'Bengali', 'Gujarati', 'Marathi', 'Kannada'], 'v1.5', 98.1, 'CC-BY-4.0', 'active', false),
('AsiaLing Corpus', 'asialing-corpus', 'Pan-Asian multilingual corpus for cross-linguistic training and cultural adaptation research', 'mixed', 1800, 620000, ARRAY['Hindi', 'English', 'Tamil', 'Chinese', 'Japanese', 'Korean', 'Thai', 'Vietnamese', 'Indonesian'], 'v2.1', 92.7, 'Apache-2.0', 'active', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample models
INSERT INTO models (name, slug, description, type, version, status, accuracy, languages, parameters, framework) VALUES
('ISN-ASR', 'isn-asr', 'Advanced Automatic Speech Recognition model optimized for Indian languages with support for diverse accents and noisy environments', 'ASR', 'v2.1', 'active', 95.8, ARRAY['Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam'], '340M parameters', 'PyTorch'),
('ISN-MT', 'isn-mt', 'Neural Machine Translation model specialized for Indian language pairs with cultural context awareness', 'MT', 'v1.8', 'active', 92.3, ARRAY['Hindi', 'Tamil', 'Telugu', 'Bengali', 'English'], '580M parameters', 'TensorFlow'),
('ISN-QA', 'isn-qa', 'Question Answering model fine-tuned on Indian educational and civic content for accurate information retrieval', 'QA', 'v3.0', 'active', 89.5, ARRAY['Hindi', 'English', 'Tamil', 'Telugu', 'Bengali'], '220M parameters', 'PyTorch'),
('ISN-ContextNet', 'isn-contextnet', 'Context-aware subtitle generation model that understands cultural nuances and idiomatic expressions', 'ContextNet', 'v1.5', 'active', 91.2, ARRAY['Hindi', 'Tamil', 'Telugu', 'Marathi'], '450M parameters', 'PyTorch'),
('ISN-Lexicon', 'isn-lexicon', 'Dynamic lexicon builder for domain-specific terminology and regional language variations', 'Lexicon', 'v2.3', 'active', 94.1, ARRAY['Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati'], '180M parameters', 'TensorFlow')
ON CONFLICT (slug) DO NOTHING;

-- Create model-dataset relationships
INSERT INTO model_dataset_relations (model_id, dataset_id)
SELECT m.id, d.id FROM models m, datasets d
WHERE (m.slug = 'isn-asr' AND d.slug = 'indic-speech-corpus')
   OR (m.slug = 'isn-mt' AND d.slug = 'cineling-dataset')
   OR (m.slug = 'isn-mt' AND d.slug = 'asialing-corpus')
   OR (m.slug = 'isn-qa' AND d.slug = 'eduling-dataset')
   OR (m.slug = 'isn-qa' AND d.slug = 'civicling-dataset')
   OR (m.slug = 'isn-contextnet' AND d.slug = 'cineling-dataset')
   OR (m.slug = 'isn-contextnet' AND d.slug = 'asialing-corpus')
   OR (m.slug = 'isn-lexicon' AND d.slug = 'eduling-dataset')
ON CONFLICT (model_id, dataset_id) DO NOTHING;