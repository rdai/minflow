"use client"

import { useCallback, useState } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Node,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import type { WorkflowStep, WorkflowInput, WorkflowOutput, StepTool, WorkflowLink, Workflow } from "@/types"
import NodePanel from "./NodePanel"
import { buildGraphLayout } from "@/lib/graph-layout"
import WorkflowNode from "./nodes/WorkflowNode"
import IONode from "./nodes/IONode"

interface Props {
  workflow: Workflow
  steps: (WorkflowStep & { tools: StepTool[] })[]
  inputs: WorkflowInput[]
  outputs: WorkflowOutput[]
  links: WorkflowLink[]
  allWorkflows: Workflow[]
}

const nodeTypes = {
  workflow: WorkflowNode,
  input: IONode,
  output: IONode,
}

export default function WorkflowGraph({ workflow, steps, inputs, outputs, links, allWorkflows }: Props) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const { nodes: layoutNodes, edges: layoutEdges } = buildGraphLayout(
    workflow, steps, inputs, outputs, links, allWorkflows
  )

  const [nodes, , onNodesChange] = useNodesState(layoutNodes)
  const [edges, , onEdgesChange] = useEdgesState(layoutEdges)

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  return (
    <div className="relative w-full h-[440px] rounded-xl overflow-hidden border border-stone-200 bg-stone-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={2}
        attributionPosition="bottom-right"
        zoomOnScroll={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Background color="#e7e5e0" gap={20} size={1} />
        <Controls showInteractive={false} className="bg-white border border-stone-200 rounded-lg shadow-sm" />
      </ReactFlow>

      {/* Side Panel */}
      {selectedNode && (
        <NodePanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  )
}
