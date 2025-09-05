import { faker } from '@faker-js/faker';
import { NextFunction, Request, Response } from 'express';
import BadRequestError from '../errors/bad-request-error';
import Product from '../models/Product';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { payment, email, phone, address, total, items } = req.body;

    if (!payment || !['card', 'online'].includes(payment)) {
      return next(new BadRequestError('Неверный тип оплаты'));
    }

    if (!email || !email.includes('@')) {
      return next(new BadRequestError('Неверный email'));
    }

    if (!phone) {
      return next(new BadRequestError('Телефон обязателен'));
    }

    if (!address) {
      return next(new BadRequestError('Адрес обязателен'));
    }

    if (!items || items.length === 0) {
      return next(new BadRequestError('Товары не выбраны'));
    }

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

    res.status(201).json({
      id: orderId,
      total,
    });
  } catch (error) {
    next(new BadRequestError('Ошибка создания заказа'));
  }
};

export default createOrder;
