"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function AcceptInviteForm() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const [ready, setReady] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // @supabase/ssr doesn't auto-parse hash tokens — do it manually
    const hash = window.location.hash
    if (hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1))
      const access_token = params.get('access_token')
      const refresh_token = params.get('refresh_token')
      if (access_token && refresh_token) {
        supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
          if (!error) setReady(true)
        })
        return
      }
    }

    // Fallback: check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "PASSWORD_RECOVERY") {
        setReady(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError("Passwords don't match"); return }
    if (password.length < 8) { setError("Must be at least 8 characters"); return }
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false); return }

    setDone(true)
    setTimeout(() => router.push("/dashboard"), 2000)
  }

  if (done) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-8 text-center">
        <div className="text-3xl mb-3">✓</div>
        <p className="text-stone-600">Account set up. Taking you to your dashboard...</p>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-8 text-center text-stone-400 text-sm">
        Verifying invite link...
        <p className="mt-3 text-xs text-stone-300">
          Link expired?{" "}
          <a href="/request-access" className="text-blue-500 hover:underline">Request access again</a>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          placeholder="At least 8 characters"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Confirm password</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 text-sm disabled:opacity-60"
      >
        {loading ? "Setting up..." : "Create Account"}
      </button>
    </form>
  )
}
