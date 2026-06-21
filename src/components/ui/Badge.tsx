import * as React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'ocean' | 'coral' | 'mint' | 'sand';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

export function Badge({
  children,
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-600',
    success: 'bg-mint-100 text-mint-700',
    warning: 'bg-sand-100 text-sand-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-ocean-100 text-ocean-700',
    ocean: 'bg-ocean-100 text-ocean-700',
    coral: 'bg-coral-100 text-coral-700',
    mint: 'bg-mint-100 text-mint-700',
    sand: 'bg-sand-100 text-sand-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  const dotColors = {
    default: 'bg-slate-400',
    success: 'bg-mint-500',
    warning: 'bg-sand-500',
    error: 'bg-red-500',
    info: 'bg-ocean-500',
    ocean: 'bg-ocean-500',
    coral: 'bg-coral-500',
    mint: 'bg-mint-500',
    sand: 'bg-sand-500',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-2 h-2 rounded-full animate-pulse-soft', dotColors[variant])} />}
      {children}
    </span>
  );
}

export default Badge;
