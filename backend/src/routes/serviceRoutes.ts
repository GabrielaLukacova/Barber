import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import { ServiceController } from '../controllers/serviceController';
import { requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

const upload = multer({
  dest: 'uploads/services/',
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               duration:
 *                 type: integer
 *               price:
 *                 type: integer
 *               isBooked:
 *                 type: boolean
 *             required: [name, duration, price]
 *     responses:
 *       201:
 *         description: Created.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 */
router.get('/', ServiceController.getAll);
router.post('/', requireAdmin, upload.single('image'), ServiceController.create);

/**
 * @openapi
 * /api/services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags:
 *       - Services
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Service.
 *       404:
 *         description: Not found.
 *   put:
 *     summary: Update a service
 *     tags:
 *       - Services
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               duration:
 *                 type: integer
 *               price:
 *                 type: integer
 *               isBooked:
 *                 type: boolean
 *             required: [name, duration, price]
 *     responses:
 *       200:
 *         description: Updated.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *   delete:
 *     summary: Delete a service
 *     tags:
 *       - Services
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted.
 *       401:
 *         description: Unauthorized.
 */
router.get('/:id', ServiceController.getOne);
router.put('/:id', requireAdmin, upload.single('image'), ServiceController.update);
router.delete('/:id', requireAdmin, ServiceController.delete);

export default router;
