import { createOrGetQueue } from './bullmqService.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Very small orchestrator for job routing.
 * Decides queue by media_duration_s and enqueues job payload.
 */
function chooseQueue(media_duration_s, latency_class='auto') {
  if (latency_class === 'realtime' || media_duration_s <= 120) return 'realtime';
  if (media_duration_s <= 900) return 'standard';
  return 'bulk';
}

export async function publishJob({ tenant_id, payload }) {
  const job_id = 'JOB-' + uuidv4();
  const queueName = chooseQueue(payload.media_duration_s, payload.latency_class || 'auto');
  const q = await createOrGetQueue(queueName);
  // job record to be persisted by workers; for now we enqueue with job_id
  await q.add('process_segment', { job_id, tenant_id, payload }, { removeOnComplete: true, attempts: 3, backoff: { type: 'exponential', delay: 2000 } });
  return { job_id, status: 'queued', enqueue_time: new Date().toISOString(), queue: queueName };
}