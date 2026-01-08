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
 */
router.get('/', BarberShopController.getAll);
router.post('/', BarberShopController.create);

/**
 * @openapi
 * /api/barber-shops/{id}:
 *   get:
 *     summary: Get barber shop by ID
 *     tags: [BarberShop]
 *   put:
 *     summary: Update barber shop
 *     tags: [BarberShop]
 *   delete:
 *     summary: Delete barber shop
 *     tags: [BarberShop]
 */
router.get('/:id', BarberShopController.getOne);
router.put('/:id', BarberShopController.update);
// router.delete('/:id', requireAdmin, BarberShopController.delete);
router.delete('/:id', BarberShopController.delete);

export default router;