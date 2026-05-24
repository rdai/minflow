"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Map, BookOpen, Wrench, Settings } from "lucide-react"

export default function Nav() {
  const pathname = usePathname()

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
