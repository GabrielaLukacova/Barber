import { Router } from 'express';
import { ConfigController } from '../controllers/configController';
import { requireAdmin } from '../middlewares/authMiddleware';

const router = Router();
/**
 * @openapi
 * /api/postal-codes:
 *   get:
 *     summary: List postal codes
 *     tags:
 *       - Config
 *   post:
 *     summary: Create postal code
 *     tags:
 *       - Config
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postalCode:
 *                 type: string
 *                 example: "6700"
 *               city:
 *                 type: string
 *                 example: "Esbjerg"
 *             required:
 *               - postalCode
 *               - city
 */
router.get('/postal-codes', ConfigController.getPostalCodes);
router.post('/postal-codes', requireAdmin, ConfigController.createPostalCode);

/**
 * @openapi
 * /api/postal-codes/{code}:
 *   get:
 *     summary: Get postal code by code
 *     tags:
 *       - Config
 *   put:
 *     summary: Update postal code
 *     tags:
 *       - Config
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city:
 *                 type: string
 *             required:
 *               - city
 *   delete:
 *     summary: Delete postal code
 *     tags:
 *       - Config
 *     security:
 *       - BearerAuth: []
 */
router.get('/postal-codes/:code', ConfigController.getPostalCode);
router.put('/postal-codes/:code', requireAdmin, ConfigController.updatePostalCode);
router.delete('/postal-codes/:code', requireAdmin, ConfigController.deletePostalCode);

export default router;
