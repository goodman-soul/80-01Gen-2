export type DeviceType = 'ac' | 'water_heater' | 'pv' | 'water_tank';
export type DeviceStatus = 'online' | 'offline' | 'warning' | 'error';
export type BookingStatus = 'upcoming' | 'checked-in' | 'checked-out';
export type UserRole = 'landlord' | 'steward' | 'guest';
export type AlertType = 'high_consumption' | 'device_error' | 'maintenance' | 'precooling';
export type AlertSeverity = 'info' | 'warning' | 'error';

export interface Property {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  roomCount: number;
  deviceCount: number;
  status: 'active' | 'maintenance';
  todayElectricity: number;
  todayWater: number;
  todaySolar: number;
}

export interface ACMetrics {
  power: number;
  setTemperature: number;
  currentTemperature: number;
  mode: 'cool' | 'heat' | 'fan' | 'auto';
  fanSpeed: number;
}

export interface WaterHeaterMetrics {
  power: number;
  temperature: number;
  waterLevel: number;
}

export interface PVMetrics {
  power: number;
  dailyGeneration: number;
  totalGeneration: number;
  efficiency: number;
}

export interface WaterTankMetrics {
  waterLevel: number;
  dailyUsage: number;
  inflowRate: number;
}

export type DeviceMetrics = ACMetrics | WaterHeaterMetrics | PVMetrics | WaterTankMetrics;

export interface Device {
  id: string;
  propertyId: string;
  roomId?: string | null;
  type: DeviceType;
  name: string;
  status: DeviceStatus;
  metrics: DeviceMetrics;
  lastUpdate: string;
}

export interface PrecoolingInfo {
  enabled: boolean;
  targetTemp: number;
  currentTemp: number;
  progress: number;
  startTime?: string | null;
}

export interface Booking {
  id: string;
  roomId: string;
  propertyId: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  roomNumber: string;
  precooling?: PrecoolingInfo | null;
}

export interface SavingTip {
  id: string;
  title: string;
  description: string;
  savingAmount: number;
  icon: string;
}

export interface DailyEnergyRecord {
  date: string;
  electricity: number;
  water: number;
  cost: number;
}

export interface EnergyBill {
  id: string;
  bookingId: string;
  propertyName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  totalElectricity: number;
  totalWater: number;
  electricityCost: number;
  waterCost: number;
  solarOffset: number;
  totalCost: number;
  averageDailyCost: number;
  savingTips: SavingTip[];
  dailyRecords: DailyEnergyRecord[];
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  deviceId?: string | null;
  propertyId: string;
  timestamp: string;
  acknowledged: number;
}

export interface PropertyMonthlyStats {
  propertyId: string;
  propertyName: string;
  electricity: number;
  water: number;
  solar: number;
  cost: number;
  savingRate: number;
}

export interface MonthlyTrend {
  month: string;
  electricity: number;
  water: number;
  cost: number;
}

export interface MonthlyStats {
  month: string;
  properties: PropertyMonthlyStats[];
  trend: MonthlyTrend[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface HourlyData {
  hour: string;
  value: number;
}
