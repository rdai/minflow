"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, ExternalLink, Maximize2, Kanban } from "lucide-react"
import WorkflowGraph from "@/components/graph/WorkflowGraph"
import ContactOwnerButton from "@/components/workflow/ContactOwnerButton"
import CloneButton from "@/components/workflow/CloneButton"
import type { Workflow } from "@/types"

type Layout = "classic" | "hero" | "kanban"

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
  steps: any[]
  inputs: any[]
  outputs: any[]
  links: any[]
  allWorkflows: Workflow[]
  outgoing: any[]
  incoming: any[]
  isLoggedIn: boolean
}

const LAYOUT_KEY = "mf_workflow_layout"

export default function WorkflowDetailView({
  workflow, steps, inputs, outputs, links, allWorkflows, outgoing, incoming, isLoggedIn
}: Props) {
  const [layout, setLayout] = useState<Layout>("hero")

  // Restore persisted layout on mount
  useEffect(() => {
    const saved = localStorage.getItem(LAYOUT_KEY) as Layout | null
    if (saved === "hero" || saved === "kanban") setLayout(saved)
  }, [])

  function switchLayout(l: Layout) {
    setLayout(l)
    localStorage.setItem(LAYOUT_KEY, l)
  }

  // Classic kept in code but not shown in UI
  const layoutButtons: { id: Layout; icon: React.ReactNode; label: string }[] = [
    { id: "hero",   icon: <Maximize2 className="w-4 h-4" />, label: "Map" },
    { id: "kanban", icon: <Kanban className="w-4 h-4" />,    label: "Kanban" },
  ]

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

        {/* Controls: all actions right-aligned */}
        <div className="shrink-0 flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-xl p-1.5 shadow-sm">
            {layoutButtons.map(btn => (
              <button
                key={btn.id}
                onClick={() => switchLayout(btn.id)}
                title={btn.label}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  layout === btn.id
                    ? "bg-white text-stone-900 shadow-sm ring-1 ring-stone-200"
                    : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
                }`}
              >
                {btn.icon}
                {btn.label}
              </button>
            ))}
          </div>
          {isLoggedIn && <CloneButton workflowId={workflow.id} />}
          {workflow.contact_enabled && (
            <ContactOwnerButton workflowId={workflow.id} workflowTitle={workflow.title} />
          )}
        </div>
      </div>

      {layout === "classic" && (
        <ClassicLayout
          workflow={workflow} steps={steps} inputs={inputs} outputs={outputs}
          links={links} allWorkflows={allWorkflows} outgoing={outgoing} incoming={incoming}
        />
      )}
      {layout === "hero" && (
        <HeroLayout
          workflow={workflow} steps={steps} inputs={inputs} outputs={outputs}
          links={links} allWorkflows={allWorkflows} outgoing={outgoing} incoming={incoming}
        />
      )}
      {layout === "kanban" && (
        <KanbanLayout
          workflow={workflow} steps={steps} inputs={inputs} outputs={outputs}
          links={links} allWorkflows={allWorkflows} outgoing={outgoing} incoming={incoming}
        />
      )}
    </div>
  )
}

/* ─── Shared sub-components ─── */

function InputsList({ inputs }: { inputs: any[] }) {
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

function OutputsList({ outputs }: { outputs: any[] }) {
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

function RelatedFlows({ outgoing, incoming }: { outgoing: any[]; incoming: any[] }) {
  if (!outgoing.length && !incoming.length) return null
  return (
    <div className="space-y-4">
      {outgoing.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-stone-800 mb-3">What comes next</h2>
          <div className="space-y-2">
            {outgoing.map((link: any) => (
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
            {incoming.map((link: any) => (
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

function StepsList({ steps }: { steps: any[] }) {
  if (!steps.length) return null
  return (
    <div className="space-y-4">
      {steps.map(step => (
        <div key={step.id} className="border border-stone-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 bg-stone-50 border-b border-stone-100">
            <span className="bg-purple-100 text-purple-700 text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0">
              {step.step_order}
            </span>
            <h3 className="font-semibold text-stone-800">{step.title}</h3>
          </div>
          <div className="px-4 py-3">
            {step.description && <p className="text-sm text-stone-600 mb-3">{step.description}</p>}
            {step.tools.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-stone-400 mb-2 uppercase tracking-wide">Tools</div>
                <div className="flex flex-wrap gap-2">
                  {step.tools.map((st: any) => st.tool && (
                    <ToolChip key={st.id} st={st} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function ToolChip({ st }: { st: any }) {
  return (
    <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5">
      <span className="text-sm font-medium text-emerald-800">{st.tool.name}</span>
      {st.tool.url && (
        <a href={st.tool.url} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-700">
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
      {st.recommended_level === "recommended" && (
        <span className="text-xs bg-green-100 text-green-700 px-1 rounded font-medium">★</span>
      )}
      {st.tool.cost_level && (
        <span className={`text-xs px-1 rounded font-medium ${costColors[st.tool.cost_level] || ""}`}>
          {st.tool.cost_level}
        </span>
      )}
    </div>
  )
}

/* ─── Layout 1: Classic ─── */
function ClassicLayout({ workflow, steps, inputs, outputs, links, allWorkflows, outgoing, incoming }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <InputsList inputs={inputs} />
        <OutputsList outputs={outputs} />
        <RelatedFlows outgoing={outgoing} incoming={incoming} />
      </div>
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h2 className="text-base font-bold text-stone-800 mb-3">Visual Map</h2>
          <WorkflowGraph workflow={workflow} steps={steps} inputs={inputs} outputs={outputs} links={links} allWorkflows={allWorkflows} />
          <p className="text-xs text-stone-400 mt-2">Click a node for details · Drag to pan · Pinch or use controls to zoom</p>
        </div>
        {steps.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-stone-800 mb-4">Steps</h2>
            <StepsList steps={steps} />
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Layout 2: Map Hero ─── */
function HeroLayout({ workflow, steps, inputs, outputs, links, allWorkflows, outgoing, incoming }: any) {
  return (
    <div className="space-y-8">
      {/* Full-width map */}
      <div>
        <h2 className="text-base font-bold text-stone-800 mb-3">Visual Map</h2>
        <WorkflowGraph workflow={workflow} steps={steps} inputs={inputs} outputs={outputs} links={links} allWorkflows={allWorkflows} />
        <p className="text-xs text-stone-400 mt-2">Click any node to see details</p>
      </div>
      {/* Steps + metadata below */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {steps.length > 0 && (
          <div className="lg:col-span-2">
            <h2 className="text-base font-bold text-stone-800 mb-4">Steps</h2>
            <StepsList steps={steps} />
          </div>
        )}
        <div className="lg:col-span-1 space-y-6">
          <InputsList inputs={inputs} />
          <OutputsList outputs={outputs} />
          <RelatedFlows outgoing={outgoing} incoming={incoming} />
        </div>
      </div>
    </div>
  )
}

/* ─── Layout 3: Kanban ─── */
function KanbanLayout({ workflow, steps, inputs, outputs, links, allWorkflows, outgoing, incoming }: any) {
  return (
    <div className="space-y-8">
      {/* Map flanked by inputs/outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
        {/* Inputs */}
        <div className="lg:col-span-1 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-3">Inputs</div>
          {inputs.length > 0 ? (
            <ul className="space-y-2">
              {inputs.map((i: any) => (
                <li key={i.id} className="text-sm text-stone-700">
                  <span className="font-medium">{i.title}</span>
                  {i.description && <p className="text-xs text-stone-500 mt-0.5">{i.description}</p>}
                </li>
              ))}
            </ul>
          ) : <p className="text-xs text-stone-400">None listed</p>}
        </div>

        {/* Map center */}
        <div className="lg:col-span-3">
          <WorkflowGraph workflow={workflow} steps={steps} inputs={inputs} outputs={outputs} links={links} allWorkflows={allWorkflows} />
          <p className="text-xs text-stone-400 mt-2 text-center">Click a node for details · Drag to pan · Pinch or use controls to zoom</p>
        </div>

        {/* Outputs */}
        <div className="lg:col-span-1 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="text-xs font-bold text-red-700 uppercase tracking-wide mb-3">Outputs</div>
          {outputs.length > 0 ? (
            <ul className="space-y-2">
              {outputs.map((o: any) => (
                <li key={o.id} className="text-sm text-stone-700">
                  <span className="font-medium">{o.title}</span>
                  {o.description && <p className="text-xs text-stone-500 mt-0.5">{o.description}</p>}
                </li>
              ))}
            </ul>
          ) : <p className="text-xs text-stone-400">None listed</p>}
        </div>
      </div>

      {/* Horizontal kanban steps */}
      {steps.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-stone-800 mb-4">Steps</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {steps.map((step: any) => (
              <div key={step.id} className="shrink-0 w-64 border border-stone-200 rounded-xl bg-white overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 border-b border-stone-100">
                  <span className="bg-purple-100 text-purple-700 text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                    {step.step_order}
                  </span>
                  <h3 className="font-semibold text-stone-800 text-sm leading-tight">{step.title}</h3>
                </div>
                <div className="px-4 py-3 space-y-3">
                  {step.description && (
                    <p className="text-xs text-stone-600">{step.description}</p>
                  )}
                  {step.tools.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Tools</div>
                      {step.tools.map((st: any) => st.tool && (
                        <div key={st.id} className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1.5 text-xs">
                          <span className="font-medium text-emerald-800">{st.tool.name}</span>
                          {st.tool.url && (
                            <a href={st.tool.url} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-700 ml-auto">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {st.tool.cost_level && (
                            <span className={`px-1 rounded font-medium ${costColors[st.tool.cost_level] || ""}`}>
                              {st.tool.cost_level}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related flows at bottom */}
      {(outgoing.length > 0 || incoming.length > 0) && (
        <div className="border-t border-stone-100 pt-6">
          <RelatedFlows outgoing={outgoing} incoming={incoming} />
        </div>
      )}
    </div>
  )
}
