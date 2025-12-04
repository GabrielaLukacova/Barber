import { query } from '../db/db';

export interface ServiceRow {
  serviceID: number;
  name: string;
  imagePath: string | null;
  duration: number;
  price: number;
  isBooked: number;
}

export interface ServiceCreateInput {
  name: string;
  imagePath: string | null;
  duration: number;
  price: number;
  isBooked: boolean;
}

export interface ServiceUpdateInput {
  name: string;
  imagePath: string | null;
  duration: number;
  price: number;
  isBooked: boolean;
}

class ServiceModel {
  async findAll(): Promise<ServiceRow[]> {
    const rows = await query<ServiceRow>(
      'SELECT serviceID, name, imagePath, duration, price, isBooked FROM Service ORDER BY serviceID DESC',
    );
    return rows;
  }

  async findById(id: number): Promise<ServiceRow | undefined> {
    const rows = await query<ServiceRow>(
      'SELECT serviceID, name, imagePath, duration, price, isBooked FROM Service WHERE serviceID = ?',
      [id],
    );
    return rows[0];
  }

  async create(input: ServiceCreateInput): Promise<ServiceRow> {
    const result = await query<{ insertId: number }>(
      'INSERT INTO Service (name, imagePath, duration, price, isBooked) VALUES (?, ?, ?, ?, ?)',
      [
        input.name,
        input.imagePath,
        input.duration,
        input.price,
        input.isBooked ? 1 : 0,
      ],
    );

    const insertId = (result as any).insertId as number;

    const created = await this.findById(insertId);
    if (!created) {
      throw new Error('Failed to load created service');
    }
    return created;
  }

  async update(id: number, input: ServiceUpdateInput): Promise<void> {
    await query(
      'UPDATE Service SET name = ?, imagePath = ?, duration = ?, price = ?, isBooked = ? WHERE serviceID = ?',
      [
        input.name,
        input.imagePath,
        input.duration,
        input.price,
        input.isBooked ? 1 : 0,
        id,
      ],
    );
  }

  async delete(id: number): Promise<void> {
    await query('DELETE FROM Service WHERE serviceID = ?', [id]);
  }
}

export const serviceModel = new ServiceModel();