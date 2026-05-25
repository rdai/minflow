import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { senderName, senderEmail, message } = await req.json()

  if (!senderName || !senderEmail || !message) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: wf } = await supabase
    .from('workflows')
    .select('title, created_by, contact_enabled')
    .eq('id', id)
    .single()

  if (!wf || !wf.contact_enabled) return NextResponse.json({ error: 'Contact not enabled' }, { status: 403 })
  if (!wf.created_by) return NextResponse.json({ error: 'No owner' }, { status: 404 })

  const { data: { user: owner } } = await supabase.auth.admin.getUserById(wf.created_by)
  if (!owner?.email) return NextResponse.json({ error: 'Owner not found' }, { status: 404 })

  const { error } = await resend.emails.send({
    from: 'Mission Workflow Map <noreply@gospelresources.org>',
    to: owner.email,
    replyTo: senderEmail,
    subject: `Message about your workflow: "${wf.title}"`,
    text: `You received a message about your workflow "${wf.title}" on Mission Workflow Map.

From: ${senderName} (${senderEmail})

Message:
${message}

---
Reply to this email to respond directly to ${senderName}.
Their email is shared only with you and is not stored or displayed publicly.`,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
