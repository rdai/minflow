import dagre from "dagre"
import { MarkerType } from "@xyflow/react"
import type { Edge, Node } from "@xyflow/react"
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

  const nodes: Node[] = []
  const edges: Edge[] = []

  const workflowNodeId = `workflow-${workflow.id}`
  const toolCount = new Set(
    steps.flatMap((step) => step.tools.map((stepTool) => stepTool.tool_id))
  ).size

  g.setNode(workflowNodeId, { width: NODE_WIDTH + 40, height: NODE_HEIGHT + 20 })
  nodes.push({
    id: workflowNodeId,
    type: "workflow",
    data: {
      label: workflow.title,
      nodeType: "workflow",
      description: workflow.description,
      isCurrent: true,
      stepCount: steps.length,
      toolCount,
    },
    position: { x: 0, y: 0 },
  })

  // Inputs lead into the current workflow.
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
    edges.push({
      id: `e-input-${input.id}-${workflow.id}`,
      source: id,
      target: workflowNodeId,
      type: "smoothstep",
      style: { stroke: "#d6d3d1", strokeWidth: 1.5, strokeDasharray: "4" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#d6d3d1" },
    })
  })

  // Outputs are results of the workflow, rather than individual steps.
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
    edges.push({
      id: `e-workflow-${workflow.id}-output-${output.id}`,
      source: workflowNodeId,
      target: id,
      type: "smoothstep",
      style: { stroke: "#ef4444", strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" },
    })
  })

  // Linked workflows are shown as workflow-level relationships. A link does
  // not identify a particular output, so it originates from the workflow.
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
          isCurrent: false,
        },
        position: { x: 0, y: 0 },
      })
    }

    const color = relationshipColors[link.relationship_type] || "#94a3b8"
    edges.push({
      id: `e-link-${link.id}`,
      source: workflowNodeId,
      target: wfNodeId,
      type: "smoothstep",
      style: { stroke: color, strokeWidth: 2 },
      label: relationshipLabels[link.relationship_type] || link.relationship_type,
      labelStyle: { fontSize: 10, fill: color, fontWeight: 600 },
      labelBgStyle: { fill: "white", fillOpacity: 0.9 },
      markerEnd: { type: MarkerType.ArrowClosed, color },
      animated: link.relationship_type === "feeds_into",
    })
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
