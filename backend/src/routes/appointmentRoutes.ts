import { Router } from 'express';
import { AppointmentController } from '../controllers/appointmentController';
import { requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @openapi
 * /api/appointments:
 *   get:
 *     summary: List all appointments
 *     tags:
 *       - Appointments
 *     responses:
 *       200:
 *         description: List of appointments.
 *   post:
 *     summary: Create an appointment
 *     tags:
 *       - Appointments
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientID:
 *                 type: integer
 *                 nullable: true
 *               appointmentDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-05"
 *               startTime:
 *                 type: string
 *                 example: "09:00:00"
 *               endTime:
 *                 type: string
 *                 example: "09:30:00"
 *               status:
 *                 type: string
 *                 enum: [BOOKED, CANCELLED, COMPLETED]
 *               totalPriceCents:
 *                 type: integer
 *                 nullable: true
 *             required:
 *               - appointmentDate
 *               - startTime
 *               - endTime
 *     responses:
 *       201:
 *         description: Created.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 */
router.get('/', AppointmentController.getAll);
router.get('/with-details', AppointmentController.getAllWithDetails);
router.post('/', requireAdmin, AppointmentController.create);

/**
 * @openapi
 * /api/appointments/{id}:
 *   get:
 *     summary: Get an appointment by ID
 *     tags:
 *       - Appointments
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Appointment.
 *       404:
 *         description: Not found.
 *   put:
 *     summary: Update an appointment
 *     tags:
 *       - Appointments
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
 *               clientID:
 *                 type: integer
 *                 nullable: true
 *               appointmentDate:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [BOOKED, CANCELLED, COMPLETED]
 *               totalPriceCents:
 *                 type: integer
 *                 nullable: true
 *             required:
 *               - appointmentDate
 *               - startTime
 *               - endTime
 *     responses:
 *       200:
 *         description: Updated.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *   delete:
 *     summary: Delete an appointment
 *     tags:
 *       - Appointments
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
router.get('/:id', AppointmentController.getOne);
router.put('/:id', requireAdmin, AppointmentController.update);
router.delete('/:id', requireAdmin, AppointmentController.delete);

export default router;
