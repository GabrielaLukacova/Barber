import { Router } from 'express';
import authRouter from './authRoutes';
import serviceRouter from './serviceRoutes';

const router = Router();

router.use('/auth', authRouter);
router.use('/services', serviceRouter);

export default router;
