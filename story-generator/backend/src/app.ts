import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from './config';
import { router } from './routes';

export interface AppError extends Error {
  status?: number;
}

export function createApp() {
  const app = express();

  app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.use('/api', router);

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.use((err: AppError, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status ?? 500;
    const message = err.message ?? 'Internal server error';
    res.status(status).json({ error: message });
  });

  return app;
}
