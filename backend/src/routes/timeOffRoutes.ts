import { Router } from 'express';
import { TimeOffController } from '../controllers/timeOffController';
import { requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @openapi
 * /api/time-off:
 *   get:
 *     summary: List time off entries
 *     tags: [TimeOff]
 *   post:
 *     summary: Create time off
 *     tags: [TimeOff]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start:
 *                 type: string
 *               end:
 *                 type: string
 *               reason:
 *                 type: string
 *                 nullable: true
 *             required:
 *               - start
 *               - end
 */
router.get('/', TimeOffController.getAll);
router.post('/', requireAdmin, TimeOffController.create);

/**
 * @openapi
 * /api/time-off/{id}:
 *   get:
 *     summary: Get time off by ID
 *     tags: [TimeOff]
 *   put:
 *     summary: Update time off
 *     tags: [TimeOff]
 *     security:
 *       - BearerAuth: []
 *   delete:
 *     summary: Delete time off entry
 *     tags: [TimeOff]
 *     security:
 *       - BearerAuth: []
 */
router.get('/:id', TimeOffController.getOne);
router.put('/:id', requireAdmin, TimeOffController.update);
router.delete('/:id', requireAdmin, TimeOffController.delete);

export default router;
