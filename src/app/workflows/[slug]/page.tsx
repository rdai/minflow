export const dynamic = 'force-dynamic'

import { notFound } from "next/navigation"
import { getWorkflow, getStepsWithTools, getWorkflowInputs, getWorkflowOutputs, getWorkflowLinks, getWorkflows, getOutgoingLinks, getIncomingLinks } from "@/lib/queries"
import WorkflowDetailView from "@/components/workflow/WorkflowDetailView"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import type { Workflow } from "@/types"
import { getSession } from "@/lib/auth"
import { logEvent } from "@/lib/analytics"

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let workflow: Workflow
  try {
    workflow = await getWorkflow(slug)
  } catch {
    notFound()
  }

  // Fire and forget — don't await
  logEvent({ event: 'workflow_view', workflow_id: workflow.id, properties: { slug } })

  const [steps, inputs, outputs, links, allWorkflows, outgoing, incoming, session] = await Promise.all([
    getStepsWithTools(workflow.id),
    getWorkflowInputs(workflow.id),
    getWorkflowOutputs(workflow.id),
    getWorkflowLinks(workflow.id),
    getWorkflows(),
    getOutgoingLinks(workflow.id),
    getIncomingLinks(workflow.id),
    getSession(),
  ])

  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex items-center gap-2 text-sm text-stone-500 mb-2">
          <Link href="/workflows" className="hover:text-stone-700">Workflows</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-stone-800 font-medium">{workflow.title}</span>
        </div>
      </div>

      <WorkflowDetailView
        workflow={workflow}
        steps={steps}
        inputs={inputs}
        outputs={outputs}
        links={links}
        allWorkflows={allWorkflows}
        outgoing={outgoing}
        incoming={incoming}
        isLoggedIn={!!session}
      />
    </div>
  )
}
