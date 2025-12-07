import { Router } from 'express';
import { BarberShopController } from '../controllers/barberShopController';
import { requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @openapi
 * /api/barber-shops:
 *   get:
 *     summary: List barber shops
 *     tags: [BarberShop]
 *   post:
 *     summary: Create barber shop
 *     tags: [BarberShop]
 *     security:
 *       - BearerAuth: []
 */
router.get('/', BarberShopController.getAll);
router.post('/', requireAdmin, BarberShopController.create);

/**
 * @openapi
 * /api/barber-shops/{id}:
 *   get:
 *     summary: Get barber shop by ID
 *     tags: [BarberShop]
 *   put:
 *     summary: Update barber shop
 *     tags: [BarberShop]
 *     security:
 *       - BearerAuth: []
 *   delete:
 *     summary: Delete barber shop
 *     tags: [BarberShop]
 *     security:
 *       - BearerAuth: []
 */
router.get('/:id', BarberShopController.getOne);
router.put('/:id', requireAdmin, BarberShopController.update);
router.delete('/:id', requireAdmin, BarberShopController.delete);

export default router;
