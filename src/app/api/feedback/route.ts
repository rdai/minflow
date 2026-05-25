import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json()
  if (!message?.trim()) return NextResponse.json({ error: 'Message required' }, { status: 400 })

  const resend = new Resend(process.env.RESEND_API_KEY)
  const adminEmail = process.env.ADMIN_EMAIL ?? 'oappdeveloper@gmail.com'

  const { error } = await resend.emails.send({
    from: 'Mission Workflow Map <noreply@gospelresources.org>',
    to: adminEmail,
    replyTo: email || undefined,
    subject: 'Site Feedback',
    text: [
      `From: ${name || 'Anonymous'}${email ? ` <${email}>` : ''}`,
      '',
      message,
    ].join('\n'),
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
