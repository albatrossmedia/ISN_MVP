# Postman Collection → Frontend Mapping

## Quick Reference Guide

This document maps Postman API endpoints to required frontend pages.

---

## ✅ ALREADY IMPLEMENTED

| Page | Endpoints Used | Status |
|------|---------------|--------|
| Dashboard | None (static) | ✅ Complete |
| Models | GET /models | ✅ Complete |
| Datasets | GET /datasets | ✅ Complete |
| Jobs | GET /jobs | ✅ Complete |
| Users | GET /users | ✅ Complete |
| Login | POST /auth/token | ✅ Complete |

---

## 🔴 HIGH PRIORITY - MUST ADD

### 1. Workflow Runner
**Page:** `/dashboard/workflows/new`
**Postman Folder:** `C. Universal Workflow & Realtime`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /models/run | Execute workflow |
| GET | /jobs/{id} | Get job status |
| GET | /jobs/{id}/preview | Preview results |
| POST | /jobs/{id}/terminate | Cancel job |

---

### 2. Job Monitor
**Page:** `/dashboard/workflows/:jobId`
**Postman Folder:** `K. Jobs & Monitoring`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /jobs/status | Poll status |
| GET | /jobs/segments | Get segments |
| POST | /jobs/segments/merge | Merge segments |
| GET | /jobs/dlq | Dead letter queue |

---

### 3. Evaluation Dashboard
**Page:** `/dashboard/evaluation`
**Postman Folder:** `E. Evaluation & Quality`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /evaluate | Evaluate ASR (WER/CER) |
| POST | /evaluate/mt | Evaluate MT (BLEU) |
| POST | /evaluate/compare | Compare providers |
| GET | /evaluate/reports | Get reports |

---

### 4. Billing Dashboard
**Page:** `/dashboard/billing`
**Postman Folder:** `I. Billing & Cost`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /billing/usage | Current usage |
| POST | /billing/estimate | Estimate costs |
| POST | /billing/forecast | Forecast |
| GET | /billing/invoice | Invoices |

---

### 5. Review Queue
**Page:** `/dashboard/review`
**Postman Folder:** `ReviewOps (HITL)`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /review/queue | Queue review |
| POST | /review/submit | Submit edits |
| GET | /review/diff | View changes |
| GET | /review/analytics | Analytics |

---

## 🟡 MEDIUM PRIORITY

### 6. Training Dashboard
**Page:** `/dashboard/training`
**Postman Folder:** `TrainingOps`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /training/start | Start training |
| GET | /training/status | Training status |
| POST | /training/evaluate | Evaluate model |
| POST | /training/deploy | Deploy model |

---

### 7. Compliance Dashboard
**Page:** `/dashboard/compliance`
**Postman Folder:** `H. Compliance & Governance`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /compliance/score | Job score |
| POST | /compliance/license-matrix/sync | Sync licenses |
| POST | /compliance/consent | Upload consent |
| GET | /compliance/watermark | Watermark info |

---

### 8. Provider Management
**Page:** `/dashboard/providers`
**Postman Folder:** `M. Providers & Integration`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /providers/register | Register provider |
| GET | /providers/list | List providers |
| POST | /providers/healthcheck | Check health |

---

### 9. Routing Policies
**Page:** `/dashboard/routing`
**Postman Folder:** `F. Adaptive Worker Routing`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /routing/policy/register | Register policy |
| GET | /routing/recommend | Recommendations |
| POST | /routing/optimize | Optimize |

---

## 🟢 LOW PRIORITY

### 10. Hybrid Workflows
**Page:** `/dashboard/hybrid`
**Postman Folder:** `Hybrid Orchestration`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /hybrid/run | Run hybrid |
| POST | /hybrid/merge | Merge outputs |

---

### 11. Gemini Studio
**Page:** `/dashboard/gemini`
**Postman Folder:** `Gemini Contextual APIs`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /gemini/translate | Translate + format |
| POST | /gemini/contextualize | Contextualize |

---

### 12. POC Testing
**Page:** `/dashboard/poc`
**Postman Folder:** `POC Validation`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /poc/test-gemini | Test Gemini |
| POST | /poc/test-stt | Test STT |
| POST | /poc/compare | Compare |

---

## 📊 ENHANCE EXISTING PAGES

### SystemHealth (Add Metrics)
**Current:** `/dashboard/system-health`
**Postman Folder:** `J. Observability & Analytics`

**Add These Endpoints:**
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /observability/metrics?metric=sqi_overall_p50 | SQI p50 |
| GET | /observability/metrics?metric=sqi_trend_7d | SQI trend |
| GET | /observability/metrics?metric=fer_rate | FER rate |
| GET | /observability/queue_depth | Queue depth |
| GET | /observability/realtime | Real-time |

---

## 🎯 IMPLEMENTATION PRIORITY

### Week 1: Core Workflow
```
✓ Workflow Runner      → 4 endpoints
✓ Job Monitor         → 4 endpoints
```

### Week 2: Quality
```
✓ Evaluation Dashboard → 4 endpoints
✓ Quality Metrics     → 3 endpoints
```

### Week 3: Business
```
✓ Billing Dashboard   → 4 endpoints
✓ Usage Reports       → 2 endpoints
```

### Week 4: Review
```
✓ Review Queue        → 2 endpoints
✓ Subtitle Editor     → 2 endpoints
```

---

## 📋 ENDPOINT USAGE STATISTICS

| Category | Endpoints | Used | Missing | Coverage |
|----------|-----------|------|---------|----------|
| Access & Identity | 11 | 2 | 9 | 18% |
| System & Overview | 11 | 1 | 10 | 9% |
| Universal Workflow | 10 | 0 | 10 | 0% |
| Models (Speech/Text) | 10 | 1 | 9 | 10% |
| Evaluation & Quality | 7 | 0 | 7 | 0% |
| Adaptive Routing | 4 | 0 | 4 | 0% |
| Datasets & MDMS | 12 | 1 | 11 | 8% |
| Compliance | 7 | 0 | 7 | 0% |
| Billing & Cost | 4 | 0 | 4 | 0% |
| Observability | 9 | 1 | 8 | 11% |
| Jobs & Monitoring | 6 | 1 | 5 | 17% |
| TrainingOps | 4 | 0 | 4 | 0% |
| ReviewOps | 4 | 0 | 4 | 0% |
| Providers | 6 | 0 | 6 | 0% |
| Edge & Deployment | 4 | 0 | 4 | 0% |
| Hybrid (v8.5) | 9 | 0 | 9 | 0% |
| **TOTAL** | **133** | **20** | **113** | **15%** |

---

## 🔧 API CLIENT STRUCTURE

### Current (`src/lib/api.ts`)
```typescript
// Single file, basic setup
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});
```

### Recommended (`src/lib/api/`)
```typescript
// Organized by domain
api/
  ├── index.ts          // Main export
  ├── client.ts         // Axios instance
  ├── auth.ts           // Authentication
  ├── workflows.ts      // Workflow execution
  ├── evaluation.ts     // Quality metrics
  ├── billing.ts        // Cost management
  ├── review.ts         // HITL operations
  ├── training.ts       // Model training
  ├── compliance.ts     // Governance
  ├── providers.ts      // Provider mgmt
  ├── routing.ts        // Adaptive routing
  ├── observability.ts  // Metrics & logs
  └── hybrid.ts         // Hybrid workflows
```

---

## 📝 EXAMPLE IMPLEMENTATIONS

### Workflow Execution
```typescript
// src/lib/api/workflows.ts
export const workflowsApi = {
  run: (data: WorkflowRequest) => 
    api.post('/models/run', data),
  
  getStatus: (jobId: string) => 
    api.get(`/jobs/${jobId}`),
  
  preview: (jobId: string) => 
    api.get(`/jobs/${jobId}/preview`),
  
  terminate: (jobId: string) => 
    api.post(`/jobs/${jobId}/terminate`),
};
```

### Billing
```typescript
// src/lib/api/billing.ts
export const billingApi = {
  getUsage: (params?: UsageParams) => 
    api.get('/billing/usage', { params }),
  
  estimate: (data: EstimateRequest) => 
    api.post('/billing/estimate', data),
  
  forecast: (data: ForecastRequest) => 
    api.post('/billing/forecast', data),
  
  getInvoices: () => 
    api.get('/billing/invoice'),
};
```

---

## 🚀 QUICK START GUIDE

### 1. Pick a Feature to Implement
Start with **Workflow Runner** (highest impact)

### 2. Find Endpoints in Postman
Open: `C. Universal Workflow & Realtime`

### 3. Create API Client
```typescript
// src/lib/api/workflows.ts
export const workflowsApi = { ... }
```

### 4. Create Page
```typescript
// src/pages/WorkflowRunner.tsx
export const WorkflowRunner = () => { ... }
```

### 5. Add Route
```typescript
// src/App.tsx
<Route path="/dashboard/workflows/new" element={<WorkflowRunner />} />
```

### 6. Test with Postman
Use Postman to verify endpoints work

### 7. Integrate Frontend
Connect UI to API client

---

**Ready to implement? Start with the Workflow Runner!**

Last Updated: 2025-11-15
