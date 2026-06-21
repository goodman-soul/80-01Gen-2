import { useNavigate } from 'react-router-dom';
import {
  Thermometer,
  Clock,
  PlayCircle,
  CheckCircle,
  XCircle,
  Zap,
  RefreshCw,
  Home,
  User,
  ChevronDown,
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

function PrecoolingPage() {
  const navigate = useNavigate();
  const { bookings, startPrecooling, properties } = useAppStore();

  const upcomingBookings = bookings.filter(b => b.status === 'upcoming');

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  const getPropertyName = (propertyId: string) => {
    return properties.find(p => p.id === propertyId)?.name || '未知房源';
  };

  const getStatusInfo = (booking: typeof upcomingBookings[0]) => {
    if (!booking.precooling?.enabled) {
      return { label: '未开启', variant: 'error' as const, icon: XCircle, color: 'text-red-500' };
    }
    if (booking.precooling.progress >= 100) {
      return { label: '已完成', variant: 'success' as const, icon: CheckCircle, color: 'text-mint-500' };
    }
    return { label: '进行中', variant: 'warning' as const, icon: PlayCircle, color: 'text-sand-500' };
  };

  const estimatedTime = (booking: typeof upcomingBookings[0]) => {
    if (!booking.precooling?.enabled) return '--';
    if (booking.precooling.progress >= 100) return '已完成';
    const remaining = (100 - booking.precooling.progress) / 10;
    return `约 ${Math.ceil(remaining)} 分钟`;
  };

  return (
    <PageLayout>
      <PageHeader
        title="预冷检查"
        subtitle="管理今日入住房间的空调预冷状态"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200">
            <Home className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">全部房源</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
          <Button variant="outline" size="md">
            <RefreshCw className="w-4 h-4" />
            刷新状态
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <Card.Content>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-50">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">待开启</p>
                <p className="text-2xl font-bold text-slate-800 font-display">
                  {upcomingBookings.filter(b => !b.precooling?.enabled).length}
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-sand-50">
                <PlayCircle className="w-6 h-6 text-sand-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">预冷中</p>
                <p className="text-2xl font-bold text-slate-800 font-display">
                  {upcomingBookings.filter(b => b.precooling?.enabled && b.precooling.progress < 100).length}
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-mint-50">
                <CheckCircle className="w-6 h-6 text-mint-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">已就绪</p>
                <p className="text-2xl font-bold text-slate-800 font-display">
                  {upcomingBookings.filter(b => b.precooling?.enabled && b.precooling.progress >= 100).length}
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>今日入住房间</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {upcomingBookings.map((booking) => {
              const statusInfo = getStatusInfo(booking);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={booking.id}
                  className={cn(
                    'p-5 rounded-2xl border transition-all duration-300',
                    booking.precooling?.enabled && booking.precooling.progress >= 100
                      ? 'border-mint-200 bg-mint-50/50'
                      : booking.precooling?.enabled
                      ? 'border-sand-200 bg-sand-50/30'
                      : 'border-slate-200 bg-white hover:border-ocean-200'
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ocean-100 to-ocean-50 flex items-center justify-center">
                        <Thermometer className="w-7 h-7 text-ocean-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-800 text-lg">
                            {booking.roomNumber} 房
                          </h3>
                          <Badge variant={statusInfo.variant} size="sm" dot>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            <span>{booking.guestName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>预计 {formatTime(booking.checkIn)} 入住</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {booking.precooling?.enabled ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-2xl font-bold text-slate-800 font-display">
                              {booking.precooling.currentTemp}°C
                            </span>
                            <span className="text-slate-400">→</span>
                            <span className="text-lg font-medium text-ocean-600">
                              {booking.precooling.targetTemp}°C
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            目标温度 {booking.precooling.targetTemp}°C
                          </p>
                        </div>
                      ) : (
                        <div className="text-slate-400">
                          <p className="text-sm">当前室温</p>
                          <p className="text-2xl font-bold font-display">31°C</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {booking.precooling?.enabled && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">预冷进度</span>
                        <span className="text-sm font-medium text-slate-800">
                          {booking.precooling.progress}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-white rounded-full overflow-hidden shadow-inner">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-700 ease-out',
                            booking.precooling.progress >= 100
                              ? 'bg-gradient-to-r from-mint-400 to-mint-500'
                              : 'bg-gradient-to-r from-ocean-400 to-ocean-500'
                          )}
                          style={{ width: `${booking.precooling.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>预计剩余：{estimatedTime(booking)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5" />
                          <span>实时功率 1200W</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                    <div className="text-sm text-slate-500">
                      {getPropertyName(booking.propertyId)}
                    </div>
                    <div className="flex items-center gap-2">
                      {!booking.precooling?.enabled ? (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => startPrecooling(booking.id)}
                        >
                          <PlayCircle className="w-4 h-4" />
                          开启预冷
                        </Button>
                      ) : (
                        <>
                          <Button size="sm" variant="outline">
                            调节温度
                          </Button>
                          <Button size="sm" variant="ghost">
                            关闭空调
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card.Content>
      </Card>
    </PageLayout>
  );
}

export default PrecoolingPage;
