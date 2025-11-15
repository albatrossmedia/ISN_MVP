# IndicSubtitleNet MVP - Frontend Gap Analysis

## 📊 Postman Collection Analysis

**Total API Endpoints: 133 endpoints across 25 categories**

---

## ✅ Current Frontend Coverage

### Existing Pages (13 pages)
1. **Landing** - Marketing page
2. **Login** - Authentication
3. **SignUp** - User registration
4. **ForgotPassword** - Password reset
5. **Dashboard** - Overview stats
6. **Models** - AI model registry
7. **Datasets** - Dataset catalog
8. **Jobs** - Job monitoring
9. **ModelPerformance** - Model analytics
10. **DatasetPerformance** - Dataset analytics
11. **SystemHealth** - System monitoring
12. **Users** - User management
13. **AuditLogs** - Audit trail

### Current API Integration
- Basic CRUD: `api.get()`, `api.post()`
- Auth: Token storage in localStorage
- Endpoints used:
  - `/models`
  - `/datasets`
  - `/jobs`
  - `/users`

---

## ❌ Missing Frontend Features

### High Priority (Critical for MVP)

#### 1. Workflow Execution (Category C - 10 endpoints)
**Missing Pages:**
- ❌ **Workflow Runner** - Execute ASR→MT→Context→Align→QA pipeline
- ❌ **Workflow Monitor** - Real-time workflow progress
- ❌ **Streaming Console** - Live ASR/MT streaming

**API Endpoints:**
- `POST /models/run` - Run Workflow
- `GET /jobs/{job_id}/preview` - Workflow Preview
- `POST /jobs/{job_id}/terminate` - Terminate Workflow
- `POST /asr/stream/start` - ASR Streaming
- `POST /mt/stream/token` - MT Streaming
- `GET /qa/live` - Live QA

**Impact:** Cannot execute subtitle generation workflows

---

#### 2. Evaluation & Quality (Category E - 7 endpoints)
**Missing Pages:**
- ❌ **Evaluation Dashboard** - Compare model outputs
- ❌ **Quality Metrics** - WER, BLEU, COMET scores
- ❌ **Provider Comparison** - ISN vs Google vs Whisper

**API Endpoints:**
- `POST /evaluate` - Evaluate ASR (WER/CER)
- `POST /evaluate/mt` - Evaluate MT (BLEU/COMET)
- `POST /evaluate/compare` - Compare providers
- `GET /evaluate/reports` - Evaluation reports

**Impact:** No quality assessment capabilities

---

#### 3. Billing & Cost (Category I - 4 endpoints)
**Missing Pages:**
- ❌ **Billing Dashboard** - Usage and costs
- ❌ **Cost Estimator** - What-if analysis
- ❌ **Usage Reports** - Detailed breakdowns

**API Endpoints:**
- `GET /billing/usage` - Current usage
- `POST /billing/estimate` - Cost estimation
- `POST /billing/forecast` - Predict costs
- `GET /billing/invoice` - Invoice history

**Impact:** No cost visibility or forecasting

---

#### 4. Review Operations - HITL (Category ReviewOps - 4 endpoints)
**Missing Pages:**
- ❌ **Review Queue** - Human-in-the-loop review
- ❌ **Subtitle Editor** - Edit and approve subtitles
- ❌ **Review Analytics** - Review performance

**API Endpoints:**
- `POST /review/queue` - Queue for review
- `POST /review/submit` - Submit edits
- `GET /review/diff` - View changes
- `GET /review/analytics` - Review stats

**Impact:** No manual review/correction workflow

---

### Medium Priority (Important for Production)

#### 5. Training Operations (Category TrainingOps - 4 endpoints)
**Missing Pages:**
- ❌ **Training Dashboard** - Monitor training jobs
- ❌ **Model Training** - Start new training
- ❌ **Training History** - Past training runs

**API Endpoints:**
- `POST /training/start` - Start training
- `GET /training/status` - Training status
- `POST /training/evaluate` - Evaluate trained model
- `POST /training/deploy` - Deploy model

**Impact:** Cannot train or fine-tune models

---

#### 6. Compliance & Governance (Category H - 7 endpoints)
**Missing Pages:**
- ❌ **Compliance Dashboard** - Compliance scores
- ❌ **License Management** - Track licenses
- ❌ **Consent Manager** - Data consent tracking

**API Endpoints:**
- `POST /compliance/score` - Job compliance score
- `POST /compliance/license-matrix/sync` - Sync licenses
- `POST /compliance/consent` - Upload consent
- `GET /compliance/watermark` - Watermark info

**Impact:** No compliance tracking or governance

---

#### 7. Adaptive Routing (Category F - 4 endpoints)
**Missing Pages:**
- ❌ **Routing Policies** - Manage routing rules
- ❌ **Routing Optimizer** - Optimize worker allocation

**API Endpoints:**
- `POST /routing/policy/register` - Register policy
- `GET /routing/recommend` - Get recommendations
- `POST /routing/optimize` - Optimize routing
- `GET /routing/cost-table` - View costs

**Impact:** No intelligent routing configuration

---

#### 8. Provider Management (Category M - 6 endpoints)
**Missing Pages:**
- ❌ **Provider Registry** - Manage providers
- ❌ **Provider Configuration** - Configure providers

**API Endpoints:**
- `POST /providers/register` - Register provider
- `GET /providers/list` - List providers
- `POST /providers/healthcheck` - Check health

**Impact:** No provider management UI

---

#### 9. Observability Extended (Category J - 9 endpoints)
**Missing Features in SystemHealth:**
- ❌ **SQI Metrics** - Subtitle Quality Index
- ❌ **FER Rate** - Frame Error Rate
- ❌ **Queue Depth** - System queue metrics
- ❌ **Live Metrics** - Real-time monitoring

**API Endpoints:**
- `GET /observability/metrics?metric=sqi_overall_p50`
- `GET /observability/metrics?metric=fer_rate`
- `GET /observability/queue_depth`
- `GET /observability/realtime`

**Impact:** Limited observability

---

### Low Priority (Nice to Have)

#### 10. Hybrid Orchestration (NEW in v8.5 - 2 endpoints)
**Missing Pages:**
- ❌ **Hybrid Workflow** - STT + Gemini workflows

**API Endpoints:**
- `POST /hybrid/run` - Run hybrid workflow
- `POST /hybrid/merge` - Merge outputs

---

#### 11. Gemini Contextual APIs (NEW in v8.5 - 2 endpoints)
**Missing Pages:**
- ❌ **Contextual Translation** - Gemini-powered translation

**API Endpoints:**
- `POST /gemini/translate` - Translate + format
- `POST /gemini/contextualize` - Contextualize SRT

---

#### 12. POC Validation (NEW in v8.5 - 3 endpoints)
**Missing Pages:**
- ❌ **POC Testing** - Test and compare models

**API Endpoints:**
- `POST /poc/test-gemini` - Test Gemini
- `POST /poc/test-stt` - Test STT
- `POST /poc/compare` - Compare outputs

---

#### 13. Edge Deployment (Category N - 4 endpoints)
**Missing Pages:**
- ❌ **Edge Management** - Deploy to edge

**API Endpoints:**
- `POST /edge/deploy` - Deploy to edge
- `GET /edge/health` - Edge health

---

#### 14. Webhooks (Category P - 2 endpoints)
**Missing Pages:**
- ❌ **Webhook Configuration** - Configure webhooks

---

## 📋 Summary

### Coverage Statistics
- **Existing Pages:** 13
- **API Categories:** 25
- **Total API Endpoints:** 133
- **Covered Endpoints:** ~20 (15%)
- **Missing Endpoints:** ~113 (85%)

### Critical Missing Features

| Priority | Feature | Pages Needed | API Endpoints | Impact |
|----------|---------|--------------|---------------|--------|
| 🔴 High | Workflow Execution | 3 | 10 | Cannot run jobs |
| 🔴 High | Quality Evaluation | 3 | 7 | No quality checks |
| 🔴 High | Billing & Cost | 3 | 4 | No cost visibility |
| 🔴 High | Review Operations | 3 | 4 | No manual review |
| 🟡 Medium | Training Ops | 3 | 4 | Cannot train models |
| 🟡 Medium | Compliance | 3 | 7 | No governance |
| 🟡 Medium | Provider Mgmt | 2 | 6 | Limited control |
| 🟡 Medium | Adaptive Routing | 2 | 4 | No optimization |
| 🟢 Low | Hybrid/Gemini | 2 | 7 | Nice to have |
| 🟢 Low | Edge/POC | 3 | 9 | Advanced features |

**Total New Pages Required:** ~27 pages

---

## 🎯 Recommended Implementation Plan

### Phase 1: Core Workflow (2-3 weeks)
1. **Workflow Runner** - Execute subtitle generation
2. **Job Monitor** - Real-time job tracking
3. **Quality Dashboard** - Basic evaluation

**Deliverables:** Working subtitle generation pipeline

### Phase 2: Quality & Review (2 weeks)
4. **Evaluation Dashboard** - Model comparison
5. **Review Queue** - Manual review interface
6. **Subtitle Editor** - Edit and approve

**Deliverables:** Quality assurance workflow

### Phase 3: Business Intelligence (1-2 weeks)
7. **Billing Dashboard** - Usage and costs
8. **Cost Estimator** - Forecasting
9. **Enhanced Analytics** - Extended metrics

**Deliverables:** Cost visibility and forecasting

### Phase 4: Advanced Features (2-3 weeks)
10. **Training Dashboard** - Model training
11. **Compliance Dashboard** - Governance
12. **Provider Management** - Multi-provider support
13. **Routing Policies** - Optimization

**Deliverables:** Production-ready platform

### Phase 5: Innovation (Optional - 1-2 weeks)
14. **Hybrid Workflows** - Gemini integration
15. **POC Testing** - Benchmarking tools
16. **Edge Deployment** - Edge computing

**Deliverables:** Next-gen features

---

## 🚀 Quick Wins (Can implement immediately)

1. **Workflow Runner** - Single page, highest impact
2. **Billing Dashboard** - Reuse existing chart components
3. **Enhanced SystemHealth** - Add missing metrics to existing page
4. **Provider List** - Simple table, easy to add

---

## 📦 Reusable Components Already Built

✅ **UI Components (9 components):**
- Badge, Button, Card, Input, LoadingSpinner, Modal, Select, Table, Tabs

✅ **Layout Components (3 components):**
- MainLayout, Sidebar, TopBar

✅ **Utilities:**
- API client with auth
- Supabase integration
- WebSocket setup
- Performance API helpers

**Can be reused for all new pages**

---

## 🔧 Technical Requirements for New Features

### 1. Enhanced API Client
Need to add methods for:
- File uploads (multipart/form-data)
- Streaming responses (Server-Sent Events)
- WebSocket connections for real-time
- Retry logic with exponential backoff
- Request cancellation

### 2. New State Management
Consider adding:
- React Query for data fetching
- Context for workflow state
- WebSocket state management

### 3. File Handling
- Video/audio upload
- SRT file upload/download
- Manifest parsing
- Progress tracking

### 4. Real-Time Features
- WebSocket for job progress
- SSE for streaming metrics
- Live chart updates

---

## 💡 Architecture Recommendations

### Current Structure (Good)
```
src/
├── components/
├── pages/
├── lib/
└── contexts/
```

### Recommended Additions
```
src/
├── components/
├── pages/
│   ├── workflows/      # NEW: Workflow execution
│   ├── evaluation/     # NEW: Quality assessment
│   ├── billing/        # NEW: Cost management
│   ├── review/         # NEW: Manual review
│   └── training/       # NEW: Model training
├── lib/
│   ├── api/            # NEW: Organized API calls
│   │   ├── workflows.ts
│   │   ├── evaluation.ts
│   │   ├── billing.ts
│   │   └── ...
│   └── hooks/          # NEW: React hooks
│       ├── useWorkflow.ts
│       └── useRealtime.ts
├── contexts/
└── types/              # NEW: TypeScript types
    ├── workflow.ts
    └── api.ts
```

---

## 🎨 UI/UX Considerations

### Workflow Runner
- Drag-and-drop file upload
- Multi-step wizard
- Real-time progress bars
- Error handling with retry

### Review Interface
- Side-by-side comparison
- Waveform visualization
- Keyboard shortcuts
- Undo/redo support

### Billing Dashboard
- Cost breakdown charts
- Usage trends
- Export to CSV
- Budget alerts

---

## 📊 Priority Matrix

```
High Value + High Effort:
- Workflow Runner
- Review Interface
- Training Dashboard

High Value + Low Effort:
- Billing Dashboard ← START HERE
- Enhanced Metrics
- Provider List

Low Value + High Effort:
- Edge Deployment
- Hybrid Workflows

Low Value + Low Effort:
- Webhook Config
- POC Testing
```

---

## ✅ Next Steps

1. **Immediate:** Add Workflow Runner page (highest impact)
2. **Week 1:** Implement Billing Dashboard (quick win)
3. **Week 2:** Build Evaluation Dashboard
4. **Week 3:** Create Review Interface
5. **Week 4:** Add Training Dashboard

**Goal:** MVP with core workflows in 4 weeks

---

**Last Updated:** 2025-11-15
**Collection Version:** v8.5-Hybrid-Full
**Frontend Version:** v1.0.0
