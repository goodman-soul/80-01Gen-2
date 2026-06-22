import { db } from '../database/connection';
import type { Alert, AlertType, AlertSeverity } from '../../shared/types';

export interface AlertRow {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  device_id: string | null;
  property_id: string;
  timestamp: string;
  acknowledged: number;
}

export function mapAlertRow(row: AlertRow): Alert {
  return {
    id: row.id,
    type: row.type,
    severity: row.severity,
    title: row.title,
    description: row.description,
    deviceId: row.device_id,
    propertyId: row.property_id,
    timestamp: row.timestamp,
    acknowledged: row.acknowledged,
  };
}

export function getAllAlerts(options?: {
  propertyId?: string;
  acknowledged?: boolean;
  severity?: AlertSeverity;
}): Alert[] {
  let sql = 'SELECT * FROM alerts WHERE 1=1';
  const params: any[] = [];

  if (options?.propertyId) {
    sql += ' AND property_id = ?';
    params.push(options.propertyId);
  }
  if (options?.acknowledged !== undefined) {
    sql += ' AND acknowledged = ?';
    params.push(options.acknowledged ? 1 : 0);
  }
  if (options?.severity) {
    sql += ' AND severity = ?';
    params.push(options.severity);
  }

  sql += ' ORDER BY timestamp DESC';

  const rows = db.prepare(sql).all(...params) as AlertRow[];
  return rows.map(mapAlertRow);
}

export function getAlertById(id: string): Alert | undefined {
  const row = db.prepare('SELECT * FROM alerts WHERE id = ?').get(id) as AlertRow | undefined;
  return row ? mapAlertRow(row) : undefined;
}

export function acknowledgeAlert(id: string) {
  db.prepare('UPDATE alerts SET acknowledged = 1 WHERE id = ?').run(id);
}

export function getUnacknowledgedCount(): number {
  const result = db.prepare('SELECT COUNT(*) as cnt FROM alerts WHERE acknowledged = 0').get() as { cnt: number };
  return result.cnt;
}

export function createAlert(alert: Omit<Alert, 'id'>): string {
  const id = 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  db.prepare(
    `INSERT INTO alerts (id, type, severity, title, description, device_id, property_id, timestamp, acknowledged)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    alert.type,
    alert.severity,
    alert.title,
    alert.description,
    alert.deviceId ?? null,
    alert.propertyId,
    alert.timestamp || new Date().toISOString(),
    alert.acknowledged ? 1 : 0
  );
  return id;
}
