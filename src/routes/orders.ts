import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Placeholder route - will be implemented later
router.get('/', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Orders route - Coming soon!',
  });
});

export default router;
