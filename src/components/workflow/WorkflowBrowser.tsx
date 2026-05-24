"use client"

import { useState } from "react"
import Link from "next/link"
import { Globe, X } from "lucide-react"
import WorkflowCard from "./WorkflowCard"
import { groupByKey, GOAL_ORDER, MEDIUM_ORDER } from "@/lib/categories"
import { GOAL_ICONS, GOAL_COLORS, MEDIUM_ICONS } from "@/lib/category-display"
import type { Workflow } from "@/types"

interface Props {
  workflows: Workflow[]
}

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"]

export default function WorkflowBrowser({ workflows }: Props) {
  const [mediumFilter, setMediumFilter] = useState<string[]>([])
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([])
  const [tagFilter, setTagFilter] = useState<string[]>([])

  function toggleMedium(m: string) {
    setMediumFilter(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])
  }
  function toggleDifficulty(d: string) {
    setDifficultyFilter(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
  }
  function toggleTag(t: string) {
    setTagFilter(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }
  function clearFilters() {
    setMediumFilter([])
    setDifficultyFilter([])
    setTagFilter([])
  }

  const hasFilters = mediumFilter.length > 0 || difficultyFilter.length > 0 || tagFilter.length > 0

  const filtered = workflows.filter(wf => {
    if (mediumFilter.length > 0 && !mediumFilter.includes(wf.medium || "")) return false
    if (difficultyFilter.length > 0 && !difficultyFilter.includes(wf.difficulty || "")) return false
    if (tagFilter.length > 0 && !tagFilter.some(t => (wf.tags || []).includes(t))) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => a.title.localeCompare(b.title))
  const phaseGroups = groupByKey(sorted, "category", GOAL_ORDER)
  const visibleGroups = phaseGroups.filter(g => g.items.length > 0)

  // Which mediums/tags actually exist in the data
  const availableMediums = MEDIUM_ORDER.filter(m =>
    workflows.some(wf => wf.medium === m)
  )
  const availableTags = Array.from(
    new Set(workflows.flatMap(wf => wf.tags || []))
  ).sort()

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="text-sm text-stone-400 mr-1">Filter:</span>

        {availableMediums.map(m => (
          <button
            key={m}
            onClick={() => toggleMedium(m)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              mediumFilter.includes(m)
                ? "bg-stone-800 text-white border-stone-800"
                : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
            }`}
          >
            <span className="w-3.5 h-3.5 [&>svg]:w-3.5 [&>svg]:h-3.5">{MEDIUM_ICONS[m]}</span>
            {m}
          </button>
        ))}

        <div className="w-px h-5 bg-stone-200 mx-1" />

        {DIFFICULTIES.map(d => (
          <button
            key={d}
            onClick={() => toggleDifficulty(d.toLowerCase())}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              difficultyFilter.includes(d.toLowerCase())
                ? "bg-stone-800 text-white border-stone-800"
                : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
            }`}
          >
            {d}
          </button>
        ))}

        {availableTags.length > 0 && (
          <>
            <div className="w-px h-5 bg-stone-200 mx-1" />
            {availableTags.map(t => (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  tagFilter.includes(t)
                    ? "bg-stone-800 text-white border-stone-800"
                    : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                }`}
              >
                {t}
              </button>
            ))}
          </>
        )}

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-2 py-1.5 rounded-full text-xs text-stone-400 hover:text-stone-600 transition-colors ml-1"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Phase sections */}
      {visibleGroups.length > 0 ? (
        <div className="space-y-12">
          {visibleGroups.map(({ group, items }) => (
            <section key={group}>
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-stone-100">
                <div className={`p-1.5 rounded-lg border ${GOAL_COLORS[group] || "bg-stone-50 text-stone-600 border-stone-200"}`}>
                  {GOAL_ICONS[group] || <Globe className="w-4 h-4" />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-stone-900">{group}</h2>
                  <p className="text-xs text-stone-400">{items.length} workflow{items.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((wf) => (
                  <WorkflowCard
                    key={wf.id}
                    workflow={wf}
                    icon={GOAL_ICONS[wf.category || ""] || <Globe className="w-5 h-5" />}
                    colorClass={GOAL_COLORS[wf.category || ""] || "bg-stone-50 text-stone-700 border-stone-200"}
                    badge={wf.medium || undefined}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-stone-400">
          {workflows.length === 0 ? (
            <>
              <Globe className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No workflows yet.</p>
              <Link href="/admin/workflows/new" className="text-blue-600 hover:underline mt-2 inline-block text-sm">
                Create one in admin
              </Link>
            </>
          ) : (
            <>
              <Globe className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No workflows match these filters.</p>
              <button onClick={clearFilters} className="text-blue-600 hover:underline mt-2 inline-block text-sm">
                Clear filters
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
