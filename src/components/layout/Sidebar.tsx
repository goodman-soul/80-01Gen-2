import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Tv,
  BarChart3,
  CalendarCheck,
  AlertTriangle,
  Home,
  User,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface SidebarProps {
  className?: string;
}

const landlordNavItems = [
  { path: '/landlord', label: '总览面板', icon: LayoutDashboard },
  { path: '/landlord/devices', label: '设备监控', icon: Tv },
  { path: '/landlord/statistics', label: '月度统计', icon: BarChart3 },
];

const stewardNavItems = [
  { path: '/steward', label: '工作台', icon: LayoutDashboard },
  { path: '/steward/precooling', label: '预冷检查', icon: CalendarCheck },
  { path: '/steward/alerts', label: '异常预警', icon: AlertTriangle },
];

export function Sidebar({ className }: SidebarProps) {
  const { currentRole, setCurrentRole } = useAppStore();
  const navigate = useNavigate();

  const navItems = currentRole === 'landlord' ? landlordNavItems : stewardNavItems;
  const roleLabel = currentRole === 'landlord' ? '房东' : '管家';
  const roleInitial = currentRole === 'landlord' ? '房' : '管';

  const handleBackToHome = () => {
    setCurrentRole(null);
    navigate('/');
  };

  return (
    <aside
      className={cn(
        'w-64 h-screen bg-white border-r border-slate-100',
        'flex flex-col fixed left-0 top-0 z-40',
        'shadow-sm',
        className
      )}
    >
      <div className="p-6 border-b border-slate-100">
        <button
          onClick={handleBackToHome}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-ocean flex items-center justify-center text-white font-bold shadow-lg shadow-ocean-500/30 group-hover:scale-105 transition-transform">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 font-display text-lg">海岛能耗</h1>
            <p className="text-xs text-slate-500">智能托管平台</p>
          </div>
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium',
                'transition-all duration-200',
                isActive
                  ? 'bg-ocean-50 text-ocean-600 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
          <div className="w-10 h-10 rounded-full bg-gradient-coral flex items-center justify-center text-white font-semibold">
            {roleInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">
              {roleLabel}账号
            </p>
            <p className="text-xs text-slate-500">{roleLabel}权限</p>
          </div>
          <User className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
