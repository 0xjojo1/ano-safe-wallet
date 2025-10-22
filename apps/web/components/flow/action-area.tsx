import { Copy, Edit, SquareKanban, SquarePen, Trash2, X } from 'lucide-react';

import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Separator } from '@workspace/ui/components/separator';

import { useTransactionFlow } from '@/contexts/TransactionFlowContext';

import { getNodeConfig } from './node-registry';

export function ActionArea() {
  const { selectedNode, clearSelection, updateNode, deleteNode, addTokenTransferNode, addCustomBuildNode } =
    useTransactionFlow();
  if (selectedNode) {
    // Node selected - fixed header + scrollable content
    return (
      <div className='w-full not-last-of-type:h-full flex flex-col h-[calc(100vh-105px)]'>
        {/* Fixed Header */}
        <div className='px-4 pt-4 space-y-2 '>
          <div className='flex items-center justify-between'>
            <span className='flex gap-2 justify-center items-center'>
              <SquarePen className='size-4' />
              <h3 className='text-sm font-semibold'>Node Details</h3>
            </span>
            <Button size='icon' variant='ghost' onClick={clearSelection}>
              <X className='size-4' />
            </Button>
          </div>

          {/* Node Overview */}
          <div className='flex gap-2 flex-wrap w-full'>
            <Badge variant={'secondary'}>Type: {selectedNode.type}</Badge>
            <Badge variant={'secondary'} className='truncate text-nowrap'>
              ID: {selectedNode.id}
            </Badge>
          </div>
        </div>

        <Separator className='my-3' />

        <ScrollArea className='flex-1 min-h-0'>
          {(() => {
            const config = getNodeConfig(selectedNode.type);
            const EditorComponent = config.editorComponent;

            if (EditorComponent) {
              return (
                <EditorComponent
                  data={selectedNode.data}
                  onChange={(newData) => updateNode(selectedNode.id, newData)}
                />
              );
            }
          })()}
          <div className='mb-16' />
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className='h-full  flex flex-col'>
      <div className='px-4 pt-4 space-y-2 '>
        <div className='flex items-center justify-between'>
          <span className='flex gap-2 justify-center items-center'>
            <SquareKanban className='size-4' />
            <h3 className='text-sm font-semibold'>Overview</h3>
          </span>
        </div>
      </div>
    </div>
  );
}
