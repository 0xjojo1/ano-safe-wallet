'use client';

import { TokenSAFE } from '@web3icons/react';
import { Handle, Position } from '@xyflow/react';
import { Wallet } from 'lucide-react';

import { SafeAccountInfo } from '@workspace/types/safe/account';
import { Badge } from '@workspace/ui/components/badge';
import { CopyButton } from '@workspace/ui/components/common/copy-button';
import { cn } from '@workspace/ui/lib/utils';

import { BaseNode } from './node-base';

export type SafeAccountNodeProps = {
  className?: string;
  nodeId?: string;
  selected?: boolean;
  safeInfo?: SafeAccountInfo;
};

function formatThreshold(threshold?: number, total?: number): string {
  if (typeof threshold !== 'number' || typeof total !== 'number') return '—';
  return `${threshold} / ${total}`;
}

function truncateAddress(address?: string): string {
  if (!address) return '—';
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function SafeAccountNode(props: SafeAccountNodeProps) {
  const { safeInfo, className, nodeId, selected } = props;

  const address = safeInfo?.address;
  const alias = safeInfo?.alias;
  const chainName = safeInfo?.chainName;
  const version = safeInfo?.version;
  const nonce = safeInfo?.nonce;
  const threshold = safeInfo?.threshold;
  const signers = safeInfo?.owners;

  return (
    <div className={cn('relative group transition-all duration-200', className)}>
      <BaseNode
        accent='#10b981'
        className={cn(selected ? 'duration-300 shadow-lg shadow-[#10b981]/50 ease-in-out' : '')}
        title={alias ?? truncateAddress(address)}
        icon={<TokenSAFE variant='branded' className='h-4 w-4' />}
        actions={
          <Badge variant='outline' className='text-xs'>
            {chainName || '—'}
          </Badge>
        }
      >
        <div className='grid grid-cols-3 gap-3 py-2 text-xs'>
          <div className='col-span-3'>
            <div className='leading-none text-muted-foreground'>Address</div>
            <div className='mt-1 font-medium flex items-center'>
              <span className='truncate ' title={address}>
                {address}
              </span>
              <CopyButton className='h-6 w-6' iconClassName='size-3' text={address ?? '—'} />
            </div>
          </div>
          <div>
            <div className='leading-none text-muted-foreground'>Version</div>
            <div className='mt-1 font-medium'>{version || '—'}</div>
          </div>
          <div>
            <div className='leading-none text-muted-foreground'>Nonce</div>
            <div className='mt-1 font-medium'>{nonce ? nonce : '—'}</div>
          </div>
          <div>
            <div className='leading-none text-muted-foreground'>Threshold</div>
            <div className='mt-1 font-medium'>{formatThreshold(threshold, signers?.length || undefined)}</div>
          </div>
        </div>
      </BaseNode>

      <Handle type='target' position={Position.Left} />
      <Handle type='source' position={Position.Right} />
    </div>
  );
}
