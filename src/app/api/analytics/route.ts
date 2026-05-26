import { NextRequest, NextResponse } from 'next/server'
import { logEvent } from '@/lib/analytics'

export async function POST(req: NextRequest) {
  const { event, workflow_id, properties } = await req.json()
  if (!event) return NextResponse.json({ error: 'event required' }, { status: 400 })
  await logEvent({ event, workflow_id, properties })
  return NextResponse.json({ ok: true })
}
