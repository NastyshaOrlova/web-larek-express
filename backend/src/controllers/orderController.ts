import { faker } from '@faker-js/faker';
import { Request, Response } from 'express';
import Product from '../models/Product';

const createOrder = async (req: Request, res: Response) => {
  try {
    const { payment, email, phone, address, total, items } = req.body;

    if (!payment || !['card', 'online'].includes(payment)) {
      return res.status(400).json({ error: 'Неверный тип оплаты' });
    }

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Неверный email' });
    }

    if (!phone) {
      return res.status(400).json({ error: 'Телефон обязателен' });
    }

    if (!address) {
      return res.status(400).json({ error: 'Адрес обязателен' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Товары не выбраны' });
    }

    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      return res.status(400).json({ error: 'Некоторые товары не найдены' });
    }

    const unavailableProducts = products.filter((p) => p.price === null);
    if (unavailableProducts.length > 0) {
      return res.status(400).json({ error: 'Некоторые товары не продаются' });
    }

    const calculatedTotal = products.reduce(
      (sum, product) => sum + (product.price || 0),
      0,
    );

    if (calculatedTotal !== total) {
      return res.status(400).json({ error: 'Неверная сумма заказа' });
    }

    const orderId = faker.string.uuid();

    res.status(201).json({
      id: orderId,
      total,
    });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка создания заказа' });
  }
};

export default createOrder;
