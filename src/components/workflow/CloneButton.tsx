"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Copy } from "lucide-react"
import { useAnalytics } from "@/lib/useAnalytics"

export default function CloneButton({ workflowId }: { workflowId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { track } = useAnalytics()

  async function handleClone() {
    setLoading(true)
    const res = await fetch(`/api/workflows/${workflowId}/clone`, { method: "POST" })
    const json = await res.json()
    if (res.ok) {
      track('clone', workflowId)
      router.push(`/dashboard/workflows/${json.id}/edit`)
    } else {
      alert(json.error || "Clone failed")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClone}
      disabled={loading}
      className="flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-stone-900 border border-stone-300 bg-stone-50 hover:bg-stone-100 rounded-lg px-3 py-2 transition-colors disabled:opacity-60 shadow-sm"
    >
      <Copy className="w-4 h-4" /> {loading ? "Cloning..." : "Clone workflow"}
    </button>
  )
}
