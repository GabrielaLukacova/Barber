import type { Request, Response } from 'express';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

const JWT_SECRET: any = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is missing');
}
const JWT_EXPIRES_IN: SignOptions['expiresIn'] =
  (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '1h';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      if (username !== ADMIN_USERNAME) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const ok = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
      if (!ok) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const payload = { sub: username, role: 'admin' };

      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });

      return res.json({ token });
    } catch (err) {
      console.error('AuthController.login error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
