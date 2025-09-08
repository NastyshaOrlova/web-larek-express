import express from 'express';
import authRoutes from './authRoutes';
import orderRoutes from './orderRoutes';
import productRoutes from './productRoutes';
import uploadRoutes from './uploadRoutes';

const router = express.Router();

router.use('/product', productRoutes);
router.use('/order', orderRoutes);
router.use('/upload', uploadRoutes);
router.use('/auth', authRoutes);

export default router;
