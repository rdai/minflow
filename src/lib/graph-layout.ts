import dagre from "dagre"
import { MarkerType } from "@xyflow/react"
import type { Workflow, WorkflowStep, WorkflowInput, WorkflowOutput, StepTool, WorkflowLink } from "@/types"

const NODE_WIDTH = 200
const NODE_HEIGHT = 60

const relationshipColors: Record<string, string> = {
  enables: "#22c55e",
  feeds_into: "#3b82f6",
  requires: "#f59e0b",
  alternative_to: "#94a3b8",
}

const relationshipLabels: Record<string, string> = {
  enables: "enables",
  feeds_into: "feeds into",
  requires: "requires",
  alternative_to: "alt to",
}

export function buildGraphLayout(
  workflow: Workflow,
  steps: (WorkflowStep & { tools: StepTool[] })[],
  inputs: WorkflowInput[],
  outputs: WorkflowOutput[],
  links: WorkflowLink[],
  allWorkflows: Workflow[]
) {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: "LR", ranksep: 80, nodesep: 30, marginx: 30, marginy: 30 })

  const nodes: any[] = []
  const edges: any[] = []

  // === INPUTS (column 1) ===
  inputs.forEach((input) => {
    const id = `input-${input.id}`
    g.setNode(id, { width: NODE_WIDTH, height: NODE_HEIGHT })
    nodes.push({
      id,
      type: "input",
      data: {
        label: input.title,
        nodeType: "input",
        description: input.description,
      },
      position: { x: 0, y: 0 },
    })
  })

  // === STEPS (column 2-3) ===
  steps.forEach((step) => {
    const stepId = `step-${step.id}`
    g.setNode(stepId, { width: NODE_WIDTH, height: NODE_HEIGHT })
    nodes.push({
      id: stepId,
      type: "step",
      data: {
        label: step.title,
        nodeType: "step",
        description: step.description,
        stepOrder: step.step_order,
        tools: step.tools,
      },
      position: { x: 0, y: 0 },
    })

    // Connect inputs to first step
    if (step.step_order === 1 && inputs.length > 0) {
      inputs.forEach((input) => {
        edges.push({
          id: `e-input-${input.id}-${stepId}`,
          source: `input-${input.id}`,
          target: stepId,
          type: "smoothstep",
          style: { stroke: "#d6d3d1", strokeWidth: 1.5, strokeDasharray: "4" },
          animated: false,
        })
      })
    }

    // Connect steps sequentially
    const prevStep = steps.find((s) => s.step_order === step.step_order - 1)
    if (prevStep) {
      edges.push({
        id: `e-step-${prevStep.id}-${step.id}`,
        source: `step-${prevStep.id}`,
        target: stepId,
        type: "smoothstep",
        style: { stroke: "#8b5cf6", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#8b5cf6" },
      })
    }

    // === TOOLS (attached to steps) ===
    step.tools.forEach((st) => {
      if (!st.tool) return
      const toolId = `tool-${st.tool.id}-step-${step.id}`
      g.setNode(toolId, { width: NODE_WIDTH, height: NODE_HEIGHT })
      nodes.push({
        id: toolId,
        type: "tool",
        data: {
          label: st.tool.name,
          nodeType: "tool",
          description: st.tool.description,
          url: st.tool.url,
          cost_level: st.tool.cost_level,
          difficulty_level: st.tool.difficulty_level,
          offline_capable: st.tool.offline_capable,
          notes: st.notes || st.tool.notes,
          recommended_level: st.recommended_level,
        },
        position: { x: 0, y: 0 },
      })
      edges.push({
        id: `e-${stepId}-${toolId}`,
        source: stepId,
        target: toolId,
        type: "smoothstep",
        style: { stroke: "#10b981", strokeWidth: 1.5, strokeDasharray: "3" },
        label: st.role || "uses",
        labelStyle: { fontSize: 10, fill: "#6b7280" },
        labelBgStyle: { fill: "#f0fdf4" },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
      })
    })
  })

  // === OUTPUTS (last column) ===
  outputs.forEach((output) => {
    const id = `output-${output.id}`
    g.setNode(id, { width: NODE_WIDTH, height: NODE_HEIGHT })
    nodes.push({
      id,
      type: "output",
      data: {
        label: output.title,
        nodeType: "output",
        description: output.description,
      },
      position: { x: 0, y: 0 },
    })

    // Connect last step to outputs
    const lastStep = steps[steps.length - 1]
    if (lastStep) {
      edges.push({
        id: `e-step-${lastStep.id}-output-${output.id}`,
        source: `step-${lastStep.id}`,
        target: id,
        type: "smoothstep",
        style: { stroke: "#ef4444", strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" },
      })
    }
  })

  // === DOWNSTREAM WORKFLOWS ===
  const downstreamLinks = links.filter((l) => l.source_workflow_id === workflow.id)
  downstreamLinks.forEach((link) => {
    const targetWorkflow = allWorkflows.find((w) => w.id === link.target_workflow_id)
    if (!targetWorkflow) return

    const wfNodeId = `workflow-${link.target_workflow_id}`
    if (!g.hasNode(wfNodeId)) {
      g.setNode(wfNodeId, { width: NODE_WIDTH + 20, height: NODE_HEIGHT })
      nodes.push({
        id: wfNodeId,
        type: "workflow",
        data: {
          label: targetWorkflow.title,
          nodeType: "workflow",
          description: targetWorkflow.description,
          slug: targetWorkflow.slug,
          relationshipType: link.relationship_type,
        },
        position: { x: 0, y: 0 },
      })
    }

    // Connect from an output to downstream workflow
    const sourceNodeId = outputs.length > 0 ? `output-${outputs[0].id}` : `step-${steps[steps.length - 1]?.id}`
    if (sourceNodeId) {
      const color = relationshipColors[link.relationship_type] || "#94a3b8"
      edges.push({
        id: `e-link-${link.id}`,
        source: sourceNodeId,
        target: wfNodeId,
        type: "smoothstep",
        style: { stroke: color, strokeWidth: 2 },
        label: relationshipLabels[link.relationship_type] || link.relationship_type,
        labelStyle: { fontSize: 10, fill: color, fontWeight: 600 },
        labelBgStyle: { fill: "white", fillOpacity: 0.9 },
        markerEnd: { type: MarkerType.ArrowClosed, color },
        animated: link.relationship_type === "feeds_into",
      })
    }
  })

  // Run dagre layout
  nodes.forEach((node) => {
    if (!g.hasNode(node.id)) {
      g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
    }
  })
  edges.forEach((edge) => {
    if (g.hasNode(edge.source) && g.hasNode(edge.target)) {
      g.setEdge(edge.source, edge.target)
    }
  })

  dagre.layout(g)

  const positionedNodes = nodes.map((node) => {
    const pos = g.node(node.id)
    return {
      ...node,
      position: {
        x: pos ? pos.x - NODE_WIDTH / 2 : 0,
        y: pos ? pos.y - NODE_HEIGHT / 2 : 0,
      },
    }
  })

  return { nodes: positionedNodes, edges }
}
