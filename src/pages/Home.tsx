import { useNavigate } from 'react-router-dom';
import { Building2, UserCog, User, Waves, Sun, Palmtree } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { UserRole } from '@/types';

function Home() {
  const navigate = useNavigate();
  const { setCurrentRole } = useAppStore();

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'landlord') {
      navigate('/landlord');
    } else if (role === 'steward') {
      navigate('/steward');
    } else {
      navigate('/guest');
    }
  };

  const roles = [
    {
      id: 'landlord' as UserRole,
      title: '房东',
      description: '管理所有房源，查看能耗总览和月度统计',
      icon: Building2,
      gradient: 'from-ocean-500 to-ocean-700',
      features: ['多房源管理', '设备实时监控', '月度能耗对比', '节能数据分析'],
    },
    {
      id: 'steward' as UserRole,
      title: '管家',
      description: '日常运营管理，入住预冷检查和异常处理',
      icon: UserCog,
      gradient: 'from-coral-500 to-coral-700',
      features: ['入住预冷检查', '设备异常预警', '今日入住安排', '一键设备控制'],
    },
    {
      id: 'guest' as UserRole,
      title: '游客',
      description: '查询入住能耗账单，获取节能建议',
      icon: User,
      gradient: 'from-mint-500 to-mint-700',
      features: ['能耗明细账单', '费用详细统计', '个性化节能建议', '离店一键查询'],
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-ocean-50 via-white to-coral-50">
      <div className="absolute top-0 right-0 w-96 h-96 bg-ocean-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-coral-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-mint-200/20 rounded-full blur-3xl" />
      
      <div className="absolute top-20 left-20 text-ocean-300/30 animate-float">
        <Waves className="w-16 h-16" />
      </div>
      <div className="absolute top-40 right-32 text-sand-400/30 animate-float" style={{ animationDelay: '1s' }}>
        <Sun className="w-20 h-20" />
      </div>
      <div className="absolute bottom-32 left-40 text-mint-400/30 animate-float" style={{ animationDelay: '2s' }}>
        <Palmtree className="w-14 h-14" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 min-h-screen flex flex-col">
        <header className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-ocean-500 to-ocean-700 shadow-xl shadow-ocean-500/30 mb-6">
            <Waves className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-slate-800 font-display mb-4">
            海岛民宿<span className="text-ocean-500">能耗托管</span>系统
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            智能管理空调、热水器、光伏和蓄水设备，降低运营成本，提升入住体验
          </p>
        </header>

        <div className="flex-1 flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto">
            {roles.map((role, index) => (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className="group relative bg-white rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 text-left animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <role.icon className="w-8 h-8" />
                </div>

                <h2 className="text-2xl font-bold text-slate-800 font-display mb-2">
                  {role.title}
                </h2>
                <p className="text-slate-500 mb-6">
                  {role.description}
                </p>

                <ul className="space-y-3">
                  {role.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                      <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${role.gradient}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex items-center gap-2 text-ocean-500 font-medium group-hover:gap-3 transition-all">
                  <span>进入</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <footer className="text-center text-slate-400 text-sm mt-12">
          <p>© 2024 海岛民宿能耗托管系统 · 让每一度电都有意义</p>
        </footer>
      </div>
    </div>
  );
}

export default Home;
