import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized';

interface DecodedToken extends JwtPayload {
  _id: string;
}

interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}

const authMiddleware = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(new UnauthorizedError('Токен не предоставлен'));
    }

    const decoded = jwt.verify(token, 'ключ') as DecodedToken;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Недействительный или просроченный токен'));
    }
    next(error);
  }
};

export default authMiddleware;
