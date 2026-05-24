import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus, ChevronRight, Pencil, ExternalLink } from "lucide-react"
import type { Tool } from "@/types"
import DeleteToolButton from "./DeleteToolButton"

export default async function AdminToolsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const { data: tools, error } = await supabase
    .from("tools")
    .select("*")
    .order("category")
    .order("name")

  const costColors: Record<string, string> = {
    free: "bg-green-100 text-green-700",
    freemium: "bg-amber-100 text-amber-700",
    paid: "bg-red-100 text-red-700",
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-stone-500 mb-6">
        <Link href="/admin" className="hover:text-stone-700">Admin</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-stone-800 font-medium">Tools</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Tools</h1>
        <Link
          href="/admin/tools/new"
          className="flex items-center gap-2 bg-emerald-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          New Tool
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error.message}</div>
      )}

      <div className="space-y-2">
        {(tools as Tool[] || []).map((tool) => (
          <div key={tool.id} className="flex items-center justify-between bg-white border border-stone-200 rounded-xl px-4 py-3 hover:border-stone-300 transition-colors">
            <div className="flex items-center gap-3">
              <div>
                <div className="font-semibold text-stone-900 flex items-center gap-2">
                  {tool.name}
                  {tool.url && (
                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-blue-600">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-stone-400">{tool.category}</span>
                  {tool.cost_level && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${costColors[tool.cost_level] || "bg-stone-100 text-stone-600"}`}>
                      {tool.cost_level}
                    </span>
                  )}
                  {tool.offline_capable && (
                    <span className="text-xs bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full">offline</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/tools/${tool.id}/edit`}
                className="text-stone-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </Link>
              <DeleteToolButton toolId={tool.id} toolName={tool.name} />
            </div>
          </div>
        ))}
        {(tools?.length || 0) === 0 && (
          <div className="text-center py-16 text-stone-400">
            <p>No tools yet.</p>
            <Link href="/admin/tools/new" className="text-blue-600 hover:underline mt-2 inline-block">Create your first tool</Link>
          </div>
        )}
      </div>
    </div>
  )
}
