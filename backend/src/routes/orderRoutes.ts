import { celebrate } from 'celebrate';
import express from 'express';
import createOrder from '../controllers/orderController';
import { createOrderSchema } from '../validation/schemas';

const router = express.Router();

router.post('/order', celebrate(createOrderSchema), createOrder);

export default router;
