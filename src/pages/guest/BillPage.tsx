import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Zap,
  Droplets,
  Sun,
  TrendingDown,
  Lightbulb,
  Thermometer,
  ShowerHead,
  Sparkles,
  Home,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

function BillPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { energyBill, fetchBillByOrder, loading } = useAppStore();
  const orderNumber = searchParams.get('order');

  useEffect(() => {
    if (orderNumber && !energyBill) {
      fetchBillByOrder(orderNumber);
    }
  }, [orderNumber, energyBill, fetchBillByOrder]);

  if (loading.bills || !energyBill) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mint-50 via-white to-ocean-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ocean-200 border-t-ocean-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">
            {loading.bills ? '加载中...' : '暂无账单数据'}
          </p>
          {!loading.bills && (
            <button
              onClick={() => navigate('/guest')}
              className="mt-4 text-ocean-500 hover:text-ocean-600 text-sm font-medium"
            >
              返回查询
            </button>
          )}
        </div>
      </div>
    );
  }

  const pieData = [
    { name: '电费', value: energyBill.electricityCost, color: '#0ea5e9' },
    { name: '水费', value: energyBill.waterCost, color: '#f97316' },
  ];

  const savingIcons: Record<string, typeof Lightbulb> = {
    thermometer: Thermometer,
    'shower-head': ShowerHead,
    sun: Sun,
  };

  const handleBack = () => {
    navigate('/guest');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-mint-50 via-white to-ocean-50 pb-12">
      <div className="absolute top-0 right-0 w-96 h-96 bg-ocean-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-mint-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回查询</span>
        </button>

        <div className="bg-gradient-to-br from-ocean-500 to-ocean-700 rounded-3xl p-8 text-white shadow-2xl shadow-ocean-500/30 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Home className="w-5 h-5 text-ocean-200" />
                <span className="text-ocean-100">{energyBill.propertyName}</span>
              </div>
              <h2 className="text-2xl font-bold font-display">
                {energyBill.roomNumber} 房 · 能耗账单
              </h2>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-ocean-100 text-sm mb-8">
            <Calendar className="w-4 h-4" />
            <span>
              {energyBill.checkIn} 至 {energyBill.checkOut} · 共 5 晚
            </span>
          </div>

          <div className="flex items-end gap-3">
            <span className="text-ocean-200 text-lg">总费用</span>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold font-display">¥{energyBill.totalCost.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-3 gap-4">
            <div>
              <p className="text-ocean-200 text-sm">日均费用</p>
              <p className="text-xl font-semibold font-display">¥{energyBill.averageDailyCost.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-ocean-200 text-sm">用电</p>
              <p className="text-xl font-semibold font-display">{energyBill.totalElectricity} kWh</p>
            </div>
            <div>
              <p className="text-ocean-200 text-sm">用水</p>
              <p className="text-xl font-semibold font-display">{energyBill.totalWater} 吨</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <Card>
            <Card.Header>
              <Card.Title>费用构成</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={50}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [`¥${value.toFixed(2)}`, '']}
                        contentStyle={{
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-ocean-500" />
                      <span className="text-sm text-slate-600">电费</span>
                    </div>
                    <span className="font-semibold text-slate-800">¥{energyBill.electricityCost.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-coral-500" />
                      <span className="text-sm text-slate-600">水费</span>
                    </div>
                    <span className="font-semibold text-slate-800">¥{energyBill.waterCost.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-sand-500" />
                        <span className="text-sm text-slate-600">光伏抵扣</span>
                      </div>
                      <span className="font-semibold text-mint-600">-¥{energyBill.solarOffset.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>每日能耗</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={energyBill.dailyRecords} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        fontSize: '12px',
                      }}
                      formatter={(value: number) => [`${value} kWh`, '用电量']}
                    />
                    <Bar dataKey="electricity" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Content>
          </Card>
        </div>

        <Card className="mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Card.Header>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-mint-100 rounded-lg">
                <Lightbulb className="w-5 h-5 text-mint-600" />
              </div>
              <div>
                <Card.Title>节能建议</Card.Title>
                <p className="text-sm text-slate-500">
                  按照建议行动，预计可节省 ¥
                  {energyBill.savingTips.reduce((sum, tip) => sum + tip.savingAmount, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {energyBill.savingTips.map((tip, index) => {
                const IconComponent = savingIcons[tip.icon] || Lightbulb;
                return (
                  <div
                    key={tip.id}
                    className={cn(
                      'p-4 rounded-2xl border border-slate-100',
                      'hover:border-mint-200 hover:bg-mint-50/30 transition-all'
                    )}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-gradient-to-br from-mint-100 to-mint-50 rounded-xl flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-mint-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-slate-800">{tip.title}</h4>
                          <span className="text-sm font-medium text-mint-600">
                            省 ¥{tip.savingAmount.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card.Content>
        </Card>

        <div className="text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="inline-flex items-center gap-2 px-5 py-3 bg-mint-50 rounded-full text-mint-700 text-sm">
            <TrendingDown className="w-5 h-5" />
            <span>
              您的能耗比同户型平均水平低 12%，继续保持！
            </span>
          </div>
        </div>

        <div className="mt-8 flex justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Button variant="outline" size="lg">
            下载账单明细
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BillPage;
