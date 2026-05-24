import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Workflow } from "@/types"

interface Props {
  workflow: Workflow
  icon: React.ReactNode
  colorClass: string
  badge?: string  // shows the "other axis" — medium when grouped by goal, goal when grouped by medium
}

const difficultyLabel: Record<string, string> = {
  beginner: "Beginner friendly",
  intermediate: "Some experience needed",
  advanced: "Experienced teams",
}

export default function WorkflowCard({ workflow, icon, colorClass, badge }: Props) {
  return (
    <Link
      href={`/workflows/${workflow.slug}`}
      className={`border rounded-xl p-5 hover:shadow-md transition-all group ${colorClass}`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="font-semibold text-base leading-tight">{workflow.title}</h3>
        </div>
        {badge && (
          <span className="text-xs font-medium bg-white/60 px-2 py-0.5 rounded-full opacity-70 shrink-0 whitespace-nowrap">
            {badge}
          </span>
        )}
      </div>
      {workflow.description && (
        <p className="text-sm opacity-80 leading-relaxed line-clamp-2 mb-3">
          {workflow.description}
        </p>
      )}
      <div className="flex items-center justify-between">
        {workflow.difficulty && (
          <span className="text-xs opacity-50 font-medium">
            {difficultyLabel[workflow.difficulty] || workflow.difficulty}
          </span>
        )}
        <span className="flex items-center gap-1 text-xs font-medium opacity-60 group-hover:opacity-100 transition-opacity ml-auto">
          View <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  )
}
