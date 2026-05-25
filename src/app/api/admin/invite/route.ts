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

  // Try generateLink first — works for both new and already-invited users
  const { error: linkError } = await adminClient.auth.admin.generateLink({
    type: 'invite',
    email,
    options: { redirectTo },
  })

  if (linkError) {
    // Fall back to inviteUserByEmail for truly new users if generateLink fails
    const { error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, { redirectTo })
    if (inviteError) {
      const msg = inviteError.message.toLowerCase()
      const alreadyExists = msg.includes('already') || msg.includes('not allowed') || msg.includes('exists')
      if (!alreadyExists) return NextResponse.json({ error: inviteError.message }, { status: 500 })
    }
  }

  // Mark request as invited
  if (requestId) {
    await supabase.from('access_requests').update({ status: 'invited' }).eq('id', requestId)
  }

  return NextResponse.json({ ok: true })
}
