import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import { Error as MongooseError } from 'mongoose';
import path from 'path';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
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
      return next(new BadRequestError('Ошибка валидации данных при создании товара'));
    }

    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Товар с таким названием уже существует'));
    }

    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;

    if (updateData.image && updateData.image.fileName) {
      moveFileToProducts(updateData.image.fileName);
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return next(new NotFoundError('Товар не найден'));
    }

    res.json(updatedProduct);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Ошибка валидации данных при обновлении товара'));
    }

    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Неверный формат ID товара'));
    }

    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Товар с таким названием уже существует'));
    }

    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return next(new NotFoundError('Товар не найден'));
    }

    res.json(deletedProduct);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Неверный формат ID товара'));
    }
    next(error);
  }
};
