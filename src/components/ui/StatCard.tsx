import * as React from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type StatVariant = 'ocean' | 'coral' | 'mint' | 'sand';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  variant?: StatVariant;
  trend?: {
    value: number;
    isUp: boolean;
  };
  subtitle?: string;
  className?: string;
}

const gradientMap = {
  ocean: 'bg-gradient-ocean',
  coral: 'bg-gradient-coral',
  mint: 'bg-gradient-mint',
  sand: 'bg-gradient-sand',
};

export function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  variant = 'ocean',
  trend,
  subtitle,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-6 text-white',
        gradientMap[variant],
        'shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
        className
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-white/80 text-sm font-medium">{title}</p>
          </div>
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
            <Icon className="w-6 h-6" />
          </div>
        </div>
        
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-3xl font-bold font-display">{value}</span>
          {unit && <span className="text-white/70 text-sm">{unit}</span>}
        </div>
        
        {trend && (
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'text-xs font-medium px-2 py-0.5 rounded-full',
                trend.isUp ? 'bg-white/20' : 'bg-white/20'
              )}
            >
              {trend.isUp ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-white/60 text-xs">较昨日</span>
          </div>
        )}
        
        {subtitle && <p className="text-white/70 text-sm mt-2">{subtitle}</p>}
      </div>
    </div>
  );
}

export default StatCard;
