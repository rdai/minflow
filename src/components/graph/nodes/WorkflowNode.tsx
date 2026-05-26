"use client"

import { Handle, Position, NodeProps } from "@xyflow/react"
import { ArrowRight } from "lucide-react"
import type { GraphNodeData } from "@/types"

export default function WorkflowNode({ data, selected }: NodeProps) {
  const d = data as unknown as GraphNodeData
  const label = d.isCurrent ? "Current workflow" : "Linked workflow"

  return (
    <div
      className={`border-2 rounded-xl px-3 py-2.5 min-w-[200px] max-w-[240px] cursor-pointer transition-all ${
        d.isCurrent ? "bg-blue-100" : "bg-blue-50"
      } ${
        selected ? "border-blue-500 shadow-lg shadow-blue-100" : "border-blue-200 hover:border-blue-400"
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-blue-400" />
      <div className="text-[10px] font-bold uppercase tracking-wide text-blue-500 mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
        <span className="text-sm font-semibold text-blue-800 leading-tight">{d.label}</span>
      </div>
      {d.isCurrent && (
        <div className="mt-1.5 text-xs text-blue-600">
          {d.stepCount || 0} step{d.stepCount === 1 ? "" : "s"} | {d.toolCount || 0} tool{d.toolCount === 1 ? "" : "s"}
        </div>
      )}
      {!d.isCurrent && d.relationshipType && (
        <div className="mt-1 text-xs text-blue-400 flex items-center gap-1">
          <ArrowRight className="w-3 h-3" />
          Explore workflow
        </div>
      )}
      {d.isCurrent && (
        <Handle type="source" position={Position.Right} className="!bg-blue-400" />
      )}
    </div>
  )
}
