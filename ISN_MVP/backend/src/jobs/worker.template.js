import { Worker } from 'bullmq';
import { init as initRedis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

/**
 * Example worker: listens on a queue and logs the job.
 * Replace processing logic with calls to model adapters and persistence.
 */
const connection = new (require('ioredis'))(process.env.REDIS_URL || 'redis://localhost:6379');

export function createWorker(queueName) {
  const worker = new Worker(queueName, async job => {
    console.log(`[worker:${queueName}] processing`, job.name, job.data);
    // Simulate processing latency
    await new Promise(r => setTimeout(r, 800));
    // In real implementation: call ASR/MT adapters, write job_segments & model_outputs
    return { processed: true };
  }, { connection });
  return worker;
}

if (require.main === module) {
  const q = process.env.WORKER_QUEUE || 'realtime';
  createWorker(q);
  console.log('Worker started for queue', q);
}