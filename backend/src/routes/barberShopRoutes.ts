import { Router } from 'express';
import { BarberShopController } from '../controllers/barberShopController';
import { requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @openapi
 * /api/barber-shop:
 *   get:
 *     summary: Get main barber shop profile
 *     tags: [BarberShop]
 *   put:
 *     summary: Update main barber shop profile
 *     tags: [BarberShop]
 *     security:
 *       - BearerAuth: []
 */
router.get('/', BarberShopController.getFirst);
router.put('/', requireAdmin, BarberShopController.updateFirst);

export default router;
