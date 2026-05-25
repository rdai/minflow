import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus, ArrowRight, ChevronRight, Pencil, Trash2 } from "lucide-react"
import type { Workflow } from "@/types"
import DeleteWorkflowButton from "./DeleteWorkflowButton"

export default async function AdminWorkflowsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const { data: workflows, error } = await supabase
    .from("workflows")
    .select("*")
    .order("category")
    .order("title")

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-stone-500 mb-6">
        <Link href="/admin" className="hover:text-stone-700">Admin</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-stone-800 font-medium">Workflows</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Workflows</h1>
        <Link
          href="/dashboard/workflows/new"
          className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          New Workflow
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error.message}</div>
      )}

      <div className="space-y-2">
        {(workflows as Workflow[] || []).map((wf) => (
          <div key={wf.id} className="flex items-center justify-between bg-white border border-stone-200 rounded-xl px-4 py-3 hover:border-stone-300 transition-colors">
            <div className="flex items-center gap-3">
              <div>
                <div className="font-semibold text-stone-900">{wf.title}</div>
                <div className="text-xs text-stone-400 mt-0.5">/{wf.slug} · {wf.category} · {wf.difficulty}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/workflows/${wf.slug}`}
                target="_blank"
                className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100"
                title="View public page"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/dashboard/workflows/${wf.id}/edit`}
                className="text-stone-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </Link>
              <DeleteWorkflowButton workflowId={wf.id} workflowTitle={wf.title} />
            </div>
          </div>
        ))}
        {(workflows?.length || 0) === 0 && (
          <div className="text-center py-16 text-stone-400">
            <p>No workflows yet.</p>
            <Link href="/admin/workflows/new" className="text-blue-600 hover:underline mt-2 inline-block">Create your first workflow</Link>
          </div>
        )}
      </div>
    </div>
  )
}
