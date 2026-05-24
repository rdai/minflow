"use client"

import { Handle, Position, NodeProps } from "@xyflow/react"

export default function StepNode({ data, selected }: NodeProps) {
  const d = data as { label: string; stepOrder?: number; description?: string }

  return (
    <div
      className={`bg-purple-50 border-2 rounded-xl px-3 py-2.5 min-w-[180px] max-w-[220px] cursor-pointer transition-all ${
        selected ? "border-purple-500 shadow-lg shadow-purple-100" : "border-purple-200 hover:border-purple-400"
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-purple-400" />
      <div className="flex items-center gap-2">
        {d.stepOrder && (
          <span className="text-xs font-bold text-purple-400 bg-purple-100 px-1.5 py-0.5 rounded-full shrink-0">
            {d.stepOrder}
          </span>
        )}
        <span className="text-sm font-semibold text-purple-800 leading-tight">{d.label}</span>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-purple-400" />
    </div>
  )
}
