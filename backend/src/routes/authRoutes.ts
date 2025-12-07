import { Router, type Response } from 'express';
import { AuthController } from '../controllers/authController';
import { requireAdmin, type AuthRequest } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login as admin
 *     description: Returns a JWT token if credentials are correct.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Successful login, returns JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Username and password are required.
 *       401:
 *         description: Invalid username or password.
 */
router.post('/login', AuthController.login);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get current authenticated admin
 *     description: Returns info about the currently authenticated admin (based on JWT).
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated admin info.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Unauthorized (missing/invalid token).
 */
router.get('/me', requireAdmin, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return res.json({
    username: req.user.sub,
    role: req.user.role,
  });
});

export default router;
