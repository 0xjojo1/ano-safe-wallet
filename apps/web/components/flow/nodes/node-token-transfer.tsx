import { Handle, Position } from '@xyflow/react';
import { HandCoins } from 'lucide-react';

import { cn } from '@workspace/ui/lib/utils';

import { BaseNode } from './node-base';

export type TokenTransferNodeProps = {
  className?: string;
  nodeId?: string;
  selected?: boolean;
};

export function TokenTransferNode(props: TokenTransferNodeProps) {
  const { className, nodeId, selected } = props;

  return (
    <div className={cn('relative group transition-all duration-200', className)}>
      <BaseNode
        accent='#f97316'
        icon={<HandCoins className='h-4 w-4 text-[#f97316]' />}
        className={cn(selected ? 'duration-300 shadow-lg shadow-[#f97316]/50 ease-in-out' : '')}
        title='Token Transfer'
      >
        <div className='py-2 text-xs space-y-2'></div>
      </BaseNode>

      <Handle type='target' position={Position.Left} />
    </div>
  );
}
