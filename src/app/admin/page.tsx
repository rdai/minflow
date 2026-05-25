import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Settings, BookOpen, Wrench, ArrowRight, LogOut, Users } from "lucide-react"

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Quick counts
  let workflowCount = 0, toolCount = 0, requestCount = 0
  try {
    const [wf, tl, rq] = await Promise.all([
      supabase.from("workflows").select("id", { count: "exact", head: true }),
      supabase.from("tools").select("id", { count: "exact", head: true }),
      supabase.from("access_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
    ])
    workflowCount = wf.count || 0
    toolCount = tl.count || 0
    requestCount = rq.count || 0
  } catch {}

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-stone-500" />
            <h1 className="text-2xl font-bold text-stone-900">Admin</h1>
          </div>
          <p className="text-stone-500">Signed in as {user.email}</p>
        </div>
        <form action="/admin/logout" method="post">
          <button className="flex items-center gap-2 text-stone-500 hover:text-stone-700 text-sm border border-stone-200 px-3 py-2 rounded-lg hover:bg-stone-50">
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href="/admin/workflows"
          className="block border border-stone-200 rounded-xl p-6 bg-white hover:shadow-md hover:border-blue-200 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-blue-400 transition-colors" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-1">Workflows</h2>
          <p className="text-stone-500 text-sm mb-4">Create, edit, and connect ministry workflows</p>
          <div className="text-2xl font-bold text-blue-600">{workflowCount}</div>
          <div className="text-xs text-stone-400">workflows in database</div>
        </Link>

        <Link
          href="/admin/tools"
          className="block border border-stone-200 rounded-xl p-6 bg-white hover:shadow-md hover:border-emerald-200 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
              <Wrench className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-emerald-400 transition-colors" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-1">Tools</h2>
          <p className="text-stone-500 text-sm mb-4">Manage tools and attach them to workflow steps</p>
          <div className="text-2xl font-bold text-emerald-600">{toolCount}</div>
          <div className="text-xs text-stone-400">tools in database</div>
        </Link>

        <Link
          href="/admin/requests"
          className="block border border-stone-200 rounded-xl p-6 bg-white hover:shadow-md hover:border-violet-200 transition-all group col-span-1 sm:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-violet-50 text-violet-600 p-3 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2">
              {requestCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {requestCount} pending
                </span>
              )}
              <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-violet-400 transition-colors" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-1">Access Requests</h2>
          <p className="text-stone-500 text-sm">Review and invite contributors</p>
        </Link>
      </div>

      <div className="mt-8 p-4 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-500">
        <strong className="text-stone-700">Quick links:</strong>{" "}
        <Link href="/workflows" className="text-blue-600 hover:underline">View public workflows</Link>
        {" · "}
        <Link href="/tools" className="text-blue-600 hover:underline">View public tools</Link>
      </div>
    </div>
  )
}
