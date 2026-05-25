import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Workflow, WorkflowStep } from '@/types'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  // Fetch source workflow
  const { data: source, error: srcErr } = await supabase.from('workflows').select('*').eq('id', id).single()
  if (srcErr || !source) return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })

  const wf = source as Workflow

  // Create clone
  const { data: clone, error: cloneErr } = await supabase
    .from('workflows')
    .insert({
      title: `${wf.title} (copy)`,
      slug: `${wf.slug}-copy-${Date.now()}`,
      description: wf.description,
      category: wf.category,
      medium: wf.medium,
      difficulty: wf.difficulty,
      tags: wf.tags,
      contact_enabled: false,
      status: 'draft',
      created_by: user.id,
      is_clone_of: wf.id,
    })
    .select()
    .single()

  if (cloneErr) return NextResponse.json({ error: cloneErr.message }, { status: 500 })

  // Clone steps
  const { data: steps } = await supabase
    .from('workflow_steps')
    .select('*')
    .eq('workflow_id', id)
    .order('step_order')

  if (steps && steps.length > 0) {
    for (const step of steps as WorkflowStep[]) {
      const { data: newStep } = await supabase
        .from('workflow_steps')
        .insert({
          workflow_id: clone.id,
          title: step.title,
          description: step.description,
          step_order: step.step_order,
        })
        .select()
        .single()

      if (newStep) {
        // Clone step tools
        const { data: stepTools } = await supabase
          .from('step_tools')
          .select('*')
          .eq('step_id', step.id)

        if (stepTools && stepTools.length > 0) {
          await supabase.from('step_tools').insert(
            stepTools.map((st: { tool_id: string; role: string | null; notes: string | null; recommended_level: string | null }) => ({
              step_id: newStep.id,
              tool_id: st.tool_id,
              role: st.role,
              notes: st.notes,
              recommended_level: st.recommended_level,
            }))
          )
        }
      }
    }
  }

  return NextResponse.json({ id: clone.id })
}
