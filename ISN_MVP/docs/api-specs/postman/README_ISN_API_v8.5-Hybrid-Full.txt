# IndicSubtitleNet — Universal API Collection (v8.5-Hybrid-Full)

This README provides setup and quick-start instructions for using the **ISN_Universal_API_Collection_v8.5-Hybrid-Full.json** and its matching Postman environment.

---

## 🚀 Quick Start

### 1️⃣ Import into Postman
1. Open Postman → *Import*.
2. Upload:
   - `ISN_Universal_API_Collection_v8.5-Hybrid-Full.json`
   - `ISN_Hybrid_Env_v1.json`
3. Select *ISN Hybrid Environment (v1)* from the environment dropdown.

---

### 2️⃣ Environment Variables

| Variable | Example Value | Description |
|-----------|----------------|-------------|
| `base_url` | `https://api.indicsubtitlenet.com/v1` | Base API endpoint |
| `token` | `Bearer eyJhbGciOi...` | OAuth2 access token |
| `tenant_id` | `TENANT-001` | Tenant identifier |
| `project_id` | `PROJECT-ISN-HYBRID` | Project identifier |
| `job_id` | `JOB-TEST-001` | Test job ID |
| `vertex_project` | `isn-gemini-poc` | GCP Vertex AI project ID |
| `storage_bucket` | `gs://isn-media` | Cloud Storage bucket |
| `grafana_url` | `https://grafana.indicsubtitlenet.com` | Observability dashboard |
| `gemini_model` | `gemini-1.5-pro` | Gemini model version |
| `stt_model` | `chirp-batch-v2` | Speech-to-Text model version |
| `region` | `asia-south1` | Deployment region |

---

### 3️⃣ Key API Workflows

#### 🔹 A. Hybrid Pipeline
- `/hybrid/run` → Runs combined STT (Chirp) + Gemini translation workflow.  
- `/hybrid/merge` → Merges STT and Gemini outputs.

#### 🔹 B. Gemini Contextual Layer
- `/gemini/translate` → Multilingual translation with tone control.  
- `/gemini/contextualize` → Cinematic subtitle rewriting.

#### 🔹 C. Vertex AI Training & Feedback
- `/training/hybrid/start` → Start model training job in Vertex AI.  
- `/training/feedback/apply` → Sync reviewer edits into dataset lineage.

#### 🔹 D. Observability & Metrics
- `/observability/metrics?metric=hybrid_accuracy_delta` → Compare model performance.  
- `/sqi/stream` → Live SQI visualization in Grafana.

#### 🔹 E. POC Validation (Google Cloud)
- `/poc/test-gemini`, `/poc/test-stt`, `/poc/compare` → Validate results during demo.

---

### 4️⃣ Error Handling

Unified JSON schema for errors:
```json
{
  "code": "ERR_MODEL_TIMEOUT",
  "message": "Model inference timed out",
  "trace_id": "a1b2c3d4",
  "details": {"retry_after": 10}
}
```

---

### 5️⃣ Compliance Rules

Integrated with **License Compliance & Consent Matrix**.  
Datasets blocked until `compliance_score ≥ 80` or `risk = Low`.

---

### 6️⃣ Health & Utilities
Use `/health`, `/version`, and `/system/map` for service health and topology.

---

### ✅ Notes
- API collection version: **v8.5-Hybrid-Full**
- Generated: 2025-10-28 12:22:15 UTC
- Maintained by: **Top Gun Venture Studios / IndicSubtitleNet**
- Based on: **v8.4-FR** architecture
- Generator: ChatGPT — ISN Assistant
