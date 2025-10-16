'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  Background,
  Controls,
  Edge,
  Node,
  NodeProps,
  NodeTypes,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from '@xyflow/react';

import { mockSafeInfo } from '@/lib/mock';

import { ActionArea } from './action-area';
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
  return <TokenTransferNode {...(data as TokenTransferNodeProps)} nodeId={id} selected={selected} />;
}

const nodeTypes: NodeTypes = {
  ownerNode: OwnerNodeWrapper,
  safeAccountNode: SafeAccountNodeWrapper,
  tokenTransferNode: TokenTransferNodeWrapper,
};

// Build initial graph from mockSafeInfo: one Safe node + Owner nodes + edges
function buildInitialGraph(): { nodes: Node[]; edges: Edge[] } {
  const safeId = `safe-${mockSafeInfo.address}`;
  const ownerAddresses = Array.isArray(mockSafeInfo.owners) ? mockSafeInfo.owners : [];

  const safeNode: Node = {
    id: safeId,
    selected: false,
    position: { x: 300, y: 0 },
    data: { safeInfo: mockSafeInfo },
    type: 'safeAccountNode',
  };

  const verticalGap = 210;
  const baseY = -((ownerAddresses.length - 1) * verticalGap) / 2;

  const ownerNodes: Node[] = ownerAddresses.map((ownerAddress, index) => {
    const id = `owner-${index}`;
    return {
      id,
      selected: false,
      position: { x: -160, y: baseY + index * verticalGap },
      data: { address: ownerAddress },
      type: 'ownerNode',
    };
  });

  const tokenTransferNode: Node = {
    id: 'token-transfer',
    selected: false,
    position: { x: 160, y: 0 },
    data: {},
    type: 'tokenTransferNode',
  };

  const edges: Edge[] = ownerAddresses.map((_addr, index) => ({
    id: `e-owner-${index}-to-safe`,
    source: `owner-${index}`,
    target: safeId,
  }));

  return { nodes: [safeNode, ...ownerNodes, tokenTransferNode], edges };
}

const { nodes: initialNodes, edges: initialEdges } = buildInitialGraph();

export function TransactionPanel() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback((params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)), []);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: any) => {
    setSelectedNodeId(node.id);
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          return { ...n, selected: true };
        }
        return { ...n, selected: false };
      })
    );
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const handleNodeUpdate = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: newData };
        }
        return node;
      })
    );
  }, []);

  const handleDeleteNode = useCallback(() => {
    if (selectedNodeId) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
      setSelectedNodeId(null);
    }
  }, [selectedNodeId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Delete key - remove selected node
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedNodeId) {
          event.preventDefault();
          handleDeleteNode();
        }
      }
      // Escape key - clear selection
      if (event.key === 'Escape') {
        setSelectedNodeId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, handleDeleteNode]);

  // Listen for node data changes from inline editing
  useEffect(() => {
    const handleNodeDataChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { nodeId, data } = customEvent.detail;
      handleNodeUpdate(nodeId, data);
    };

    window.addEventListener('nodeDataChange', handleNodeDataChange);
    return () => window.removeEventListener('nodeDataChange', handleNodeDataChange);
  }, [handleNodeUpdate]);

  const handleClearSelection = useCallback(() => {
    setSelectedNodeId(null);
    setNodes((nds) =>
      nds.map((n) => {
        return { ...n, selected: false };
      })
    );
  }, []);

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null;

  return (
    <div className='w-full h-full flex gap-2'>
      <div className='w-4/5 h-full border rounded-md'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
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
      </div>

      <ActionArea
        selectedNode={selectedNode}
        onClearSelection={handleClearSelection}
        onNodeUpdate={handleNodeUpdate}
        onDeleteNode={handleDeleteNode}
      />
    </div>
  );
}
