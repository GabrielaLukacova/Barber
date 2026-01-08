import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET || 'dev_secret';

export interface AuthRequest extends Request {
  user?: {
    sub: string;
    role: string;
  };
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  // validate bearer header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header.' });
  }

  const token = authHeader.substring('Bearer '.length);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;

    // enforce admin role
    if (!payload || payload.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    req.user = { sub: payload.sub, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}