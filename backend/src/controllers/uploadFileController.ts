import { Request, Response } from 'express';

const uploadFile = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Файл не был загружен',
      });
    }

    return res.json({
      fileName: `/images/${req.file.filename}`,
      originalName: req.file.originalname,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Ошибка при загрузке файла',
    });
  }
};

export default uploadFile;
