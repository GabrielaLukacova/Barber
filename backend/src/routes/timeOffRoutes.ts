import { Router } from 'express';
import { TimeOffController } from '../controllers/timeOffController';
import { requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @openapi
 * /api/time-off:
 *   get:
 *     summary: List future time off
 *     tags: [TimeOff]
 *   post:
 *     summary: Create time off
 *     tags: [TimeOff]
 */
router.get('/', TimeOffController.getAllFuture);
router.post('/', TimeOffController.create);

/**
 * @openapi
 * /api/time-off/{id}:
 *   put:
 *     summary: Update time off
 *     tags: [TimeOff]
 *   delete:
 *     summary: Delete time off
 *     tags: [TimeOff]
 */
router.put('/:id', TimeOffController.update);
router.delete('/:id', TimeOffController.delete);

export default router;