"use client"

import { useState } from "react"
import type { AccessRequest } from "@/types"

const statusColors = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  invited: "bg-green-50 text-green-700 border-green-200",
  declined: "bg-stone-50 text-stone-500 border-stone-200",
}

export default function AccessRequestsManager({ requests }: { requests: AccessRequest[] }) {
  const [items, setItems] = useState(requests)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState("")

  async function invite(req: AccessRequest) {
    setLoading(req.id)
    setError("")
    const res = await fetch("/api/admin/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: req.email, requestId: req.id }),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error); setLoading(null); return }
    setItems(prev => prev.map(r => r.id === req.id ? { ...r, status: "invited" } : r))
    setLoading(null)
  }

  async function decline(req: AccessRequest) {
    setLoading(req.id)
    const res = await fetch(`/api/admin/requests/${req.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "declined" }),
    })
    if (res.ok) setItems(prev => prev.map(r => r.id === req.id ? { ...r, status: "declined" } : r))
    setLoading(null)
  }

  if (items.length === 0) {
    return <p className="text-stone-400 text-sm">No access requests yet.</p>
  }

  return (
    <div className="space-y-3">
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      {items.map(req => (
        <div key={req.id} className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-stone-900">{req.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColors[req.status]}`}>
                  {req.status}
                </span>
              </div>
              <p className="text-sm text-stone-500">{req.email}{req.org ? ` · ${req.org}` : ""}{req.referral ? ` · via ${req.referral}` : ""}</p>
              {req.message && (
                <p className="text-sm text-stone-600 mt-2 bg-stone-50 rounded-lg p-3">{req.message}</p>
              )}
              <p className="text-xs text-stone-400 mt-2">{new Date(req.created_at).toLocaleDateString()}</p>
            </div>
            {(req.status === "pending" || req.status === "declined") && (
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => invite(req)}
                  disabled={loading === req.id}
                  className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                  {loading === req.id ? "Sending..." : "Approve"}
                </button>
                {req.status === "pending" && (
                  <button
                    onClick={() => decline(req)}
                    disabled={loading === req.id}
                    className="text-stone-500 text-sm px-4 py-2 rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    Decline
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
