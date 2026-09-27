import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Stepper from '@/components/Stepper'

export default async function PilihMateri({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const kelasId = resolvedParams.kelasId as string
  const mapel = resolvedParams.mapel as string

  if (!kelasId || !mapel) redirect('/kelas')

  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch unique materi for this class and mapel
  const { data, error } = await supabase
    .from('materi_praktik')
    .select('materi_praktik')
    .eq('id_kelas', kelasId)
    .eq('mata_pelajaran', mapel)
  const materiList = data as any[]

  if (error) {
    console.error('Error fetching materi:', error)
  }

  // Get distinct materi
  const materiSet = new Set(materiList?.map(m => m.materi_praktik).filter(Boolean))
  const uniqueMateri = Array.from(materiSet) as string[]

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <Stepper currentStep={3} />
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pilih Materi Praktik</h2>
        <p className="text-gray-500 mb-6">Mata Pelajaran: {mapel}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {uniqueMateri.map((materi) => (
            <Link 
              key={materi}
              href={`/menu?kelasId=${kelasId}&mapel=${encodeURIComponent(mapel)}&materi=${encodeURIComponent(materi)}`}
              className="border rounded-2xl p-6 hover:border-sage-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group cursor-pointer bg-white text-center"
            >
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-sage-600">
                {materi}
              </h3>
            </Link>
          ))}

          {uniqueMateri.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">
              Belum ada materi praktik.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
