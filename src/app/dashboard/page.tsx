import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getProfile, isAdmin } from '@/lib/auth'
import Link from 'next/link'
import type { Workflow } from '@/types'
import { PlusCircle, Copy } from 'lucide-react'
import WorkflowList from '@/components/dashboard/WorkflowList'

export type CreatorInfo = { name: string | null; email: string | null }

export default async function DashboardPage() {
  const supabase = await createClient()
  const profile = await getProfile()
  const admin = await isAdmin()

  const { data: { user } } = await supabase.auth.getUser()

  // Admin sees all workflows; contributors see only their own
  const query = supabase.from('workflows').select('*').order('updated_at', { ascending: false })
  if (!admin) query.eq('created_by', user!.id)
  const { data } = await query

  const workflows = (data || []) as Workflow[]

  // For admin: build creator map (name + email) keyed by user id
  let creatorMap: Record<string, CreatorInfo> = {}
  if (admin && workflows.length > 0) {
    const ids = [...new Set(workflows.map(w => w.created_by).filter(Boolean))] as string[]
    const adminClient = createAdminClient()
    const [profilesRes, usersRes] = await Promise.all([
      supabase.from('profiles').select('id, full_name').in('id', ids),
      adminClient.auth.admin.listUsers({ perPage: 1000 }),
    ])
    const nameById = Object.fromEntries((profilesRes.data || []).map(p => [p.id, p.full_name]))
    const emailById = Object.fromEntries((usersRes.data?.users || []).map(u => [u.id, u.email]))
    ids.forEach(id => {
      creatorMap[id] = { name: nameById[id] ?? null, email: emailById[id] ?? null }
    })
  }
  const drafts = workflows.filter(w => w.status === 'draft')
  const published = workflows.filter(w => w.status === 'published')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{admin ? "All Workflows" : "My Workflows"}</h1>
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
              <WorkflowList workflows={drafts} isAdmin={admin} creatorMap={creatorMap} />
            </section>
          )}
          {published.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
                Published ({published.length})
              </h2>
              <WorkflowList workflows={published} isAdmin={admin} creatorMap={creatorMap} />
            </section>
          )}
        </div>
      )}
    </div>
  )
}

