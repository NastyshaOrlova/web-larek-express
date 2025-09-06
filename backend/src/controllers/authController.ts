import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Токен не предоставлен' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, 'ключ'!) as { _id: string };

    const user = await User.findById(decoded._id).select('-password -tokens');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    return res.json({
      user: {
        email: user.email,
        name: user.name,
      },
      success: true,
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Невалидный токен' });
  }
};

export default getCurrentUser;
