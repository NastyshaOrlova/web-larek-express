import express from 'express';
import orderRoutes from './orderRoutes';
import productRoutes from './productRoutes';

const router = express.Router();

router.use('/api', productRoutes);
router.use('/api', orderRoutes);

export default router;
