import { getWorkflows } from "@/lib/queries"
import WorkflowBrowser from "@/components/workflow/WorkflowBrowser"
import Link from "next/link"
import { Map } from "lucide-react"

export default async function HomePage() {
  let workflows: Awaited<ReturnType<typeof getWorkflows>> = []
  try {
    workflows = await getWorkflows()
  } catch {
    // Supabase not yet configured
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Compact header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Map className="w-5 h-5 text-blue-500" />
            <h1 className="text-2xl font-bold text-stone-900">Mission Workflow Map</h1>
          </div>
          <p className="text-stone-500">
            Explore ministry workflows — what they need, how they connect, and what tools to use.
            {" "}
            <Link href="/tools" className="text-blue-600 hover:underline">Browse tools →</Link>
          </p>
        </div>
      </div>

      <WorkflowBrowser workflows={workflows} />
    </div>
  )
}
