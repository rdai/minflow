import { createClient } from './supabase/server'
import type { Workflow, WorkflowStep, WorkflowOutput, WorkflowInput, Tool, StepTool, WorkflowLink } from '@/types'

export async function getWorkflows() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workflows')
    .select('*')
    .eq('status', 'published')
    .order('category', { ascending: true })
    .order('title', { ascending: true })
  if (error) throw error
  return data as Workflow[]
}

export async function getWorkflow(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workflows')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) throw error
  return data as Workflow
}

export async function getWorkflowSteps(workflowId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workflow_steps')
    .select('*')
    .eq('workflow_id', workflowId)
    .order('step_order', { ascending: true })
  if (error) throw error
  return data as WorkflowStep[]
}

export async function getWorkflowOutputs(workflowId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workflow_outputs')
    .select('*')
    .eq('workflow_id', workflowId)
  if (error) throw error
  return data as WorkflowOutput[]
}

export async function getWorkflowInputs(workflowId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workflow_inputs')
    .select('*')
    .eq('workflow_id', workflowId)
  if (error) throw error
  return data as WorkflowInput[]
}

export async function getStepTools(stepId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('step_tools')
    .select('*, tool:tools(*)')
    .eq('step_id', stepId)
  if (error) throw error
  return data as StepTool[]
}

export async function getStepsWithTools(workflowId: string) {
  const supabase = await createClient()
  const { data: steps, error } = await supabase
    .from('workflow_steps')
    .select('*')
    .eq('workflow_id', workflowId)
    .order('step_order', { ascending: true })
  if (error) throw error

  const stepsWithTools = await Promise.all(
    (steps as WorkflowStep[]).map(async (step) => {
      const tools = await getStepTools(step.id)
      return { ...step, tools }
    })
  )
  return stepsWithTools
}

export async function getWorkflowLinks(workflowId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workflow_links')
    .select('*')
    .or(`source_workflow_id.eq.${workflowId},target_workflow_id.eq.${workflowId}`)
  if (error) throw error
  return data as WorkflowLink[]
}

export async function getOutgoingLinks(workflowId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workflow_links')
    .select('*, target:workflows!target_workflow_id(*)')
    .eq('source_workflow_id', workflowId)
  if (error) throw error
  return data
}

export async function getIncomingLinks(workflowId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workflow_links')
    .select('*, source:workflows!source_workflow_id(*)')
    .eq('target_workflow_id', workflowId)
  if (error) throw error
  return data
}

export async function getTools() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true })
  if (error) throw error
  return data as Tool[]
}

export async function getTool(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) throw error
  return data as Tool
}

export async function getFullWorkflowGraph(workflowId: string) {
  const [workflow, steps, inputs, outputs, links] = await Promise.all([
    getWorkflow('').catch(() => null),
    getWorkflowSteps(workflowId),
    getWorkflowInputs(workflowId),
    getWorkflowOutputs(workflowId),
    getWorkflowLinks(workflowId),
  ])

  const stepsWithTools = await Promise.all(
    steps.map(async (step) => ({
      ...step,
      tools: await getStepTools(step.id),
    }))
  )

  return { stepsWithTools, inputs, outputs, links }
}
