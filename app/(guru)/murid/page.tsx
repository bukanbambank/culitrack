import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Avatar } from '@/components/Avatar'
import Stepper from '@/components/Stepper'

export default async function PilihMurid({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const kelasId = resolvedParams.kelasId as string
  const materiId = resolvedParams.materiId as string

  if (!kelasId || !materiId) redirect('/kelas')

  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch murid for this class
  const { data, error } = await supabase
    .from('murid')
    .select('*')
    .eq('id_kelas', kelasId)
    .order('nama_murid')
  const muridList = data as any[]

  // Fetch existing assessments for this materi to show checkmarks
  const { data: assessedData } = await supabase
    .from('penilaian')
    .select('id_murid')
    .eq('id_materi', materiId)
  
  const assessedMuridIds = new Set(((assessedData as any[]) || []).map(row => row.id_murid))

  if (error) {
    console.error('Error fetching murid:', error)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <Stepper currentStep={5} />
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Pilih Murid untuk Dinilai</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {muridList?.map((murid) => {
            const isAssessed = assessedMuridIds.has(murid.id_murid)
            
            return (
              <Link 
                key={murid.id_murid}
                href={`/penilaian/form?materiId=${materiId}&muridId=${murid.id_murid}`}
                className={`border rounded-lg p-4 transition-all group cursor-pointer flex items-center justify-between ${
                  isAssessed 
                    ? 'bg-sage-50 border-sage-200 hover:border-sage-500' 
                    : 'hover:border-sage-500 hover:shadow-md'
                }`}
              >
                <div>
                  <h3 className={`font-medium group-hover:text-sage-600 ${isAssessed ? 'text-sage-700' : 'text-gray-800'}`}>
                    {murid.nama_murid}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {murid.jk === 'L' ? 'Laki-laki' : murid.jk === 'P' ? 'Perempuan' : murid.jk}
                  </p>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isAssessed
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400 group-hover:bg-green-100 group-hover:text-sage-600'
                }`}>
                  {isAssessed ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    '→'
                  )}
                </div>
              </Link>
            )
          })}

          {(!muridList || muridList.length === 0) && (
            <div className="col-span-full text-center text-gray-500 py-8">
              Belum ada data murid di kelas ini.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
