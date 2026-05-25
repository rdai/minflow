import { createClient } from './supabase/server'
import type { Profile } from '@/types'

export async function getSession() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  return data as Profile | null
}

export async function isAdmin(): Promise<boolean> {
  const profile = await getProfile()
  return profile?.is_admin === true
}

export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')
  return true
}
