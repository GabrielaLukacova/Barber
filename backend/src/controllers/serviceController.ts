import type { Request, Response, NextFunction } from 'express';
import { serviceService } from '../services/serviceService';
import { createServiceSchema, updateServiceSchema } from '../validation/serviceSchemas';
import { supabase } from '../lib/supabase';

async function uploadServiceImage(file: Express.Multer.File) {
  const fileName = `${Date.now()}-${file.originalname}`;

  // 👇 upload to SERVICES bucket
  const { error } = await supabase.storage
    .from('services')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from('services')
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export class ServiceController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const services = await serviceService.listServices();
      res.json(services);
    } catch (err) {
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
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      let imagePath: string | null = null;

      if (req.file) {
        imagePath = await uploadServiceImage(req.file);
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
        imagePath,
      });

      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid service ID' });
      }

      let imagePath: string | undefined;

      if (req.file) {
        imagePath = await uploadServiceImage(req.file);
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

      if (imagePath) {
        payload.imagePath = imagePath;
      }

      await serviceService.updateService(id, payload);

      res.json({ success: true });
    } catch (err) {
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
      next(err);
    }
  }
}