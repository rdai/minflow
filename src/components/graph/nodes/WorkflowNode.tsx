"use client"

import { Handle, Position, NodeProps } from "@xyflow/react"
import { ArrowRight } from "lucide-react"

export default function WorkflowNode({ data, selected }: NodeProps) {
  const d = data as { label: string; description?: string; slug?: string; relationshipType?: string }

  return (
    <div
      className={`bg-blue-50 border-2 rounded-xl px-3 py-2.5 min-w-[180px] max-w-[220px] cursor-pointer transition-all ${
        selected ? "border-blue-500 shadow-lg shadow-blue-100" : "border-blue-200 hover:border-blue-400"
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-blue-400" />
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
        <span className="text-sm font-semibold text-blue-800 leading-tight">{d.label}</span>
      </div>
      {d.relationshipType && (
        <div className="mt-1 text-xs text-blue-400 flex items-center gap-1">
          <ArrowRight className="w-3 h-3" />
          linked workflow
        </div>
      )}
      <Handle type="source" position={Position.Right} className="!bg-blue-400" />
    </div>
  )
}
