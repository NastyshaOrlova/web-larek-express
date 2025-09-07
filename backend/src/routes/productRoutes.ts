import { celebrate } from 'celebrate';
import express from 'express';
import { createProduct, deleteProduct, getAllProducts, updateProduct } from '../controllers/productController';
import { createProductSchema } from '../validation/schemas';

const router = express.Router();

router.get('/', getAllProducts);
router.post('/', celebrate(createProductSchema), createProduct);
router.patch('/:productId', updateProduct);
router.delete('/:productId', deleteProduct);

export default router;
