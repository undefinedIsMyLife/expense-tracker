import express from 'express';
import { analyticsController } from '../controllers/analyticsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All analytics routes are protected
router.use(authenticateToken);

router.get('/', analyticsController.getAnalytics);

export default router;
