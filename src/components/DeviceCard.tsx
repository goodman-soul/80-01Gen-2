import { cn } from '@/lib/utils';
import type { Device, DeviceType, DeviceStatus } from '@/types';
import {
  Thermometer,
  Droplets,
  Sun,
  Waves,
  Zap,
  Gauge,
} from 'lucide-react';

interface DeviceCardProps {
  device: Device;
  onClick?: () => void;
  className?: string;
}

const deviceTypeConfig: Record<DeviceType, { icon: typeof Thermometer; label: string; color: string }> = {
  ac: { icon: Thermometer, label: '空调', color: 'ocean' },
  water_heater: { icon: Droplets, label: '热水器', color: 'coral' },
  pv: { icon: Sun, label: '光伏', color: 'sand' },
  water_tank: { icon: Waves, label: '蓄水池', color: 'mint' },
};

const statusConfig: Record<DeviceStatus, { label: string; color: string; dot: string }> = {
  online: { label: '在线', color: 'text-mint-600', dot: 'bg-mint-500' },
  offline: { label: '离线', color: 'text-slate-400', dot: 'bg-slate-300' },
  warning: { label: '警告', color: 'text-sand-600', dot: 'bg-sand-500' },
  error: { label: '故障', color: 'text-red-600', dot: 'bg-red-500' },
};

const colorClasses = {
  ocean: 'bg-ocean-50 text-ocean-600',
  coral: 'bg-coral-50 text-coral-600',
  sand: 'bg-sand-50 text-sand-600',
  mint: 'bg-mint-50 text-mint-600',
};

export function DeviceCard({ device, onClick, className }: DeviceCardProps) {
  const typeConfig = deviceTypeConfig[device.type];
  const statusConfigItem = statusConfig[device.status];
  const Icon = typeConfig.icon;

  const renderMetrics = () => {
    const metrics = device.metrics;
    
    switch (device.type) {
      case 'ac':
        const acMetrics = metrics as { power: number; currentTemperature: number; setTemperature: number; mode: string };
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">当前温度</span>
              <span className="text-lg font-semibold text-slate-800">{acMetrics.currentTemperature}°C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">设定温度</span>
              <span className="text-sm text-slate-600">{acMetrics.setTemperature}°C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">功率</span>
              <span className="text-sm text-slate-600">{acMetrics.power} W</span>
            </div>
          </div>
        );
      
      case 'water_heater':
        const whMetrics = metrics as { power: number; temperature: number; waterLevel: number };
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">水温</span>
              <span className="text-lg font-semibold text-slate-800">{whMetrics.temperature}°C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">水位</span>
              <span className="text-sm text-slate-600">{whMetrics.waterLevel}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-1">
              <div
                className={cn('h-2 rounded-full transition-all', whMetrics.waterLevel > 30 ? 'bg-coral-500' : 'bg-red-500')}
                style={{ width: `${whMetrics.waterLevel}%` }}
              />
            </div>
          </div>
        );
      
      case 'pv':
        const pvMetrics = metrics as { power: number; dailyGeneration: number; efficiency: number };
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">发电功率</span>
              <span className="text-lg font-semibold text-slate-800">{pvMetrics.power} W</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">今日发电</span>
              <span className="text-sm text-slate-600">{pvMetrics.dailyGeneration} kWh</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">转换效率</span>
              <span className="text-sm text-mint-600">{pvMetrics.efficiency}%</span>
            </div>
          </div>
        );
      
      case 'water_tank':
        const wtMetrics = metrics as { waterLevel: number; dailyUsage: number; inflowRate: number };
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">当前水位</span>
              <span className="text-lg font-semibold text-slate-800">{wtMetrics.waterLevel}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className={cn('h-2 rounded-full transition-all', wtMetrics.waterLevel > 30 ? 'bg-mint-500' : 'bg-red-500')}
                style={{ width: `${wtMetrics.waterLevel}%` }}
              />
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-500 text-sm">今日用水</span>
              <span className="text-sm text-slate-600">{wtMetrics.dailyUsage} 吨</span>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl p-5 border border-slate-100',
        'shadow-card hover:shadow-card-hover',
        'transition-all duration-300 hover:-translate-y-0.5',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('p-2.5 rounded-xl', colorClasses[typeConfig.color as keyof typeof colorClasses])}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{device.name}</h3>
            <p className="text-xs text-slate-500">{typeConfig.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={cn('w-2 h-2 rounded-full animate-pulse-soft', statusConfigItem.dot)} />
          <span className={cn('text-xs font-medium', statusConfigItem.color)}>{statusConfigItem.label}</span>
        </div>
      </div>

      {renderMetrics()}
    </div>
  );
}

export default DeviceCard;
