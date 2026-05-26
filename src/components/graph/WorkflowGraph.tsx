"use client"

import { useCallback, useState, useEffect } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
  Panel,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import type { WorkflowStep, WorkflowInput, WorkflowOutput, StepTool, WorkflowLink, Workflow } from "@/types"
import NodePanel from "./NodePanel"
import { buildGraphLayout } from "@/lib/graph-layout"
import WorkflowNode from "./nodes/WorkflowNode"
import StepNode from "./nodes/StepNode"
import ToolNode from "./nodes/ToolNode"
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
  step: StepNode,
  tool: ToolNode,
  input: IONode,
  output: IONode,
}

export default function WorkflowGraph({ workflow, steps, inputs, outputs, links, allWorkflows }: Props) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const { nodes: layoutNodes, edges: layoutEdges } = buildGraphLayout(
    workflow, steps, inputs, outputs, links, allWorkflows
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutEdges)

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-stone-200 bg-stone-50">
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
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case "workflow": return "#3b82f6"
              case "step": return "#8b5cf6"
              case "tool": return "#10b981"
              case "input": return "#f59e0b"
              case "output": return "#ef4444"
              default: return "#94a3b8"
            }
          }}
          className="bg-white border border-stone-200 rounded-lg shadow-sm"
        />

        {/* Legend */}
        <Panel position="top-left" className="bg-white/90 backdrop-blur-sm border border-stone-200 rounded-xl p-3 shadow-sm">
          <div className="text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">Legend</div>
          <div className="space-y-1.5 text-xs">
            {[
              { color: "bg-amber-100 border-amber-300", label: "Input" },
              { color: "bg-purple-100 border-purple-300", label: "Step" },
              { color: "bg-emerald-100 border-emerald-300", label: "Tool" },
              { color: "bg-red-100 border-red-300", label: "Output" },
              { color: "bg-blue-100 border-blue-300", label: "Linked Workflow" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded border ${item.color}`} />
                <span className="text-stone-600">{item.label}</span>
              </div>
            ))}
          </div>
        </Panel>
      </ReactFlow>

      {/* Side Panel */}
      {selectedNode && (
        <NodePanel
          node={selectedNode}
          allWorkflows={allWorkflows}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  )
}
