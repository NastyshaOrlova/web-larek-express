import express from 'express';
import authRoutes from './authRoutes';
import uploadRoutes from './uploadRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);

export default router;
