import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import FormPenilaian from './FormPenilaian'
import { ArrowLeft } from 'lucide-react'

export default async function PenilaianPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const muridId = resolvedParams.muridId as string
  const materiId = resolvedParams.materiId as string

  if (!muridId || !materiId) redirect('/kelas')

  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch Murid
  const { data: muridRaw, error: muridError } = await supabase
    .from('murid')
    .select('id_murid, nama_murid, id_kelas')
    .eq('id_murid', muridId)
    .single()
  const murid = muridRaw as any

  if (muridError || !murid) {
    console.error('Murid error:', muridError)
    return <div className="p-8 text-center text-red-500">Data murid tidak ditemukan.</div>
  }

  // Fetch Kelas
  const { data: kelasRaw, error: kelasError } = await supabase
    .from('kelas')
    .select('*')
    .eq('id_kelas', murid.id_kelas)
    .single()
  const kelas = kelasRaw as any

  // Fetch Materi
  const { data: materiRaw, error: materiError } = await supabase
    .from('materi_praktik')
    .select('*')
    .eq('id_materi', materiId)
    .single()
  const materi = materiRaw as any

  if (materiError || !materi) {
    return <div className="p-8 text-center text-red-500">Data materi tidak ditemukan.</div>
  }

  // Fetch Existing Penilaian
  const { data: existingRaw } = await supabase
    .from('penilaian')
    .select('*')
    .eq('id_murid', muridId)
    .eq('id_materi', materiId)
    .single()
  const existingPenilaian = existingRaw as any

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header Info */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">{murid.nama_murid}</h1>
            <div className="text-gray-500 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <p><span className="font-medium text-gray-700">Kelas:</span> {kelas?.nama_kelas}</p>
              <p><span className="font-medium text-gray-700">Mapel:</span> {materi.mata_pelajaran}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-500">Materi & Menu</p>
            <p className="font-semibold text-gray-800">{materi.materi_praktik}</p>
            <p className="text-sage-600">{materi.menu_praktik}</p>
          </div>
        </div>
      </div>

      {/* The Form or Display */}
      {existingPenilaian ? (
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="mb-6 pb-6 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Sudah Dinilai</h2>
                <p className="text-gray-500 text-sm">Murid ini sudah mendapatkan nilai untuk materi ini.</p>
              </div>
            </div>
            <div className="text-right bg-sage-50 px-4 py-2 rounded-xl border border-sage-100">
              <p className="text-sm font-medium text-sage-600 mb-1">Nilai Akhir</p>
              <p className="text-4xl font-bold text-sage-700">{Number(existingPenilaian.nilai_akhir).toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 mb-4">Rincian Skor</h3>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Persiapan (15%)</span>
                <span className="font-semibold text-gray-900">{existingPenilaian.skor_persiapan}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Proses Praktik (35%)</span>
                <span className="font-semibold text-gray-900">{existingPenilaian.skor_proses}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Hasil Produk (30%)</span>
                <span className="font-semibold text-gray-900">{existingPenilaian.skor_hasil_produk}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Sikap (20%)</span>
                <span className="font-semibold text-gray-900">{existingPenilaian.skor_sikap}</span>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-2">Catatan Guru</h3>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-700 min-h-[100px] whitespace-pre-wrap">
                  {existingPenilaian.catatan_guru || <span className="text-gray-400 italic">Tidak ada catatan.</span>}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Foto Produk</h3>
              {existingPenilaian.foto_produk ? (
                <div className="aspect-square w-full relative rounded-xl overflow-hidden border bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={existingPenilaian.foto_produk} 
                    alt={`Hasil karya ${murid.nama_murid}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="aspect-square w-full rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 text-gray-400 flex-col gap-2">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span>Tidak ada foto</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t flex justify-end">
            <Link 
              href={`/murid?kelasId=${murid.id_kelas}&materiId=${materi.id_materi}`}
              className="px-6 py-2.5 bg-sage-600 text-white font-medium rounded-lg hover:bg-sage-700 transition-colors"
            >
              Kembali ke Daftar Murid
            </Link>
          </div>
        </div>
      ) : (
        <FormPenilaian 
          murid={murid} 
          kelas={kelas} 
          materi={materi} 
        />
      )}
      
      {/* Back button just in case user wants to abandon */}
      <Link 
        href={`/murid?kelasId=${murid.id_kelas}&materiId=${materi.id_materi}`}
        className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors mt-6"
      >
        <ArrowLeft size={16} className="mr-1" />
        Batal dan Kembali
      </Link>
    </div>
  )
}
