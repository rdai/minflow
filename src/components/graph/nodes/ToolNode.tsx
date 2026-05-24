"use client"

import { Handle, Position, NodeProps } from "@xyflow/react"
import { Wrench } from "lucide-react"

export default function ToolNode({ data, selected }: NodeProps) {
  const d = data as { label: string; cost_level?: string; offline_capable?: boolean; recommended_level?: string }

  return (
    <div
      className={`bg-emerald-50 border-2 rounded-xl px-3 py-2.5 min-w-[160px] max-w-[200px] cursor-pointer transition-all ${
        selected ? "border-emerald-500 shadow-lg shadow-emerald-100" : "border-emerald-200 hover:border-emerald-400"
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-emerald-400" />
      <div className="flex items-center gap-2">
        <Wrench className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        <span className="text-sm font-semibold text-emerald-800 leading-tight">{d.label}</span>
      </div>
      <div className="flex gap-1.5 mt-1">
        {d.cost_level && (
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
            d.cost_level === "free" ? "bg-green-100 text-green-700" :
            d.cost_level === "freemium" ? "bg-amber-100 text-amber-700" :
            "bg-red-100 text-red-700"
          }`}>
            {d.cost_level}
          </span>
        )}
        {d.offline_capable && (
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
            offline
          </span>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-emerald-400" />
    </div>
  )
}
