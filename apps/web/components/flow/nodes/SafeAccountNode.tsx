'use client';

import { useState } from 'react';

import { Handle, Position } from '@xyflow/react';
import { Expand, Wallet } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

import { BaseNode } from './BaseNode';

type Signer = {
  address: string;
  name?: string;
  avatarUrl?: string;
};

export type SafeAccountNodeProps = {
  name?: string;
  address: string;
  chainName?: string;
  version?: string;
  nonce?: number;
  signers?: Signer[];
  threshold?: number;
  className?: string;
  nodeId?: string;
  onAction?: (type: 'token' | 'custom', context: { nodeId?: string }) => void;
};

function truncateAddress(addr?: string): string {
  if (!addr) return '—';
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function firstLetter(text?: string): string {
  if (!text || text.trim().length === 0) return '?';
  return text.trim().charAt(0).toUpperCase();
}

function formatThreshold(threshold?: number, total?: number): string {
  if (typeof threshold !== 'number' || typeof total !== 'number') return '—';
  return `${threshold} / ${total}`;
}

export function SafeAccountNode(props: SafeAccountNodeProps) {
  const { name, address, chainName, version, nonce, signers = [], threshold, className, nodeId, onAction } = props;

  const displayTitle = name || truncateAddress(address);
  const shortAddress = truncateAddress(address);

  const [showFull, setShowFull] = useState(false);
  const maxCollapsed = 4;
  const visibleSigners = showFull ? signers : signers.slice(0, maxCollapsed);
  const overflowCount = Math.max(0, signers.length - visibleSigners.length);

  return (
    <div className={cn('w-92 relative group', className)}>
      <BaseNode
        accent='#10b981'
        title={displayTitle}
        icon={<Wallet className='h-4 w-4' />}
        actions={
          <Button size='sm' variant='ghost' onClick={(e) => {}}>
            <Expand className='h-3 w-3' />
          </Button>
        }
      >
        {/* Address and chain info */}
        <div className='mb-3'>
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <span title={address}>{shortAddress}</span>
            {chainName ? (
              <span className='text-[10px] px-1.5 py-0.5 rounded border border-border/60 text-muted-foreground'>
                {chainName}
              </span>
            ) : null}
          </div>
        </div>

        {/* Compact 3-col info row */}
        <div className='grid grid-cols-3 gap-3 mb-3'>
          <div>
            <div className='text-[11px] leading-none text-muted-foreground'>Version</div>
            <div className='mt-1 text-sm font-medium'>{version || '—'}</div>
          </div>
          <div>
            <div className='text-[11px] leading-none text-muted-foreground'>Nonce</div>
            <div className='mt-1 text-sm font-medium'>{typeof nonce === 'number' ? nonce : '—'}</div>
          </div>
          <div>
            <div className='text-[11px] leading-none text-muted-foreground'>Threshold</div>
            <div className='mt-1 text-sm font-medium'>{formatThreshold(threshold, signers.length || undefined)}</div>
          </div>
        </div>

        {/* Signers section */}
        <div>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-[11px] leading-none text-muted-foreground'>Signers</div>
            <button
              type='button'
              className='text-xs text-muted-foreground hover:underline'
              onClick={() => setShowFull((v) => !v)}
            >
              {showFull ? 'Collapse' : 'Expand'}
            </button>
          </div>
          <div>
            {visibleSigners.length === 0 ? (
              <span className='text-sm text-muted-foreground'>—</span>
            ) : showFull ? (
              <div className='flex flex-col gap-2'>
                {visibleSigners.map((s) => {
                  const label = s.name || truncateAddress(s.address);
                  const badgeLetter = firstLetter(s.name || s.address);
                  return (
                    <div key={s.address} className='flex items-center gap-2'>
                      <span className='text-xs text-muted-foreground' title={s.address}>
                        {s.address}
                      </span>
                      <Handle type='source' position={Position.Left} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className='flex flex-wrap items-center gap-2'>
                {visibleSigners.map((s) => {
                  return (
                    <span
                      key={s.address}
                      title={`${s.name ? s.name + ' · ' : ''}${s.address}`}
                      className='inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs'
                    >
                      {s.address}
                    </span>
                  );
                })}
                {overflowCount > 0 ? (
                  <span className='inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground'>
                    +{overflowCount}
                  </span>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </BaseNode>

      <Handle type='source' position={Position.Right} />
    </div>
  );
}
