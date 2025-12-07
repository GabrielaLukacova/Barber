import { Router } from 'express';
import { GalleryImageController } from '../controllers/galleryImageController';
import { requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @openapi
 * /api/gallery-images:
 *   get:
 *     summary: List gallery images
 *     tags: [GalleryImage]
 *   post:
 *     summary: Create gallery image
 *     tags: [GalleryImage]
 *     security:
 *       - BearerAuth: []
 */
router.get('/', GalleryImageController.getAll);
router.post('/', requireAdmin, GalleryImageController.create);

/**
 * @openapi
 * /api/gallery-images/{id}:
 *   get:
 *     summary: Get gallery image by ID
 *     tags: [GalleryImage]
 *   put:
 *     summary: Update gallery image
 *     tags: [GalleryImage]
 *     security:
 *       - BearerAuth: []
 *   delete:
 *     summary: Delete gallery image
 *     tags: [GalleryImage]
 *     security:
 *       - BearerAuth: []
 */
router.get('/:id', GalleryImageController.getOne);
router.put('/:id', requireAdmin, GalleryImageController.update);
router.delete('/:id', requireAdmin, GalleryImageController.delete);

export default router;
