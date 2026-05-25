import { createClient } from '@/lib/supabase/server'
import type { AccessRequest } from '@/types'
import AccessRequestsManager from '@/components/admin/AccessRequestsManager'

export default async function AccessRequestsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('access_requests')
    .select('*')
    .order('created_at', { ascending: false })

  const requests = (data || []) as AccessRequest[]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Access Requests</h1>
        <p className="text-stone-500 text-sm mt-1">
          {requests.filter(r => r.status === 'pending').length} pending
        </p>
      </div>
      <AccessRequestsManager requests={requests} />
    </div>
  )
}
