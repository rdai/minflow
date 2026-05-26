"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { GOAL_ORDER } from "@/lib/categories"
import type { Workflow } from "@/types"

interface Props {
  workflow?: Workflow
  isAdmin?: boolean
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export default function ContributorWorkflowForm({ workflow, isAdmin }: Props) {
  const isEdit = !!workflow
  const [title, setTitle] = useState(workflow?.title || "")
  const [slug, setSlug] = useState(workflow?.slug || "")
  const [description, setDescription] = useState(workflow?.description || "")
  const [category, setCategory] = useState(workflow?.category || "")
  const [medium, setMedium] = useState(workflow?.medium || "")
  const [difficulty, setDifficulty] = useState(workflow?.difficulty || "")
  const [tags, setTags] = useState((workflow?.tags || []).join(", "))
  const [contactEnabled, setContactEnabled] = useState(workflow?.contact_enabled || false)
  const [visibility, setVisibility] = useState<'public' | 'private'>(workflow?.visibility || 'public')
  const [verified, setVerified] = useState(workflow?.verified || false)
  const [status, setStatus] = useState<'draft' | 'published'>(workflow?.status || "draft")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!isEdit) setSlug(slugify(val))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const parsedTags = tags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean)
    const basePayload = {
      title, slug, description, category, medium: medium || null,
      difficulty, tags: parsedTags, contact_enabled: contactEnabled,
      visibility,
      ...(isAdmin ? { verified } : {}),
      status, updated_at: new Date().toISOString()
    }

    if (isEdit) {
      const { error } = await supabase.from("workflows").update(basePayload).eq("id", workflow.id)
      if (error) { setError(error.message); setLoading(false); return }
      router.push("/dashboard")
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError("Not logged in"); setLoading(false); return }
      const { error } = await supabase.from("workflows").insert({ ...basePayload, created_by: user.id })
      if (error) { setError(error.message); setLoading(false); return }
      router.push("/dashboard")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Title *</label>
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          placeholder="Bible Translation"
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
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 h-24 resize-none"
          placeholder="Describe this workflow..."
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Goal</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            placeholder="Scripture Access..."
            list="category-options"
          />
          <datalist id="category-options">
            {GOAL_ORDER.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Medium</label>
          <select
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white"
          >
            <option value="">Select...</option>
            {["Text", "Audio", "Film", "Digital", "Print", "In-Person", "Mixed"].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white"
          >
            <option value="">Select...</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Tags</label>
        <input
          value={tags}
          onChange={(e) => {
            // Auto-normalize: lowercase, remove spaces within each tag
            const raw = e.target.value
            // Preserve trailing comma/space while typing (normalize per-segment)
            const normalized = raw
              .split(",")
              .map((t, i, arr) =>
                // Don't aggressively strip the last segment while user is still typing
                i === arr.length - 1 ? t.toLowerCase() : t.trim().toLowerCase().replace(/\s+/g, "")
              )
              .join(", ")
            setTags(normalized)
          }}
          onBlur={(e) => {
            // Full normalize on blur
            const normalized = e.target.value
              .split(",")
              .map(t => t.trim().toLowerCase().replace(/\s+/g, ""))
              .filter(Boolean)
              .join(", ")
            setTags(normalized)
          }}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          placeholder="offline, secure, low-bandwidth"
          list="tag-suggestions"
        />
        <datalist id="tag-suggestions">
          {["offline", "secure", "low-bandwidth", "oral-learner", "high-security-context", "no-internet"].map(t => (
            <option key={t} value={t} />
          ))}
        </datalist>
        <p className="text-xs text-stone-400 mt-1">Comma-separated · auto-lowercased, no spaces.</p>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={contactEnabled}
            onChange={(e) => setContactEnabled(e.target.checked)}
            className="rounded border-stone-300 text-blue-600"
          />
          <span className="text-sm text-stone-700">Allow visitors to contact me about this workflow</span>
        </label>
      </div>

      <div className="flex items-center gap-4 pt-1">
        <span className="text-sm font-medium text-stone-700">Visibility</span>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="visibility"
            value="public"
            checked={visibility === 'public'}
            onChange={() => setVisibility('public')}
            className="text-blue-600"
          />
          <span className="text-sm text-stone-700">Public</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="visibility"
            value="private"
            checked={visibility === 'private'}
            onChange={() => setVisibility('private')}
            className="text-purple-600"
          />
          <span className="text-sm text-stone-700">Private <span className="text-stone-400">(share by link)</span></span>
        </label>
      </div>

      {isAdmin && (
        <div className="flex items-center gap-3 pt-1 border-t border-stone-100">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
              className="rounded border-stone-300 text-emerald-600"
            />
            <span className="text-sm text-stone-700 font-medium">✓ Mark as verified <span className="text-stone-400 font-normal">(team-reviewed process)</span></span>
          </label>
        </div>
      )}

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          onClick={() => setStatus("draft")}
          className="bg-stone-100 text-stone-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-stone-200 transition-colors text-sm disabled:opacity-60"
        >
          {loading && status === "draft" ? "Saving..." : "Save as Draft"}
        </button>
        <button
          type="submit"
          disabled={loading}
          onClick={() => setStatus("published")}
          className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm disabled:opacity-60"
        >
          {loading && status === "published" ? "Publishing..." : "Publish"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="text-stone-500 hover:text-stone-700 px-5 py-2.5 rounded-xl hover:bg-stone-100 text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
