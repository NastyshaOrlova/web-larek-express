import express from 'express';
import {
  createProduct,
  getAllProducts,
} from '../controllers/productController';

const router = express.Router();

router.get('/product', getAllProducts);
router.post('/product', createProduct);

export default router;
