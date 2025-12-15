import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { GalleryImageController } from '../controllers/galleryImageController';
import { requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

const GALLERY_DIR = path.join(process.cwd(), 'uploads', 'gallery');
if (!fs.existsSync(GALLERY_DIR)) fs.mkdirSync(GALLERY_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, GALLERY_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only images allowed'));
    cb(null, true);
  },
});

// public
router.get('/', GalleryImageController.getAll);

// admin (accept multiple files under field name: images)
router.post(
  '/',
  requireAdmin,
  (req, res, next) => {
    upload.array('images', 20)(req as any, res as any, (err: any) => {
      if (err) return res.status(400).json({ error: 'Upload failed', message: err.message });
      next();
    });
  },
  GalleryImageController.create,
);

router.put('/:id', requireAdmin, GalleryImageController.updateSortOrder);
router.delete('/:id', requireAdmin, GalleryImageController.delete);

export default router;
