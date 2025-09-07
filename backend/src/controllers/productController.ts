import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import { Error as MongooseError } from 'mongoose';
import path from 'path';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import Product from '../models/Product';

export const getAllProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find();
    res.json({
      items: products,
      total: products.length,
    });
  } catch (error) {
    next(error);
  }
};

const moveFileToProducts = (fileName: string): void => {
  if (!fileName) return;

  const fileBaseName = path.basename(fileName);
  const tempPath = path.join('uploads/temp', fileBaseName);
  const finalPath = path.join('uploads/products', fileBaseName);

  if (fs.existsSync(tempPath)) {
    if (!fs.existsSync('uploads/products')) {
      fs.mkdirSync('uploads/products', { recursive: true });
    }

    fs.copyFileSync(tempPath, finalPath);
    fs.unlinkSync(tempPath);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productData = req.body;

    if (productData.image && productData.image.fileName) {
      moveFileToProducts(productData.image.fileName);
    }
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      next(new BadRequestError('Ошибка валидации данных при создании товара'));
    }

    if (error instanceof Error && error.message.includes('E11000')) {
      next(new ConflictError('Товар с таким названием уже существует'));
    }

    next(error);
  }
};
