'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from '@xyflow/react';

// Context type definition
type TransactionFlowContextValue = {
  // State
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  selectedNode: Node | null;

  // Node operations
  updateNode: (nodeId: string, data: any) => void;
  deleteNode: (nodeId: string) => void;

  // React Flow change handlers
  handleNodesChange: (changes: NodeChange[]) => void;
  handleEdgesChange: (changes: EdgeChange[]) => void;
  handleConnect: (connection: Connection) => void;

  // Selection operations
  selectNode: (nodeId: string | null) => void;
  clearSelection: () => void;

  // Advanced operations
  addTokenTransferNode: (sourceNodeId: string) => void;
  addCustomBuildNode: (sourceNodeId: string) => void;

  // Internal counter
  transactionNodeCounter: number;
  incrementCounter: () => void;
};

// Create Context
const TransactionFlowContext = createContext<TransactionFlowContextValue | null>(null);

// Provider Props
type TransactionFlowProviderProps = {
  children: React.ReactNode;
  initialNodes: Node[];
  initialEdges: Edge[];
};

// Provider component
export function TransactionFlowProvider({ children, initialNodes, initialEdges }: TransactionFlowProviderProps) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [transactionNodeCounter, setTransactionNodeCounter] = useState(0);

  // Calculate selected node
  const selectedNode = useMemo(() => {
    return selectedNodeId ? (nodes.find((n) => n.id === selectedNodeId) ?? null) : null;
  }, [nodes, selectedNodeId]);

  // Update node data
  const updateNode = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: newData };
        }
        return node;
      })
    );
  }, []);

  // Delete node
  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      if (selectedNodeId === nodeId) {
        setSelectedNodeId(null);
      }
    },
    [selectedNodeId]
  );

  // Select node
  const selectNode = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        selected: n.id === nodeId,
      }))
    );
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedNodeId(null);
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        selected: false,
      }))
    );
  }, []);

  // Increment counter
  const incrementCounter = useCallback(() => {
    setTransactionNodeCounter((c) => c + 1);
  }, []);

  // Handle React Flow node changes
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  // Handle React Flow edge changes
  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  // Handle React Flow connections
  const handleConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  // Add Token Transfer node
  const addTokenTransferNode = useCallback(
    (sourceNodeId: string) => {
      const sourceNode = nodes.find((n) => n.id === sourceNodeId);
      if (!sourceNode) return;

      const newCounter = transactionNodeCounter + 1;
      setTransactionNodeCounter(newCounter);
      const newNodeId = `transaction-node-${newCounter}`;

      const newPosition = {
        x: sourceNode.position.x + 320 + 80,
        y: sourceNode.position.y + (newCounter - 1) * 320,
      };

      const newNode: Node = {
        id: newNodeId,
        selected: false,
        position: newPosition,
        data: {
          recipient: '',
          token: '',
          amount: '',
        },
        type: 'tokenTransferNode',
      };

      const newEdge: Edge = {
        id: `e-${sourceNodeId}-to-${newNodeId}`,
        source: sourceNodeId,
        target: newNodeId,
      };

      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [...eds, newEdge]);
    },
    [nodes, transactionNodeCounter]
  );

  // Add Custom Build node
  const addCustomBuildNode = useCallback(
    (sourceNodeId: string) => {
      const sourceNode = nodes.find((n) => n.id === sourceNodeId);
      if (!sourceNode) return;

      const newCounter = transactionNodeCounter + 1;
      setTransactionNodeCounter(newCounter);
      const newNodeId = `transaction-node-${newCounter}`;

      const newPosition = {
        x: sourceNode.position.x + 320 + 80,
        y: sourceNode.position.y + (newCounter - 1) * 320,
      };

      const newNode: Node = {
        id: newNodeId,
        selected: false,
        position: newPosition,
        data: {
          contractAddress: '',
          abiInput: '',
          parsedAbi: [],
          selectedFunction: '',
          functionParams: {},
          parseError: '',
        },
        type: 'customBuildNode',
      };

      const newEdge: Edge = {
        id: `e-${sourceNodeId}-to-${newNodeId}`,
        source: sourceNodeId,
        target: newNodeId,
      };

      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [...eds, newEdge]);
    },
    [nodes, transactionNodeCounter]
  );

  const value = useMemo<TransactionFlowContextValue>(
    () => ({
      nodes,
      edges,
      selectedNodeId,
      selectedNode,
      updateNode,
      deleteNode,
      handleNodesChange,
      handleEdgesChange,
      handleConnect,
      selectNode,
      clearSelection,
      addTokenTransferNode,
      addCustomBuildNode,
      transactionNodeCounter,
      incrementCounter,
    }),
    [
      nodes,
      edges,
      selectedNodeId,
      selectedNode,
      updateNode,
      deleteNode,
      handleNodesChange,
      handleEdgesChange,
      handleConnect,
      selectNode,
      clearSelection,
      addTokenTransferNode,
      addCustomBuildNode,
      transactionNodeCounter,
      incrementCounter,
    ]
  );

  return <TransactionFlowContext.Provider value={value}>{children}</TransactionFlowContext.Provider>;
}

// Custom Hook
export function useTransactionFlow() {
  const context = useContext(TransactionFlowContext);
  if (!context) {
    throw new Error('useTransactionFlow must be used within TransactionFlowProvider');
  }
  return context;
}
