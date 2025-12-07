import { Router } from 'express';
import { ClientController } from '../controllers/clientController';
import { requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @openapi
 * /api/clients:
 *   get:
 *     summary: List all clients
 *     tags:
 *       - Clients
 *     responses:
 *       200:
 *         description: List of clients.
 *   post:
 *     summary: Create a client
 *     tags:
 *       - Clients
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *                 nullable: true
 *               note:
 *                 type: string
 *                 nullable: true
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *     responses:
 *       201:
 *         description: Created.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 */
router.get('/', ClientController.getAll);
router.post('/', requireAdmin, ClientController.create);

/**
 * @openapi
 * /api/clients/{id}:
 *   get:
 *     summary: Get a client by ID
 *     tags:
 *       - Clients
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Client.
 *       404:
 *         description: Client not found.
 *   put:
 *     summary: Update a client
 *     tags:
 *       - Clients
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *                 nullable: true
 *               note:
 *                 type: string
 *                 nullable: true
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *     responses:
 *       200:
 *         description: Updated.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Client not found.
 *   delete:
 *     summary: Delete a client
 *     tags:
 *       - Clients
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted.
 *       401:
 *         description: Unauthorized.
 */
router.get('/:id', ClientController.getOne);
router.put('/:id', requireAdmin, ClientController.update);
router.delete('/:id', requireAdmin, ClientController.delete);

export default router;
