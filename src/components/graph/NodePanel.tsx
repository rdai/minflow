"use client"

import { X } from "lucide-react"
import Link from "next/link"
import type { Node } from "@xyflow/react"
import type { GraphNodeData } from "@/types"

interface Props {
  node: Node
  onClose: () => void
}

export default function NodePanel({ node, onClose }: Props) {
  const data = node.data as unknown as GraphNodeData

  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-white border-l border-stone-200 shadow-xl z-10 overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-stone-100 sticky top-0 bg-white">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            data.nodeType === "input" ? "bg-amber-100 text-amber-700" :
            data.nodeType === "output" ? "bg-red-100 text-red-700" :
            "bg-blue-100 text-blue-700"
          }`}>
            {data.nodeType?.toUpperCase()}
          </span>
          <h3 className="font-bold text-stone-900 text-sm">{data.label}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Description */}
        {data.description && (
          <div>
            <p className="text-stone-600 text-sm leading-relaxed">{data.description}</p>
          </div>
        )}

        {data.nodeType === "workflow" && data.slug && (
          <Link
            href={`/workflows/${data.slug}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium border border-blue-200 rounded-lg px-3 py-2 hover:bg-blue-50 transition-colors"
          >
            View this workflow →
          </Link>
        )}
      </div>
    </div>
  )
}
