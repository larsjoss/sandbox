import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from '../app';

interface JwtPayload {
  userId: string;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token as string | undefined;
  if (!token) {
    const err: AppError = new Error('Nicht authentifiziert');
    err.status = 401;
    return next(err);
  }

  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    res.locals.userId = payload.userId;
    next();
  } catch {
    const err: AppError = new Error('Ungültiger Token');
    err.status = 401;
    next(err);
  }
}
