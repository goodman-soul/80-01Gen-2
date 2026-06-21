import * as React from 'react';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50/50 to-white">
      <Sidebar />
      <main className={cn('ml-64 min-h-screen', className)}>
        <div className="p-8 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, children, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-8', className)}>
      <div>
        <h1 className="text-2xl font-bold text-slate-800 font-display">{title}</h1>
        {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}

export default PageLayout;
