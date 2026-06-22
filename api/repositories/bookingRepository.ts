import { db } from '../database/connection';
import type { Booking, BookingStatus, PrecoolingInfo } from '../../shared/types';

export interface BookingRow {
  id: string;
  room_id: string;
  property_id: string;
  guest_name: string;
  check_in: string;
  check_out: string;
  status: BookingStatus;
  room_number: string;
  precooling: string | null;
}

export function mapBookingRow(row: BookingRow): Booking {
  return {
    id: row.id,
    roomId: row.room_id,
    propertyId: row.property_id,
    guestName: row.guest_name,
    checkIn: row.check_in,
    checkOut: row.check_out,
    status: row.status,
    roomNumber: row.room_number,
    precooling: row.precooling ? (JSON.parse(row.precooling) as PrecoolingInfo) : null,
  };
}

export function getAllBookings(options?: {
  propertyId?: string;
  status?: BookingStatus;
  excludeCheckedOut?: boolean;
}): Booking[] {
  let sql = 'SELECT * FROM bookings WHERE 1=1';
  const params: any[] = [];

  if (options?.propertyId) {
    sql += ' AND property_id = ?';
    params.push(options.propertyId);
  }
  if (options?.status) {
    sql += ' AND status = ?';
    params.push(options.status);
  }
  if (options?.excludeCheckedOut) {
    sql += " AND status != 'checked-out'";
  }

  sql += ' ORDER BY check_in ASC';

  const rows = db.prepare(sql).all(...params) as BookingRow[];
  return rows.map(mapBookingRow);
}

export function getBookingById(id: string): Booking | undefined {
  const row = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id) as BookingRow | undefined;
  return row ? mapBookingRow(row) : undefined;
}

export function updateBookingStatus(id: string, status: BookingStatus) {
  db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, id);
}

export function updateBookingPrecooling(id: string, precooling: PrecoolingInfo) {
  db.prepare('UPDATE bookings SET precooling = ? WHERE id = ?').run(
    JSON.stringify(precooling),
    id
  );
}
