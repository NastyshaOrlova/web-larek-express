import { NextFunction, Request, Response } from 'express';
import BadRequestError from '../errors/bad-request-error';

const uploadFile = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(new BadRequestError('Файл не был загружен'));
    }

    return res.json({
      fileName: `/images/${req.file.filename}`,
      originalName: req.file.originalname,
    });
  } catch (error) {
    next(error);
  }
};

export default uploadFile;
