import express from 'express';
import { getCurrentUser, login, logout, refreshAccessToken, register } from '../controllers/authController';
import authMiddleware from '../middlewares/auth';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/token', refreshAccessToken);
router.get('/logout', logout);
router.get('/user', authMiddleware, getCurrentUser);

export default router;
