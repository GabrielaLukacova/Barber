import type { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';

export const AuthMeController = {
  me(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json({
      username: req.user.sub,
      role: req.user.role,
    });
  },
};
