import express from 'express';
import { authController, updateCategories } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.patch('/categories', authenticateToken, updateCategories);

export default router;
