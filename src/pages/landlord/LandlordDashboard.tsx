import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Droplets,
  Sun,
  Leaf,
  ChevronRight,
  Tv,
  Thermometer,
  Waves,
  AlertTriangle,
  MapPin,
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/layout/PageLayout';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

function LandlordDashboard() {
  const navigate = useNavigate();
  const { properties, devices, alerts } = useAppStore();

  const totalElectricity = properties.reduce((sum, p) => sum + p.todayElectricity, 0);
  const totalWater = properties.reduce((sum, p) => sum + p.todayWater, 0);
  const totalSolar = properties.reduce((sum, p) => sum + p.todaySolar, 0);
  const savingRate = Math.round((totalSolar / totalElectricity) * 100);

  const deviceStats = {
    ac: devices.filter(d => d.type === 'ac').length,
    water_heater: devices.filter(d => d.type === 'water_heater').length,
    pv: devices.filter(d => d.type === 'pv').length,
    water_tank: devices.filter(d => d.type === 'water_tank').length,
    online: devices.filter(d => d.status === 'online').length,
    warning: devices.filter(d => d.status === 'warning' || d.status === 'error').length,
  };

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <PageLayout>
      <PageHeader
        title="房东总览"
        subtitle={`管理 ${properties.length} 处房源，实时监控能耗状态`}
      >
        <Badge variant="ocean" dot>
          实时更新
        </Badge>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="今日用电"
          value={totalElectricity.toFixed(1)}
          unit="kWh"
          icon={Zap}
          variant="ocean"
          trend={{ value: 5.2, isUp: false }}
        />
        <StatCard
          title="今日用水"
          value={totalWater.toFixed(1)}
          unit="吨"
          icon={Droplets}
          variant="coral"
          trend={{ value: 3.8, isUp: false }}
        />
        <StatCard
          title="光伏发电"
          value={totalSolar.toFixed(1)}
          unit="kWh"
          icon={Sun}
          variant="sand"
          trend={{ value: 8.5, isUp: true }}
        />
        <StatCard
          title="节能比例"
          value={savingRate}
          unit="%"
          icon={Leaf}
          variant="mint"
          subtitle="光伏占用电比例"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Title>我的房源</Card.Title>
                <button
                  onClick={() => navigate('/landlord/devices')}
                  className="text-ocean-500 text-sm font-medium hover:text-ocean-600 flex items-center gap-1"
                >
                  查看全部 <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    onClick={() => navigate('/landlord/devices')}
                    className="group relative rounded-xl overflow-hidden border border-slate-100 hover:border-ocean-200 cursor-pointer transition-all duration-300 hover:shadow-md"
                  >
                    <div className="aspect-[16/9] bg-gradient-to-br from-ocean-100 to-ocean-50 relative overflow-hidden">
                      <img
                        src={property.imageUrl}
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge variant={property.status === 'active' ? 'success' : 'warning'} size="sm" dot>
                          {property.status === 'active' ? '运营中' : '维护中'}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-800 mb-1">{property.name}</h3>
                      <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{property.address}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Tv className="w-4 h-4 text-ocean-500" />
                          <span>{property.deviceCount} 台设备</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Zap className="w-4 h-4 text-coral-500" />
                          <span>{property.todayElectricity.toFixed(0)} kWh</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <Card.Header>
              <Card.Title>设备概览</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-ocean-50">
                  <div className="p-2 bg-ocean-100 rounded-lg">
                    <Thermometer className="w-5 h-5 text-ocean-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{deviceStats.ac}</p>
                    <p className="text-xs text-slate-500">空调</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-coral-50">
                  <div className="p-2 bg-coral-100 rounded-lg">
                    <Droplets className="w-5 h-5 text-coral-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{deviceStats.water_heater}</p>
                    <p className="text-xs text-slate-500">热水器</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-sand-50">
                  <div className="p-2 bg-sand-100 rounded-lg">
                    <Sun className="w-5 h-5 text-sand-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{deviceStats.pv}</p>
                    <p className="text-xs text-slate-500">光伏</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-mint-50">
                  <div className="p-2 bg-mint-100 rounded-lg">
                    <Waves className="w-5 h-5 text-mint-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{deviceStats.water_tank}</p>
                    <p className="text-xs text-slate-500">蓄水池</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-mint-500 animate-pulse-soft" />
                    <span className="text-sm text-slate-600">在线设备</span>
                  </div>
                  <span className="font-semibold text-mint-600">{deviceStats.online} 台</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sand-500 animate-pulse-soft" />
                    <span className="text-sm text-slate-600">异常设备</span>
                  </div>
                  <span className="font-semibold text-sand-600">{deviceStats.warning} 台</span>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Title>异常预警</Card.Title>
                <Badge variant="error" size="sm">
                  {unacknowledgedAlerts.length} 条未处理
                </Badge>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {unacknowledgedAlerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <div className={cn(
                      'p-2 rounded-lg mt-0.5',
                      alert.severity === 'error' ? 'bg-red-100' :
                      alert.severity === 'warning' ? 'bg-sand-100' : 'bg-ocean-100'
                    )}>
                      <AlertTriangle className={cn(
                        'w-4 h-4',
                        alert.severity === 'error' ? 'text-red-600' :
                        alert.severity === 'warning' ? 'text-sand-600' : 'text-ocean-600'
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{alert.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{alert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}

export default LandlordDashboard;
