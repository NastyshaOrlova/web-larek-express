import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
  _id: string;
}

interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'Токен не предоставлен' });
  } else {
    try {
      const decoded = jwt.verify(token, 'ключ') as DecodedToken;
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Недействительный или просроченный токен' });
    }
  }
};

export default authMiddleware;
