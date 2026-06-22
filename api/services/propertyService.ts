import * as propertyRepository from '../repositories/propertyRepository';
import * as deviceRepository from '../repositories/deviceRepository';
import type { Property } from '../../shared/types';

export function getDashboardOverview() {
  const properties = propertyRepository.getAllProperties();

  const totalElectricity = properties.reduce((sum, p) => sum + p.todayElectricity, 0);
  const totalWater = properties.reduce((sum, p) => sum + p.todayWater, 0);
  const totalSolar = properties.reduce((sum, p) => sum + p.todaySolar, 0);
  const savingRate = totalElectricity > 0 ? Math.round((totalSolar / totalElectricity) * 100) : 0;

  const deviceStats = deviceRepository.getDeviceStats();
  const deviceTypeMap = new Map(deviceStats.map(s => [s.type, s]));
  const totalDevices = deviceStats.reduce((sum, s) => sum + s.total, 0);
  const onlineDevices = deviceStats.reduce((sum, s) => sum + s.online_count, 0);
  const warningDevices = deviceStats.reduce((sum, s) => sum + s.warning_count, 0);

  return {
    metrics: {
      totalElectricity: Number(totalElectricity.toFixed(1)),
      totalWater: Number(totalWater.toFixed(1)),
      totalSolar: Number(totalSolar.toFixed(1)),
      savingRate,
    },
    properties,
    deviceStats: {
      types: deviceStats,
      total: totalDevices,
      online: onlineDevices,
      warning: warningDevices,
    },
  };
}

export function getAllProperties(): Property[] {
  return propertyRepository.getAllProperties();
}

export function getPropertyDetail(id: string) {
  const property = propertyRepository.getPropertyById(id);
  if (!property) return null;

  const devices = deviceRepository.getAllDevices({ propertyId: id });
  return {
    property,
    devices,
    deviceCount: devices.length,
  };
}

export function updatePropertyStatus(id: string, status: 'active' | 'maintenance') {
  propertyRepository.updatePropertyMetrics(id, { status });
  return propertyRepository.getPropertyById(id);
}
