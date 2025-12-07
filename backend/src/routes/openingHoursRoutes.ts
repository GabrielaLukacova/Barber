import { Router } from 'express';
import { OpeningHoursController } from '../controllers/openingHoursController';
import { requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @openapi
 * /api/opening-hours:
 *   get:
 *     summary: List opening hours
 *     tags: [OpeningHours]
 *   post:
 *     summary: Create opening hours
 *     tags: [OpeningHours]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dayOfWeek:
 *                 type: string
 *               openingTime:
 *                 type: string
 *                 nullable: true
 *               closingTime:
 *                 type: string
 *                 nullable: true
 *             required:
 *               - dayOfWeek
 */
router.get('/', OpeningHoursController.getAll);
router.post('/', requireAdmin, OpeningHoursController.create);

/**
 * @openapi
 * /api/opening-hours/{id}:
 *   get:
 *     summary: Get opening hours by ID
 *     tags: [OpeningHours]
 *   put:
 *     summary: Update opening hours
 *     tags: [OpeningHours]
 *     security:
 *       - BearerAuth: []
 *   delete:
 *     summary: Delete opening hours
 *     tags: [OpeningHours]
 *     security:
 *       - BearerAuth: []
 */
router.get('/:id', OpeningHoursController.getOne);
router.put('/:id', requireAdmin, OpeningHoursController.update);
router.delete('/:id', requireAdmin, OpeningHoursController.delete);

export default router;
