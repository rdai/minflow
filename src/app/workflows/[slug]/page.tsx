export const dynamic = 'force-dynamic'

import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getWorkflow, getStepsWithTools, getWorkflowInputs, getWorkflowOutputs, getWorkflowLinks, getWorkflows, getOutgoingLinks, getIncomingLinks } from "@/lib/queries"
import WorkflowGraph from "@/components/graph/WorkflowGraph"
import ContactOwnerButton from "@/components/workflow/ContactOwnerButton"
import CloneButton from "@/components/workflow/CloneButton"
import { ArrowRight, ChevronRight, ExternalLink, Wifi, WifiOff } from "lucide-react"
import Link from "next/link"
import type { Workflow } from "@/types"
import { getSession } from "@/lib/auth"

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-rose-100 text-rose-700",
}

const relationshipColors: Record<string, string> = {
  enables: "bg-green-50 text-green-700 border-green-200",
  feeds_into: "bg-blue-50 text-blue-700 border-blue-200",
  requires: "bg-amber-50 text-amber-700 border-amber-200",
  alternative_to: "bg-stone-50 text-stone-600 border-stone-300",
}

const relationshipLabel: Record<string, string> = {
  enables: "enables",
  feeds_into: "feeds into",
  requires: "requires",
  alternative_to: "alternative to",
}

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

  const costColors: Record<string, string> = {
    free: "bg-green-100 text-green-700",
    freemium: "bg-amber-100 text-amber-700",
    paid: "bg-red-100 text-red-700",
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-stone-500 mb-6">
        <Link href="/workflows" className="hover:text-stone-700">Workflows</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-stone-800 font-medium">{workflow.title}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-3xl font-bold text-stone-900">{workflow.title}</h1>
          {workflow.difficulty && (
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${difficultyColors[workflow.difficulty] || "bg-stone-100 text-stone-600"}`}>
              {workflow.difficulty}
            </span>
          )}
          {workflow.category && (
            <span className="text-sm px-3 py-1 rounded-full font-medium bg-stone-100 text-stone-600">
              {workflow.category}
            </span>
          )}
        </div>
        {workflow.description && (
          <p className="text-stone-600 text-lg leading-relaxed max-w-3xl">{workflow.description}</p>
        )}
        <div className="flex items-center gap-2 mt-4">
          {workflow.contact_enabled && (
            <ContactOwnerButton workflowId={workflow.id} workflowTitle={workflow.title} />
          )}
          {session && (
            <CloneButton workflowId={workflow.id} />
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: metadata */}
        <div className="lg:col-span-1 space-y-6">

          {/* Inputs */}
          {inputs.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-stone-800 mb-3 flex items-center gap-2">
                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold">INPUTS</span>
                What you need to start
              </h2>
              <ul className="space-y-2">
                {inputs.map((input) => (
                  <li key={input.id} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-stone-700">{input.title}</div>
                      {input.description && <div className="text-xs text-stone-500 mt-0.5">{input.description}</div>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Outputs */}
          {outputs.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-stone-800 mb-3 flex items-center gap-2">
                <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">OUTPUTS</span>
                What this produces
              </h2>
              <ul className="space-y-2">
                {outputs.map((output) => (
                  <li key={output.id} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-stone-700">{output.title}</div>
                      {output.description && <div className="text-xs text-stone-500 mt-0.5">{output.description}</div>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Downstream workflows */}
          {outgoing.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-stone-800 mb-3">What comes next</h2>
              <div className="space-y-2">
                {outgoing.map((link: any) => (
                  <Link
                    key={link.id}
                    href={`/workflows/${link.target?.slug}`}
                    className={`block border rounded-xl p-3 hover:shadow-sm transition-all ${relationshipColors[link.relationship_type] || "bg-stone-50 text-stone-600 border-stone-200"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{link.target?.title}</span>
                      <ArrowRight className="w-4 h-4 opacity-50" />
                    </div>
                    <div className="text-xs mt-1 opacity-70">{relationshipLabel[link.relationship_type]}</div>
                    {link.description && <div className="text-xs mt-1 opacity-60">{link.description}</div>}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Upstream workflows */}
          {incoming.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-stone-800 mb-3">Comes from</h2>
              <div className="space-y-2">
                {incoming.map((link: any) => (
                  <Link
                    key={link.id}
                    href={`/workflows/${link.source?.slug}`}
                    className="block border border-stone-200 rounded-xl p-3 bg-stone-50 hover:bg-stone-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-stone-700">{link.source?.title}</span>
                      <ArrowRight className="w-4 h-4 text-stone-400" />
                    </div>
                    <div className="text-xs text-stone-500 mt-1">{relationshipLabel[link.relationship_type]}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Steps + Graph */}
        <div className="lg:col-span-2 space-y-8">
          {/* Graph */}
          <div>
            <h2 className="text-base font-bold text-stone-800 mb-3">Visual Map</h2>
            <WorkflowGraph
              workflow={workflow}
              steps={steps}
              inputs={inputs}
              outputs={outputs}
              links={links}
              allWorkflows={allWorkflows}
            />
            <p className="text-xs text-stone-400 mt-2">Click any node to see details</p>
          </div>

          {/* Steps */}
          {steps.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-stone-800 mb-4">Steps</h2>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="border border-stone-200 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 bg-stone-50 border-b border-stone-100">
                      <span className="bg-purple-100 text-purple-700 text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                        {step.step_order}
                      </span>
                      <h3 className="font-semibold text-stone-800">{step.title}</h3>
                    </div>
                    <div className="px-4 py-3">
                      {step.description && (
                        <p className="text-sm text-stone-600 mb-3">{step.description}</p>
                      )}
                      {step.tools.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-stone-400 mb-2 uppercase tracking-wide">Tools</div>
                          <div className="flex flex-wrap gap-2">
                            {step.tools.map((st) => (
                              st.tool && (
                                <div key={st.id} className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5">
                                  <span className="text-sm font-medium text-emerald-800">{st.tool.name}</span>
                                  {st.tool.url && (
                                    <a href={st.tool.url} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-700">
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                  {st.recommended_level === "recommended" && (
                                    <span className="text-xs bg-green-100 text-green-700 px-1 rounded font-medium">★</span>
                                  )}
                                  <div className="flex gap-1">
                                    {st.tool.cost_level && (
                                      <span className={`text-xs px-1 rounded font-medium ${costColors[st.tool.cost_level] || ""}`}>
                                        {st.tool.cost_level}
                                      </span>
                                    )}
                                    {st.tool.offline_capable && (
                                      <span title="Works offline"><Wifi className="w-3 h-3 text-stone-400" /></span>
                                    )}
                                  </div>
                                </div>
                              )
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
