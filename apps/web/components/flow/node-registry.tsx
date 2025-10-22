import { ComponentType } from 'react';

import { CustomBuildEditor } from './editors/editor-custom-build';
import { OwnerEditor } from './editors/editor-owner';
import { SafeAccountEditor } from './editors/editor-safe-account';
import { TokenTransferEditor } from './editors/editor-token-transfer';

type NodeConfig = {
  label: string;
  editorComponent: ComponentType<{
    className?: string;
    data: any;
    onChange: (data: any) => void;
  }> | null;
};

export const NODE_REGISTRY: Record<string, NodeConfig> = {
  safeAccountNode: {
    label: 'Safe Account',
    editorComponent: SafeAccountEditor,
  },
  ownerNode: {
    label: 'Owner',
    editorComponent: OwnerEditor,
  },
  tokenTransferNode: {
    label: 'Token Transfer',
    editorComponent: TokenTransferEditor,
  },
  customBuildNode: {
    label: 'Custom Build',
    editorComponent: CustomBuildEditor,
  },
  default: {
    label: 'Node',
    editorComponent: null,
  },
};

export function getNodeConfig(type?: string): NodeConfig {
  if (!type || !NODE_REGISTRY[type]) {
    return NODE_REGISTRY.default as NodeConfig;
  }
  return NODE_REGISTRY[type] as NodeConfig;
}
