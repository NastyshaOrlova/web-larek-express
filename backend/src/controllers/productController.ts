import { Request, Response } from 'express';
import Product from '../models/Product';

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json({
      items: products,
      total: products.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения товаров' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: 'Ошибка создания товара' });
  }
};
