import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'List jobs - to be implemented', jobs: [] });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create job - to be implemented' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get job ${req.params.id} - to be implemented` });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Update job ${req.params.id} - to be implemented` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete job ${req.params.id} - to be implemented` });
});

export default router;
