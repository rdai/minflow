import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import ToolForm from "@/components/admin/ToolForm"

export default async function NewToolPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-stone-500 mb-6">
        <Link href="/admin" className="hover:text-stone-700">Admin</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/admin/tools" className="hover:text-stone-700">Tools</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-stone-800 font-medium">New</span>
      </div>
      <h1 className="text-2xl font-bold text-stone-900 mb-8">Create Tool</h1>
      <ToolForm />
    </div>
  )
}
