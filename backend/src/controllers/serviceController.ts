import type { Request, Response, NextFunction } from 'express';
import { serviceService } from '../services/serviceService';

// Allow req.file (multer) on Request type
declare module 'express-serve-static-core' {
  interface Request {
    file?: Express.Multer.File;
  }
}

export class ServiceController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const services = await serviceService.listServices();
      res.json(services);
    } catch (err) {
      console.error('ServiceController.getAll error:', err);
      next(err);
    }
  }

  static async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid service ID' });
      }

      const service = await serviceService.getService(id);
      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }

      res.json(service);
    } catch (err) {
      console.error('ServiceController.getOne error:', err);
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, duration, price, isBooked } = req.body;

      if (!name || !duration || !price) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      let imagePath: string | null = null;
      if (req.file) {
        imagePath = `/uploads/services/${req.file.filename}`;
      }

      const created = await serviceService.createService({
        name: String(name),
        duration: Number(duration),
        price: Number(price),
        isBooked: isBooked === '1' || isBooked === 'true' || isBooked === true,
        imagePath,
      });

      res.status(201).json(created);
    } catch (err) {
      console.error('ServiceController.create error:', err);
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid service ID' });
      }

      const { name, duration, price, isBooked } = req.body;

      if (!name || !duration || !price) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      let imagePath: string | undefined;
      if (req.file) {
        imagePath = `/uploads/services/${req.file.filename}`;
      }

      await serviceService.updateService(id, {
        name: String(name),
        duration: Number(duration),
        price: Number(price),
        isBooked: isBooked === '1' || isBooked === 'true' || isBooked === true,
        imagePath,
      });

      res.json({ success: true });
    } catch (err) {
      console.error('ServiceController.update error:', err);
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid service ID' });
      }

      await serviceService.deleteService(id);
      res.json({ success: true });
    } catch (err) {
      console.error('ServiceController.delete error:', err);
      next(err);
    }
  }
}
