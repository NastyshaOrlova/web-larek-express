import { Joi } from 'celebrate';

export const createOrderSchema = {
  body: Joi.object().keys({
    payment: Joi.string().valid('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    total: Joi.number().positive().required(),
    items: Joi.array().items(Joi.string()).min(1).required(),
  }),
};

export const createProductSchema = {
  body: Joi.object().keys({
    title: Joi.string().min(2).max(30).required(),
    image: Joi.object()
      .keys({
        fileName: Joi.string().required(),
        originalName: Joi.string().required(),
      })
      .required(),
    category: Joi.string().required(),
    description: Joi.string().optional(),
    price: Joi.number().positive().allow(null).optional(),
  }),
};

export const registerSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
};

export const loginSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
