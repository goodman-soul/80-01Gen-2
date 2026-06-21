import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Waves,
  Search,
  QrCode,
  Home,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

function GuestHome() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');

  const handleQuery = () => {
    if (orderId.trim()) {
      navigate('/guest/bill');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-mint-50 via-white to-ocean-50">
      <div className="absolute top-0 right-0 w-96 h-96 bg-mint-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-ocean-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回首页</span>
        </button>

        <div className="max-w-md mx-auto pt-16">
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-mint-500 to-ocean-600 shadow-xl shadow-mint-500/30 mb-6">
              <Waves className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 font-display mb-2">
              您的能耗账单
            </h1>
            <p className="text-slate-500">
              输入订单号查询您入住期间的能耗详情
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-card animate-slide-up">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  订单编号
                </label>
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="请输入您的订单编号"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-mint-500 focus:ring-4 focus:ring-mint-500/20 transition-all text-lg"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  订单号可在预订确认短信或订单详情中查看
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleQuery}
                disabled={!orderId.trim()}
              >
                <Search className="w-5 h-5" />
                查询账单
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-white text-slate-400">或</span>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-mint-300 hover:text-mint-600 hover:bg-mint-50/50 transition-all">
                <QrCode className="w-6 h-6" />
                <span className="font-medium">扫码查询账单</span>
              </button>
            </div>
          </div>

          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-mint-50 rounded-full text-mint-700 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>节能小贴士：查看节能建议，为环保出一份力</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-xl bg-ocean-50 flex items-center justify-center mx-auto mb-2">
                <Home className="w-6 h-6 text-ocean-500" />
              </div>
              <p className="text-xs text-slate-500">3 套房源</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-xl bg-mint-50 flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-6 h-6 text-mint-500" />
              </div>
              <p className="text-xs text-slate-500">智能节能</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-xl bg-coral-50 flex items-center justify-center mx-auto mb-2">
                <Waves className="w-6 h-6 text-coral-500" />
              </div>
              <p className="text-xs text-slate-500">海岛风情</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestHome;
