# IndicSubtitleNet Universal API Collection (v8.5-Hybrid-Full) Documentation

## Overview

The **IndicSubtitleNet (ISN) Universal API Collection (v8.5-Hybrid-Full)** delivers the next-generation architecture integrating **Speech-to-Text (STT – Chirp)** and **Gemini Multimodal API (Vertex AI)** into a unified hybrid orchestration layer.  
This version supports full multimodal workflows (Audio/Video → Transcript → Translation → Subtitle → SQI Scoring) with hybrid model routing, real-time observability, and auto-feedback training.

**Version 8.5-Hybrid-Full** introduces:
- Gemini contextual translation and formatting APIs  
- Hybrid orchestration (`/hybrid/run`, `/hybrid/merge`)  
- Vertex AI training and feedback integration  
- Live SQI streaming and hybrid performance metrics  
- POC Validation endpoints for Google Cloud testing

---

## Getting Started

1. **Set Up Environment**: Import `ISN_Hybrid_Env_v1.json` in Postman and set variables (`base_url`, `token`, `project_id`, etc.).  
2. **Import Collection**: Load `ISN_Universal_API_Collection_v8.5-Hybrid-Full.json` into Postman.  
3. **Select Environment**: Choose *ISN Hybrid Environment (v1)* from the environment dropdown.  
4. **Execute Workflows**: Start testing hybrid endpoints under `Hybrid Orchestration` or `Gemini Contextual APIs`.

---

## New in v8.5-Hybrid-Full

| Feature | Description |
|----------|-------------|
| **Hybrid Orchestration** | Smart routing between STT (Chirp) and Gemini for multimodal processing. |
| **Gemini Contextual APIs** | Translation, style reformatting, tone and sentiment-aware subtitles. |
| **Vertex AI TrainingOps** | `/training/hybrid/start` enables Google Cloud training orchestration. |
| **Dataset Feedback Loop** | Reviewer edits sync automatically via `/training/feedback/apply`. |
| **Real-Time SQI Stream** | `/sqi/stream` streams subtitle quality in Grafana. |
| **POC Validation** | `/poc/test-gemini`, `/poc/test-stt`, and `/poc/compare` for benchmarking. |

---

## Categorized List of Endpoints

### 1. Hybrid Orchestration (NEW)
- **Run Hybrid Workflow** → `POST /hybrid/run`  
  Launches a multimodal pipeline using STT + Gemini.  
- **Merge Hybrid Output** → `POST /hybrid/merge`  
  Combines STT transcript and Gemini contextualized translation.

### 2. Gemini Contextual APIs (NEW)
- **Translate + Format** → `POST /gemini/translate`  
  Context-aware translation with subtitle formatting.  
- **Contextualize SRT** → `POST /gemini/contextualize`  
  Rewrites subtitles based on tone and cinematic feel.

### 3. Training & Feedback (Hybrid Extension)
- **Start Hybrid Training** → `POST /training/hybrid/start`  
  Runs Vertex AI training using ISN datasets.  
- **Apply Feedback** → `POST /training/feedback/apply`  
  Integrates human edits into dataset lineage.

### 4. Observability & Metrics (Hybrid)
- **Hybrid Accuracy Delta** → `GET /observability/metrics?metric=hybrid_accuracy_delta&interval=24h`  
  Compare STT vs Gemini accuracy.  
- **Live SQI Stream** → `GET /sqi/stream?job_id={job_id}`  
  Streams real-time Subtitle Quality Index updates.

### 5. POC Validation (NEW)
- **Test Gemini** → `POST /poc/test-gemini`  
  Runs Gemini-only transcription + translation test.  
- **Test STT** → `POST /poc/test-stt`  
  Tests Chirp model STT transcription.  
- **Compare Outputs** → `POST /poc/compare`  
  Benchmarks Gemini vs STT for WER, SQI, and Latency.

---

## Integration with Existing v8.4 APIs

All legacy APIs from **v8.4-FR** remain compatible.  
The hybrid modules extend functionality without breaking backward compatibility.

### Key Existing Categories Retained
- **Universal Workflow** (`/models/run`, `/jobs/{job_id}`)  
- **Evaluation & QA** (`/evaluate`, `/evaluate/compare`)  
- **MDMS** (`/mdms/datasets/*`)  
- **Compliance & Security** (`/compliance/*`, `/security/*`)  
- **TrainingOps** (`/training/start`, `/training/deploy`)  
- **Observability** (`/observability/metrics`, `/observability/logs`)  
- **ReviewOps (HITL)** (`/review/submit`, `/review/analytics`)  

---

## Version Metadata

| Field | Value |
|--------|--------|
| **Version** | v8.5-Hybrid-Full |
| **Base Version** | v8.4-FR |
| **Generated At** | 2025-10-28 12:22:15 UTC |
| **Maintained By** | Top Gun Venture Studios / IndicSubtitleNet |
| **Change Summary** | Added Gemini + STT hybrid orchestration, Vertex AI training ops, SQI streaming, and dataset feedback integration. |

---

## Changelog Link

See the full changelog summary table in `ISN_Universal_API_Collection_v8.5-Hybrid-Full` Postman metadata.
