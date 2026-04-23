import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { prisma } from '../lib/prisma';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      return res.status(400).json({ error: 'E-Mail und Passwort erforderlich' });
    }
    const user = await authService.registerUser(email, password);
    const token = authService.signToken(user.id);
    authService.setAuthCookie(res, token);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      return res.status(400).json({ error: 'E-Mail und Passwort erforderlich' });
    }
    const user = await authService.loginUser(email, password);
    const token = authService.signToken(user.id);
    authService.setAuthCookie(res, token);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  res.json({ ok: true });
}

export async function me(_req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.userId as string;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });
    if (!user) return res.status(401).json({ error: 'Nicht authentifiziert' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
