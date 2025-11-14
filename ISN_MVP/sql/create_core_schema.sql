
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
