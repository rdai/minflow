"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Map, Settings, LayoutDashboard } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"

export default function Nav() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const links = [
    { href: "/", label: "Workflows" },
    { href: "/tools", label: "Tools" },
  ]

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-stone-900">
            <Map className="w-5 h-5 text-blue-600" />
            <span>Mission Workflow Map</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-blue-50 text-blue-700"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith("/dashboard")
                    ? "bg-blue-50 text-blue-700"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">My Workflows</span>
              </Link>
            ) : (
              <Link
                href="/request-access"
                className="ml-1 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Contribute
              </Link>
            )}

            <Link
              href="/admin"
              className="ml-2 px-3 py-2 rounded-lg text-sm text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors flex items-center gap-1"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
