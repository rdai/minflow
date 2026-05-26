"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trash2, Link2, Check } from "lucide-react"
import type { Workflow } from "@/types"
import type { CreatorInfo } from "@/app/dashboard/page"

export default function WorkflowList({ workflows, isAdmin, creatorMap = {} }: {
  workflows: Workflow[]
  isAdmin?: boolean
  creatorMap?: Record<string, CreatorInfo>
}) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  function copyShareLink(wf: Workflow) {
    const url = `${window.location.origin}/share/${wf.share_token}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(wf.id)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    const res = await fetch(`/api/workflows/${id}`, { method: "DELETE" })
    if (res.ok) {
      router.refresh()
    } else {
      const json = await res.json()
      alert(json.error || "Delete failed")
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-2">
      {workflows.map(wf => (
        <div key={wf.id} className="bg-white border border-stone-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-medium text-stone-900 truncate">{wf.title}</h3>
            {isAdmin && wf.created_by && (() => {
              const c = creatorMap[wf.created_by]
              return (
                <p className="text-xs text-stone-400 truncate mt-0.5">
                  {c?.name ?? "Unknown"}{c?.email ? ` · ${c.email}` : ""}
                </p>
              )
            })()}
            {!isAdmin && wf.description && (
              <p className="text-sm text-stone-500 truncate mt-0.5">{wf.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Visibility badge */}
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
              wf.visibility === 'private'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-stone-50 text-stone-400 border-stone-200'
            }`}>
              {wf.visibility === 'private' ? '🔒 private' : 'public'}
            </span>
            {/* Status badge */}
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
              wf.status === 'published'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-stone-50 text-stone-500 border-stone-200'
            }`}>
              {wf.status}
            </span>
            <Link href={`/dashboard/workflows/${wf.id}/edit`} className="text-sm text-blue-600 hover:underline">
              Edit
            </Link>
            {/* View: private uses share URL, public uses slug */}
            {wf.status === 'published' && wf.visibility !== 'private' && (
              <Link href={`/workflows/${wf.slug}`} className="text-sm text-stone-500 hover:underline">
                View
              </Link>
            )}
            {/* Copy share link for private workflows */}
            {wf.visibility === 'private' && (
              <button
                onClick={() => copyShareLink(wf)}
                className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 transition-colors"
                title="Copy share link"
              >
                {copied === wf.id
                  ? <><Check className="w-3.5 h-3.5" /> Copied!</>
                  : <><Link2 className="w-3.5 h-3.5" /> Copy link</>
                }
              </button>
            )}
            <button
              onClick={() => handleDelete(wf.id, wf.title)}
              disabled={deleting === wf.id}
              className="text-stone-400 hover:text-red-500 transition-colors disabled:opacity-40 p-1"
              title="Delete workflow"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
