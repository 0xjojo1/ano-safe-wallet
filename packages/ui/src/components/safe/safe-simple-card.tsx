'use client';

import * as React from 'react';
import { Copy, CheckCheck, Shield, Users } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import { Badge } from '@workspace/ui/components/badge';

export interface SafeSimpleCardProps {
  chainId: number;
  alias: string;
  address: string;
  threshold: number;
  owners: string[];
  version: string;
  chainIcon?: React.ReactNode;
  onSelect?: () => void;
  isActive?: boolean;
  className?: string;
}

export function SafeSimpleCard({
  chainId,
  alias,
  address,
  threshold,
  owners,
  version,
  chainIcon,
  onSelect,
  isActive = false,
  className,
}: SafeSimpleCardProps) {
  const [copied, setCopied] = React.useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ownerCount = owners.length;
  const thresholdPercentage = (threshold / ownerCount) * 100;

  return (
    <div
      onClick={onSelect}
      className={cn(
        'group relative overflow-hidden rounded-lg border transition-all duration-300',
        'hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5',
        isActive
          ? 'border-primary bg-primary/5 shadow-md shadow-primary/20'
          : 'border-border bg-card hover:border-primary/50',
        onSelect && 'cursor-pointer',
        className
      )}
    >
      <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />

      {isActive && <div className='absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/50' />}

      <div className='relative p-4 space-y-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            {chainIcon && <div className='flex-shrink-0'>{chainIcon}</div>}
            <div className='flex items-center gap-2'>
              <Shield className='h-4 w-4 text-primary' />
              <span className='text-sm font-medium'>Safe Account</span>
            </div>
          </div>
          <Badge variant='outline' className='text-xs'>
            v{version}
          </Badge>
        </div>

        <div className='flex items-center justify-between gap-2 group/address'>
          <code className='text-sm font-mono text-muted-foreground'>{address}</code>
          <button
            onClick={handleCopy}
            className='opacity-0 group-hover/address:opacity-100 transition-opacity p-1 rounded hover:bg-muted'
            title='Copy address'
          >
            {copied ? (
              <CheckCheck className='h-3.5 w-3.5 text-green-500' />
            ) : (
              <Copy className='h-3.5 w-3.5 text-muted-foreground' />
            )}
          </button>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between text-sm'>
            <div className='flex items-center gap-1.5 text-muted-foreground'>
              <Users className='h-3.5 w-3.5' />
              <span>Threshold</span>
            </div>
            <span className='font-medium'>
              {threshold} / {ownerCount}
            </span>
          </div>

          <div className='h-1.5 w-full bg-muted rounded-full overflow-hidden'>
            <div
              className='h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500'
              style={{ width: `${thresholdPercentage}%` }}
            />
          </div>
        </div>

        <div className='flex items-center gap-1'>
          {owners.slice(0, 3).map((owner, idx) => (
            <div
              key={owner}
              className='h-6 w-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-xs font-medium border border-primary/20'
              style={{ marginLeft: idx > 0 ? '-8px' : '0' }}
            >
              {owner.slice(2, 4).toUpperCase()}
            </div>
          ))}
          {ownerCount > 3 && <div className='ml-1 text-xs text-muted-foreground'>+{ownerCount - 3} more</div>}
        </div>
      </div>
    </div>
  );
}
