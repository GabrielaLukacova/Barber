import type { Request, Response, NextFunction } from 'express';
import { availableSlotsQuerySchema, publicBookSchema } from '../../validation/publicBookingSchemas';
import { getAvailableSlots, createPublicBooking } from '../../services/publicBookingService';

const BARBER_SHOP_ID = 4;

export class PublicBookingController {
  static async availableSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = availableSlotsQuerySchema.parse(req.query);
      const data = await getAvailableSlots({
        barberShopID: BARBER_SHOP_ID,
        dateISO: parsed.date,
        serviceIDs: parsed.serviceIDs,
      });
      res.json(data);
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        return res.status(400).json({
          error: 'Validation error',
          details: err.issues?.map((i: any) => i.message) ?? [],
        });
      }
      next(err);
    }
  }

  static async book(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = publicBookSchema.parse(req.body);
      if (parsed.barberShopID !== BARBER_SHOP_ID) {
        return res.status(400).json({ error: 'Invalid barberShopID' });
      }

      const created = await createPublicBooking({
        barberShopID: parsed.barberShopID,
        serviceIDs: parsed.serviceIDs,
        dateISO: parsed.date,
        startTimeHHMM: parsed.startTime,
        customerName: parsed.customerName,
        customerEmail: parsed.customerEmail,
        customerPhone: parsed.customerPhone,
      });

      res.status(201).json({ success: true, ...created });
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        return res.status(400).json({
          error: 'Validation error',
          details: err.issues?.map((i: any) => i.message) ?? [],
        });
      }

      if (err?.code === 'DOUBLE_BOOKING') {
        return res.status(409).json({ error: err.message || 'Time slot is no longer available' });
      }

      if (typeof err?.message === 'string') {
        return res.status(400).json({ error: err.message });
      }
      next(err);
    }
  }
}
