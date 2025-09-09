import { celebrate } from 'celebrate';
import express from 'express';
import { getCurrentUser, login, logout, refreshAccessToken, register } from '../controllers/authController';
import authMiddleware from '../middlewares/auth';
import { loginSchema, registerSchema } from '../validation/schemas';

const router = express.Router();

router.post('/register', celebrate(registerSchema), register);
router.post('/login', celebrate(loginSchema), login);
router.get('/token', refreshAccessToken);
router.get('/logout', logout);
router.get('/user', authMiddleware, getCurrentUser);

export default router;
