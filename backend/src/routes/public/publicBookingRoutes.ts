import { Router } from 'express';
import { PublicBookingController } from '../../controllers/public/publicBookingController';

const router = Router();

router.get('/available-slots', PublicBookingController.availableSlots);
router.post('/book', PublicBookingController.book);

export default router;
