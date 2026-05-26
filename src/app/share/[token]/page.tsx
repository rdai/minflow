export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import {
  getWorkflowByShareToken,
  getStepsWithTools,
  getWorkflowInputs,
  getWorkflowOutputs,
  getWorkflowLinks,
  getWorkflows,
  getOutgoingLinks,
  getIncomingLinks,
} from '@/lib/queries'
import WorkflowDetailView from '@/components/workflow/WorkflowDetailView'
import type { Workflow } from '@/types'

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  let workflow: Workflow
  try {
    workflow = await getWorkflowByShareToken(token)
  } catch {
    notFound()
  }

  const [steps, inputs, outputs, links, allWorkflows, outgoing, incoming] =
    await Promise.all([
      getStepsWithTools(workflow.id),
      getWorkflowInputs(workflow.id),
      getWorkflowOutputs(workflow.id),
      getWorkflowLinks(workflow.id),
      getWorkflows(),
      getOutgoingLinks(workflow.id),
      getIncomingLinks(workflow.id),
    ])

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex items-center gap-2 text-sm mb-2">
          <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-1 rounded-full font-medium">
            🔒 Private · shared link
          </span>
          <span className="text-stone-400 text-xs">Anyone with this link can view</span>
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
        isLoggedIn={false}
      />
    </div>
  )
}
