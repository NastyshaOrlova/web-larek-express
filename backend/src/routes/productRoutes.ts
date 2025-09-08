import { celebrate } from 'celebrate';
import express from 'express';
import { createProduct, deleteProduct, getAllProducts, updateProduct } from '../controllers/productController';
import authMiddleware from '../middlewares/auth';
import { createProductSchema } from '../validation/schemas';

const router = express.Router();

router.get('/', getAllProducts);
router.post('/', authMiddleware, celebrate(createProductSchema), createProduct);
router.patch('/:productId', authMiddleware, updateProduct);
router.delete('/:productId', authMiddleware, deleteProduct);

export default router;
