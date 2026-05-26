"use client"

import { Handle, Position, NodeProps } from "@xyflow/react"

export default function IONode({ data, selected }: NodeProps) {
  const d = data as { label: string; nodeType: "input" | "output"; description?: string }
  const isInput = d.nodeType === "input"

  return (
    <div
      className={`border-2 rounded-xl px-3 py-2.5 min-w-[160px] max-w-[200px] cursor-pointer transition-all ${
        isInput
          ? selected ? "bg-amber-100 border-amber-500 shadow-lg shadow-amber-100" : "bg-amber-50 border-amber-200 hover:border-amber-400"
          : selected ? "bg-red-100 border-red-500 shadow-lg shadow-red-100" : "bg-red-50 border-red-200 hover:border-red-400"
      }`}
    >
      {!isInput && (
        <Handle type="target" position={Position.Left} className={`!bg-${isInput ? "amber" : "red"}-400`} />
      )}
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
          isInput ? "bg-amber-200 text-amber-700" : "bg-red-200 text-red-700"
        }`}>
          {isInput ? "IN" : "OUT"}
        </span>
        <span className={`text-sm font-semibold leading-tight ${isInput ? "text-amber-800" : "text-red-800"}`}>
          {d.label}
        </span>
      </div>
      {isInput && (
        <Handle type="source" position={Position.Right} className="!bg-amber-400" />
      )}
    </div>
  )
}
