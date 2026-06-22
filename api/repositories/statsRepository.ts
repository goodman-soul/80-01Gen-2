import { db } from '../database/connection';
import type { MonthlyStats, MonthlyTrend, PropertyMonthlyStats } from '../../shared/types';

export interface MonthlyTrendRow {
  month: string;
  electricity: number;
  water: number;
  cost: number;
}

export interface MonthlyPropertyStatRow {
  month: string;
  property_id: string;
  property_name: string;
  electricity: number;
  water: number;
  solar: number;
  cost: number;
  saving_rate: number;
}

export function mapMonthlyTrendRow(row: MonthlyTrendRow): MonthlyTrend {
  return {
    month: row.month,
    electricity: row.electricity,
    water: row.water,
    cost: row.cost,
  };
}

export function mapMonthlyPropertyStatRow(row: MonthlyPropertyStatRow): PropertyMonthlyStats {
  return {
    propertyId: row.property_id,
    propertyName: row.property_name,
    electricity: row.electricity,
    water: row.water,
    solar: row.solar,
    cost: row.cost,
    savingRate: row.saving_rate,
  };
}

export function getMonthlyStats(month: string = '2024-01'): MonthlyStats {
  const trendRows = db.prepare('SELECT * FROM monthly_trend ORDER BY month ASC').all() as MonthlyTrendRow[];

  const propertyRows = db.prepare(
    'SELECT * FROM monthly_property_stats WHERE month = ? ORDER BY cost DESC'
  ).all(month) as MonthlyPropertyStatRow[];

  return {
    month,
    properties: propertyRows.map(mapMonthlyPropertyStatRow),
    trend: trendRows.map(mapMonthlyTrendRow),
  };
}

export function getMonthlyPropertyStats(month: string): PropertyMonthlyStats[] {
  const rows = db.prepare(
    'SELECT * FROM monthly_property_stats WHERE month = ? ORDER BY saving_rate DESC'
  ).all(month) as MonthlyPropertyStatRow[];
  return rows.map(mapMonthlyPropertyStatRow);
}

export function getMonthlyTrend(): MonthlyTrend[] {
  const rows = db.prepare('SELECT * FROM monthly_trend ORDER BY month ASC').all() as MonthlyTrendRow[];
  return rows.map(mapMonthlyTrendRow);
}
