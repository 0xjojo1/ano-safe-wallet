import { ComponentType } from 'react';

import { SafeAccountEditor } from './editors/editor-safe-account';

type NodeConfig = {
  label: string;
  editorComponent: ComponentType<{ data: any; onChange: (data: any) => void }> | null;
};

export const NODE_REGISTRY: Record<string, NodeConfig> = {
  safeAccountNode: {
    label: 'Safe Account',
    editorComponent: SafeAccountEditor,
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
