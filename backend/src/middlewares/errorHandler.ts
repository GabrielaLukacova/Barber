import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error('[ERROR]', err);

  return res.status(500).json({
    error: 'Internal server error',
    message: err?.message || 'Unexpected error occurred',
  });
}
