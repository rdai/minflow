import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"
import WorkflowGraph from "@/components/graph/WorkflowGraph"
import ContactOwnerButton from "@/components/workflow/ContactOwnerButton"
import CloneButton from "@/components/workflow/CloneButton"
import type { StepTool, Tool, Workflow, WorkflowInput, WorkflowLink, WorkflowOutput, WorkflowStep } from "@/types"

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
  alternative_to: "alt to",
}

const costColors: Record<string, string> = {
  free: "bg-green-100 text-green-700",
  freemium: "bg-amber-100 text-amber-700",
  paid: "bg-red-100 text-red-700",
}

interface Props {
  workflow: Workflow
  steps: StepWithTools[]
  inputs: WorkflowInput[]
  outputs: WorkflowOutput[]
  links: WorkflowLink[]
  allWorkflows: Workflow[]
  outgoing: WorkflowLinkWithTarget[]
  incoming: WorkflowLinkWithSource[]
  isLoggedIn: boolean
}

type StepWithTools = WorkflowStep & { tools: StepTool[] }
type WorkflowLinkWithTarget = WorkflowLink & { target?: Workflow | null }
type WorkflowLinkWithSource = WorkflowLink & { source?: Workflow | null }
type WorkflowOverviewProps = Omit<Props, "isLoggedIn">

export default function WorkflowDetailView({
  workflow, steps, inputs, outputs, links, allWorkflows, outgoing, incoming, isLoggedIn
}: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
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
            {workflow.verified && (
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                ✓ Verified
              </span>
            )}
            {(workflow.tags || []).map(tag => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-50 text-blue-600 border border-blue-100">
                #{tag}
              </span>
            ))}
          </div>
          {workflow.description && (
            <p className="text-stone-600 text-lg leading-relaxed max-w-3xl">{workflow.description}</p>
          )}
          {!workflow.verified && (
            <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-800 max-w-xl">
              <span className="shrink-0 mt-0.5">⚠️</span>
              <span>Community contribution — not yet reviewed by our team. Processes may vary.</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="shrink-0 flex flex-col items-end gap-2">
          {isLoggedIn && <CloneButton workflowId={workflow.id} />}
          {workflow.contact_enabled && (
            <ContactOwnerButton workflowId={workflow.id} workflowTitle={workflow.title} />
          )}
        </div>
      </div>

      <WorkflowOverview
        workflow={workflow} steps={steps} inputs={inputs} outputs={outputs}
        links={links} allWorkflows={allWorkflows} outgoing={outgoing} incoming={incoming}
      />
    </div>
  )
}

/* ─── Shared sub-components ─── */

function InputsList({ inputs }: { inputs: WorkflowInput[] }) {
  if (!inputs.length) return null
  return (
    <div>
      <h2 className="text-base font-bold text-stone-800 mb-3 flex items-center gap-2">
        <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold">INPUTS</span>
        What you need
      </h2>
      <ul className="space-y-2">
        {inputs.map(i => (
          <li key={i.id} className="flex items-start gap-2">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <div>
              <div className="text-sm font-medium text-stone-700">{i.title}</div>
              {i.description && <div className="text-xs text-stone-500 mt-0.5">{i.description}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function OutputsList({ outputs }: { outputs: WorkflowOutput[] }) {
  if (!outputs.length) return null
  return (
    <div>
      <h2 className="text-base font-bold text-stone-800 mb-3 flex items-center gap-2">
        <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">OUTPUTS</span>
        What this produces
      </h2>
      <ul className="space-y-2">
        {outputs.map(o => (
          <li key={o.id} className="flex items-start gap-2">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
            <div>
              <div className="text-sm font-medium text-stone-700">{o.title}</div>
              {o.description && <div className="text-xs text-stone-500 mt-0.5">{o.description}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function RelatedFlows({ outgoing, incoming }: { outgoing: WorkflowLinkWithTarget[]; incoming: WorkflowLinkWithSource[] }) {
  if (!outgoing.length && !incoming.length) return null
  return (
    <div className="space-y-4">
      {outgoing.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-stone-800 mb-3">What comes next</h2>
          <div className="space-y-2">
            {outgoing.map((link) => (
              <Link key={link.id} href={`/workflows/${link.target?.slug}`}
                className={`block border rounded-xl p-3 hover:shadow-sm transition-all ${relationshipColors[link.relationship_type] || "bg-stone-50 border-stone-200"}`}>
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
      {incoming.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-stone-800 mb-3">Comes from</h2>
          <div className="space-y-2">
            {incoming.map((link) => (
              <Link key={link.id} href={`/workflows/${link.source?.slug}`}
                className="block border border-stone-200 rounded-xl p-3 bg-stone-50 hover:bg-stone-100 transition-colors">
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
  )
}

function StepsList({ steps }: { steps: StepWithTools[] }) {
  if (!steps.length) return null
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <article key={step.id} id={`step-${step.id}`} className="relative pl-11 scroll-mt-20 target:[&>div]:ring-2 target:[&>div]:ring-purple-300 target:[&>div]:ring-offset-2">
          {index < steps.length - 1 && (
            <div className="absolute left-3 top-9 bottom-[-1rem] border-l-2 border-purple-100" />
          )}
          <span className="absolute left-0 top-4 bg-purple-100 text-purple-700 text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center">
            {step.step_order}
          </span>
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
            <div className="px-4 py-3 bg-stone-50 border-b border-stone-100">
              <h3 className="font-semibold text-stone-800">{step.title}</h3>
            </div>
            <div className="px-4 py-4">
              {step.description && <p className="text-sm text-stone-600 mb-4 leading-relaxed">{step.description}</p>}
              {step.tools.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-stone-400 mb-2 uppercase tracking-wide">Tools for this step</div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {step.tools.map((st) => st.tool && (
                      <ToolCard key={st.id} st={st} tool={st.tool} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

function ToolCard({ st, tool }: { st: StepTool; tool: Tool }) {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-emerald-800">{tool.name}</div>
          {st.role && <div className="text-xs text-emerald-700 mt-0.5">{st.role}</div>}
        </div>
        {tool.url && (
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${tool.name}`}
            className="text-emerald-500 hover:text-emerald-700 shrink-0 p-0.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
      {(st.notes || tool.description) && (
        <p className="text-xs text-stone-600 mt-2 leading-relaxed">{st.notes || tool.description}</p>
      )}
      <div className="flex flex-wrap gap-1.5 mt-2">
        {st.recommended_level === "recommended" && (
          <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">Recommended</span>
        )}
        {tool.cost_level && (
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${costColors[tool.cost_level] || ""}`}>
            {tool.cost_level}
          </span>
        )}
        {tool.offline_capable && (
          <span className="text-xs bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-medium">Offline capable</span>
        )}
      </div>
    </div>
  )
}

function ProcessStrip({ steps }: { steps: StepWithTools[] }) {
  if (!steps.length) return null
  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-2 -mx-1 px-1">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-start shrink-0">
          <a
            href={`#step-${step.id}`}
            className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-3 py-2.5 hover:border-purple-300 hover:bg-purple-50 transition-colors group shadow-sm"
          >
            <span className="bg-purple-100 text-purple-700 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 group-hover:bg-purple-200 transition-colors">
              {step.step_order}
            </span>
            <span className="text-sm font-medium text-stone-700 group-hover:text-stone-900 max-w-[180px]">
              {step.title}
            </span>
          </a>
          {index < steps.length - 1 && (
            <ArrowRight className="w-5 h-5 text-stone-400 mx-0.5 shrink-0 mt-3" />
          )}
        </div>
      ))}
    </div>
  )
}

function WorkflowOverview({ workflow, steps, inputs, outputs, links, allWorkflows, outgoing, incoming }: WorkflowOverviewProps) {
  return (
    <div className="space-y-10">

      {/* 1. Process strip — at-a-glance sequence */}
      {steps.length > 0 && (
        <section>
          <h2 className="text-base font-bold text-stone-800 mb-3">Process overview</h2>
          <ProcessStrip steps={steps} />
        </section>
      )}

      {/* 2. Step-by-step detail */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-bold text-stone-800">How to do it</h2>
          <p className="text-sm text-stone-500 mt-1">Follow the steps in order and use the supporting tools where helpful.</p>
        </div>
        {steps.length > 0 ? (
          <StepsList steps={steps} />
        ) : (
          <p className="text-sm text-stone-500 border border-stone-200 rounded-xl p-4 bg-white">No steps have been listed yet.</p>
        )}
      </section>

      {/* 3. Where this fits — ecosystem map at the bottom */}
      <section className="border-t border-stone-100 pt-10">
        <div className="mb-4">
          <h2 className="text-base font-bold text-stone-800">Where this workflow fits</h2>
          <p className="text-sm text-stone-500 mt-1">Inputs, outputs, and connections to other workflows.</p>
        </div>
        <WorkflowGraph key={workflow.id} workflow={workflow} steps={steps} inputs={inputs} outputs={outputs} links={links} allWorkflows={allWorkflows} />
        <p className="text-xs text-stone-400 mt-2">Click a node for details · Drag to pan · Pinch or use controls to zoom</p>

        {(inputs.length > 0 || outputs.length > 0 || outgoing.length > 0 || incoming.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            <InputsList inputs={inputs} />
            <OutputsList outputs={outputs} />
            <RelatedFlows outgoing={outgoing} incoming={incoming} />
          </div>
        )}
      </section>

    </div>
  )
}
