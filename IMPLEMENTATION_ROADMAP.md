# IndicSubtitleNet MVP - Implementation Roadmap

## 🎯 Executive Summary

**Current State:** Frontend has 13 pages covering basic MDMS (Models, Datasets, Monitoring)
**Target State:** Full-featured subtitle generation platform with workflow execution
**Gap:** 85% of API endpoints (113/133) not yet integrated
**Timeline:** 4-8 weeks to MVP, 12 weeks to full production

---

## 📊 Gap Analysis Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                   API COVERAGE STATUS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Total Endpoints: 133                                           │
│  ████████████████████████████████████████████████████████       │
│                                                                  │
│  ✅ Covered:  20 (15%) ████                                     │
│  ❌ Missing: 113 (85%) ████████████████████████████████████     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### By Priority

| Priority | Features | Endpoints | Pages | Weeks |
|----------|----------|-----------|-------|-------|
| 🔴 High  | 4 | 25 | 12 | 4 |
| 🟡 Medium | 4 | 21 | 11 | 4 |
| 🟢 Low | 5 | 67 | 9 | 4 |
| **Total** | **13** | **113** | **32** | **12** |

---

## 🚀 Phase 1: Core Workflows (Week 1-4) - CRITICAL

### Goal: Enable subtitle generation workflows

#### Week 1: Workflow Execution
**New Pages:**
1. **Workflow Runner** (`/dashboard/workflows/new`)
   - Upload video/audio files
   - Select models (ASR, MT, Context, QA)
   - Configure workflow parameters
   - Start job execution

2. **Job Monitor** (`/dashboard/workflows/:jobId`)
   - Real-time progress tracking
   - Stage-by-stage status
   - Error handling and retry
   - Download results

**API Endpoints (10):**
- `POST /models/run` - Start workflow
- `GET /jobs/{id}` - Job status
- `GET /jobs/{id}/preview` - Preview results
- `POST /jobs/{id}/terminate` - Cancel job
- `POST /asr/stream/start` - Start ASR stream
- `POST /asr/stream/push` - Push audio chunks
- `POST /asr/stream/stop` - Stop stream
- `POST /mt/stream/token` - MT streaming
- `POST /align/stream` - Alignment streaming
- `GET /qa/live` - Live QA

**Components:**
- FileUploader with drag-and-drop
- WorkflowStepper (multi-step form)
- ProgressTracker with stages
- ResultsViewer (SRT preview)
- ErrorBoundary with retry

**Deliverable:** ✅ Working subtitle generation pipeline

---

#### Week 2: Quality & Evaluation
**New Pages:**
3. **Evaluation Dashboard** (`/dashboard/evaluation`)
   - Compare model outputs
   - WER, BLEU, COMET scores
   - Provider comparison charts
   - Export reports

4. **Quality Metrics** (`/dashboard/evaluation/metrics`)
   - Detailed metric breakdowns
   - Historical trends
   - SQI (Subtitle Quality Index)
   - Per-language performance

**API Endpoints (7):**
- `POST /evaluate` - Evaluate ASR
- `POST /evaluate/mt` - Evaluate MT
- `POST /evaluate/compare` - Compare providers
- `GET /evaluate/reports` - Get reports
- `POST /qa/metrics` - QA metrics
- `GET /sqi/score` - SQI score
- `GET /sqi/trend` - SQI trends

**Components:**
- MetricsChart (bar, line, radar)
- ComparisonTable
- ScoreCard
- TrendGraph

**Deliverable:** ✅ Quality assessment capabilities

---

#### Week 3: Billing & Cost Management
**New Pages:**
5. **Billing Dashboard** (`/dashboard/billing`)
   - Current usage (minutes, costs)
   - Provider breakdown (ISN/Google/Whisper)
   - Usage trends
   - Budget alerts

6. **Cost Estimator** (`/dashboard/billing/estimate`)
   - What-if analysis
   - Cost forecasting
   - Provider comparison
   - Bulk estimation

7. **Usage Reports** (`/dashboard/billing/reports`)
   - Detailed breakdowns
   - Invoice history
   - Export to CSV/PDF
   - Custom date ranges

**API Endpoints (4):**
- `GET /billing/usage` - Current usage
- `POST /billing/estimate` - Estimate costs
- `POST /billing/forecast` - Forecast
- `GET /billing/invoice` - Invoices

**Components:**
- UsageChart (stacked area)
- CostBreakdown (pie chart)
- BudgetAlert
- InvoiceTable

**Deliverable:** ✅ Cost visibility and forecasting

---

#### Week 4: Review Operations (HITL)
**New Pages:**
8. **Review Queue** (`/dashboard/review`)
   - Pending reviews list
   - Priority sorting
   - Assign reviewers
   - Bulk actions

9. **Subtitle Editor** (`/dashboard/review/:jobId`)
   - Side-by-side comparison
   - Waveform visualization
   - Edit timings and text
   - Keyboard shortcuts
   - Undo/redo support

10. **Review Analytics** (`/dashboard/review/analytics`)
    - Review performance
    - Reviewer stats
    - Edit patterns
    - Quality improvements

**API Endpoints (4):**
- `POST /review/queue` - Queue review
- `POST /review/submit` - Submit edits
- `GET /review/diff` - View changes
- `GET /review/analytics` - Analytics

**Components:**
- ReviewQueue (table with filters)
- SubtitleEditor (rich text)
- WaveformVisualizer
- DiffViewer
- TimingAdjuster

**Deliverable:** ✅ Manual review and correction workflow

---

### Phase 1 Summary
**Duration:** 4 weeks
**Pages Added:** 10
**Endpoints Integrated:** 25
**Status:** 🔴 Critical for MVP
**Investment:** High (30-40 hours/week)

---

## 🎯 Phase 2: Production Features (Week 5-8) - IMPORTANT

### Week 5: Training Operations
**New Pages:**
11. **Training Dashboard** (`/dashboard/training`)
    - Active training jobs
    - Training history
    - Model versions
    - Performance metrics

12. **Start Training** (`/dashboard/training/new`)
    - Select datasets
    - Configure hyperparameters
    - Set training schedule
    - Monitor progress

13. **Training Results** (`/dashboard/training/:id`)
    - Training curves
    - Validation metrics
    - Model comparison
    - Deploy model

**API Endpoints (4):**
- `POST /training/start` - Start training
- `GET /training/status` - Status
- `POST /training/evaluate` - Evaluate
- `POST /training/deploy` - Deploy

**Deliverable:** Model training and deployment

---

### Week 6: Compliance & Governance
**New Pages:**
14. **Compliance Dashboard** (`/dashboard/compliance`)
    - Compliance scores
    - License matrix
    - Consent tracking
    - Audit trail

15. **License Management** (`/dashboard/compliance/licenses`)
    - Active licenses
    - Expiration tracking
    - Renewal alerts
    - Provider licenses

16. **Consent Manager** (`/dashboard/compliance/consent`)
    - Data consent records
    - Artifact uploads
    - Compliance reports
    - GDPR tools

**API Endpoints (7):**
- `POST /compliance/score` - Score job
- `POST /compliance/license-matrix/sync` - Sync
- `POST /compliance/consent` - Upload consent
- `GET /compliance/watermark` - Watermark
- `GET /compliance/reports` - Reports
- `POST /compliance/audit` - Audit log
- `GET /compliance/gdpr` - GDPR tools

**Deliverable:** Compliance tracking and governance

---

### Week 7: Provider Management
**New Pages:**
17. **Provider Registry** (`/dashboard/providers`)
    - List all providers
    - Provider status
    - Health checks
    - Configuration

18. **Provider Config** (`/dashboard/providers/:id`)
    - API credentials
    - Rate limits
    - Endpoints
    - Test connection

**API Endpoints (6):**
- `POST /providers/register` - Register
- `GET /providers/list` - List
- `GET /providers/:id` - Details
- `POST /providers/healthcheck` - Health
- `PUT /providers/:id/config` - Update
- `DELETE /providers/:id` - Remove

**Deliverable:** Multi-provider management

---

### Week 8: Adaptive Routing
**New Pages:**
19. **Routing Policies** (`/dashboard/routing`)
    - Active policies
    - Create/edit policies
    - Policy simulation
    - Cost optimization

20. **Routing Optimizer** (`/dashboard/routing/optimize`)
    - Routing recommendations
    - Cost vs quality tradeoffs
    - Provider selection
    - A/B testing

**API Endpoints (4):**
- `POST /routing/policy/register` - Register
- `GET /routing/recommend` - Recommend
- `POST /routing/optimize` - Optimize
- `GET /routing/cost-table` - Costs

**Deliverable:** Intelligent routing and optimization

---

### Phase 2 Summary
**Duration:** 4 weeks
**Pages Added:** 10
**Endpoints Integrated:** 21
**Status:** 🟡 Important for Production
**Investment:** Medium (20-30 hours/week)

---

## 🌟 Phase 3: Advanced Features (Week 9-12) - OPTIONAL

### Week 9-10: Hybrid & Innovation
**New Pages:**
21. **Hybrid Workflows** (`/dashboard/hybrid`)
    - STT + Gemini workflows
    - Hybrid orchestration
    - Output merging
    - Performance comparison

22. **Gemini Studio** (`/dashboard/gemini`)
    - Contextual translation
    - Style formatting
    - Tone adjustment
    - Cinematic feel

23. **POC Testing** (`/dashboard/poc`)
    - Test Gemini
    - Test STT
    - Compare outputs
    - Benchmarking

**API Endpoints (7):**
- `POST /hybrid/run`
- `POST /hybrid/merge`
- `POST /gemini/translate`
- `POST /gemini/contextualize`
- `POST /poc/test-gemini`
- `POST /poc/test-stt`
- `POST /poc/compare`

---

### Week 11-12: Edge & Infrastructure
**New Pages:**
24. **Edge Deployment** (`/dashboard/edge`)
    - Deploy to edge
    - Edge health
    - Cache management
    - Geographic distribution

25. **Webhook Configuration** (`/dashboard/webhooks`)
    - Configure webhooks
    - Test webhooks
    - Event logs
    - Secret rotation

26. **System Utilities** (`/dashboard/utilities`)
    - Error diagnosis
    - System trace
    - Debug tools
    - Bulk operations

**API Endpoints (9):**
- Edge, Webhook, Utility endpoints

---

### Phase 3 Summary
**Duration:** 4 weeks
**Pages Added:** 6
**Endpoints Integrated:** 16
**Status:** 🟢 Nice to Have
**Investment:** Low (10-20 hours/week)

---

## 📈 Enhanced Existing Pages

### Enhance SystemHealth Page
**Add Missing Metrics:**
- SQI Overall (p50, p95, p99)
- SQI Trend (7d, 30d)
- FER (Frame Error Rate)
- Queue Depth
- Real-time metrics
- Live monitoring

**API Endpoints (5):**
- `GET /observability/metrics?metric=sqi_overall_p50`
- `GET /observability/metrics?metric=sqi_trend_7d`
- `GET /observability/metrics?metric=fer_rate`
- `GET /observability/queue_depth`
- `GET /observability/realtime`

---

## 🛠️ Technical Architecture Updates

### 1. Enhanced API Client (`src/lib/api/`)
```typescript
// Organize by domain
api/
  ├── auth.ts          // Authentication
  ├── workflows.ts     // Workflow execution
  ├── evaluation.ts    // Quality metrics
  ├── billing.ts       // Cost management
  ├── review.ts        // HITL operations
  ├── training.ts      // Model training
  ├── compliance.ts    // Governance
  ├── providers.ts     // Provider mgmt
  └── routing.ts       // Adaptive routing
```

### 2. React Hooks (`src/lib/hooks/`)
```typescript
hooks/
  ├── useWorkflow.ts      // Workflow state
  ├── useRealtime.ts      // WebSocket/SSE
  ├── useFileUpload.ts    // File handling
  ├── useJobMonitor.ts    // Job tracking
  └── useMetrics.ts       // Performance data
```

### 3. TypeScript Types (`src/types/`)
```typescript
types/
  ├── workflow.ts         // Workflow types
  ├── job.ts             // Job types
  ├── evaluation.ts      // Metric types
  ├── billing.ts         // Cost types
  └── api.ts             // API responses
```

### 4. State Management
Consider adding:
- **React Query** for data fetching and caching
- **Zustand** for global workflow state
- **WebSocket Context** for real-time updates

---

## 📦 New Dependencies

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0",
    "react-dropzone": "^14.2.0",
    "wavesurfer.js": "^7.0.0",
    "srt-parser-2": "^1.2.3",
    "date-fns": "^3.0.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0"
  }
}
```

---

## 🎨 Design System Enhancements

### New Components Needed
1. **FileUploader** - Drag-and-drop with progress
2. **WorkflowStepper** - Multi-step form wizard
3. **ProgressTracker** - Stage-based progress
4. **MetricsChart** - Various chart types
5. **SubtitleEditor** - Rich text editor
6. **WaveformVisualizer** - Audio waveform
7. **DiffViewer** - Text comparison
8. **CostCalculator** - Interactive cost estimator

---

## 📊 Success Metrics

### Phase 1 (MVP)
- ✅ Users can upload and process videos
- ✅ Subtitles generated with quality scores
- ✅ Cost visibility and tracking
- ✅ Manual review workflow functional

### Phase 2 (Production)
- ✅ Model training capability
- ✅ Compliance tracking active
- ✅ Multi-provider support
- ✅ Intelligent routing enabled

### Phase 3 (Advanced)
- ✅ Hybrid workflows operational
- ✅ Edge deployment available
- ✅ POC testing tools ready

---

## 💰 Resource Estimation

### Development Team
- **1 Senior Frontend Developer** (Full-time)
- **1 Mid-level Frontend Developer** (Full-time)
- **1 UI/UX Designer** (Part-time)

### Timeline
- **Phase 1:** 4 weeks (160 hours)
- **Phase 2:** 4 weeks (160 hours)
- **Phase 3:** 4 weeks (160 hours)
- **Total:** 12 weeks (480 hours)

### Cost Estimate
- Phase 1 (Critical): $40,000 - $60,000
- Phase 2 (Important): $30,000 - $50,000
- Phase 3 (Optional): $20,000 - $40,000
- **Total: $90,000 - $150,000**

---

## 🚦 Risk Assessment

### High Risk
- **Workflow execution complexity** - Mitigation: Incremental development
- **Real-time WebSocket integration** - Mitigation: Use proven libraries
- **File upload at scale** - Mitigation: Chunked upload, presigned URLs

### Medium Risk
- **Subtitle editor UX** - Mitigation: Use existing libraries (wavesurfer.js)
- **Cost calculation accuracy** - Mitigation: Validate against backend
- **Training UI complexity** - Mitigation: Phase 2, more time

### Low Risk
- **UI component reuse** - Already have design system
- **API integration** - Well-documented Postman collection
- **Database schema** - Already established

---

## ✅ Next Actions

### Immediate (This Week)
1. **Review and approve** this roadmap
2. **Prioritize** which features to build first
3. **Allocate resources** (developers, designers)
4. **Set up project tracking** (Jira, Linear, etc.)

### Week 1 Start
1. **Create** Workflow Runner page
2. **Implement** file upload component
3. **Integrate** POST /models/run endpoint
4. **Add** basic job monitoring

### Quick Wins (Parallel)
1. **Enhance** SystemHealth with missing metrics
2. **Add** Provider list to Models page
3. **Create** simple Billing dashboard
4. **Update** Jobs page with more details

---

## 📞 Support & Resources

### Documentation
- ✅ Postman Collection (v8.5-Hybrid-Full)
- ✅ Frontend Gap Analysis
- ✅ Project Structure Guide
- ✅ API Documentation

### Development Environment
- ✅ Vite dev server configured
- ✅ Supabase database ready
- ✅ Backend API available
- ✅ Design system components built

---

**Ready to start Phase 1? Let's build the Workflow Runner! 🚀**

---

**Last Updated:** 2025-11-15
**Version:** 1.0
**Status:** Ready for Implementation
