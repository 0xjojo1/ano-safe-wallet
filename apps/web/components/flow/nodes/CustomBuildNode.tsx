'use client';

import { Hammer } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';

import { BaseNode } from './BaseNode';

export function CustomBuildNode({ onRemove }: { onRemove?: () => void }) {
  return (
    <BaseNode
      accent='#f59e0b'
      title='Custom Build'
      icon={<Hammer className='h-4 w-4' />}
      actions={
        <Button
          size='sm'
          variant='ghost'
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
        >
          Remove
        </Button>
      }
    >
      <div className='text-xs text-muted-foreground'>This is a placeholder for custom transaction builder content.</div>
    </BaseNode>
  );
}
