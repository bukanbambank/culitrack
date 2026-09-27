import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function GuruDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase.from('profiles').select('nama, id_guru').eq('id', user.id).single()
  const profile = data as any
  if (!profile?.id_guru) redirect('/login')

  // Fetch recent activities (last 3)
  const { data: recentData } = await supabase
    .from('penilaian')
    .select(`
      id_penilaian,
      tanggal,
      nilai_akhir,
      murid ( nama_murid ),
      materi_praktik ( mata_pelajaran, materi_praktik )
    `)
    .eq('id_guru', profile.id_guru)
    .order('created_at', { ascending: false })
    .limit(3)
  const recentActivities = recentData || []

  // Fetch all classes
  const { data: kelasData } = await supabase
    .from('kelas')
    .select('*, murid(id_murid, nama_murid, jk)')
    .order('nama_kelas')
  
  const kelasList = ((kelasData as any[]) || []).map(k => ({
    ...k,
    murids: k.murid?.sort((a: any, b: any) => a.nama_murid.localeCompare(b.nama_murid)) || []
  }))

  // Fetch all materi
  const { data: materiData } = await supabase
    .from('materi_praktik')
    .select('*')
    .order('mata_pelajaran')
  const materiList = materiData || []

  // Avatar color generator based on string
  const getAvatarColor = (name: string) => {
    if (!name) return 'bg-gray-100 text-gray-600'
    const colors = [
      'bg-sage-100 text-sage-700',
      'bg-orange-100 text-orange-700',
      'bg-blue-100 text-blue-700',
      'bg-yellow-100 text-yellow-700',
      'bg-purple-100 text-purple-700'
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return colors[Math.abs(hash) % colors.length]
  }

  // Score badge color generator
  const getScoreBadge = (score: number) => {
    if (score >= 75) return 'bg-green-100 text-green-700'
    if (score >= 50) return 'bg-orange-100 text-orange-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <div className="max-w-[1100px] mx-auto mt-8 p-4">
      {/* Header Card (Hero) */}
      <div className="bg-gradient-to-r from-orange-50 to-sage-50 rounded-2xl shadow-sm border border-sage-100/50 p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Selamat Datang, {profile?.nama || 'Guru'}</h1>
          <p className="text-gray-600 max-w-lg text-lg">Pilih menu di bawah untuk memulai sesi penilaian ujian praktik kuliner, atau cek daftar kelas dan materi Anda.</p>
        </div>
        <Link 
          href="/kelas"
          className="whitespace-nowrap inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-sage-600 rounded-xl hover:bg-sage-700 transition-all hover:scale-[1.02] shadow-md hover:shadow-lg"
        >
          Mulai Penilaian Baru
        </Link>
      </div>

      {/* Quick Stats / Recent Activity */}
      {recentActivities.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center border-l-4 border-sage-500 pl-3">Aktivitas Terakhir Anda</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentActivities.map((act: any) => {
              const score = Number(act.nilai_akhir)
              const muridName = act.murid?.nama_murid || '?'
              return (
                <div key={act.id_penilaian} className="bg-white border rounded-xl p-4 shadow-sm flex items-start gap-4 hover:border-sage-300 hover:shadow-md hover:scale-[1.02] transition-all cursor-default">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-bold text-lg ${getAvatarColor(muridName)}`}>
                    {muridName.substring(0, 1).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <h3 className="font-bold text-gray-800 truncate" title={muridName}>{muridName}</h3>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{act.materi_praktik?.materi_praktik}</p>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end justify-center py-1">
                    <span className={`inline-block font-bold px-3 py-1 rounded text-sm ${getScoreBadge(score)}`}>
                      {score.toFixed(1)}
                    </span>
                    {score < 50 && (
                      <span className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider">Perlu dicek</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Interactive Hub */}
      <DashboardClient kelasList={kelasList as any} materiList={materiList as any} />
    </div>
  )
}
