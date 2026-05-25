export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { getSession, isAdmin } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const admin = await isAdmin()
  if (!admin) redirect('/dashboard')

  return <>{children}</>
}
