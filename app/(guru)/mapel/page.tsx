import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Stepper from '@/components/Stepper'

export default async function PilihMapel({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const kelasId = resolvedParams.kelasId as string

  if (!kelasId) redirect('/kelas')

  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch unique mapel for this class
  // Since Supabase RPC isn't defined yet, we fetch all materi_praktik for this class and distinct in JS
  const { data, error } = await supabase
    .from('materi_praktik')
    .select('mata_pelajaran')
    .eq('id_kelas', kelasId)
  const materiList = data as any[]

  if (error) {
    console.error('Error fetching mapel:', error)
  }

  // Get distinct mapel
  const mapelSet = new Set(materiList?.map(m => m.mata_pelajaran).filter(Boolean))
  const uniqueMapel = Array.from(mapelSet) as string[]

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <Stepper currentStep={2} />
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Pilih Mata Pelajaran</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {uniqueMapel.map((mapel) => (
            <Link 
              key={mapel}
              href={`/materi?kelasId=${kelasId}&mapel=${encodeURIComponent(mapel)}`}
              className="border rounded-2xl p-6 hover:border-sage-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group cursor-pointer bg-white text-center"
            >
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-sage-600">
                {mapel}
              </h3>
            </Link>
          ))}

          {uniqueMapel.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">
              Belum ada mata pelajaran untuk kelas ini.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
