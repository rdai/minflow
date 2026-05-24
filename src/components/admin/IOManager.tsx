"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Plus, Trash2 } from "lucide-react"

interface IOItem {
  id: string
  title: string
  description: string | null
}

interface Props {
  workflowId: string
  table: "workflow_inputs" | "workflow_outputs"
  items: IOItem[]
}

export default function IOManager({ workflowId, table, items: initialItems }: Props) {
  const [items, setItems] = useState(initialItems)
  const [newTitle, setNewTitle] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function addItem() {
    if (!newTitle.trim()) return
    setLoading(true)
    const { data, error } = await supabase
      .from(table)
      .insert({ workflow_id: workflowId, title: newTitle, description: newDesc || null })
      .select()
      .single()
    if (!error && data) {
      setItems([...items, data as IOItem])
      setNewTitle("")
      setNewDesc("")
    }
    setLoading(false)
    router.refresh()
  }

  async function deleteItem(itemId: string) {
    await supabase.from(table).delete().eq("id", itemId)
    setItems(items.filter((i) => i.id !== itemId))
    router.refresh()
  }

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
      {items.length > 0 && (
        <div className="divide-y divide-stone-100">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="text-sm font-medium text-stone-800">{item.title}</div>
                {item.description && <div className="text-xs text-stone-500 mt-0.5">{item.description}</div>}
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                className="text-stone-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      {items.length === 0 && (
        <div className="px-4 py-6 text-center text-stone-400 text-sm">No items yet</div>
      )}

      <div className="px-4 py-4 border-t border-stone-100 bg-stone-50 space-y-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          placeholder="Item title"
          onKeyDown={(e) => e.key === "Enter" && addItem()}
        />
        <input
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          placeholder="Description (optional)"
        />
        <button
          onClick={addItem}
          disabled={loading || !newTitle.trim()}
          className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>
    </div>
  )
}
