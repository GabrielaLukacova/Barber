import { Router } from 'express';
import { ConfigController } from '../controllers/configController';
import { requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @openapi
 * /api/opening-hours:
 *   get:
 *     summary: List opening hours
 *     tags:
 *       - Config
 *     responses:
 *       200:
 *         description: List of opening hours.
 *   post:
 *     summary: Create opening hours entry
 *     tags:
 *       - Config
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dayOfWeek:
 *                 type: string
 *                 example: "Monday"
 *               openingTime:
 *                 type: string
 *                 nullable: true
 *                 example: "09:00:00"
 *               closingTime:
 *                 type: string
 *                 nullable: true
 *                 example: "17:00:00"
 *             required:
 *               - dayOfWeek
 *     responses:
 *       201:
 *         description: Created.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 */
router.get('/opening-hours', ConfigController.getOpeningHours);
router.post('/opening-hours', requireAdmin, ConfigController.createOpeningHours);

/**
 * @openapi
 * /api/opening-hours/{id}:
 *   get:
 *     summary: Get opening hours by ID
 *     tags:
 *       - Config
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *   put:
 *     summary: Update opening hours entry
 *     tags:
 *       - Config
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
 *               dayOfWeek:
 *                 type: string
 *               openingTime:
 *                 type: string
 *                 nullable: true
 *               closingTime:
 *                 type: string
 *                 nullable: true
 *             required:
 *               - dayOfWeek
 *   delete:
 *     summary: Delete opening hours entry
 *     tags:
 *       - Config
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 */
router.get('/opening-hours/:id', ConfigController.getOpeningHour);
router.put('/opening-hours/:id', requireAdmin, ConfigController.updateOpeningHours);
router.delete('/opening-hours/:id', requireAdmin, ConfigController.deleteOpeningHours);

/**
 * @openapi
 * /api/time-off:
 *   get:
 *     summary: List time-off entries
 *     tags:
 *       - Config
 *   post:
 *     summary: Create time-off entry
 *     tags:
 *       - Config
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start:
 *                 type: string
 *                 example: "2025-12-05T09:00:00"
 *               end:
 *                 type: string
 *                 example: "2025-12-05T12:00:00"
 *               reason:
 *                 type: string
 *                 nullable: true
 *             required:
 *               - start
 *               - end
 */
router.get('/time-off', ConfigController.getTimeOff);
router.post('/time-off', requireAdmin, ConfigController.createTimeOff);

/**
 * @openapi
 * /api/time-off/{id}:
 *   get:
 *     summary: Get time-off entry by ID
 *     tags:
 *       - Config
 *   put:
 *     summary: Update time-off entry
 *     tags:
 *       - Config
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
 *               start:
 *                 type: string
 *               end:
 *                 type: string
 *               reason:
 *                 type: string
 *                 nullable: true
 *             required:
 *               - start
 *               - end
 *   delete:
 *     summary: Delete time-off entry
 *     tags:
 *       - Config
 *     security:
 *       - BearerAuth: []
 */
router.get('/time-off/:id', ConfigController.getTimeOffOne);
router.put('/time-off/:id', requireAdmin, ConfigController.updateTimeOff);
router.delete('/time-off/:id', requireAdmin, ConfigController.deleteTimeOff);

/**
 * @openapi
 * /api/barber-shops:
 *   get:
 *     summary: List barbershops
 *     tags:
 *       - Config
 *   post:
 *     summary: Create barbershop
 *     tags:
 *       - Config
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
 *               phoneNumber:
 *                 type: string
 *                 nullable: true
 *               email:
 *                 type: string
 *                 nullable: true
 *               street:
 *                 type: string
 *                 nullable: true
 *               postalCode:
 *                 type: string
 *                 nullable: true
 *               description:
 *                 type: string
 *                 nullable: true
 *             required:
 *               - name
 */
router.get('/barber-shops', ConfigController.getBarberShops);
router.post('/barber-shops', requireAdmin, ConfigController.createBarberShop);

/**
 * @openapi
 * /api/barber-shops/{id}:
 *   get:
 *     summary: Get barbershop by ID
 *     tags:
 *       - Config
 *   put:
 *     summary: Update barbershop
 *     tags:
 *       - Config
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
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *                 nullable: true
 *               email:
 *                 type: string
 *                 nullable: true
 *               street:
 *                 type: string
 *                 nullable: true
 *               postalCode:
 *                 type: string
 *                 nullable: true
 *               description:
 *                 type: string
 *                 nullable: true
 *             required:
 *               - name
 *   delete:
 *     summary: Delete barbershop
 *     tags:
 *       - Config
 *     security:
 *       - BearerAuth: []
 */
router.get('/barber-shops/:id', ConfigController.getBarberShop);
router.put('/barber-shops/:id', requireAdmin, ConfigController.updateBarberShop);
router.delete('/barber-shops/:id', requireAdmin, ConfigController.deleteBarberShop);

/**
 * @openapi
 * /api/gallery-images:
 *   get:
 *     summary: List gallery images
 *     tags:
 *       - Config
 *   post:
 *     summary: Create gallery image
 *     tags:
 *       - Config
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               barberShopID:
 *                 type: integer
 *               filePath:
 *                 type: string
 *               altText:
 *                 type: string
 *               title:
 *                 type: string
 *                 nullable: true
 *               description:
 *                 type: string
 *                 nullable: true
 *               sortOrder:
 *                 type: integer
 *                 nullable: true
 *             required:
 *               - barberShopID
 *               - filePath
 *               - altText
 */
router.get('/gallery-images', ConfigController.getGalleryImages);
router.post('/gallery-images', requireAdmin, ConfigController.createGalleryImage);

/**
 * @openapi
 * /api/gallery-images/{id}:
 *   get:
 *     summary: Get gallery image by ID
 *     tags:
 *       - Config
 *   put:
 *     summary: Update gallery image
 *     tags:
 *       - Config
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
 *               barberShopID:
 *                 type: integer
 *               filePath:
 *                 type: string
 *               altText:
 *                 type: string
 *               title:
 *                 type: string
 *                 nullable: true
 *               description:
 *                 type: string
 *                 nullable: true
 *               sortOrder:
 *                 type: integer
 *                 nullable: true
 *             required:
 *               - barberShopID
 *               - filePath
 *               - altText
 *   delete:
 *     summary: Delete gallery image
 *     tags:
 *       - Config
 *     security:
 *       - BearerAuth: []
 */
router.get('/gallery-images/:id', ConfigController.getGalleryImage);
router.put('/gallery-images/:id', requireAdmin, ConfigController.updateGalleryImage);
router.delete('/gallery-images/:id', requireAdmin, ConfigController.deleteGalleryImage);

/**
 * @openapi
 * /api/postal-codes:
 *   get:
 *     summary: List postal codes
 *     tags:
 *       - Config
 *   post:
 *     summary: Create postal code
 *     tags:
 *       - Config
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postalCode:
 *                 type: string
 *                 example: "6700"
 *               city:
 *                 type: string
 *                 example: "Esbjerg"
 *             required:
 *               - postalCode
 *               - city
 */
router.get('/postal-codes', ConfigController.getPostalCodes);
router.post('/postal-codes', requireAdmin, ConfigController.createPostalCode);

/**
 * @openapi
 * /api/postal-codes/{code}:
 *   get:
 *     summary: Get postal code by code
 *     tags:
 *       - Config
 *   put:
 *     summary: Update postal code
 *     tags:
 *       - Config
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city:
 *                 type: string
 *             required:
 *               - city
 *   delete:
 *     summary: Delete postal code
 *     tags:
 *       - Config
 *     security:
 *       - BearerAuth: []
 */
router.get('/postal-codes/:code', ConfigController.getPostalCode);
router.put('/postal-codes/:code', requireAdmin, ConfigController.updatePostalCode);
router.delete('/postal-codes/:code', requireAdmin, ConfigController.deletePostalCode);

export default router;
