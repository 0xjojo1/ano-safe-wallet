import { Handle, Position } from '@xyflow/react';
import { Fingerprint } from 'lucide-react';

import { CopyButton } from '@workspace/ui/components/common/copy-button';
import { cn } from '@workspace/ui/lib/utils';

import { BaseNode } from './node-base';

export type OwnerNodeProps = {
  className?: string;
  nodeId?: string;
  selected?: boolean;
  address: string;
  alias?: string;
};

export function OwnerNode(props: OwnerNodeProps) {
  const { address, alias, className, nodeId, selected } = props;

  return (
    <div className={cn('relative group transition-all duration-200', className)}>
      <BaseNode
        accent='#a3a3a3'
        icon={<Fingerprint className='h-4 w-4' />}
        className={cn(selected ? 'duration-300 shadow-lg shadow-[#a3a3a3]/50 ease-in-out' : '')}
        title={alias ?? `${address.slice(0, 6)}…${address.slice(-4)}`}
      >
        <div className='py-2 text-xs space-y-2'>
          <div>
            <div className='leading-none text-muted-foreground'>Alias</div>
            <div className='mt-1 font-mono'>{alias ?? '—'}</div>
          </div>
          <div>
            <div className='leading-none text-muted-foreground'>Address</div>
            <div className='mt-1 flex items-center gap-2'>
              <span className='truncate ' title={address}>
                {address}
              </span>
              <CopyButton className='h-6 w-6' iconClassName='size-3' text={address} />
            </div>
          </div>
        </div>
      </BaseNode>

      <Handle type='source' position={Position.Right} />
    </div>
  );
}
