import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const admin = await isAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { email, requestId } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const supabase = await createClient()

  // Send Supabase invite
  const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email)
  if (inviteError) return NextResponse.json({ error: inviteError.message }, { status: 500 })

  // Mark request as invited
  if (requestId) {
    await supabase.from('access_requests').update({ status: 'invited' }).eq('id', requestId)
  }

  return NextResponse.json({ ok: true })
}
