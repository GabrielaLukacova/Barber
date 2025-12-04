import { Router } from 'express';
import multer from 'multer';
import { ServiceController } from '../controllers/serviceController';
import { requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

const upload = multer({
  dest: 'uploads/services/',
});

// Public routes
router.get('/', ServiceController.getAll);
router.get('/:id', ServiceController.getOne);

// Admin-only routes
router.post('/', requireAdmin, upload.single('image'), ServiceController.create);
router.put('/:id', requireAdmin, upload.single('image'), ServiceController.update);
router.delete('/:id', requireAdmin, ServiceController.delete);

export default router;
