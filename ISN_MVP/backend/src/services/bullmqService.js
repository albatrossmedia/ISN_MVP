import { Queue } from 'bullmq';
import IORedis from 'ioredis';
let connection;
const queues = {};

function getConnection() {
  if (!connection) {
    connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');
  }
  return connection;
}

export function createOrGetQueue(name) {
  if (queues[name]) return queues[name];
  const q = new Queue(name, { connection: getConnection() });
  queues[name] = q;
  return q;
}