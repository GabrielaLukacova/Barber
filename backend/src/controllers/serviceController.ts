import type { Request, Response, NextFunction } from 'express';
import { serviceService } from '../services/serviceService';
import { createServiceSchema, updateServiceSchema } from '../validation/serviceSchemas';

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
      let imagePath: string | null = null;
      if (req.file) {
        // derive image path
        imagePath = `/uploads/services/${req.file.filename}`;
      }

      const parsed = createServiceSchema.parse({
        ...req.body,
        imagePath,
      });

      const created = await serviceService.createService({
        name: parsed.name,
        duration: parsed.duration,
        price: parsed.price,
        isBooked: parsed.isBooked ?? false,
        imagePath: parsed.imagePath ?? null,
      });

      res.status(201).json(created);
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        const issues = err.issues?.map((i: any) => i.message) ?? [];
        return res.status(400).json({ error: 'Validation error', details: issues });
      }

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

      let imagePath: string | null | undefined;
      if (req.file) {
        // derive image path
        imagePath = `/uploads/services/${req.file.filename}`;
      }

      const parsed = updateServiceSchema.parse({
        ...req.body,
        imagePath,
      });

      const payload: any = {
        name: parsed.name,
        duration: parsed.duration,
        price: parsed.price,
        isBooked: parsed.isBooked ?? false,
      };

      // keep existing image
      if (imagePath !== undefined) {
        payload.imagePath = imagePath;
      }

      await serviceService.updateService(id, payload);

      res.json({ success: true });
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        const issues = err.issues?.map((i: any) => i.message) ?? [];
        return res.status(400).json({ error: 'Validation error', details: issues });
      }

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