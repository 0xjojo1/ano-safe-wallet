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

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@workspace/ui/components/resizable';

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
  return <TokenTransferNode {...(data as TokenTransferNodeProps)} nodeId={id} selected={selected} />;
}
function CustomBuildNodeWrapper({ id, data, selected }: NodeProps) {
  return <CustomBuildNode {...(data as CustomBuildNodeProps)} nodeId={id} selected={selected} />;
}

const nodeTypes: NodeTypes = {
  ownerNode: OwnerNodeWrapper,
  safeAccountNode: SafeAccountNodeWrapper,
  tokenTransferNode: TokenTransferNodeWrapper,
  customBuildNode: CustomBuildNodeWrapper,
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

  const edges: Edge[] = ownerAddresses.map((_addr, index) => ({
    id: `e-owner-${index}-to-safe`,
    source: `owner-${index}`,
    target: safeId,
  }));

  return { nodes: [safeNode, ...ownerNodes], edges };
}

const { nodes: initialNodes, edges: initialEdges } = buildInitialGraph();

export function TransactionPanel() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const [transactionNodeCounter, setTransactionNodeCounter] = useState(0);

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

  const handleAddTokenTransfer = useCallback(
    (sourceNodeId: string) => {
      const sourceNode = nodes.find((n) => n.id === sourceNodeId);
      if (!sourceNode) return;

      // Generate unique ID
      const newCounter = transactionNodeCounter + 1;
      setTransactionNodeCounter(newCounter);
      const newNodeId = `transaction-node-${newCounter}`;

      // Calculate position: to the right of the source node
      // BaseNode width is 320px (w-80), add 80px gap
      const newPosition = {
        x: sourceNode.position.x + 320 + 80,
        y: sourceNode.position.y + (newCounter - 1) * 320, // Stack nodes vertically with 50px offset
      };

      // Create new TokenTransfer node
      const newNode: Node = {
        id: newNodeId,
        selected: false,
        position: newPosition,
        data: {},
        type: 'tokenTransferNode',
      };

      // Create edge from source to new node
      const newEdge: Edge = {
        id: `e-${sourceNodeId}-to-${newNodeId}`,
        source: sourceNodeId,
        target: newNodeId,
      };

      // Add node and edge to state
      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [...eds, newEdge]);
    },
    [nodes, transactionNodeCounter]
  );

  const handleAddCustomBuild = useCallback(
    (sourceNodeId: string) => {
      const sourceNode = nodes.find((n) => n.id === sourceNodeId);
      if (!sourceNode) return;

      // Generate unique ID
      const newCounter = transactionNodeCounter + 1;
      setTransactionNodeCounter(newCounter);
      const newNodeId = `transaction-node-${newCounter}`;

      // Calculate position: to the right of the source node
      // BaseNode width is 320px (w-80), add 80px gap
      const newPosition = {
        x: sourceNode.position.x + 320 + 80,
        y: sourceNode.position.y + (newCounter - 1) * 320, // Stack nodes vertically with 50px offset
      };

      // Create new TokenTransfer node
      const newNode: Node = {
        id: newNodeId,
        selected: false,
        position: newPosition,
        data: {},
        type: 'customBuildNode',
      };

      // Create edge from source to new node
      const newEdge: Edge = {
        id: `e-${sourceNodeId}-to-${newNodeId}`,
        source: sourceNodeId,
        target: newNodeId,
      };

      // Add node and edge to state
      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [...eds, newEdge]);
    },
    [nodes, transactionNodeCounter]
  );

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
    <div className='w-full h-full overflow-hidden'>
      {/* <div className='w-4/5 h-full border rounded-md'>
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
        onAddTokenTransfer={handleAddTokenTransfer}
        onAddCustomBuild={handleAddCustomBuild}
      /> */}

      <ResizablePanelGroup direction='horizontal' className='h-full max-h-full rounded-lg border'>
        <ResizablePanel defaultSize={80}>
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
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <ActionArea
            selectedNode={selectedNode}
            onClearSelection={handleClearSelection}
            onNodeUpdate={handleNodeUpdate}
            onDeleteNode={handleDeleteNode}
            onAddTokenTransfer={handleAddTokenTransfer}
            onAddCustomBuild={handleAddCustomBuild}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
