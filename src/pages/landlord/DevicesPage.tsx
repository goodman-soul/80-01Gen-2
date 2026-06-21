import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tv,
  Thermometer,
  Droplets,
  Sun,
  Waves,
  Filter,
  Search,
  ChevronDown,
  LineChart,
} from 'lucide-react';
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import PageLayout from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import DeviceCard from '@/components/DeviceCard';
import { useAppStore } from '@/store/useAppStore';
import { generate24HourData } from '@/data/mockData';
import type { DeviceType } from '@/types';
import { cn } from '@/lib/utils';

const deviceTypes: { type: DeviceType | 'all'; label: string; icon: typeof Tv }[] = [
  { type: 'all', label: '全部设备', icon: Tv },
  { type: 'ac', label: '空调', icon: Thermometer },
  { type: 'water_heater', label: '热水器', icon: Droplets },
  { type: 'pv', label: '光伏', icon: Sun },
  { type: 'water_tank', label: '蓄水池', icon: Waves },
];

function DevicesPage() {
  const navigate = useNavigate();
  const { devices, properties, selectedDeviceType, setSelectedDeviceType } = useAppStore();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  const filteredDevices = devices.filter((device) => {
    if (selectedDeviceType !== 'all' && device.type !== selectedDeviceType) return false;
    if (selectedPropertyId && device.propertyId !== selectedPropertyId) return false;
    return true;
  });

  const chartData = generate24HourData(50, 20);
  const solarChartData = generate24HourData(30, 15);

  return (
    <PageLayout>
      <PageHeader
        title="设备监控"
        subtitle={`共 ${devices.length} 台设备，实时监控运行状态`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索设备..."
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-500/20 w-56"
            />
          </div>
          <Button variant="outline" size="md">
            <Filter className="w-4 h-4" />
            筛选
          </Button>
        </div>
      </PageHeader>

      <div className="flex items-center gap-3 mb-6 overflow-x-auto scrollbar-hide pb-2">
        {deviceTypes.map((item) => {
          const Icon = item.icon;
          const isActive = selectedDeviceType === item.type;
          return (
            <button
              key={item.type}
              onClick={() => setSelectedDeviceType(item.type)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap',
                'transition-all duration-200',
                isActive
                  ? 'bg-ocean-500 text-white shadow-lg shadow-ocean-500/30'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Title>24小时用电趋势</Card.Title>
                <Badge variant="ocean">今日</Badge>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorElectricity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="hour" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        padding: '12px 16px',
                      }}
                      formatter={(value: number) => [`${value} kWh`, '用电量']}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      fill="url(#colorElectricity)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card.Content>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <Card.Header>
              <Card.Title>光伏发电趋势</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={solarChartData}>
                    <defs>
                      <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="hour" hide />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        padding: '8px 12px',
                        fontSize: '12px',
                      }}
                      formatter={(value: number) => [`${value} kWh`, '发电量']}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      fill="url(#colorSolar)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
                <span className="text-sm text-slate-500">今日发电</span>
                <span className="text-lg font-bold text-sand-600 font-display">
                  {properties.reduce((sum, p) => sum + p.todaySolar, 0).toFixed(1)} kWh
                </span>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>设备状态分布</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-mint-500" />
                    <span className="text-sm text-slate-600">正常运行</span>
                  </div>
                  <span className="font-semibold text-mint-600">{devices.filter(d => d.status === 'online').length} 台</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-sand-500" />
                    <span className="text-sm text-slate-600">异常警告</span>
                  </div>
                  <span className="font-semibold text-sand-600">{devices.filter(d => d.status === 'warning').length} 台</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm text-slate-600">故障离线</span>
                  </div>
                  <span className="font-semibold text-red-600">{devices.filter(d => d.status === 'error' || d.status === 'offline').length} 台</span>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <Card.Title>设备列表</Card.Title>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">共 {filteredDevices.length} 台设备</span>
            </div>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDevices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </Card.Content>
      </Card>
    </PageLayout>
  );
}

export default DevicesPage;
