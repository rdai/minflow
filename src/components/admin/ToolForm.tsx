"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { Tool } from "@/types"

interface Props {
  tool?: Tool
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export default function ToolForm({ tool }: Props) {
  const isEdit = !!tool
  const [name, setName] = useState(tool?.name || "")
  const [slug, setSlug] = useState(tool?.slug || "")
  const [description, setDescription] = useState(tool?.description || "")
  const [url, setUrl] = useState(tool?.url || "")
  const [category, setCategory] = useState(tool?.category || "")
  const [costLevel, setCostLevel] = useState(tool?.cost_level || "")
  const [diffLevel, setDiffLevel] = useState(tool?.difficulty_level || "")
  const [offline, setOffline] = useState(tool?.offline_capable || false)
  const [notes, setNotes] = useState(tool?.notes || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  function handleNameChange(val: string) {
    setName(val)
    if (!isEdit) setSlug(slugify(val))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const payload = {
      name, slug, description, url: url || null, category,
      cost_level: costLevel || null, difficulty_level: diffLevel || null,
      offline_capable: offline, notes: notes || null,
      updated_at: new Date().toISOString(),
    }

    if (isEdit) {
      const { error } = await supabase.from("tools").update(payload).eq("id", tool.id)
      if (error) { setError(error.message); setLoading(false); return }
      router.refresh()
    } else {
      const { data, error } = await supabase.from("tools").insert(payload).select().single()
      if (error) { setError(error.message); setLoading(false); return }
      router.push("/admin/tools")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Name *</label>
          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Slug *</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 h-20 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Website URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          placeholder="https://..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            placeholder="Translation, Audio..."
            list="tool-categories"
          />
          <datalist id="tool-categories">
            {["Translation", "Publishing", "Audio", "Film", "Outreach", "Follow-up", "Discipleship", "Media", "Distribution", "Repository"].map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Cost</label>
          <select
            value={costLevel}
            onChange={(e) => setCostLevel(e.target.value)}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
          >
            <option value="">Select...</option>
            <option value="free">Free</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Difficulty</label>
          <select
            value={diffLevel}
            onChange={(e) => setDiffLevel(e.target.value)}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
          >
            <option value="">Select...</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={offline}
            onChange={(e) => setOffline(e.target.checked)}
            className="w-4 h-4 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-stone-700">Works offline (no internet required)</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 h-16 resize-none"
          placeholder="Additional notes for practitioners..."
        />
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors text-sm disabled:opacity-60"
        >
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Tool"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/tools")}
          className="text-stone-500 hover:text-stone-700 px-5 py-2.5 rounded-xl hover:bg-stone-100 text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
