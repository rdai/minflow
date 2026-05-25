"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Copy } from "lucide-react"

export default function CloneButton({ workflowId }: { workflowId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleClone() {
    setLoading(true)
    const res = await fetch(`/api/workflows/${workflowId}/clone`, { method: "POST" })
    const json = await res.json()
    if (res.ok) {
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
      className="flex items-center gap-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl px-4 py-2.5 transition-colors disabled:opacity-60"
    >
      <Copy className="w-4 h-4" /> {loading ? "Cloning..." : "Clone workflow"}
    </button>
  )
}
