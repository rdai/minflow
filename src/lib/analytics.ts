import { createAdminClient } from './supabase/admin'

interface EventPayload {
  event: string
  workflow_id?: string | null
  properties?: Record<string, unknown>
}

// Server-side: fire and forget, never throws
export async function logEvent(payload: EventPayload) {
  try {
    const client = createAdminClient()
    await client.from('analytics_events').insert({
      event: payload.event,
      workflow_id: payload.workflow_id ?? null,
      properties: payload.properties ?? {},
    })
  } catch {
    // silently ignore — analytics must never break the app
  }
}
