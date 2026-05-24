import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import WorkflowForm from "@/components/admin/WorkflowForm"
import StepsManager from "@/components/admin/StepsManager"
import WorkflowLinksManager from "@/components/admin/WorkflowLinksManager"
import IOManager from "@/components/admin/IOManager"
import type { Workflow } from "@/types"

export default async function EditWorkflowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const stepsRes = await supabase.from("workflow_steps").select("*").eq("workflow_id", id).order("step_order")
  const stepIds = (stepsRes.data || []).map((s: any) => s.id)

  const [
    { data: wf },
    { data: inputs },
    { data: outputs },
    { data: links },
    { data: allWorkflows },
    { data: allTools },
    { data: stepToolsData },
  ] = await Promise.all([
    supabase.from("workflows").select("*").eq("id", id).single(),
    supabase.from("workflow_inputs").select("*").eq("workflow_id", id),
    supabase.from("workflow_outputs").select("*").eq("workflow_id", id),
    supabase.from("workflow_links").select("*, target:workflows!target_workflow_id(*)").eq("source_workflow_id", id),
    supabase.from("workflows").select("*").order("title"),
    supabase.from("tools").select("*").order("name"),
    stepIds.length > 0
      ? supabase.from("step_tools").select("*, tool:tools(*)").in("step_id", stepIds)
      : Promise.resolve({ data: [] }),
  ])

  if (!wf) notFound()

  const steps = stepsRes.data || []

  // Attach step_tools to each step
  const stepsWithTools = steps.map((step: any) => ({
    ...step,
    step_tools: (stepToolsData || []).filter((st: any) => st.step_id === step.id),
  }))

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-stone-500 mb-6">
        <Link href="/admin" className="hover:text-stone-700">Admin</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/admin/workflows" className="hover:text-stone-700">Workflows</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-stone-800 font-medium">Edit: {wf.title}</span>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="text-lg font-bold text-stone-900 mb-4">Workflow Details</h2>
          <WorkflowForm workflow={wf as Workflow} />
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-900 mb-4">Inputs</h2>
          <p className="text-sm text-stone-500 mb-3">What does this workflow need to get started?</p>
          <IOManager workflowId={id} table="workflow_inputs" items={inputs || []} />
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-900 mb-4">Steps</h2>
          <p className="text-sm text-stone-500 mb-3">The sequence of actions in this workflow. Click the wrench icon to attach tools to a step.</p>
          <StepsManager workflowId={id} steps={stepsWithTools} allTools={allTools || []} />
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-900 mb-4">Outputs</h2>
          <p className="text-sm text-stone-500 mb-3">What does this workflow produce?</p>
          <IOManager workflowId={id} table="workflow_outputs" items={outputs || []} />
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-900 mb-4">Connected Workflows</h2>
          <p className="text-sm text-stone-500 mb-3">Link this workflow to others. These connections form the graph.</p>
          <WorkflowLinksManager
            workflowId={id}
            links={links || []}
            allWorkflows={(allWorkflows || []).filter((w: any) => w.id !== id) as Workflow[]}
          />
        </section>
      </div>
    </div>
  )
}
