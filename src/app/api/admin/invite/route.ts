import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const admin = await isAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { email, requestId } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const supabase = await createClient()
  const adminClient = createAdminClient()

  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://minflow.gospelresources.org'}/accept-invite`

  // generateLink creates a fresh OTP and returns the action link — works for new and re-invited users
  const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
    type: 'invite',
    email,
    options: { redirectTo },
  })

  if (linkError) return NextResponse.json({ error: linkError.message }, { status: 500 })

  // Send email manually via Resend (generateLink does not send email itself)
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  const actionLink = linkData.properties?.action_link
  const { error: emailError } = await resend.emails.send({
    from: 'Mission Workflow Map <noreply@gospelresources.org>',
    to: email,
    subject: "You're invited to Mission Workflow Map",
    text: `You've been invited to contribute to Mission Workflow Map.\n\nAccept your invitation and set a password here:\n${actionLink}\n\nThis link expires in 24 hours.`,
  })

  if (emailError) return NextResponse.json({ error: emailError.message }, { status: 500 })

  // Mark request as invited
  if (requestId) {
    await supabase.from('access_requests').update({ status: 'invited' }).eq('id', requestId)
  }

  return NextResponse.json({ ok: true })
}
