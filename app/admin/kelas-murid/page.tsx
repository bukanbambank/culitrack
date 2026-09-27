import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import KelasMuridClient from './KelasMuridClient'

export default async function AdminKelasMuridPage() {
  const supabase = await createClient() as any

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const profile = data as any
  if (profile?.role !== 'admin') redirect('/dashboard')

  // Fetch data
  const { data: kelasData } = await supabase.from('kelas').select('*').order('nama_kelas')
  const { data: muridData } = await supabase.from('murid').select(`*, kelas(nama_kelas)`).order('nama_murid')

  return (
    <div className="max-w-5xl mx-auto p-4 mt-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Kelas & Murid</h1>
      <KelasMuridClient 
        kelasList={kelasData as any[] || []} 
        muridList={muridData as any[] || []} 
      />
    </div>
  )
}
