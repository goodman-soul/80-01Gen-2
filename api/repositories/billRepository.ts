import { db } from '../database/connection';
import type { EnergyBill } from '../../shared/types';

export interface EnergyBillRow {
  id: string;
  booking_id: string;
  property_name: string;
  room_number: string;
  check_in: string;
  check_out: string;
  total_electricity: number;
  total_water: number;
  electricity_cost: number;
  water_cost: number;
  solar_offset: number;
  total_cost: number;
  average_daily_cost: number;
  saving_tips: string;
  daily_records: string;
}

export function mapEnergyBillRow(row: EnergyBillRow): EnergyBill {
  return {
    id: row.id,
    bookingId: row.booking_id,
    propertyName: row.property_name,
    roomNumber: row.room_number,
    checkIn: row.check_in,
    checkOut: row.check_out,
    totalElectricity: row.total_electricity,
    totalWater: row.total_water,
    electricityCost: row.electricity_cost,
    waterCost: row.water_cost,
    solarOffset: row.solar_offset,
    totalCost: row.total_cost,
    averageDailyCost: row.average_daily_cost,
    savingTips: JSON.parse(row.saving_tips),
    dailyRecords: JSON.parse(row.daily_records),
  };
}

export function getBillById(id: string): EnergyBill | undefined {
  const row = db.prepare('SELECT * FROM energy_bills WHERE id = ?').get(id) as EnergyBillRow | undefined;
  return row ? mapEnergyBillRow(row) : undefined;
}

export function getBillByBookingId(bookingId: string): EnergyBill | undefined {
  const row = db.prepare('SELECT * FROM energy_bills WHERE booking_id = ?').get(bookingId) as EnergyBillRow | undefined;
  return row ? mapEnergyBillRow(row) : undefined;
}

export function getAllBills(): EnergyBill[] {
  const rows = db.prepare('SELECT * FROM energy_bills ORDER BY check_out DESC').all() as EnergyBillRow[];
  return rows.map(mapEnergyBillRow);
}

export function getBillByOrderNumber(_orderNumber: string): EnergyBill {
  const row = db.prepare('SELECT * FROM energy_bills LIMIT 1').get() as EnergyBillRow;
  return mapEnergyBillRow(row);
}
