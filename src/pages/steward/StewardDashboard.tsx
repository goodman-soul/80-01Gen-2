import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  AlertTriangle,
  Clock,
  Thermometer,
  ChevronRight,
  Zap,
  CheckCircle,
  PlayCircle,
  Home,
  User,
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

function StewardDashboard() {
  const navigate = useNavigate();
  const {
    bookings,
    alerts,
    startPrecooling,
    todayBookings,
    fetchTodayBookings,
    fetchAlerts,
  } = useAppStore();

  useEffect(() => {
    fetchTodayBookings();
    fetchAlerts({ acknowledged: false });
  }, [fetchTodayBookings, fetchAlerts]);

  const todayBookingsList = todayBookings?.bookings ?? bookings.filter(b => b.status !== 'checked-out');
  const upcomingCount = todayBookings?.counts?.upcoming ?? bookings.filter(b => b.status === 'upcoming').length;
  const checkedInCount = todayBookings?.counts?.checkedIn ?? bookings.filter(b => b.status === 'checked-in').length;
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  const upcomingBookings = todayBookingsList.filter(b => b.status === 'upcoming');

  const precoolingNotStarted = todayBookings?.precoolingStats?.notStarted ?? upcomingBookings.filter(
    b => !b.precooling?.enabled
  ).length;
  const precoolingInProgress = todayBookings?.precoolingStats?.inProgress ?? upcomingBookings.filter(
    b => b.precooling?.enabled && b.precooling.progress < 100
  ).length;
  const precoolingComplete = todayBookings?.precoolingStats?.complete ?? upcomingBookings.filter(
    b => b.precooling?.enabled && b.precooling.progress >= 100
  ).length;

  const precoolingNotStartedList = upcomingBookings.filter(b => !b.precooling?.enabled);
  const precoolingInProgressList = upcomingBookings.filter(b => b.precooling?.enabled && b.precooling.progress < 100);
  const precoolingCompleteList = upcomingBookings.filter(b => b.precooling?.enabled && b.precooling.progress >= 100);

  const handleStartPrecooling = (bookingId: string) => {
    startPrecooling(bookingId);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <PageLayout>
      <PageHeader
        title="管家工作台"
        subtitle="今日入住安排与设备状态概览"
      >
        <Badge variant="ocean" dot>
          今日 {todayBookingsList.length} 个预订
        </Badge>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="今日入住"
          value={upcomingCount}
          unit="间"
          icon={CalendarCheck}
          variant="ocean"
        />
        <StatCard
          title="待预冷"
          value={precoolingNotStarted}
          unit="间"
          icon={Thermometer}
          variant="coral"
          subtitle="需尽快开启"
        />
        <StatCard
          title="预冷中"
          value={precoolingInProgress}
          unit="间"
          icon={PlayCircle}
          variant="sand"
          subtitle="进行中"
        />
        <StatCard
          title="异常预警"
          value={unacknowledgedAlerts.length}
          unit="条"
          icon={AlertTriangle}
          variant="mint"
          subtitle="待处理"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Title>今日入住安排</Card.Title>
                <button
                  onClick={() => navigate('/steward/precooling')}
                  className="text-ocean-500 text-sm font-medium hover:text-ocean-600 flex items-center gap-1"
                >
                  查看全部 <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {todayBookingsList.map((booking, index) => (
                  <div
                    key={booking.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-ocean-200 hover:bg-ocean-50/30 transition-all"
                  >
                    <div className="relative">
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center',
                        booking.status === 'checked-in'
                          ? 'bg-mint-100 text-mint-600'
                          : 'bg-ocean-100 text-ocean-600'
                      )}>
                        <User className="w-6 h-6" />
                      </div>
                      {index < todayBookingsList.length - 1 && (
                        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-800">
                          {booking.guestName}
                        </h4>
                        <Badge
                          variant={booking.status === 'checked-in' ? 'success' : 'info'}
                          size="sm"
                        >
                          {booking.status === 'checked-in' ? '已入住' : '待入住'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Home className="w-3.5 h-3.5" />
                          <span>{booking.roomNumber} 房</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatTime(booking.checkIn)} 入住</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {booking.status === 'upcoming' && (
                        <div className="text-right">
                          {booking.precooling?.enabled ? (
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-600">
                                  {booking.precooling.currentTemp}°C
                                </span>
                                <span className="text-slate-400">→</span>
                                <span className="text-sm font-medium text-mint-600">
                                  {booking.precooling.targetTemp}°C
                                </span>
                              </div>
                              <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-ocean-400 to-mint-400 rounded-full transition-all duration-500"
                                  style={{ width: `${booking.precooling.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-400">
                                预冷中 {booking.precooling.progress}%
                              </span>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleStartPrecooling(booking.id)}
                            >
                              <Thermometer className="w-3.5 h-3.5" />
                              开启预冷
                            </Button>
                          )}
                        </div>
                      )}
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
              <div className="flex items-center justify-between">
                <Card.Title>预冷状态总览</Card.Title>
                <Badge variant="mint" size="sm">
                  {precoolingComplete} 间已就绪
                </Badge>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-mint-50">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-mint-500" />
                    <span className="text-sm text-slate-700">预冷完成</span>
                  </div>
                  <span className="font-bold text-mint-600">{precoolingComplete} 间</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-sand-50">
                  <div className="flex items-center gap-3">
                    <PlayCircle className="w-5 h-5 text-sand-500" />
                    <span className="text-sm text-slate-700">预冷进行中</span>
                  </div>
                  <span className="font-bold text-sand-600">{precoolingInProgress} 间</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-coral-50">
                  <div className="flex items-center gap-3">
                    <Thermometer className="w-5 h-5 text-coral-500" />
                    <span className="text-sm text-slate-700">待开启预冷</span>
                  </div>
                  <span className="font-bold text-coral-600">{precoolingNotStarted} 间</span>
                </div>
              </div>

              <Button
                variant="primary"
                fullWidth
                className="mt-4"
                onClick={() => navigate('/steward/precooling')}
              >
                <Thermometer className="w-4 h-4" />
                进入预冷管理
              </Button>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Title>待处理预警</Card.Title>
                <Badge variant="error" size="sm">
                  {unacknowledgedAlerts.length} 条
                </Badge>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {unacknowledgedAlerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                    onClick={() => navigate('/steward/alerts')}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'p-2 rounded-lg mt-0.5 flex-shrink-0',
                          alert.severity === 'error'
                            ? 'bg-red-100'
                            : alert.severity === 'warning'
                            ? 'bg-sand-100'
                            : 'bg-ocean-100'
                        )}
                      >
                        <AlertTriangle
                          className={cn(
                            'w-4 h-4',
                            alert.severity === 'error'
                              ? 'text-red-600'
                              : alert.severity === 'warning'
                              ? 'text-sand-600'
                              : 'text-ocean-600'
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">{alert.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {alert.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                fullWidth
                className="mt-4"
                onClick={() => navigate('/steward/alerts')}
              >
                <AlertTriangle className="w-4 h-4" />
                查看全部预警
              </Button>
            </Card.Content>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}

export default StewardDashboard;
