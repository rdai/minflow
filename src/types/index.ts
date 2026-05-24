export interface Workflow {
  id: string
  title: string
  slug: string
  description: string | null
  category: string | null   // ministry goal: Scripture Access / Evangelism / Follow-up / Discipleship
  medium: string | null     // output medium: Text / Audio / Film / Digital / Print / In-Person / Mixed
  difficulty: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
}

export interface WorkflowStep {
  id: string
  workflow_id: string
  title: string
  description: string | null
  step_order: number
  created_at: string
  updated_at: string
}

export interface WorkflowOutput {
  id: string
  workflow_id: string
  title: string
  description: string | null
}

export interface WorkflowInput {
  id: string
  workflow_id: string
  title: string
  description: string | null
}

export interface Tool {
  id: string
  name: string
  slug: string
  description: string | null
  url: string | null
  category: string | null
  cost_level: 'free' | 'freemium' | 'paid' | null
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | null
  offline_capable: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface StepTool {
  id: string
  step_id: string
  tool_id: string
  role: string | null
  notes: string | null
  recommended_level: string | null
  tool?: Tool
}

export interface WorkflowLink {
  id: string
  source_workflow_id: string
  target_workflow_id: string
  relationship_type: 'enables' | 'requires' | 'feeds_into' | 'alternative_to'
  description: string | null
}

export type RelationshipType = 'enables' | 'requires' | 'feeds_into' | 'alternative_to'

export type NodeType = 'workflow' | 'step' | 'tool' | 'output' | 'input'

export interface GraphNodeData {
  label: string
  nodeType: NodeType
  description?: string | null
  url?: string | null
  cost_level?: string | null
  difficulty_level?: string | null
  offline_capable?: boolean
  notes?: string | null
  inputs?: WorkflowInput[]
  outputs?: WorkflowOutput[]
  tools?: StepTool[]
  relatedWorkflows?: WorkflowLink[]
}
