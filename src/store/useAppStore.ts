import { create } from 'zustand';
import type {
  Property,
  Device,
  Booking,
  Alert,
  MonthlyStats,
  EnergyBill,
  UserRole,
  DeviceType,
  HourlyData,
  SavingTip,
  DailyEnergyRecord,
} from '../../shared/types';
import {
  propertyApi,
  deviceApi,
  bookingApi,
  billApi,
  alertApi,
  statsApi,
  type DashboardOverview,
  type DeviceListResponse,
  type ChartsData,
  type TodayBookingsResponse,
  type AlertListResponse,
} from '../api';

interface LoadingState {
  overview: boolean;
  devices: boolean;
  bookings: boolean;
  alerts: boolean;
  bills: boolean;
  stats: boolean;
}

interface AppState {
  currentRole: UserRole | null;

  properties: Property[];
  overviewMetrics: DashboardOverview['metrics'] | null;
  deviceStats: DashboardOverview['deviceStats'] | null;

  devices: Device[];
  deviceListStats: DeviceListResponse['stats'] | null;
  chartsData: ChartsData | null;

  bookings: Booking[];
  todayBookings: TodayBookingsResponse | null;

  alerts: Alert[];
  alertCounts: AlertListResponse['counts'] | null;

  monthlyStats: MonthlyStats | null;
  energyBill: EnergyBill | null;

  selectedPropertyId: string | null;
  selectedDeviceType: DeviceType | 'all';

  loading: LoadingState;
  error: string | null;

  setCurrentRole: (role: UserRole | null) => void;
  setSelectedPropertyId: (id: string | null) => void;
  setSelectedDeviceType: (type: DeviceType | 'all') => void;

  fetchOverview: () => Promise<void>;
  fetchDevices: () => Promise<void>;
  fetchDeviceCharts: () => Promise<void>;
  fetchTodayBookings: () => Promise<void>;
  fetchPrecoolingBookings: () => Promise<void>;
  fetchAlerts: (params?: { propertyId?: string; acknowledged?: boolean }) => Promise<void>;
  fetchMonthlyStats: () => Promise<void>;
  fetchBillByOrder: (orderNumber: string) => Promise<void>;

  acknowledgeAlert: (alertId: string) => Promise<void>;
  startPrecooling: (bookingId: string, targetTemp?: number) => Promise<void>;

  getDevicesByProperty: (propertyId: string) => Device[];
  getDevicesByType: (type: DeviceType) => Device[];
  getBookingsByProperty: (propertyId: string) => Booking[];
  getAlertsByProperty: (propertyId: string) => Alert[];

  clearError: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentRole: null,

  properties: [],
  overviewMetrics: null,
  deviceStats: null,

  devices: [],
  deviceListStats: null,
  chartsData: null,

  bookings: [],
  todayBookings: null,

  alerts: [],
  alertCounts: null,

  monthlyStats: null,
  energyBill: null,

  selectedPropertyId: null,
  selectedDeviceType: 'all',

  loading: {
    overview: false,
    devices: false,
    bookings: false,
    alerts: false,
    bills: false,
    stats: false,
  },
  error: null,

  setCurrentRole: (role) => set({ currentRole: role }),
  setSelectedPropertyId: (id) => set({ selectedPropertyId: id }),
  setSelectedDeviceType: (type) => set({ selectedDeviceType: type }),

  fetchOverview: async () => {
    set({ loading: { ...get().loading, overview: true }, error: null });
    try {
      const data = await propertyApi.getOverview();
      set({
        properties: data.properties,
        overviewMetrics: data.metrics,
        deviceStats: data.deviceStats,
      });
    } catch (err: any) {
      set({ error: err.message || '加载总览数据失败' });
    } finally {
      set({ loading: { ...get().loading, overview: false } });
    }
  },

  fetchDevices: async () => {
    set({ loading: { ...get().loading, devices: true }, error: null });
    try {
      const { selectedDeviceType, selectedPropertyId } = get();
      const data = await deviceApi.getList({
        propertyId: selectedPropertyId ?? undefined,
        type: selectedDeviceType,
      });
      set({
        devices: data.devices,
        deviceListStats: data.stats,
      });
    } catch (err: any) {
      set({ error: err.message || '加载设备列表失败' });
    } finally {
      set({ loading: { ...get().loading, devices: false } });
    }
  },

  fetchDeviceCharts: async () => {
    try {
      const data = await deviceApi.getCharts();
      set({ chartsData: data });
    } catch (err: any) {
      set({ error: err.message || '加载图表数据失败' });
    }
  },

  fetchTodayBookings: async () => {
    set({ loading: { ...get().loading, bookings: true }, error: null });
    try {
      const { selectedPropertyId } = get();
      const data = await bookingApi.getToday({
        propertyId: selectedPropertyId ?? undefined,
      });
      set({
        bookings: data.bookings,
        todayBookings: data,
      });
    } catch (err: any) {
      set({ error: err.message || '加载预订数据失败' });
    } finally {
      set({ loading: { ...get().loading, bookings: false } });
    }
  },

  fetchPrecoolingBookings: async () => {
    try {
      const { selectedPropertyId } = get();
      const data = await bookingApi.getForPrecooling({
        propertyId: selectedPropertyId ?? undefined,
      });
      set({ bookings: data });
    } catch (err: any) {
      set({ error: err.message || '加载预冷数据失败' });
    }
  },

  fetchAlerts: async (params) => {
    set({ loading: { ...get().loading, alerts: true }, error: null });
    try {
      const data = await alertApi.getList(params);
      set({
        alerts: data.alerts,
        alertCounts: data.counts,
      });
    } catch (err: any) {
      set({ error: err.message || '加载告警数据失败' });
    } finally {
      set({ loading: { ...get().loading, alerts: false } });
    }
  },

  fetchMonthlyStats: async () => {
    set({ loading: { ...get().loading, stats: true }, error: null });
    try {
      const data = await statsApi.getMonthly();
      set({ monthlyStats: data });
    } catch (err: any) {
      set({ error: err.message || '加载统计数据失败' });
    } finally {
      set({ loading: { ...get().loading, stats: false } });
    }
  },

  fetchBillByOrder: async (orderNumber) => {
    set({ loading: { ...get().loading, bills: true }, error: null });
    try {
      const data = await billApi.queryByOrderNumber(orderNumber);
      set({ energyBill: data });
    } catch (err: any) {
      set({ error: err.message || '查询账单失败' });
    } finally {
      set({ loading: { ...get().loading, bills: false } });
    }
  },

  acknowledgeAlert: async (alertId) => {
    try {
      await alertApi.acknowledge(alertId);
      set((state) => ({
        alerts: state.alerts.map((a) =>
          a.id === alertId ? { ...a, acknowledged: 1 } : a
        ),
      }));
    } catch (err: any) {
      set({ error: err.message || '处理告警失败' });
    }
  },

  startPrecooling: async (bookingId, targetTemp) => {
    try {
      const updated = await bookingApi.startPrecooling(bookingId, targetTemp);
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === bookingId ? updated : b
        ),
      }));
    } catch (err: any) {
      set({ error: err.message || '启动预冷失败' });
    }
  },

  getDevicesByProperty: (propertyId) => {
    return get().devices.filter((d) => d.propertyId === propertyId);
  },

  getDevicesByType: (type) => {
    return get().devices.filter((d) => d.type === type);
  },

  getBookingsByProperty: (propertyId) => {
    return get().bookings.filter((b) => b.propertyId === propertyId);
  },

  getAlertsByProperty: (propertyId) => {
    return get().alerts.filter((a) => a.propertyId === propertyId);
  },

  clearError: () => set({ error: null }),
}));

export default useAppStore;
