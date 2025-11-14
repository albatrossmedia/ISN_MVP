import express from 'express';
import authRoutes from './auth.routes.js';
import jobsRoutes from './jobs.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/jobs', jobsRoutes);

router.get('/', (req, res) => {
  res.json({
    message: 'ISN API v1.0',
    endpoints: {
      auth: '/api/auth',
      jobs: '/api/jobs'
    }
  });
});

export default router;
