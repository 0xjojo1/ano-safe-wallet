import { Copy, Edit, Trash2, X } from 'lucide-react';

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
};

export function ActionArea({ selectedNode, onClearSelection, onNodeUpdate, onDeleteNode, onAddTokenTransfer }: ActionAreaProps) {
  if (selectedNode) {
    // Node selected - fixed header + scrollable content
    return (
      <div className='w-1/5 h-full border rounded-md p-4 flex flex-col'>
        {/* Fixed Header */}
        <div className='space-y-2 shrink-0'>
          <div className='flex items-center justify-between'>
            <h3 className='text-md font-semibold'>Node Details</h3>
            <Button size='icon' variant='ghost' onClick={onClearSelection}>
              <X className='size-4' />
            </Button>
          </div>
        </div>

        <Separator className='my-3 shrink-0' />

        {/* Scroll Area */}
        <ScrollArea>
          {/* Node-specific Editor */}
          {(() => {
            const config = getNodeConfig(selectedNode.type);
            const EditorComponent = config.editorComponent;

            if (EditorComponent) {
              return (
                <EditorComponent
                  data={selectedNode.data}
                  onChange={(newData) => onNodeUpdate(selectedNode.id, newData)}
                  onAddTokenTransfer={
                    selectedNode.type === 'safeAccountNode' 
                      ? () => onAddTokenTransfer(selectedNode.id)
                      : undefined
                  }
                />
              );
            }
          })()}
        </ScrollArea>
      </div>
    );
  }

  // No selection - show global actions

  return (
    <div className='w-1/5 h-full border rounded-md p-4 flex flex-col'>
      {/* Fixed Header */}
      <div className='space-y-2 shrink-0'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-semibold'>Action Panel</h3>
        </div>
      </div>
    </div>
  );
}
