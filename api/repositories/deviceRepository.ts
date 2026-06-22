import { db } from '../database/connection';
import type { Device, DeviceType, DeviceStatus, DeviceMetrics } from '../../shared/types';

export interface DeviceRow {
  id: string;
  property_id: string;
  room_id: string | null;
  type: DeviceType;
  name: string;
  status: DeviceStatus;
  metrics: string;
  last_update: string;
}

export function mapDeviceRow(row: DeviceRow): Device {
  return {
    id: row.id,
    propertyId: row.property_id,
    roomId: row.room_id,
    type: row.type,
    name: row.name,
    status: row.status,
    metrics: JSON.parse(row.metrics) as DeviceMetrics,
    lastUpdate: row.last_update,
  };
}

export function getAllDevices(options?: {
  propertyId?: string;
  type?: DeviceType | 'all';
  status?: DeviceStatus;
}): Device[] {
  let sql = 'SELECT * FROM devices WHERE 1=1';
  const params: any[] = [];

  if (options?.propertyId) {
    sql += ' AND property_id = ?';
    params.push(options.propertyId);
  }
  if (options?.type && options.type !== 'all') {
    sql += ' AND type = ?';
    params.push(options.type);
  }
  if (options?.status) {
    sql += ' AND status = ?';
    params.push(options.status);
  }

  sql += ' ORDER BY property_id, type, name';

  const rows = db.prepare(sql).all(...params) as DeviceRow[];
  return rows.map(mapDeviceRow);
}

export function getDeviceById(id: string): Device | undefined {
  const row = db.prepare('SELECT * FROM devices WHERE id = ?').get(id) as DeviceRow | undefined;
  return row ? mapDeviceRow(row) : undefined;
}

export function updateDeviceStatus(id: string, status: DeviceStatus) {
  db.prepare('UPDATE devices SET status = ?, last_update = CURRENT_TIMESTAMP WHERE id = ?').run(status, id);
}

export function updateDeviceMetrics(id: string, metrics: DeviceMetrics) {
  db.prepare('UPDATE devices SET metrics = ?, last_update = CURRENT_TIMESTAMP WHERE id = ?').run(
    JSON.stringify(metrics),
    id
  );
}

export function getDeviceCountByProperty(propertyId: string): number {
  const result = db.prepare('SELECT COUNT(*) as cnt FROM devices WHERE property_id = ?').get(propertyId) as { cnt: number };
  return result.cnt;
}

export function getDeviceStats() {
  const rows = db.prepare(
    `SELECT 
       type,
       COUNT(*) as total,
       SUM(CASE WHEN status = 'online' THEN 1 ELSE 0 END) as online_count,
       SUM(CASE WHEN status IN ('warning','error') THEN 1 ELSE 0 END) as warning_count
     FROM devices 
     GROUP BY type`
  ).all() as { type: DeviceType; total: number; online_count: number; warning_count: number }[];
  return rows;
}
