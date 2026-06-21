import { create } from 'zustand';
import type { Property, Device, Booking, Alert, MonthlyStats, EnergyBill, UserRole, DeviceType } from '@/types';
import { mockProperties, mockDevices, mockBookings, mockAlerts, mockMonthlyStats, mockEnergyBill } from '@/data/mockData';

interface AppState {
  currentRole: UserRole | null;
  properties: Property[];
  devices: Device[];
  bookings: Booking[];
  alerts: Alert[];
  monthlyStats: MonthlyStats;
  energyBill: EnergyBill;
  selectedPropertyId: string | null;
  selectedDeviceType: DeviceType | 'all';
  
  setCurrentRole: (role: UserRole | null) => void;
  setSelectedPropertyId: (id: string | null) => void;
  setSelectedDeviceType: (type: DeviceType | 'all') => void;
  acknowledgeAlert: (alertId: string) => void;
  startPrecooling: (bookingId: string) => void;
  getDevicesByProperty: (propertyId: string) => Device[];
  getDevicesByType: (type: DeviceType) => Device[];
  getBookingsByProperty: (propertyId: string) => Booking[];
  getAlertsByProperty: (propertyId: string) => Alert[];
}

export const useAppStore = create<AppState>((set, get) => ({
  currentRole: null,
  properties: mockProperties,
  devices: mockDevices,
  bookings: mockBookings,
  alerts: mockAlerts,
  monthlyStats: mockMonthlyStats,
  energyBill: mockEnergyBill,
  selectedPropertyId: null,
  selectedDeviceType: 'all',

  setCurrentRole: (role) => set({ currentRole: role }),
  
  setSelectedPropertyId: (id) => set({ selectedPropertyId: id }),
  
  setSelectedDeviceType: (type) => set({ selectedDeviceType: type }),
  
  acknowledgeAlert: (alertId) => set((state) => ({
    alerts: state.alerts.map(alert =>
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ),
  })),
  
  startPrecooling: (bookingId) => set((state) => ({
    bookings: state.bookings.map(booking =>
      booking.id === bookingId
        ? {
            ...booking,
            precooling: {
              enabled: true,
              targetTemp: 24,
              currentTemp: 30,
              progress: 0,
              startTime: new Date().toISOString(),
            },
          }
        : booking
    ),
  })),
  
  getDevicesByProperty: (propertyId) => {
    return get().devices.filter(d => d.propertyId === propertyId);
  },
  
  getDevicesByType: (type) => {
    return get().devices.filter(d => d.type === type);
  },
  
  getBookingsByProperty: (propertyId) => {
    return get().bookings.filter(b => b.propertyId === propertyId);
  },
  
  getAlertsByProperty: (propertyId) => {
    return get().alerts.filter(a => a.propertyId === propertyId);
  },
}));
