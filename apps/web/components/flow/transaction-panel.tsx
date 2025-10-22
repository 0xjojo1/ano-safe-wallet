'use client';

import { useCallback, useEffect, useMemo } from 'react';

import { Background, Controls, Edge, Node, NodeProps, NodeTypes, ReactFlow } from '@xyflow/react';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@workspace/ui/components/resizable';

import { TransactionFlowProvider, useTransactionFlow } from '@/contexts/TransactionFlowContext';
import { mockSafeInfo } from '@/lib/mock';

import { ActionArea } from './action-area';
import { CustomBuildNode, CustomBuildNodeProps } from './nodes/node-custom-build';
import { OwnerNode, OwnerNodeProps } from './nodes/node-owner';
import { SafeAccountNode, type SafeAccountNodeProps } from './nodes/node-safe-account';
import { TokenTransferNode, TokenTransferNodeProps } from './nodes/node-token-transfer';

function SafeAccountNodeWrapper({ id, data, selected }: NodeProps) {
  return <SafeAccountNode {...(data as SafeAccountNodeProps)} nodeId={id} selected={selected} />;
}
function OwnerNodeWrapper({ id, data, selected }: NodeProps) {
  return <OwnerNode {...(data as OwnerNodeProps)} nodeId={id} selected={selected} />;
}
function TokenTransferNodeWrapper({ id, data, selected }: NodeProps) {
  const { updateNode } = useTransactionFlow();
  return (
    <TokenTransferNode
      {...(data as TokenTransferNodeProps)}
      nodeId={id}
      selected={selected}
      onChange={(newData) => updateNode(id, { ...data, ...newData })}
    />
  );
}
function CustomBuildNodeWrapper({ id, data, selected }: NodeProps) {
  const { updateNode } = useTransactionFlow();
  return (
    <CustomBuildNode
      {...(data as CustomBuildNodeProps)}
      nodeId={id}
      selected={selected}
      onChange={(newData) => updateNode(id, { ...data, ...newData })}
    />
  );
}

const nodeTypes: NodeTypes = {
  ownerNode: OwnerNodeWrapper,
  safeAccountNode: SafeAccountNodeWrapper,
  tokenTransferNode: TokenTransferNodeWrapper,
  customBuildNode: CustomBuildNodeWrapper,
};

// Layout constants for initial graph
const LAYOUT_CONSTANTS = {
  SAFE_NODE_X: 300,
  SAFE_NODE_Y: 0,
  OWNER_NODE_X: -160,
  VERTICAL_GAP: 210,
} as const;

// Build initial graph from mockSafeInfo: one Safe node + Owner nodes + edges
function buildInitialGraph(): { nodes: Node[]; edges: Edge[] } {
  const safeId = `safe-${mockSafeInfo.address}`;
  const ownerAddresses = Array.isArray(mockSafeInfo.owners) ? mockSafeInfo.owners : [];

  const safeNode: Node = {
    id: safeId,
    selected: false,
    position: { x: LAYOUT_CONSTANTS.SAFE_NODE_X, y: LAYOUT_CONSTANTS.SAFE_NODE_Y },
    data: { safeInfo: mockSafeInfo },
    type: 'safeAccountNode',
  };

  const baseY = -((ownerAddresses.length - 1) * LAYOUT_CONSTANTS.VERTICAL_GAP) / 2;

  const ownerNodes: Node[] = ownerAddresses.map((ownerAddress, index) => {
    const id = `owner-${index}`;
    return {
      id,
      selected: false,
      position: {
        x: LAYOUT_CONSTANTS.OWNER_NODE_X,
        y: baseY + index * LAYOUT_CONSTANTS.VERTICAL_GAP,
      },
      data: { address: ownerAddress },
      type: 'ownerNode',
    };
  });

  const edges: Edge[] = ownerAddresses.map((_addr, index) => ({
    id: `e-owner-${index}-to-safe`,
    source: `owner-${index}`,
    target: safeId,
  }));

  return { nodes: [safeNode, ...ownerNodes], edges };
}

// Inner component that uses the context
function TransactionPanelInner() {
  const {
    nodes,
    edges,
    handleNodesChange,
    handleEdgesChange,
    handleConnect,
    selectNode,
    clearSelection,
    selectedNodeId,
    deleteNode,
  } = useTransactionFlow();

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onPaneClick = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore events when user is typing in an input or textarea
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      // Delete key - remove selected node
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedNodeId) {
          event.preventDefault();
          deleteNode(selectedNodeId);
        }
      }
      // Escape key - clear selection
      if (event.key === 'Escape') {
        clearSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, deleteNode, clearSelection]);

  return (
    <div className='w-full h-full overflow-hidden'>
      <ResizablePanelGroup direction='horizontal' className='h-full max-h-full rounded-lg border'>
        <ResizablePanel defaultSize={80}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={handleConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            fitView
            fitViewOptions={{
              padding: 0.3,
              maxZoom: 1,
              minZoom: 0.5,
            }}
            nodesFocusable={true}
            elementsSelectable={true}
            selectNodesOnDrag={false}
            className='w-full h-full'
          >
            <Background />
            <Controls />
          </ReactFlow>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <ActionArea />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

// Main export with Provider wrapper
export function TransactionPanel() {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => buildInitialGraph(), []);

  return (
    <TransactionFlowProvider initialNodes={initialNodes} initialEdges={initialEdges}>
      <TransactionPanelInner />
    </TransactionFlowProvider>
  );
}
