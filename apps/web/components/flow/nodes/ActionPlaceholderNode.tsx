'use client';

import { useState } from 'react';

import { Handle, Position } from '@xyflow/react';
import { Hammer, Plus, Send, Wrench } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

import { BaseNode } from './BaseNode';

export type ActionPlaceholderNodeProps = {
  className?: string;
  nodeId?: string;
  onReplace?: (type: 'token' | 'custom', context: { nodeId?: string }) => void;
};

export function ActionPlaceholderNode({ className, nodeId, onReplace }: ActionPlaceholderNodeProps) {
  return (
    <div className={cn('w-92', className)}>
      <BaseNode accent='#f59e0b' title='Add Transaction' icon={<Plus className='h-4 w-4' />}>
        <div className='text-xs text-muted-foreground mb-4'>Choose a transaction type to get started</div>

        {/* Action buttons */}
        <div className='grid grid-cols-2 gap-2'>
          <Button
            size='sm'
            variant='outline'
            className='flex items-center justify-center gap-2'
            onClick={(e) => {
              e.stopPropagation();
              onReplace?.('token', { nodeId });
            }}
          >
            <Send className='h-3 w-3' />
            Token Transfer
          </Button>
          <Button
            size='sm'
            variant='outline'
            className='flex items-center justify-center gap-2'
            onClick={(e) => {
              e.stopPropagation();
              onReplace?.('custom', { nodeId });
            }}
          >
            <Wrench className='h-3 w-3' />
            Custom Build
          </Button>
        </div>
      </BaseNode>

      <Handle type='target' position={Position.Left} />
      <Handle type='source' position={Position.Right} />
    </div>
  );
}
