export function useAnalytics() {
  function track(event: string, workflow_id?: string | null, properties?: Record<string, unknown>) {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, workflow_id, properties }),
    }).catch(() => {}) // fire and forget
  }
  return { track }
}
