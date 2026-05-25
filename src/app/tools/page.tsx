import { getTools } from "@/lib/queries"
import { groupByCategory, TOOL_CATEGORY_ORDER } from "@/lib/categories"
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/lib/category-display"
import Link from "next/link"
import { ExternalLink, Globe } from "lucide-react"
import type { Tool } from "@/types"

const costColors: Record<string, string> = {
  free: "bg-green-100 text-green-700",
  freemium: "bg-amber-100 text-amber-700",
  paid: "bg-red-100 text-red-700",
}

const difficultyColors: Record<string, string> = {
  beginner: "bg-blue-100 text-blue-700",
  intermediate: "bg-purple-100 text-purple-700",
  advanced: "bg-rose-100 text-rose-700",
}

export default async function ToolsPage() {
  let tools: Tool[] = []
  let error = false
  try {
    tools = await getTools()
  } catch {
    error = true
  }

  // Sort within each category by name
  const sortedTools = [...tools].sort((a, b) => a.name.localeCompare(b.name))
  const groups = groupByCategory(sortedTools, TOOL_CATEGORY_ORDER)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Tools</h1>
        <p className="text-stone-600 text-lg">
          Software, platforms, and resources used across ministry workflows —
          grouped by type, with cost, difficulty, and offline capability noted.
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
          <strong>Database not connected.</strong> Configure Supabase to see tools.
        </div>
      )}

      {groups.map(({ category, items }) => (
        <div key={category} className="mb-12">
          {/* Category header */}
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-stone-100">
            <div className={`p-1.5 rounded-lg border ${CATEGORY_COLORS[category] || "bg-stone-50 text-stone-700 border-stone-200"}`}>
              {CATEGORY_ICONS[category] || <Globe className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-800">{category}</h2>
              <p className="text-xs text-stone-400">{items.length} tool{items.length !== 1 ? "s" : ""}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((tool) => (
              <div key={tool.id} className="bg-white border border-stone-200 rounded-xl p-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-stone-900 text-base leading-tight">{tool.name}</h3>
                  {tool.url && (
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-400 hover:text-blue-600 ml-2 shrink-0 mt-0.5"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {tool.description && (
                  <p className="text-sm text-stone-600 mb-3 line-clamp-2 leading-relaxed">{tool.description}</p>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {tool.cost_level && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${costColors[tool.cost_level] || "bg-stone-100 text-stone-600"}`}>
                      {tool.cost_level}
                    </span>
                  )}
                  {tool.difficulty_level && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[tool.difficulty_level] || "bg-stone-100 text-stone-600"}`}>
                      {tool.difficulty_level}
                    </span>
                  )}
                </div>

                {tool.notes && (
                  <p className="mt-2 text-xs text-stone-400 leading-relaxed">{tool.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {tools.length === 0 && !error && (
        <div className="text-center py-20 text-stone-400">
          <Globe className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No tools yet. Add them via the admin panel.</p>
        </div>
      )}
    </div>
  )
}
