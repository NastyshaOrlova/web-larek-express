import { celebrate } from 'celebrate';
import express from 'express';
import { createProduct, getAllProducts, updateProduct } from '../controllers/productController';
import { createProductSchema } from '../validation/schemas';

const router = express.Router();

router.get('/', getAllProducts);
router.post('/', celebrate(createProductSchema), createProduct);
router.patch('/:productId', updateProduct);

export default router;
