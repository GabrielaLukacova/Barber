import { Router } from 'express';
import { GalleryImageController } from '../controllers/galleryImageController';
import { requireAdmin } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/upload';

const router = Router();

// public
router.get('/', GalleryImageController.getAll);

// admin
router.post(
  '/',
  requireAdmin,
  upload.array('images', 20),
  GalleryImageController.create,
);

router.put('/:id', requireAdmin, GalleryImageController.updateSortOrder);
router.delete('/:id', requireAdmin, GalleryImageController.delete);

export default router;