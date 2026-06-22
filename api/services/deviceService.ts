import * as deviceRepository from '../repositories/deviceRepository';
import * as alertRepository from '../repositories/alertRepository';
import type { Device, DeviceType, DeviceStatus, ACMetrics } from '../../shared/types';
import type { HourlyData } from '../../shared/types';

export function getDeviceList(options?: {
  propertyId?: string;
  type?: DeviceType | 'all';
  status?: DeviceStatus;
}) {
  const devices = deviceRepository.getAllDevices(options);
  const stats = deviceRepository.getDeviceStats();
  return {
    devices,
    stats: {
      byType: stats,
      total: devices.length,
      online: devices.filter(d => d.status === 'online').length,
      warning: devices.filter(d => d.status === 'warning' || d.status === 'error').length,
    },
  };
}

export function getDeviceDetail(id: string) {
  return deviceRepository.getDeviceById(id);
}

export function updateDeviceStatus(id: string, status: DeviceStatus) {
  deviceRepository.updateDeviceStatus(id, status);

  if (status === 'error') {
    const device = deviceRepository.getDeviceById(id);
    if (device) {
      alertRepository.createAlert({
        type: 'device_error',
        severity: 'error',
        title: `${device.name} 故障`,
        description: `${device.name} 状态异常，请及时检修`,
        deviceId: device.id,
        propertyId: device.propertyId,
        timestamp: new Date().toISOString(),
        acknowledged: 0,
      });
    }
  }

  return deviceRepository.getDeviceById(id);
}

export function updateACSettings(
  id: string,
  settings: Partial<Pick<ACMetrics, 'setTemperature' | 'mode' | 'fanSpeed' | 'power'>>
) {
  const device = deviceRepository.getDeviceById(id);
  if (!device || device.type !== 'ac') return null;

  const metrics = device.metrics as ACMetrics;
  const newMetrics: ACMetrics = {
    ...metrics,
    ...settings,
  };

  deviceRepository.updateDeviceMetrics(id, newMetrics);

  if (settings.setTemperature !== undefined && settings.setTemperature < 20) {
    alertRepository.createAlert({
      type: 'high_consumption',
      severity: 'warning',
      title: '空调温度设置过低',
      description: `${device.name} 设定温度为 ${settings.setTemperature}°C，建议设置为 24-26°C 以节省能耗`,
      deviceId: device.id,
      propertyId: device.propertyId,
      timestamp: new Date().toISOString(),
      acknowledged: 0,
    });
  }

  return deviceRepository.getDeviceById(id);
}

export function generateHourlyData(baseValue: number, variance: number): HourlyData[] {
  const data: HourlyData[] = [];
  for (let i = 0; i < 24; i++) {
    const hourFactor = i >= 8 && i <= 20 ? 1.2 : 0.6;
    const randomSeed = Math.sin(i * 12.9898) * 43758.5453;
    const randomValue = (randomSeed - Math.floor(randomSeed) - 0.5) * variance;
    const value = baseValue * hourFactor + randomValue;
    data.push({
      hour: `${i.toString().padStart(2, '0')}:00`,
      value: Math.round(Math.max(0, value) * 10) / 10,
    });
  }
  return data;
}

export function getChartsData() {
  return {
    electricityTrend: generateHourlyData(50, 20),
    solarTrend: generateHourlyData(30, 15),
  };
}
