export type DeviceType = 'ac' | 'water_heater' | 'pv' | 'water_tank';
export type DeviceStatus = 'online' | 'offline' | 'warning' | 'error';
export type BookingStatus = 'upcoming' | 'checked-in' | 'checked-out';
export type UserRole = 'landlord' | 'steward' | 'guest';

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

export interface Room {
  id: string;
  propertyId: string;
  roomNumber: string;
  roomType: string;
  area: number;
  floor: number;
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
  roomId?: string;
  type: DeviceType;
  name: string;
  status: DeviceStatus;
  metrics: DeviceMetrics;
  lastUpdate: string;
}

export interface EnergyRecord {
  id: string;
  deviceId: string;
  type: 'electricity' | 'water';
  value: number;
  unit: string;
  timestamp: string;
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
  precooling?: {
    enabled: boolean;
    targetTemp: number;
    currentTemp: number;
    progress: number;
    startTime?: string;
  };
}

export interface SavingTip {
  id: string;
  title: string;
  description: string;
  savingAmount: number;
  icon: string;
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
  dailyRecords: {
    date: string;
    electricity: number;
    water: number;
    cost: number;
  }[];
}

export interface Alert {
  id: string;
  type: 'high_consumption' | 'device_error' | 'maintenance' | 'precooling';
  severity: 'info' | 'warning' | 'error';
  title: string;
  description: string;
  deviceId?: string;
  propertyId: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface MonthlyStats {
  month: string;
  properties: {
    propertyId: string;
    propertyName: string;
    electricity: number;
    water: number;
    solar: number;
    cost: number;
    savingRate: number;
  }[];
  trend: {
    month: string;
    electricity: number;
    water: number;
    cost: number;
  }[];
}
