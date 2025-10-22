import { Copy, Edit, SquareKanban, SquarePen, Trash2, X } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Separator } from '@workspace/ui/components/separator';

import { getNodeConfig } from './node-registry';

export type ActionAreaProps = {
  selectedNode: any;
  onClearSelection: () => void;
  onNodeUpdate: (nodeId: string, data: any) => void;
  onDeleteNode: () => void;
  onAddTokenTransfer: (sourceNodeId: string) => void;
  onAddCustomBuild: (sourceNodeId: string) => void;
};

export function ActionArea({
  selectedNode,
  onClearSelection,
  onNodeUpdate,
  onDeleteNode,
  onAddTokenTransfer,
  onAddCustomBuild,
}: ActionAreaProps) {
  if (selectedNode) {
    // Node selected - fixed header + scrollable content
    return (
      <div className='h-full flex flex-col max-h-[calc(100vh-105px)]'>
        {/* Fixed Header */}
        <div className='px-4 pt-4 space-y-2 '>
          <div className='flex items-center justify-between'>
            <span className='flex gap-2 justify-center items-center'>
              <SquarePen className='size-4' />
              <h3 className='text-sm font-semibold'>Node Details</h3>
            </span>
            <Button size='icon' variant='ghost' onClick={onClearSelection}>
              <X className='size-4' />
            </Button>
          </div>

          {/* Node Overview */}
          <div></div>
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
                  onChange={(newData) => onNodeUpdate(selectedNode.id, newData)}
                  onAddTokenTransfer={
                    selectedNode.type === 'safeAccountNode' ? () => onAddTokenTransfer(selectedNode.id) : undefined
                  }
                  onAddCustomBuild={
                    selectedNode.type === 'safeAccountNode' ? () => onAddCustomBuild(selectedNode.id) : undefined
                  }
                />
              );
            }
          })()}
          <div className='mb-16' />
        </ScrollArea>
      </div>
    );
  }

  // No selection - show global actions

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
