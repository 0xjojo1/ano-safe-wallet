'use client';

import { ReactNode } from 'react';

import { cn } from '@workspace/ui/lib/utils';

type BaseNodeProps = {
  accent?: string;
  title: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function BaseNode({ accent = '#3b82f6', title, icon, actions, children, className }: BaseNodeProps) {
  return (
    <div className={cn('relative w-80 rounded-lg border bg-card shadow-sm', className)}>
      {/* Accent bar without being affected by padding */}
      <div className='inset-x-0 top-0 h-1 rounded-t-lg' style={{ background: accent }}></div>
      {/* Content wrapper */}
      <div className='px-3'>
        {/* Ensure all elements are vertically centered for horizontal alignment */}
        <div className='py-2 flex items-center gap-2'>
          {icon ? (
            <div className='h-8 w-8 rounded-full bg-muted/60 flex items-center justify-center'>{icon}</div>
          ) : null}
          <div className='min-w-0 flex-1 flex items-center'>
            <div className='text-sm font-semibold truncate'>{title}</div>
          </div>
          {actions ? <div className='shrink-0 flex items-center'>{actions}</div> : null}
        </div>
        <div className='pb-3'>{children}</div>
      </div>
    </div>
  );
}
