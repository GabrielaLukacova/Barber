import type { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';

export const authMeController = {
  me(req: AuthRequest, res: Response) {
    // require authenticated user
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json({
      username: req.user.sub,
      role: req.user.role,
    });
  },
};