import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Stepper from '@/components/Stepper'

export default async function PilihMenu({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const kelasId = resolvedParams.kelasId as string
  const mapel = resolvedParams.mapel as string
  const materi = resolvedParams.materi as string

  if (!kelasId || !mapel || !materi) redirect('/kelas')

  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch unique menu for this class, mapel, and materi
  const { data, error } = await supabase
    .from('materi_praktik')
    .select('id_materi, menu_praktik')
    .eq('id_kelas', kelasId)
    .eq('mata_pelajaran', mapel)
    .eq('materi_praktik', materi)
  const menuList = data as any[]

  if (error) {
    console.error('Error fetching menu:', error)
  }

  // Filter out duplicates if any (though usually id_materi is unique per menu)
  // We want to pass id_materi to the next step
  const uniqueMenus = Array.from(
    new Map(menuList?.filter(m => m.menu_praktik).map(m => [m.menu_praktik, m])).values()
  )

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <Stepper currentStep={4} />
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pilih Menu Praktik</h2>
        <p className="text-gray-500 mb-6">{mapel} - {materi}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {uniqueMenus.map((item) => (
            <Link 
              key={item.id_materi}
              href={`/murid?kelasId=${kelasId}&materiId=${item.id_materi}`}
              className="border rounded-2xl p-6 hover:border-sage-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group cursor-pointer bg-white text-center"
            >
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-sage-600">
                {item.menu_praktik}
              </h3>
            </Link>
          ))}

          {uniqueMenus.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">
              Belum ada menu praktik.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
