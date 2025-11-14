import { publishJob } from '../services/orchestratorService.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * POST /models/run
 * Validates and enqueues a job via orchestratorService.
 */
export async function modelsRun(req, res) {
  const body = req.body;
  // Basic validation (extend with AJV in validate.middleware)
  if (!body || !body.input || !body.media_duration_s) {
    return res.status(400).json({ code: 'ERR_INVALID_REQUEST', message: 'input and media_duration_s required', trace_id: uuidv4() });
  }
  try {
    const job = await publishJob({ tenant_id: req.tenant?.id || 'demo', payload: body });
    return res.status(202).json({ job_id: job.job_id, status: job.status, enqueue_time: job.enqueue_time });
  } catch (err) {
    const trace_id = uuidv4();
    return res.status(500).json({ code: 'ERR_JOB_ENQUEUE', message: err.message, trace_id });
  }
}

/**
 * GET /jobs/status?job_id=...
 */
export async function jobStatus(req, res) {
  const job_id = req.query.job_id;
  if (!job_id) return res.status(400).json({ code: 'ERR_INVALID_REQUEST', message: 'job_id required', trace_id: uuidv4() });
  // For now, return a stubbed response; backend should query DB
  return res.json({ job_id, status: 'queued', percent_complete: 0.0, manifest_url: null });
}