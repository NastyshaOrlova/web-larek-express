import { celebrate } from 'celebrate';
import express from 'express';
import { createProduct, getAllProducts } from '../controllers/productController';
import { createProductSchema } from '../validation/schemas';

const router = express.Router();

router.get('/product', getAllProducts);
router.post('/product', celebrate(createProductSchema), createProduct);

export default router;
