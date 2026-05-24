"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Plus, Trash2, ArrowRight } from "lucide-react"
import type { Workflow, WorkflowLink } from "@/types"

interface LinkWithTarget extends WorkflowLink {
  target?: Workflow
}

interface Props {
  workflowId: string
  links: LinkWithTarget[]
  allWorkflows: Workflow[]
}

const relationshipColors: Record<string, string> = {
  enables: "bg-green-50 text-green-700 border-green-200",
  feeds_into: "bg-blue-50 text-blue-700 border-blue-200",
  requires: "bg-amber-50 text-amber-700 border-amber-200",
  alternative_to: "bg-stone-50 text-stone-600 border-stone-200",
}

export default function WorkflowLinksManager({ workflowId, links: initialLinks, allWorkflows }: Props) {
  const [links, setLinks] = useState(initialLinks)
  const [targetId, setTargetId] = useState("")
  const [relType, setRelType] = useState("feeds_into")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function addLink() {
    if (!targetId) return
    setLoading(true)
    const { data, error } = await supabase
      .from("workflow_links")
      .insert({
        source_workflow_id: workflowId,
        target_workflow_id: targetId,
        relationship_type: relType,
        description: description || null,
      })
      .select("*, target:workflows!target_workflow_id(*)")
      .single()
    if (!error && data) {
      setLinks([...links, data as any])
      setTargetId("")
      setDescription("")
    }
    setLoading(false)
    router.refresh()
  }

  async function deleteLink(linkId: string) {
    await supabase.from("workflow_links").delete().eq("id", linkId)
    setLinks(links.filter((l) => l.id !== linkId))
    router.refresh()
  }

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
      {links.length > 0 && (
        <div className="divide-y divide-stone-100">
          {links.map((link) => (
            <div key={link.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${relationshipColors[link.relationship_type] || "bg-stone-50 text-stone-600 border-stone-200"}`}>
                  {link.relationship_type.replace("_", " ")}
                </span>
                <div className="flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-sm font-medium text-stone-800">{link.target?.title || link.target_workflow_id}</span>
                </div>
                {link.description && <span className="text-xs text-stone-400">— {link.description}</span>}
              </div>
              <button onClick={() => deleteLink(link.id)} className="text-stone-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      {links.length === 0 && (
        <div className="px-4 py-6 text-center text-stone-400 text-sm">No connections yet</div>
      )}

      <div className="px-4 py-4 border-t border-stone-100 bg-stone-50">
        <div className="font-medium text-sm text-stone-700 mb-3">Add Connection</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
          <select
            value={relType}
            onChange={(e) => setRelType(e.target.value)}
            className="border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
          >
            <option value="feeds_into">feeds into</option>
            <option value="enables">enables</option>
            <option value="requires">requires</option>
            <option value="alternative_to">alternative to</option>
          </select>
          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
          >
            <option value="">Select workflow...</option>
            {allWorkflows.map((w) => (
              <option key={w.id} value={w.id}>{w.title}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            placeholder="Description (optional)"
          />
          <button
            onClick={addLink}
            disabled={loading || !targetId}
            className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Connect
          </button>
        </div>
      </div>
    </div>
  )
}
