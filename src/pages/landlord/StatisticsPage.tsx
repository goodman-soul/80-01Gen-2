import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Award,
  Calendar,
  Download,
  BarChart3,
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

function StatisticsPage() {
  const { monthlyStats, fetchMonthlyStats } = useAppStore();
  const [viewMode, setViewMode] = useState<'electricity' | 'water' | 'cost'>('electricity');

  useEffect(() => {
    fetchMonthlyStats();
  }, [fetchMonthlyStats]);

  const properties = monthlyStats?.properties ?? [];
  const trend = monthlyStats?.trend ?? [];

  const sortedProperties = [...properties].sort(
    (a, b) => b.savingRate - a.savingRate
  );

  const totalElectricity = properties.reduce((sum, p) => sum + p.electricity, 0);
  const totalWater = properties.reduce((sum, p) => sum + p.water, 0);
  const totalCost = properties.reduce((sum, p) => sum + p.cost, 0);
  const totalSolar = properties.reduce((sum, p) => sum + p.solar, 0);
  const avgSavingRate = properties.length > 0
    ? Math.round(properties.reduce((sum, p) => sum + p.savingRate, 0) / properties.length)
    : 0;

  const viewModeConfig = {
    electricity: { label: '用电量', key: 'electricity', unit: 'kWh', color: '#0ea5e9' },
    water: { label: '用水量', key: 'water', unit: '吨', color: '#f97316' },
    cost: { label: '费用', key: 'cost', unit: '元', color: '#10b981' },
  };

  return (
    <PageLayout>
      <PageHeader
        title="月度统计"
        subtitle="多房源能耗对比与趋势分析"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">2024年1月</span>
          </div>
          <Button variant="outline" size="md">
            <Download className="w-4 h-4" />
            导出报表
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="月度总用电"
          value={totalElectricity.toLocaleString()}
          unit="kWh"
          icon={TrendingUp}
          variant="ocean"
          trend={{ value: 8.5, isUp: true }}
        />
        <StatCard
          title="月度总用水"
          value={totalWater.toFixed(1)}
          unit="吨"
          icon={TrendingDown}
          variant="coral"
          trend={{ value: 3.2, isUp: false }}
        />
        <StatCard
          title="光伏发电"
          value={totalSolar.toLocaleString()}
          unit="kWh"
          icon={Award}
          variant="sand"
          subtitle="本月累计发电"
        />
        <StatCard
          title="平均节能率"
          value={avgSavingRate}
          unit="%"
          icon={BarChart3}
          variant="mint"
          subtitle="三店平均"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Title>房源能耗对比</Card.Title>
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                  {(['electricity', 'water', 'cost'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={cn(
                        'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                        viewMode === mode
                          ? 'bg-white text-slate-800 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      )}
                    >
                      {viewModeConfig[mode].label}
                    </button>
                  ))}
                </div>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={properties} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="propertyName"
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        padding: '12px 16px',
                      }}
                      formatter={(value: number) => [
                        `${value} ${viewModeConfig[viewMode].unit}`,
                        viewModeConfig[viewMode].label,
                      ]}
                    />
                    <Bar
                      dataKey={viewModeConfig[viewMode].key}
                      fill={viewModeConfig[viewMode].color}
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Content>
          </Card>
        </div>

        <div>
          <Card>
            <Card.Header>
              <Card.Title>节能排行榜</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {sortedProperties.map((property, index) => (
                  <div
                    key={property.propertyId}
                    className={cn(
                      'p-4 rounded-xl border transition-all',
                      index === 0
                        ? 'bg-gradient-to-r from-sand-50 to-sand-100 border-sand-200'
                        : 'bg-white border-slate-100 hover:border-slate-200'
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                          index === 0
                            ? 'bg-sand-400 text-white'
                            : index === 1
                            ? 'bg-slate-300 text-white'
                            : index === 2
                            ? 'bg-orange-300 text-white'
                            : 'bg-slate-100 text-slate-500'
                        )}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{property.propertyName}</p>
                      </div>
                      <Badge variant="mint">{property.savingRate}%</Badge>
                    </div>
                    <div className="text-sm text-slate-500 flex items-center justify-between">
                      <span>月均电费 ¥{property.cost.toLocaleString()}</span>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-mint-400 to-mint-500 transition-all"
                          style={{ width: `${property.savingRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>月度趋势分析</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    padding: '12px 16px',
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="electricity"
                  name="用电量 (kWh)"
                  stroke="#0ea5e9"
                  strokeWidth={2.5}
                  dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cost"
                  name="费用 (元)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </ReLineChart>
            </ResponsiveContainer>
          </div>
        </Card.Content>
      </Card>
    </PageLayout>
  );
}

export default StatisticsPage;
