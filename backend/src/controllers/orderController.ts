import { faker } from '@faker-js/faker';
import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import BadRequestError from '../errors/bad-request-error';
import Product from '../models/Product';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { total, items } = req.body;

    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      return next(new BadRequestError('Некоторые товары не найдены'));
    }

    const unavailableProducts = products.filter((p) => p.price === null);
    if (unavailableProducts.length > 0) {
      return next(new BadRequestError('Некоторые товары не продаются'));
    }

    const calculatedTotal = products.reduce((sum, product) => sum + (product.price || 0), 0);

    if (calculatedTotal !== total) {
      return next(new BadRequestError('Неверная сумма заказа'));
    }

    const orderId = faker.string.uuid();

    res.json({
      id: orderId,
      total,
    });
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Неверный формат ID товара'));
    }
    next(error);
  }
};

export default createOrder;
