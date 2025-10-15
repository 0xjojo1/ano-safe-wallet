import { Node, NodeProps, useReactFlow } from '@xyflow/react';
import { User } from 'lucide-react';

import { BaseNode } from './BaseNode';

export type WalletNodeProps = Node<{ address: string; name: string }, 'wallet'>;

export function WalletNode({ data, id }: NodeProps<WalletNodeProps>) {
  const { updateNodeData } = useReactFlow();

  return (
    <BaseNode accent='#10b981' title={data.name} icon={<User className='h-4 w-4' />}>
      <div className='mb-3'>
        <div className='flex items-center gap-2 text-xs text-muted-foreground'></div>
      </div>
    </BaseNode>
  );
}
