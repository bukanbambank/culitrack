import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MapelClient from './MapelClient'

export default async function AdminMapelPage() {
  const supabase = await createClient() as any

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const profile = data as any
  if (profile?.role !== 'admin') redirect('/dashboard')

  // Fetch data
  const { data: kelasData } = await supabase.from('kelas').select('*').order('nama_kelas')
  const { data: materiData } = await supabase.from('materi_praktik').select(`*, kelas(nama_kelas)`).order('mata_pelajaran')

  return (
    <div className="max-w-5xl mx-auto p-4 mt-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Mapel & Materi Praktik</h1>
      <MapelClient 
        kelasList={kelasData as any[] || []} 
        materiList={materiData as any[] || []} 
      />
    </div>
  )
}
