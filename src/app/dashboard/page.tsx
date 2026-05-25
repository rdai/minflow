import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/auth'
import Link from 'next/link'
import type { Workflow } from '@/types'
import { PlusCircle, Copy } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const profile = await getProfile()

  const { data: { user } } = await supabase.auth.getUser()
  const { data } = await supabase
    .from('workflows')
    .select('*')
    .eq('created_by', user!.id)
    .order('updated_at', { ascending: false })

  const workflows = (data || []) as Workflow[]
  const drafts = workflows.filter(w => w.status === 'draft')
  const published = workflows.filter(w => w.status === 'published')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">My Workflows</h1>
          <p className="text-stone-500 text-sm mt-1">
            Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
            {profile?.org ? ` · ${profile.org}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/workflows"
            className="flex items-center gap-2 bg-green-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-green-700 transition-colors text-sm"
          >
            <Copy className="w-4 h-4" /> Clone Existing Flow
          </Link>
          <Link
            href="/dashboard/workflows/new"
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm"
          >
            <PlusCircle className="w-4 h-4" /> New Workflow
          </Link>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6 text-sm text-green-800">
        <span className="font-semibold">Tip:</span> Browse existing workflows and click{" "}
        <span className="font-semibold">Clone workflow</span> to copy one into your drafts — great starting point for adapting to your ministry context.
      </div>

      {workflows.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-stone-200 rounded-xl">
          <p className="text-stone-400 mb-4">No workflows yet.</p>
          <Link href="/dashboard/workflows/new" className="text-blue-600 hover:underline text-sm">
            Create your first workflow →
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {drafts.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
                Drafts ({drafts.length})
              </h2>
              <WorkflowList workflows={drafts} />
            </section>
          )}
          {published.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
                Published ({published.length})
              </h2>
              <WorkflowList workflows={published} />
            </section>
          )}
        </div>
      )}
    </div>
  )
}

function WorkflowList({ workflows }: { workflows: Workflow[] }) {
  return (
    <div className="space-y-2">
      {workflows.map(wf => (
        <div key={wf.id} className="bg-white border border-stone-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-medium text-stone-900 truncate">{wf.title}</h3>
            {wf.description && (
              <p className="text-sm text-stone-500 truncate mt-0.5">{wf.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
              wf.status === 'published'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-stone-50 text-stone-500 border-stone-200'
            }`}>
              {wf.status}
            </span>
            <Link
              href={`/dashboard/workflows/${wf.id}/edit`}
              className="text-sm text-blue-600 hover:underline"
            >
              Edit
            </Link>
            {wf.status === 'published' && (
              <Link
                href={`/workflows/${wf.slug}`}
                className="text-sm text-stone-500 hover:underline"
              >
                View
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
