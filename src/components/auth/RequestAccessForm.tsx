"use client"

import { useState } from "react"

export default function RequestAccessForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [org, setOrg] = useState("")
  const [message, setMessage] = useState("")
  const [referral, setReferral] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/request-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, org, message, referral }),
    })
    const json = await res.json()

    if (!res.ok) {
      setError(json.error || "Something went wrong")
      setLoading(false)
      return
    }

    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-8 text-center">
        <div className="text-3xl mb-3">✓</div>
        <h2 className="font-semibold text-stone-900 mb-2">Request received</h2>
        <p className="text-stone-500 text-sm">
          We'll review your request and if approved, you will receive an invite link to <strong>{email}</strong>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Name *</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          placeholder="you@org.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Organization</label>
        <input
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          placeholder="Wycliffe, IMB, SIL..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">How did you hear about this?</label>
        <input
          value={referral}
          onChange={(e) => setReferral(e.target.value)}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          placeholder="A colleague, conference, social media..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">What brings you here?</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 h-24 resize-none"
          placeholder="Tell us about your ministry context and what you'd like to contribute..."
        />
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Request Access"}
      </button>
    </form>
  )
}
