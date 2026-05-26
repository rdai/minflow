import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSession, isAdmin } from '@/lib/auth'

// POST /api/workflows/[id]/share — regenerate share token
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()

  // Verify ownership (RLS will block non-owner reads, so if we get data they own it)
  const { data: workflow, error: fetchError } = await supabase
    .from('workflows')
    .select('id, created_by')
    .eq('id', id)
    .single()

  if (fetchError || !workflow) {
    // Check if admin can access anyway
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 })
    }
  } else if (workflow.created_by !== session.user.id) {
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  // Generate new token and update via admin client (bypasses RLS for the update)
  const newToken = randomBytes(24).toString('base64url')
  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .from('workflows')
    .update({ share_token: newToken })
    .eq('id', id)
    .select('share_token')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ share_token: data.share_token })
}
