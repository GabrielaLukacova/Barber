import { Router } from 'express';
import authRouter from './authRoutes';
import serviceRouter from './serviceRoutes';
import clientRouter from './clientRoutes';
import appointmentRouter from './appointmentRoutes';
import openingHoursRouter from './openingHoursRoutes';
import timeOffRouter from './timeOffRoutes';
import barberShopRouter from './barberShopRoutes';
import galleryImageRouter from './galleryImageRoutes';
import postalCodeRouter from './postalCodeRoutes';
import publicBookingRouter from "./public/publicBookingRoutes";

const router = Router();

router.use('/auth', authRouter);
router.use('/services', serviceRouter);
router.use('/clients', clientRouter);
router.use('/appointments', appointmentRouter);
router.use('/opening-hours', openingHoursRouter);
router.use('/time-off', timeOffRouter);
router.use('/barber-shops', barberShopRouter);
router.use('/gallery-images', galleryImageRouter);
router.use('/postal-codes', postalCodeRouter);
router.use('/public', publicBookingRouter);

export default router;
