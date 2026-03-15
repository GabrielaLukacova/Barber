import { Router } from 'express';
import multer from 'multer';
import { ServiceController } from '../controllers/serviceController';
import { requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

/**
 * IMPORTANT:
 * For Supabase upload we MUST use memoryStorage.
 * We do NOT store files on disk anymore.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images allowed'));
    }
    cb(null, true);
  },
});

/**
 * @openapi
 * /api/services:
 *   get:
 *     summary: List all services
 *     tags:
 *       - Services
 *     responses:
 *       200:
 *         description: List of services.
 *   post:
 *     summary: Create a new service
 *     tags:
 *       - Services
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Created.
 */
router.get('/', ServiceController.getAll);
router.post('/', requireAdmin, upload.single('image'), ServiceController.create);

/**
 * @openapi
 * /api/services/{id}:
 *   get:
 *     summary: Get a service by ID
 *   put:
 *     summary: Update a service
 *   delete:
 *     summary: Delete a service
 */
router.get('/:id', ServiceController.getOne);
router.put('/:id', requireAdmin, upload.single('image'), ServiceController.update);
router.delete('/:id', requireAdmin, ServiceController.delete);

export default router;