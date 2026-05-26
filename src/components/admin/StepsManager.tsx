"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Plus, Trash2, ChevronUp, ChevronDown, Wrench, Pencil, Check, X } from "lucide-react"
import type { WorkflowStep, Tool } from "@/types"

interface StepWithTools extends WorkflowStep {
  step_tools?: Array<{ id: string; tool_id: string; role: string | null; notes: string | null; recommended_level: string | null; tool?: Tool }>
}

interface Props {
  workflowId: string
  steps: StepWithTools[]
  allTools: Tool[]
}

export default function StepsManager({ workflowId, steps: initialSteps, allTools }: Props) {
  const [steps, setSteps] = useState(initialSteps)
  const [newTitle, setNewTitle] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function addStep() {
    if (!newTitle.trim()) return
    setLoading(true)
    const nextOrder = steps.length > 0 ? Math.max(...steps.map((s) => s.step_order)) + 1 : 1
    const { data, error } = await supabase
      .from("workflow_steps")
      .insert({ workflow_id: workflowId, title: newTitle, description: newDesc, step_order: nextOrder })
      .select()
      .single()
    if (!error && data) {
      setSteps([...steps, { ...data, step_tools: [] }])
      setNewTitle("")
      setNewDesc("")
    }
    setLoading(false)
    router.refresh()
  }

  async function deleteStep(stepId: string) {
    if (!confirm("Delete this step?")) return
    await supabase.from("workflow_steps").delete().eq("id", stepId)
    setSteps(steps.filter((s) => s.id !== stepId))
    router.refresh()
  }

  async function moveStep(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= steps.length) return
    const updated = [...steps]
    const a = updated[index]
    const b = updated[targetIndex]
    // Swap orders
    const aOrder = a.step_order
    const bOrder = b.step_order
    await Promise.all([
      supabase.from("workflow_steps").update({ step_order: bOrder }).eq("id", a.id),
      supabase.from("workflow_steps").update({ step_order: aOrder }).eq("id", b.id),
    ])
    updated[index] = { ...a, step_order: bOrder }
    updated[targetIndex] = { ...b, step_order: aOrder }
    setSteps(updated.sort((x, y) => x.step_order - y.step_order))
    router.refresh()
  }

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
      {steps.length > 0 && (
        <div className="divide-y divide-stone-100">
          {steps.sort((a, b) => a.step_order - b.step_order).map((step, index) => (
            <StepRow
              key={step.id}
              step={step}
              index={index}
              total={steps.length}
              allTools={allTools}
              onDelete={() => deleteStep(step.id)}
              onMove={(dir) => moveStep(index, dir)}
            />
          ))}
        </div>
      )}
      {steps.length === 0 && (
        <div className="px-4 py-6 text-center text-stone-400 text-sm">No steps yet</div>
      )}

      {/* Add step form */}
      <div className="px-4 py-4 border-t border-stone-100 bg-stone-50">
        <div className="font-medium text-sm text-stone-700 mb-3">Add Step</div>
        <div className="space-y-2">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            placeholder="Step title"
            onKeyDown={(e) => e.key === "Enter" && addStep()}
          />
          <input
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            placeholder="Description (optional)"
          />
          <button
            onClick={addStep}
            disabled={loading || !newTitle.trim()}
            className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add Step
          </button>
        </div>
      </div>
    </div>
  )
}

function StepRow({ step, index, total, allTools, onDelete, onMove }: {
  step: StepWithTools
  index: number
  total: number
  allTools: Tool[]
  onDelete: () => void
  onMove: (dir: "up" | "down") => void
}) {
  const [showTools, setShowTools] = useState(false)
  const [stepTools, setStepTools] = useState(step.step_tools || [])
  const [selectedTool, setSelectedTool] = useState("")
  const [toolRole, setToolRole] = useState("")
  const [toolRec, setToolRec] = useState("optional")
  const [isEditing, setIsEditing] = useState(false)
  const [localTitle, setLocalTitle] = useState(step.title)
  const [localDesc, setLocalDesc] = useState(step.description || "")
  const [editTitle, setEditTitle] = useState("")
  const [editDesc, setEditDesc] = useState("")
  const supabase = createClient()
  const router = useRouter()

  function startEdit() {
    setEditTitle(localTitle)
    setEditDesc(localDesc)
    setIsEditing(true)
  }

  function cancelEdit() {
    setIsEditing(false)
  }

  async function saveEdit() {
    if (!editTitle.trim()) return
    const { error } = await supabase
      .from("workflow_steps")
      .update({ title: editTitle, description: editDesc || null })
      .eq("id", step.id)
    if (!error) {
      setLocalTitle(editTitle)
      setLocalDesc(editDesc)
      setIsEditing(false)
      router.refresh()
    }
  }

  async function addTool() {
    if (!selectedTool) return
    const { data, error } = await supabase
      .from("step_tools")
      .insert({ step_id: step.id, tool_id: selectedTool, role: toolRole || null, recommended_level: toolRec })
      .select("*, tool:tools(*)")
      .single()
    if (!error && data) {
      setStepTools([...stepTools, data as any])
      setSelectedTool("")
      setToolRole("")
      router.refresh()
    }
  }

  async function removeTool(stId: string) {
    await supabase.from("step_tools").delete().eq("id", stId)
    setStepTools(stepTools.filter((t) => t.id !== stId))
    router.refresh()
  }

  return (
    <div className="px-4 py-3">
      {isEditing ? (
        <div className="flex items-start gap-3">
          <span className="bg-purple-100 text-purple-700 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1.5">
            {step.step_order}
          </span>
          <div className="flex-1 space-y-2">
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full border border-blue-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && saveEdit()}
            />
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none h-16"
              placeholder="Description (optional)"
            />
            <div className="flex gap-2">
              <button
                onClick={saveEdit}
                className="flex items-center gap-1 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700"
              >
                <Check className="w-3 h-3" /> Save
              </button>
              <button
                onClick={cancelEdit}
                className="flex items-center gap-1 text-stone-500 text-xs px-3 py-1.5 rounded-lg hover:bg-stone-100"
              >
                <X className="w-3 h-3" /> Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="bg-purple-100 text-purple-700 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">
            {step.step_order}
          </span>
          <div>
            <div className="text-sm font-medium text-stone-800">{localTitle}</div>
            {localDesc && <div className="text-xs text-stone-500 mt-0.5">{localDesc}</div>}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setShowTools(!showTools)} className="text-emerald-500 hover:text-emerald-700 p-1 rounded hover:bg-emerald-50" title="Manage tools">
            <Wrench className="w-4 h-4" />
          </button>
          <button onClick={startEdit} className="text-stone-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50" title="Edit step">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => onMove("up")} disabled={index === 0} className="text-stone-400 hover:text-stone-600 p-1 rounded hover:bg-stone-100 disabled:opacity-30">
            <ChevronUp className="w-4 h-4" />
          </button>
          <button onClick={() => onMove("down")} disabled={index === total - 1} className="text-stone-400 hover:text-stone-600 p-1 rounded hover:bg-stone-100 disabled:opacity-30">
            <ChevronDown className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="text-stone-400 hover:text-red-600 p-1 rounded hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      )}

      {showTools && (
        <div className="mt-3 ml-9 space-y-2">
          {stepTools.map((st) => (
            <div key={st.id} className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
              <div>
                <span className="text-sm font-medium text-emerald-800">{st.tool?.name}</span>
                {st.role && <span className="text-xs text-emerald-600 ml-2">— {st.role}</span>}
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded font-medium ${st.recommended_level === "recommended" ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}>
                  {st.recommended_level}
                </span>
              </div>
              <button onClick={() => removeTool(st.id)} className="text-stone-400 hover:text-red-600 p-0.5 rounded">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="border border-stone-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-400 bg-white flex-1 min-w-32"
            >
              <option value="">Select tool...</option>
              {allTools.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <input
              value={toolRole}
              onChange={(e) => setToolRole(e.target.value)}
              className="border border-stone-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-400 flex-1 min-w-24"
              placeholder="Role (e.g. Primary tool)"
            />
            <select
              value={toolRec}
              onChange={(e) => setToolRec(e.target.value)}
              className="border border-stone-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-400 bg-white"
            >
              <option value="recommended">Recommended</option>
              <option value="optional">Optional</option>
            </select>
            <button
              onClick={addTool}
              disabled={!selectedTool}
              className="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
