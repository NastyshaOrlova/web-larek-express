import express from 'express';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import uploadRoutes from './uploadRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);
router.use('/product', productRoutes);

export default router;
