import type { Request, Response, NextFunction } from 'express';
import { serviceService } from '../services/serviceService';
import { createServiceSchema, updateServiceSchema } from '../validation/serviceSchemas';
import { supabase } from '../lib/supabase';

async function uploadServiceImage(file: Express.Multer.File) {
  const fileName = `services/${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from('gallery')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from('gallery')
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export class ServiceController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const services = await serviceService.listServices();
      res.json(services);
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
        imagePath: parsed.imagePath ?? null,
      });

      res.status(201).json(created);
    } catch (err: any) {
      next(err);
    }
  }
}