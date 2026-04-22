import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { config } from '../config';
import { AppError } from '../app';

function makeError(status: number, message: string): AppError {
  const err: AppError = new Error(message);
  err.status = status;
  return err;
}

export async function registerUser(email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw makeError(409, 'E-Mail bereits registriert');

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash },
    select: { id: true, email: true },
  });
  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw makeError(401, 'E-Mail oder Passwort falsch');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw makeError(401, 'E-Mail oder Passwort falsch');

  return { id: user.id, email: user.email };
}

export function signToken(userId: string): string {
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
