"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Pencil, Check, X } from "lucide-react"

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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDesc, setEditDesc] = useState("")
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

  function startEdit(item: IOItem) {
    setEditingId(item.id)
    setEditTitle(item.title)
    setEditDesc(item.description || "")
  }

  function cancelEdit() {
    setEditingId(null)
    setEditTitle("")
    setEditDesc("")
  }

  async function saveEdit(itemId: string) {
    if (!editTitle.trim()) return
    const { error } = await supabase
      .from(table)
      .update({ title: editTitle, description: editDesc || null })
      .eq("id", itemId)
    if (!error) {
      setItems(items.map(i => i.id === itemId ? { ...i, title: editTitle, description: editDesc || null } : i))
      cancelEdit()
      router.refresh()
    }
  }

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
      {items.length > 0 && (
        <div className="divide-y divide-stone-100">
          {items.map((item) => (
            <div key={item.id} className="px-4 py-3">
              {editingId === item.id ? (
                <div className="space-y-2">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full border border-blue-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(item.id)}
                  />
                  <input
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="Description (optional)"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(item.id)}
                      className="flex items-center gap-1 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700"
                    >
                      <Check className="w-3 h-3" /> Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1 text-stone-500 text-xs px-3 py-1.5 rounded-lg hover:bg-stone-100"
                    >
                      <X className="w-3 h-3" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-stone-800">{item.title}</div>
                    {item.description && <div className="text-xs text-stone-500 mt-0.5">{item.description}</div>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(item)}
                      className="text-stone-400 hover:text-blue-600 p-1.5 rounded hover:bg-blue-50"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-stone-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
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
