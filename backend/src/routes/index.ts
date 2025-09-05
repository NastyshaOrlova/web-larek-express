import express from 'express';
import orderRoutes from './orderRoutes';
import productRoutes from './productRoutes';

const router = express.Router();

router.use('/', productRoutes);
router.use('/', orderRoutes);

export default router;
