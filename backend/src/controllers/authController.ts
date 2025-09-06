import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import User from '../models/User';

export const getCurrentUser = async (req: Request, res: Response) => {
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

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email и пароль обязательны' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Пароль должен быть от 6 символов' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Пользователь с таким email уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: 'Ё-мое',
      email,
      password: hashedPassword,
      tokens: [],
    });

    await user.save();

    const accessToken = jwt.sign({ _id: user._id }, 'ключ', { expiresIn: '10m' });

    const refreshToken = jwt.sign({ _id: user._id }, 'ключ', { expiresIn: '7d' });

    user.tokens.push({ token: refreshToken });
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: ms('7d'),
      path: '/',
    });

    return res.json({
      user: {
        email: user.email,
        name: user.name,
      },
      success: true,
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Неверный email или пароль' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Неверный email или пароль' });
    }

    const accessToken = jwt.sign({ _id: user._id }, 'ключ'!, { expiresIn: '10m' });

    const refreshToken = jwt.sign({ _id: user._id }, 'ключ'!, { expiresIn: '7d' });

    user.tokens.push({ token: refreshToken });
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: ms('7d'),
      path: '/',
    });

    return res.json({
      user: {
        email: user.email,
        name: user.name,
      },
      success: true,
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Токен не предоставлен' });
    }

    const decoded = jwt.verify(refreshToken, 'ключ') as { _id: string };

    if (!decoded._id) {
      return res.status(400).json({ success: false, message: 'Невалидный _id в токене' });
    }

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    user.tokens = user.tokens.filter((t) => t.token !== refreshToken);
    await user.save();

    res.cookie('refreshToken', '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 0,
      path: '/',
    });

    return res.json({
      success: true,
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Невалидный токен' });
  }
};
