import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  ChevronRight,
  Zap,
  Thermometer,
  Droplets,
  Wrench,
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import type { Alert } from '@/types';

function AlertsPage() {
  const { alerts, alertCounts, acknowledgeAlert, properties, fetchAlerts } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'unacknowledged' | 'acknowledged'>('unacknowledged');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'error' | 'warning' | 'info'>('all');

  useEffect(() => {
    const params: { acknowledged?: boolean; severity?: any } = {};
    if (filter === 'unacknowledged') params.acknowledged = false;
    if (filter === 'acknowledged') params.acknowledged = true;
    if (severityFilter !== 'all') params.severity = severityFilter;
    fetchAlerts(params);
  }, [fetchAlerts, filter, severityFilter]);

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'unacknowledged' && alert.acknowledged) return false;
    if (filter === 'acknowledged' && !alert.acknowledged) return false;
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
    return true;
  });

  const getPropertyName = (propertyId: string) => {
    return properties.find(p => p.id === propertyId)?.name || '未知房源';
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'high_consumption':
        return Zap;
      case 'device_error':
        return Thermometer;
      case 'maintenance':
        return Wrench;
      case 'precooling':
        return Thermometer;
      default:
        return AlertTriangle;
    }
  };

  const getSeverityStyle = (severity: Alert['severity']) => {
    switch (severity) {
      case 'error':
        return {
          bg: 'bg-red-50',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          border: 'border-red-100',
        };
      case 'warning':
        return {
          bg: 'bg-sand-50',
          iconBg: 'bg-sand-100',
          iconColor: 'text-sand-600',
          border: 'border-sand-100',
        };
      case 'info':
      default:
        return {
          bg: 'bg-ocean-50',
          iconBg: 'bg-ocean-100',
          iconColor: 'text-ocean-600',
          border: 'border-ocean-100',
        };
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 60) return `${diffMins} 分钟前`;
    if (diffHours < 24) return `${diffHours} 小时前`;
    return date.toLocaleDateString('zh-CN');
  };

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <PageLayout>
      <PageHeader
        title="异常预警"
        subtitle={`共 ${alerts.length} 条预警，${unacknowledgedCount} 条待处理`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索预警..."
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-500/20 w-56"
            />
          </div>
          <Button variant="outline" size="md">
            <Filter className="w-4 h-4" />
            高级筛选
          </Button>
        </div>
      </PageHeader>

      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-slate-200">
          {(['all', 'unacknowledged', 'acknowledged'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                filter === f
                  ? 'bg-ocean-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              )}
            >
              {f === 'all' ? '全部' : f === 'unacknowledged' ? '待处理' : '已处理'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">严重程度：</span>
          {(['all', 'error', 'warning', 'info'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-full transition-all',
                severityFilter === s
                  ? s === 'error'
                    ? 'bg-red-100 text-red-700'
                    : s === 'warning'
                    ? 'bg-sand-100 text-sand-700'
                    : s === 'info'
                    ? 'bg-ocean-100 text-ocean-700'
                    : 'bg-slate-100 text-slate-700'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
              )}
            >
              {s === 'all' ? '全部' : s === 'error' ? '故障' : s === 'warning' ? '警告' : '提示'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <Card.Content>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-50">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">故障告警</p>
                <p className="text-2xl font-bold text-slate-800 font-display">
                  {alertCounts?.error ?? alerts.filter(a => a.severity === 'error' && !a.acknowledged).length}
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-sand-50">
                <Zap className="w-6 h-6 text-sand-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">能耗警告</p>
                <p className="text-2xl font-bold text-slate-800 font-display">
                  {alertCounts?.warning ?? alerts.filter(a => a.severity === 'warning' && !a.acknowledged).length}
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
                <p className="text-sm text-slate-500">已处理</p>
                <p className="text-2xl font-bold text-slate-800 font-display">
                  {(alertCounts?.total ?? alerts.length)
                    - (alertCounts?.error ?? alerts.filter(a => a.severity === 'error' && !a.acknowledged).length)
                    - (alertCounts?.warning ?? alerts.filter(a => a.severity === 'warning' && !a.acknowledged).length)
                    - (alertCounts?.info ?? alerts.filter(a => a.severity === 'info' && !a.acknowledged).length)}
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <Card.Title>预警列表</Card.Title>
            <span className="text-sm text-slate-500">共 {filteredAlerts.length} 条</span>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="space-y-3">
            {filteredAlerts.map((alert) => {
              const style = getSeverityStyle(alert.severity);
              const Icon = getAlertIcon(alert.type);

              return (
                <div
                  key={alert.id}
                  className={cn(
                    'p-4 rounded-xl border transition-all duration-200 hover:shadow-md',
                    alert.acknowledged ? 'bg-slate-50 border-slate-100 opacity-60' : style.bg,
                    !alert.acknowledged && style.border
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn('p-2.5 rounded-xl flex-shrink-0', style.iconBg)}>
                      <Icon className={cn('w-5 h-5', style.iconColor)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-slate-800">{alert.title}</h4>
                        <Badge
                          variant={
                            alert.severity === 'error'
                              ? 'error'
                              : alert.severity === 'warning'
                              ? 'warning'
                              : 'info'
                          }
                          size="sm"
                        >
                          {alert.severity === 'error'
                            ? '故障'
                            : alert.severity === 'warning'
                            ? '警告'
                            : '提示'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{alert.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatTime(alert.timestamp)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Droplets className="w-3.5 h-3.5" />
                          <span>{getPropertyName(alert.propertyId)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {!alert.acknowledged ? (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          处理
                        </Button>
                      ) : (
                        <Badge variant="success" size="sm">
                          已处理
                        </Badge>
                      )}
                      <button className="text-slate-400 hover:text-slate-600 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAlerts.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-mint-300 mx-auto mb-4" />
              <p className="text-slate-500">暂无预警记录</p>
            </div>
          )}
        </Card.Content>
      </Card>
    </PageLayout>
  );
}

export default AlertsPage;
