import { Router } from 'express';
import multer from 'multer';
import { ServiceController } from '../controllers/serviceController';

const router = Router();

const upload = multer({
  dest: 'uploads/services/',
});

router.get('/', ServiceController.getAll);
router.get('/:id', ServiceController.getOne);
router.post('/', upload.single('image'), ServiceController.create);
router.put('/:id', upload.single('image'), ServiceController.update);
router.delete('/:id', ServiceController.delete);

export default router;
