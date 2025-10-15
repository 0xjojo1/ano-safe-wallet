import { Eye } from "lucide-react";
import { BaseNode } from "./BaseNode";
import { Handle, Position } from "@xyflow/react";

export function PreviewNode() {
  return (
    <div className="w-92">
      <BaseNode
        accent="#3b82f6"
        title="Preview"
        icon={<Eye className="h-4 w-4" />}
      >
        <div className="text-xs text-muted-foreground">
          This is a placeholder for preview content.
        </div>
      </BaseNode>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
