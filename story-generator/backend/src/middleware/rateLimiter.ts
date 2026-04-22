import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  keyGenerator: (_req: Request, res: Response) => res.locals.userId as string,
  message: { error: 'Zu viele Anfragen. Bitte in einer Stunde erneut versuchen.' },
  standardHeaders: true,
  legacyHeaders: false,
});
