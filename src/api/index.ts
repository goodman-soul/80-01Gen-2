import { http } from './client';
import type {
  Property,
  Device,
  Booking,
  EnergyBill,
  Alert,
  MonthlyStats,
  HourlyData,
  DeviceType,
  DeviceStatus,
  BookingStatus,
  AlertSeverity,
} from '../../shared/types';

export interface DashboardOverview {
  metrics: {
    totalElectricity: number;
    totalWater: number;
    totalSolar: number;
    savingRate: number;
  };
  properties: Property[];
  deviceStats: {
    types: Array<{
      type: DeviceType;
      total: number;
      online_count: number;
      warning_count: number;
    }>;
    total: number;
    online: number;
    warning: number;
  };
}

export interface DeviceListResponse {
  devices: Device[];
  stats: {
    byType: Array<{
      type: DeviceType;
      total: number;
      online_count: number;
      warning_count: number;
    }>;
    total: number;
    online: number;
    warning: number;
  };
}

export interface ChartsData {
  electricityTrend: HourlyData[];
  solarTrend: HourlyData[];
}

export interface TodayBookingsResponse {
  bookings: Array<Booking & { propertyName?: string }>;
  counts: {
    upcoming: number;
    checkedIn: number;
  };
  precoolingStats: {
    notStarted: number;
    inProgress: number;
    complete: number;
  };
}

export interface AlertListResponse {
  alerts: Alert[];
  counts: {
    error: number;
    warning: number;
    info: number;
    total: number;
  };
}

export const propertyApi = {
  getOverview: () => http.get<DashboardOverview>('/properties'),
  getList: () => http.get<Property[]>('/properties/list'),
  getDetail: (id: string) =>
    http.get<{ property: Property; devices: Device[]; deviceCount: number }>(`/properties/${id}`),
  updateStatus: (id: string, status: 'active' | 'maintenance') =>
    http.patch<Property>(`/properties/${id}/status`, { status }),
};

export const deviceApi = {
  getList: (params?: { propertyId?: string; type?: DeviceType | 'all'; status?: DeviceStatus }) =>
    http.get<DeviceListResponse>('/devices', params),
  getDetail: (id: string) => http.get<Device>(`/devices/${id}`),
  getCharts: () => http.get<ChartsData>('/devices/charts'),
  updateStatus: (id: string, status: DeviceStatus) =>
    http.patch<Device>(`/devices/${id}/status`, { status }),
  updateACSettings: (id: string, settings: {
    setTemperature?: number;
    mode?: 'cool' | 'heat' | 'fan' | 'auto';
    fanSpeed?: number;
    power?: number;
  }) => http.patch<Device>(`/devices/${id}/ac-settings`, settings),
};

export const bookingApi = {
  getToday: (params?: { propertyId?: string }) =>
    http.get<TodayBookingsResponse>('/bookings/today', params),
  getForPrecooling: (params?: { propertyId?: string }) =>
    http.get<Booking[]>('/bookings/precooling', params),
  startPrecooling: (bookingId: string, targetTemp?: number) =>
    http.post<Booking>(`/bookings/${bookingId}/precooling/start`, { targetTemp }),
  updatePrecoolingProgress: (bookingId: string, progressDelta?: number) =>
    http.patch<Booking>(`/bookings/${bookingId}/precooling/progress`, { progressDelta }),
  checkIn: (bookingId: string) =>
    http.post<Booking>(`/bookings/${bookingId}/check-in`),
  checkOut: (bookingId: string) =>
    http.post<Booking>(`/bookings/${bookingId}/check-out`),
};

export const billApi = {
  getAll: () => http.get<EnergyBill[]>('/bills'),
  queryByOrderNumber: (orderNumber: string) =>
    http.get<EnergyBill>('/bills/query', { orderNumber }),
  getById: (id: string) => http.get<EnergyBill>(`/bills/${id}`),
  getByBooking: (bookingId: string) =>
    http.get<EnergyBill>(`/bills/booking/${bookingId}`),
  getSummary: (id: string) =>
    http.get<{
      id: string;
      propertyName: string;
      roomNumber: string;
      checkIn: string;
      checkOut: string;
      totalCost: number;
      totalElectricity: number;
      totalWater: number;
      averageDailyCost: number;
      solarOffset: number;
      potentialSavings: number;
    }>(`/bills/${id}/summary`),
};

export const alertApi = {
  getList: (params?: { propertyId?: string; acknowledged?: boolean; severity?: AlertSeverity }) =>
    http.get<AlertListResponse>('/alerts', params
      ? {
          ...params,
          acknowledged: params.acknowledged === undefined ? undefined : String(params.acknowledged) as any,
        }
      : undefined),
  getDetail: (id: string) => http.get<Alert>(`/alerts/${id}`),
  getStats: () =>
    http.get<{ total: number; error: number; warning: number; info: number }>('/alerts/stats'),
  acknowledge: (id: string) => http.post<Alert>(`/alerts/${id}/acknowledge`),
  create: (data: {
    type: Alert['type'];
    severity: Alert['severity'];
    title: string;
    description: string;
    deviceId?: string;
    propertyId: string;
  }) => http.post<{ id: string }>('/alerts', data),
};

export const statsApi = {
  getMonthly: (month?: string) =>
    http.get<MonthlyStats>('/stats/monthly', month ? { month } : undefined),
  getRanking: (month?: string) =>
    http.get<{ month: string; ranking: MonthlyStats['properties']; bestPerformer: MonthlyStats['properties'][0] }>(
      '/stats/ranking',
      month ? { month } : undefined
    ),
  getTrend: () =>
    http.get<{
      trend: MonthlyStats['trend'];
      delta: {
        electricity: { value: number; percent: number };
        cost: { value: number; percent: number };
      } | null;
    }>('/stats/trend'),
};
