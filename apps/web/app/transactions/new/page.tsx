'use client';

import { useCallback, useState } from 'react';

import { Background, Controls, ReactFlow, addEdge, applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  ArrowLeftRight,
  Code,
  Download,
  FileCode,
  FileText,
  Play,
  Plus,
  Save,
  Send,
  Trash2,
  Upload,
  Wallet,
  Zap,
} from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';

const initialNodes = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

export default function NewTransactionPage() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback((params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)), []);

  return (
    <div className='w-full h-[calc(100vh-6rem)] flex gap-2'>
      <div className='w-4/5 h-full border rounded-md'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      <div className='w-1/5 h-full border rounded-md p-4 space-y-6'>
        {/* Add Nodes Section */}
        <div className='space-y-3'>
          <h3 className='text-sm font-semibold text-muted-foreground'>Add Nodes</h3>
          <div className='grid grid-cols-2 gap-2'>
            <Button variant='outline' size='sm' className='gap-2 justify-start'>
              <Wallet className='h-4 w-4' />
              Wallet
            </Button>
            <Button variant='outline' size='sm' className='gap-2 justify-start'>
              <ArrowLeftRight className='h-4 w-4' />
              Transfer
            </Button>
            <Button variant='outline' size='sm' className='gap-2 justify-start'>
              <Code className='h-4 w-4' />
              Contract
            </Button>
            <Button variant='outline' size='sm' className='gap-2 justify-start'>
              <Zap className='h-4 w-4' />
              Action
            </Button>
            <Button variant='outline' size='sm' className='gap-2 justify-start'>
              <FileText className='h-4 w-4' />
              Preview
            </Button>
            <Button variant='outline' size='sm' className='gap-2 justify-start'>
              <Send className='h-4 w-4' />
              Execute
            </Button>
          </div>
        </div>

        <Separator />

        {/* Canvas Actions */}
        <div className='space-y-3'>
          <h3 className='text-sm font-semibold text-muted-foreground'>Canvas Actions</h3>
          <div className='space-y-2'>
            <Button variant='outline' size='sm' className='w-full gap-2 justify-start'>
              <Plus className='h-4 w-4' />
              Add Connection
            </Button>
            <Button variant='outline' size='sm' className='w-full gap-2 justify-start'>
              <Trash2 className='h-4 w-4' />
              Clear All
            </Button>
            <Button variant='outline' size='sm' className='w-full gap-2 justify-start'>
              <Download className='h-4 w-4' />
              Export Flow
            </Button>
            <Button variant='outline' size='sm' className='w-full gap-2 justify-start'>
              <Upload className='h-4 w-4' />
              Import Flow
            </Button>
          </div>
        </div>

        <Separator />

        {/* Transaction Actions */}
        <div className='space-y-3'>
          <h3 className='text-sm font-semibold text-muted-foreground'>Transaction Actions</h3>
          <div className='space-y-2'>
            <Button variant='outline' size='sm' className='w-full gap-2 justify-start'>
              <FileCode className='h-4 w-4' />
              View Raw Data
            </Button>
            <Button variant='outline' size='sm' className='w-full gap-2 justify-start'>
              <Save className='h-4 w-4' />
              Save Draft
            </Button>
            <Button size='sm' className='w-full gap-2 justify-start'>
              <Play className='h-4 w-4' />
              Build Transaction
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
