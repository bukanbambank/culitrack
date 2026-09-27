import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const profile = data as any
  if (profile?.role !== 'admin') redirect('/dashboard')

  // Fetch counts
  const [{ count: guruCount }, { count: muridCount }, { count: kelasCount }, { count: menuCount }] = await Promise.all([
    supabase.from('guru').select('*', { count: 'exact', head: true }),
    supabase.from('murid').select('*', { count: 'exact', head: true }),
    supabase.from('kelas').select('*', { count: 'exact', head: true }),
    supabase.from('materi_praktik').select('*', { count: 'exact', head: true })
  ])

  return (
    <div className="max-w-5xl mx-auto p-4 mt-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border p-6 border-l-4 border-l-sage-500">
          <p className="text-gray-500 text-sm font-medium mb-1">Total Guru</p>
          <h2 className="text-4xl font-bold text-gray-800">{guruCount || 0}</h2>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border p-6 border-l-4 border-l-sage-500">
          <p className="text-gray-500 text-sm font-medium mb-1">Total Murid</p>
          <h2 className="text-4xl font-bold text-gray-800">{muridCount || 0}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6 border-l-4 border-l-purple-500">
          <p className="text-gray-500 text-sm font-medium mb-1">Total Kelas</p>
          <h2 className="text-4xl font-bold text-gray-800">{kelasCount || 0}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6 border-l-4 border-l-yellow-500">
          <p className="text-gray-500 text-sm font-medium mb-1">Total Menu Praktik</p>
          <h2 className="text-4xl font-bold text-gray-800">{menuCount || 0}</h2>
        </div>
      </div>
    </div>
  )
}
