import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Workflow, WorkflowStep, WorkflowInput, WorkflowOutput, WorkflowLink } from '@/types'

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

  // Clone inputs
  const { data: inputs } = await supabase
    .from('workflow_inputs')
    .select('*')
    .eq('workflow_id', id)

  if (inputs && inputs.length > 0) {
    await supabase.from('workflow_inputs').insert(
      (inputs as WorkflowInput[]).map(i => ({
        workflow_id: clone.id,
        title: i.title,
        description: i.description,
      }))
    )
  }

  // Clone outputs
  const { data: outputs } = await supabase
    .from('workflow_outputs')
    .select('*')
    .eq('workflow_id', id)

  if (outputs && outputs.length > 0) {
    await supabase.from('workflow_outputs').insert(
      (outputs as WorkflowOutput[]).map(o => ({
        workflow_id: clone.id,
        title: o.title,
        description: o.description,
      }))
    )
  }

  // Clone outgoing workflow links (source = this workflow)
  const { data: links } = await supabase
    .from('workflow_links')
    .select('*')
    .eq('source_workflow_id', id)

  if (links && links.length > 0) {
    await supabase.from('workflow_links').insert(
      (links as WorkflowLink[]).map(l => ({
        source_workflow_id: clone.id,
        target_workflow_id: l.target_workflow_id,
        relationship_type: l.relationship_type,
        description: l.description,
      }))
    )
  }

  return NextResponse.json({ id: clone.id })
}
