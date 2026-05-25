import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import type { Workflow } from '@/types'
import ContributorWorkflowForm from '@/components/dashboard/ContributorWorkflowForm'

export default async function EditWorkflowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data } = await supabase.from('workflows').select('*').eq('id', id).single()
  if (!data) notFound()

  const workflow = data as Workflow
  if (workflow.created_by !== user!.id) redirect('/dashboard')

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Edit Workflow</h1>
      <ContributorWorkflowForm workflow={workflow} />
    </div>
  )
}
