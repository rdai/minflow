import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const { name, email, org, message } = await req.json()
  if (!name || !email) return NextResponse.json({ error: 'Name and email required' }, { status: 400 })

  const supabase = await createClient()
  const { error } = await supabase
    .from('access_requests')
    .insert({ name, email, org: org || null, message: message || null })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Notify admin
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Mission Workflow Map <noreply@gospelresources.org>',
      to: process.env.ADMIN_EMAIL || 'oappdeveloper@gmail.com',
      subject: `New access request from ${name}`,
      text: `New access request on Mission Workflow Map.

Name: ${name}
Email: ${email}
Org: ${org || '—'}

Message:
${message || '—'}

Review and invite at: https://minflow.gospelresources.org/admin/requests`,
    })
  } catch (e) {
    // Don't fail the request if email fails
    console.error('[request-access notify]', e)
  }

  return NextResponse.json({ ok: true })
}
