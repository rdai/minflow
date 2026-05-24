"use client"

import { X, ExternalLink, Wifi, WifiOff, DollarSign } from "lucide-react"
import Link from "next/link"
import type { Node } from "@xyflow/react"
import type { Workflow } from "@/types"

interface Props {
  node: Node
  allWorkflows: Workflow[]
  onClose: () => void
}

const costColors: Record<string, string> = {
  free: "bg-green-100 text-green-700",
  freemium: "bg-amber-100 text-amber-700",
  paid: "bg-red-100 text-red-700",
}

const difficultyColors: Record<string, string> = {
  beginner: "bg-blue-100 text-blue-700",
  intermediate: "bg-purple-100 text-purple-700",
  advanced: "bg-rose-100 text-rose-700",
}

export default function NodePanel({ node, allWorkflows, onClose }: Props) {
  const data = node.data as any

  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-white border-l border-stone-200 shadow-xl z-10 overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-stone-100 sticky top-0 bg-white">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            data.nodeType === "step" ? "bg-purple-100 text-purple-700" :
            data.nodeType === "tool" ? "bg-emerald-100 text-emerald-700" :
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

        {/* TOOL-specific fields */}
        {data.nodeType === "tool" && (
          <>
            <div className="flex flex-wrap gap-2">
              {data.cost_level && (
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${costColors[data.cost_level] || "bg-stone-100 text-stone-600"}`}>
                  {data.cost_level === "free" ? "Free" : data.cost_level === "freemium" ? "Freemium" : "Paid"}
                </span>
              )}
              {data.difficulty_level && (
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${difficultyColors[data.difficulty_level] || "bg-stone-100 text-stone-600"}`}>
                  {data.difficulty_level}
                </span>
              )}
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${
                data.offline_capable ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"
              }`}>
                {data.offline_capable ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {data.offline_capable ? "Works offline" : "Requires internet"}
              </span>
            </div>

            {data.notes && (
              <div className="bg-stone-50 rounded-lg p-3">
                <div className="text-xs font-semibold text-stone-500 mb-1 uppercase tracking-wide">Notes</div>
                <p className="text-sm text-stone-600">{data.notes}</p>
              </div>
            )}

            {data.url && (
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium border border-blue-200 rounded-lg px-3 py-2 hover:bg-blue-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Visit website
              </a>
            )}
          </>
        )}

        {/* STEP-specific: list tools */}
        {data.nodeType === "step" && data.tools && data.tools.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">Tools used in this step</div>
            <div className="space-y-2">
              {data.tools.map((st: any) => (
                st.tool && (
                  <div key={st.id} className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-emerald-800">{st.tool.name}</span>
                      {st.recommended_level && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                          st.recommended_level === "recommended" ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"
                        }`}>
                          {st.recommended_level}
                        </span>
                      )}
                    </div>
                    {st.tool.url && (
                      <a href={st.tool.url} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 hover:underline flex items-center gap-1 mt-1">
                        <ExternalLink className="w-3 h-3" /> {st.tool.url.replace("https://", "").split("/")[0]}
                      </a>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* WORKFLOW-specific: link to detail page */}
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
