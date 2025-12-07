import { Router } from 'express';
import { PostalCodeController } from '../controllers/postalCodeController';
import { requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @openapi
 * /api/postal-codes:
 *   get:
 *     summary: List postal codes
 *     tags: [PostalCode]
 *   post:
 *     summary: Create postal code
 *     tags: [PostalCode]
 *     security:
 *       - BearerAuth: []
 */
router.get('/', PostalCodeController.getAll);
router.post('/', requireAdmin, PostalCodeController.create);

/**
 * @openapi
 * /api/postal-codes/{code}:
 *   get:
 *     summary: Get postal code
 *     tags: [PostalCode]
 *   put:
 *     summary: Update postal code
 *     tags: [PostalCode]
 *     security:
 *       - BearerAuth: []
 *   delete:
 *     summary: Delete postal code
 *     tags: [PostalCode]
 *     security:
 *       - BearerAuth: []
 */
router.get('/:code', PostalCodeController.getOne);
router.put('/:code', requireAdmin, PostalCodeController.update);
router.delete('/:code', requireAdmin, PostalCodeController.delete);

export default router;
