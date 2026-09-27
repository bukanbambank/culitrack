import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GuruClient from './GuruClient'

export default async function AdminGuruPage() {
  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const profile = data as any
  if (profile?.role !== 'admin') redirect('/dashboard')

  // Fetch Guru + Their emails from profiles
  const { data: guruData, error } = await supabase
    .from('guru')
    .select(`
      *,
      profiles ( id, role )
    `)
    .order('nama_guru')

  if (error) {
    console.error('Error fetching guru:', error)
  }

  // We can't fetch emails easily without Admin API, but for management display, we can just show the basics.
  // We'll pass the list to the client component.
  return (
    <div className="max-w-5xl mx-auto p-4 mt-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Guru</h1>
      <GuruClient initialData={guruData as any[] || []} />
    </div>
  )
}
