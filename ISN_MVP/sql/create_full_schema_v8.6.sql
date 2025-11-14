
-- jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  job_id VARCHAR(64) NOT NULL UNIQUE,
  tenant_id VARCHAR(64) NOT NULL,
  project_id VARCHAR(64),
  status VARCHAR(32) NOT NULL DEFAULT 'queued',
  latency_class VARCHAR(16),
  source_lang VARCHAR(8),
  target_lang VARCHAR(8),
  media_duration_s INT,
  provider_used VARCHAR(64),
  cost_cents BIGINT DEFAULT 0,
  idempotency_key VARCHAR(128),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (tenant_id), INDEX (status)
);

-- job_segments table
CREATE TABLE IF NOT EXISTS job_segments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  job_id VARCHAR(64) NOT NULL,
  idx INT NOT NULL,
  start_s FLOAT,
  end_s FLOAT,
  status VARCHAR(32) DEFAULT 'pending',
  provider VARCHAR(64),
  confidence FLOAT,
  latency_ms INT,
  output_url VARCHAR(1024),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (job_id)
);

-- model_outputs table
CREATE TABLE IF NOT EXISTS model_outputs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  job_id VARCHAR(64) NOT NULL,
  segment_id BIGINT,
  model_id VARCHAR(64),
  model_version VARCHAR(64),
  provider VARCHAR(64),
  hypothesis_text TEXT,
  confidence FLOAT,
  metrics_json JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (job_id), INDEX (provider)
);

-- models table
CREATE TABLE IF NOT EXISTS models (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  model_id VARCHAR(64) NOT NULL,
  version VARCHAR(64),
  provider VARCHAR(64),
  status VARCHAR(32),
  checksum VARCHAR(128),
  train_metrics_json JSON,
  eval_metrics_json JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY(model_id, version)
);

-- datasets table
CREATE TABLE IF NOT EXISTS datasets (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  dataset_id VARCHAR(128) NOT NULL,
  name VARCHAR(255),
  license_type VARCHAR(64),
  owner_contact VARCHAR(255),
  consent_evidence BOOLEAN DEFAULT FALSE,
  pii_flags JSON,
  redistributable BOOLEAN DEFAULT FALSE,
  allowed_uses_json JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY(dataset_id)
);

-- dataset_versions table
CREATE TABLE IF NOT EXISTS dataset_versions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  dataset_id VARCHAR(128),
  version VARCHAR(64),
  manifest_url VARCHAR(1024),
  checksum VARCHAR(128),
  compliance_score INT,
  risk_level VARCHAR(16),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (dataset_id)
);

-- provider_metrics table
CREATE TABLE IF NOT EXISTS provider_metrics (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  provider VARCHAR(64),
  lang VARCHAR(16),
  metric_window VARCHAR(32),
  p50_ms FLOAT,
  p95_ms FLOAT,
  wer FLOAT,
  bleu FLOAT,
  success_rate FLOAT,
  cost_per_min FLOAT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (provider)
);

-- feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  job_id VARCHAR(64),
  rating FLOAT,
  comment TEXT,
  emotion_match FLOAT,
  reference_url VARCHAR(1024),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (job_id)
);

-- billing_usage table
CREATE TABLE IF NOT EXISTS billing_usage (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id VARCHAR(64),
  period VARCHAR(16),
  minutes_isn FLOAT,
  minutes_google FLOAT,
  minutes_whisper FLOAT,
  amount_cents BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (tenant_id, period)
);

-- webhook_subscriptions + deliveries
CREATE TABLE IF NOT EXISTS webhook_subscriptions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id VARCHAR(64),
  url VARCHAR(1024),
  secret VARCHAR(256),
  status VARCHAR(32),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  subscription_id BIGINT,
  event_type VARCHAR(64),
  payload JSON,
  status VARCHAR(32),
  attempt INT DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- audits + errors
CREATE TABLE IF NOT EXISTS audits (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  actor_type VARCHAR(32),
  actor_id VARCHAR(64),
  action VARCHAR(128),
  target_type VARCHAR(64),
  target_id VARCHAR(64),
  ip VARCHAR(64),
  user_agent VARCHAR(255),
  context_json JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS errors (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  job_id VARCHAR(64),
  code VARCHAR(64),
  message TEXT,
  details_json JSON,
  trace_id VARCHAR(128),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




-- ============================================
-- ISN Full Schema Upgrade v8.6 (Hybrid + Vertex AI + Compliance)
-- ============================================

-- (A) Tenants & Plans
CREATE TABLE IF NOT EXISTS tenants (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  tenant_id VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(255),
  contact_email VARCHAR(255),
  plan_id VARCHAR(64),
  status VARCHAR(32) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plans (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  plan_id VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(128),
  tier VARCHAR(32),
  free_quota_minutes INT DEFAULT 0,
  cost_per_min FLOAT DEFAULT 0.0,
  overage_rate FLOAT DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- (B) Hybrid Orchestration Tables
CREATE TABLE IF NOT EXISTS hybrid_jobs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  job_id VARCHAR(64) NOT NULL,
  tenant_id VARCHAR(64),
  source_engine VARCHAR(64),
  secondary_engine VARCHAR(64),
  hybrid_status VARCHAR(32) DEFAULT 'queued',
  latency_ms INT,
  stt_confidence FLOAT,
  gemini_context_score FLOAT,
  combined_sqi FLOAT,
  cost_cents BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (job_id), INDEX (tenant_id)
);

CREATE TABLE IF NOT EXISTS hybrid_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  job_id VARCHAR(64),
  phase VARCHAR(32),
  message TEXT,
  metadata JSON,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (job_id)
);

-- (C) Compliance & Licensing
CREATE TABLE IF NOT EXISTS compliance_reports (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  dataset_id VARCHAR(128),
  job_id VARCHAR(64),
  risk_level VARCHAR(16),
  score INT,
  report_url VARCHAR(1024),
  reviewer VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS compliance_flags (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  dataset_id VARCHAR(128),
  flag_type VARCHAR(64),
  description TEXT,
  severity VARCHAR(16),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- (D) TrainingOps
CREATE TABLE IF NOT EXISTS training_jobs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  model_id VARCHAR(64),
  dataset_id VARCHAR(128),
  vertex_job_id VARCHAR(128),
  status VARCHAR(32) DEFAULT 'pending',
  loss FLOAT,
  accuracy FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS training_metrics (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  training_job_id BIGINT,
  epoch INT,
  loss FLOAT,
  accuracy FLOAT,
  eval_score FLOAT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- (E) Dataset Feedback Loop
CREATE TABLE IF NOT EXISTS dataset_feedback (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  dataset_id VARCHAR(128),
  job_id VARCHAR(64),
  reviewer VARCHAR(255),
  feedback_json JSON,
  sqi_before FLOAT,
  sqi_after FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- (F) SQI Metrics
CREATE TABLE IF NOT EXISTS sqi_snapshots (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  job_id VARCHAR(64),
  sqi_score FLOAT,
  emotion_alignment FLOAT,
  caption_density FLOAT,
  latency_s FLOAT,
  snapshot_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (job_id)
);

-- (G) Billing Invoices
CREATE TABLE IF NOT EXISTS billing_invoices (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  invoice_id VARCHAR(64) UNIQUE,
  tenant_id VARCHAR(64),
  period VARCHAR(16),
  total_amount_cents BIGINT,
  payment_status VARCHAR(32) DEFAULT 'unpaid',
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS billing_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  invoice_id VARCHAR(64),
  job_id VARCHAR(64),
  description VARCHAR(255),
  usage_minutes FLOAT,
  rate_per_min FLOAT,
  amount_cents BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (invoice_id)
);
