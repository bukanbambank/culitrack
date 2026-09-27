import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Stepper from '@/components/Stepper'

export default async function PilihKelas() {
  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch classes with murid to compute count
  const { data, error } = await supabase
    .from('kelas')
    .select('*, murid(id_murid)')
    .order('nama_kelas')
  const kelas = data as any[]

  if (error) {
    console.error('Error fetching kelas:', error)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <Stepper currentStep={1} />
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Pilih Kelas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kelas?.map((k) => (
            <Link 
              key={k.id_kelas}
              href={`/mapel?kelasId=${k.id_kelas}`}
              className="border rounded-2xl p-6 hover:border-sage-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group cursor-pointer bg-white"
            >
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-sage-600 mb-2">
                {k.nama_kelas}
              </h3>
              <p className="text-gray-500">Tingkat: {k.tingkat}</p>
              <p className="text-gray-500">{k.murid?.length || 0} Murid</p>
            </Link>
          ))}

          {(!kelas || kelas.length === 0) && (
            <div className="col-span-full text-center text-gray-500 py-8">
              Belum ada data kelas.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
