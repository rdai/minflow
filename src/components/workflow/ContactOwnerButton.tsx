"use client"

import { useState } from "react"
import { Mail, X } from "lucide-react"

export default function ContactOwnerButton({ workflowId, workflowTitle }: { workflowId: string; workflowTitle: string }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await fetch(`/api/workflows/${workflowId}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderName: name, senderEmail: email, message }),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error); setLoading(false); return }
    setDone(true)
    setLoading(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-stone-900 border border-stone-300 bg-stone-50 hover:bg-stone-100 rounded-lg px-3 py-2 transition-colors shadow-sm"
      >
        <Mail className="w-4 h-4" /> Contact owner
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-stone-900">Contact about "{workflowTitle}"</h3>
              <button onClick={() => setOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {done ? (
              <div className="text-center py-6">
                <div className="text-3xl mb-3">✓</div>
                <p className="text-stone-600 text-sm">Message sent. The workflow owner will reach out if they're able.</p>
                <button onClick={() => setOpen(false)} className="mt-4 text-blue-600 text-sm hover:underline">Close</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Your name *</label>
                  <input
                    value={name} onChange={(e) => setName(e.target.value)} required
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Your email *</label>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  />
                  <p className="text-xs text-stone-400 mt-1">Shared only with the workflow owner so they can reply.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Message *</label>
                  <textarea
                    value={message} onChange={(e) => setMessage(e.target.value)} required
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 h-24 resize-none"
                  />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button
                  type="submit" disabled={loading}
                  className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 text-sm disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
