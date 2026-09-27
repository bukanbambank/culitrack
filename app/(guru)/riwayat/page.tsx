import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ExportExcelButton from '@/components/ExportExcelButton'
import HistoryFilter from '@/components/HistoryFilter'

export default async function GuruRiwayatPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase.from('profiles').select('id_guru').eq('id', user.id).single()
  const profile = data as any
  const id_guru = profile?.id_guru
  if (!id_guru) redirect('/login')

  // Fetch filters data
  const { data: kelasList } = await supabase.from('kelas').select('id_kelas, nama_kelas').order('nama_kelas')

  // Build query
  let query = supabase
    .from('penilaian')
    .select(`
      id_penilaian,
      tanggal,
      nilai_akhir,
      murid ( nama_murid, kelas ( id_kelas, nama_kelas ) ),
      materi_praktik ( mata_pelajaran, menu_praktik )
    `)
    .eq('id_guru', id_guru)
    .order('tanggal', { ascending: false })

  // Apply filters
  if (resolvedParams.mapel) {
    query = query.ilike('mata_pelajaran', `%${resolvedParams.mapel}%`)
  }
  if (resolvedParams.menu) {
    query = query.ilike('menu_praktik', `%${resolvedParams.menu}%`)
  }
  
  // Note: Filtering by nested relational tables natively in PostgREST is done via inner joins, 
  // but for simplicity we can filter it post-fetch if it's too complex, or using syntax:
  if (resolvedParams.kelasId) {
    query = query.eq('murid.id_kelas', resolvedParams.kelasId)
  }

  const { data: riwayatData, error } = await query

  if (error) {
    console.error('Error fetching riwayat:', error)
  }

  // If using `.eq('murid.id_kelas', id)`, Supabase returns null for the `murid` field if it doesn't match. 
  // We need to filter out rows where `murid` is null (if the filter was applied).
  let finalData = riwayatData as any[] || []
  if (resolvedParams.kelasId) {
    finalData = finalData.filter(row => row.murid !== null)
  }

  // Format data for Excel
  const excelData = finalData.map(row => ({
    Tanggal: new Date(row.tanggal).toLocaleDateString('id-ID'),
    Kelas: row.murid?.kelas?.nama_kelas || '-',
    'Mata Pelajaran': row.materi_praktik?.mata_pelajaran || '-',
    'Menu Praktik': row.materi_praktik?.menu_praktik || '-',
    'Nama Murid': row.murid?.nama_murid || '-',
    'Nilai Akhir': Number(row.nilai_akhir).toFixed(2)
  }))

  const excelColumns = [
    { header: 'Tanggal', key: 'Tanggal' },
    { header: 'Kelas', key: 'Kelas' },
    { header: 'Mata Pelajaran', key: 'Mata Pelajaran' },
    { header: 'Menu Praktik', key: 'Menu Praktik' },
    { header: 'Nama Murid', key: 'Nama Murid' },
    { header: 'Nilai Akhir', key: 'Nilai Akhir' }
  ]

  const fileName = `culitrack-export-guru-${new Date().toISOString().split('T')[0]}.xlsx`

  const { data: materiList } = await supabase.from('materi_praktik').select('id_kelas, mata_pelajaran, menu_praktik')

  return (
    <div className="max-w-6xl mx-auto p-4 mt-4">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Riwayat Penilaian</h1>
          <ExportExcelButton data={excelData} columns={excelColumns} filename={fileName} />
        </div>

        <HistoryFilter kelasList={kelasList as any[]} materiList={materiList as any[]} />

        <div className="overflow-x-auto">
          <table className="w-full min-w-full text-left text-sm text-gray-600 border-collapse whitespace-nowrap">
            <thead className="bg-gray-50 border-y text-gray-700">
              <tr>
                <th className="py-3 px-4 font-semibold">Tanggal</th>
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
                  <td className="py-3 px-4">{row.murid?.kelas?.nama_kelas}</td>
                  <td className="py-3 px-4">{row.materi_praktik?.mata_pelajaran}</td>
                  <td className="py-3 px-4">{row.materi_praktik?.menu_praktik}</td>
                  <td className="py-3 px-4">{row.murid?.nama_murid}</td>
                  <td className="py-3 px-4 text-right font-medium text-gray-800">{Number(row.nilai_akhir).toFixed(2)}</td>
                </tr>
              ))}
              {finalData.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
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
