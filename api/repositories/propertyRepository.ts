import { db } from '../database/connection';
import type { Property } from '../../shared/types';

export interface PropertyRow {
  id: string;
  name: string;
  address: string;
  image_url: string;
  room_count: number;
  device_count: number;
  status: 'active' | 'maintenance';
  today_electricity: number;
  today_water: number;
  today_solar: number;
}

export function mapPropertyRow(row: PropertyRow): Property {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    imageUrl: row.image_url,
    roomCount: row.room_count,
    deviceCount: row.device_count,
    status: row.status,
    todayElectricity: row.today_electricity,
    todayWater: row.today_water,
    todaySolar: row.today_solar,
  };
}

export function getAllProperties(): Property[] {
  const rows = db.prepare('SELECT * FROM properties ORDER BY id').all() as PropertyRow[];
  return rows.map(mapPropertyRow);
}

export function getPropertyById(id: string): Property | undefined {
  const row = db.prepare('SELECT * FROM properties WHERE id = ?').get(id) as PropertyRow | undefined;
  return row ? mapPropertyRow(row) : undefined;
}

export function updatePropertyMetrics(
  id: string,
  updates: Partial<Pick<Property, 'todayElectricity' | 'todayWater' | 'todaySolar' | 'status'>>
) {
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.todayElectricity !== undefined) {
    fields.push('today_electricity = ?');
    values.push(updates.todayElectricity);
  }
  if (updates.todayWater !== undefined) {
    fields.push('today_water = ?');
    values.push(updates.todayWater);
  }
  if (updates.todaySolar !== undefined) {
    fields.push('today_solar = ?');
    values.push(updates.todaySolar);
  }
  if (updates.status !== undefined) {
    fields.push('status = ?');
    values.push(updates.status);
  }

  if (fields.length > 0) {
    values.push(id);
    db.prepare(`UPDATE properties SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  }
}
