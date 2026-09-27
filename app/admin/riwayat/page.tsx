import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ExportExcelButton from '@/components/ExportExcelButton'
import HistoryFilter from '@/components/HistoryFilter'

export default async function AdminRiwayatPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const profile = data as any
  if (profile?.role !== 'admin') redirect('/dashboard')

  // Fetch filters data
  const { data: kelasList } = await supabase.from('kelas').select('id_kelas, nama_kelas').order('nama_kelas')
  const { data: guruList } = await supabase.from('guru').select('id_guru, nama_guru').order('nama_guru')

  // Build query
  let query = supabase
    .from('penilaian')
    .select(`
      id_penilaian,
      tanggal,
      nilai_akhir,
      guru ( nama_guru ),
      murid ( nama_murid, kelas ( id_kelas, nama_kelas ) ),
      materi_praktik ( mata_pelajaran, menu_praktik )
    `)
    .order('tanggal', { ascending: false })

  // Apply filters
  if (resolvedParams.mapel) {
    query = query.ilike('mata_pelajaran', `%${resolvedParams.mapel}%`)
  }
  if (resolvedParams.menu) {
    query = query.ilike('menu_praktik', `%${resolvedParams.menu}%`)
  }
  if (resolvedParams.guruId) {
    query = query.eq('id_guru', resolvedParams.guruId)
  }
  
  if (resolvedParams.kelasId) {
    query = query.eq('murid.id_kelas', resolvedParams.kelasId)
  }

  const { data: riwayatData, error } = await query

  if (error) {
    console.error('Error fetching riwayat:', error)
  }

  // Filter out rows where `murid` is null (if the inner join filter was applied)
  let finalData = riwayatData as any[] || []
  if (resolvedParams.kelasId) {
    finalData = finalData.filter(row => row.murid !== null)
  }

  // Format data for Excel
  const excelData = finalData.map(row => ({
    Tanggal: new Date(row.tanggal).toLocaleDateString('id-ID'),
    Guru: row.guru?.nama_guru || '-',
    Kelas: row.murid?.kelas?.nama_kelas || '-',
    'Mata Pelajaran': row.materi_praktik?.mata_pelajaran || '-',
    'Menu Praktik': row.materi_praktik?.menu_praktik || '-',
    'Nama Murid': row.murid?.nama_murid || '-',
    'Nilai Akhir': Number(row.nilai_akhir).toFixed(2)
  }))

  const excelColumns = [
    { header: 'Tanggal', key: 'Tanggal' },
    { header: 'Guru', key: 'Guru' },
    { header: 'Kelas', key: 'Kelas' },
    { header: 'Mata Pelajaran', key: 'Mata Pelajaran' },
    { header: 'Menu Praktik', key: 'Menu Praktik' },
    { header: 'Nama Murid', key: 'Nama Murid' },
    { header: 'Nilai Akhir', key: 'Nilai Akhir' }
  ]

  const fileName = `culitrack-export-admin-${new Date().toISOString().split('T')[0]}.xlsx`

  const { data: materiList } = await supabase.from('materi_praktik').select('id_kelas, mata_pelajaran, menu_praktik')

  return (
    <div className="max-w-5xl mx-auto p-4 mt-4">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Semua Riwayat Penilaian</h1>
          <ExportExcelButton data={excelData} columns={excelColumns} filename={fileName} />
        </div>

        <HistoryFilter 
          kelasList={kelasList as any[]} 
          guruList={guruList as any[]} 
          materiList={materiList as any[]}
          showGuruFilter={true} 
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-full text-left text-sm text-gray-600 border-collapse whitespace-nowrap">
            <thead className="bg-gray-50 border-y text-gray-700">
              <tr>
                <th className="py-3 px-4 font-semibold">Tanggal</th>
                <th className="py-3 px-4 font-semibold">Guru</th>
                <th className="py-3 px-4 font-semibold">Kelas</th>
                <th className="py-3 px-4 font-semibold">Mata Pelajaran</th>
                <th className="py-3 px-4 font-semibold">Menu Praktik</th>
                <th className="py-3 px-4 font-semibold">Nama Murid</th>
                <th className="py-3 px-4 font-semibold text-right">Nilai Akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {finalData.map((row: any) => (
                <tr key={row.id_penilaian} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{new Date(row.tanggal).toLocaleDateString('id-ID')}</td>
                  <td className="py-3 px-4 font-medium text-sage-600">{row.guru?.nama_guru}</td>
                  <td className="py-3 px-4">{row.murid?.kelas?.nama_kelas}</td>
                  <td className="py-3 px-4">{row.materi_praktik?.mata_pelajaran}</td>
                  <td className="py-3 px-4">{row.materi_praktik?.menu_praktik}</td>
                  <td className="py-3 px-4">{row.murid?.nama_murid}</td>
                  <td className="py-3 px-4 text-right font-medium text-gray-800">{Number(row.nilai_akhir).toFixed(2)}</td>
                </tr>
              ))}
              {finalData.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    Tidak ada data penilaian yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
