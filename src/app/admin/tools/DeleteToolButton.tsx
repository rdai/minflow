"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function DeleteToolButton({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    if (!confirm(`Delete "${toolName}"?`)) return
    setLoading(true)
    await supabase.from("tools").delete().eq("id", toolId)
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50"
      title="Delete"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
