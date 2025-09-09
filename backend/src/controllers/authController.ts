import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Error as MongooseError } from 'mongoose';
import ms from 'ms';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import UnauthorizedError from '../errors/unauthorized';
import User from '../models/User';

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Токен не предоставлен'));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'ключ'!) as { _id: string };
    const user = await User.findById(decoded._id).select('-password -tokens');

    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }

    return res.json({
      user: {
        email: user.email,
        name: user.name,
      },
      success: true,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Невалидный токен'));
    }
    next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
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
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Ошибка валидации данных пользователя'));
    }

    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }

    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password +tokens');
    if (!user) {
      return next(new UnauthorizedError('Неверный email или пароль'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new UnauthorizedError('Неверный email или пароль'));
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
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return next(new UnauthorizedError('Токен не предоставлен'));
    }

    const decoded = jwt.verify(refreshToken, 'ключ') as { _id: string };
    const user = await User.findById(decoded._id).select('+tokens');

    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
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
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Невалидный токен'));
    }
    next(error);
  }
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return next(new UnauthorizedError('Refresh токен не предоставлен'));
    }

    const decoded = jwt.verify(refreshToken, 'ключ') as { _id: string };
    const user = await User.findById(decoded._id).select('+tokens');

    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }

    const tokenExists = user.tokens.some((t) => t.token === refreshToken);
    if (!tokenExists) {
      return next(new UnauthorizedError('Невалидный refresh токен'));
    }

    user.tokens = user.tokens.filter((t) => t.token !== refreshToken);

    const newAccessToken = jwt.sign({ _id: user._id }, 'ключ', { expiresIn: '10m' });
    const newRefreshToken = jwt.sign({ _id: user._id }, 'ключ', { expiresIn: '7d' });

    user.tokens.push({ token: newRefreshToken });
    await user.save();

    res.cookie('refreshToken', newRefreshToken, {
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
      accessToken: newAccessToken,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Невалидный или просроченный refresh токен'));
    }
    next(error);
  }
};
