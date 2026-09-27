'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function simpanPenilaian(formData: FormData) {
  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get profile
  const { data } = await supabase
    .from('profiles')
    .select('id_guru')
    .eq('id', user.id)
    .single()
  const profile = data as any

  const id_guru = profile?.id_guru
  if (!id_guru) throw new Error('Data profil guru tidak ditemukan.')

  // Parse form data
  const id_murid = formData.get('id_murid') as string
  const id_materi = formData.get('id_materi') as string
  const id_kelas = formData.get('id_kelas') as string
  const persiapan = parseFloat(formData.get('persiapan') as string)
  const proses = parseFloat(formData.get('proses') as string)
  const hasil_produk = parseFloat(formData.get('hasil_produk') as string)
  const sikap = parseFloat(formData.get('sikap') as string)
  const catatan = formData.get('catatan') as string

  // Get materi details
  const { data: materiRaw } = await supabase
    .from('materi_praktik')
    .select('mata_pelajaran, menu_praktik')
    .eq('id_materi', id_materi)
    .single()
  
  const materi = materiRaw as any
  
  // Handle image upload
  const fotoFile = formData.get('foto') as File
  let fotoUrl = null

  if (fotoFile && fotoFile.size > 0) {
    const fileExt = fotoFile.name.split('.').pop()
    const fileName = `${id_murid}-${Date.now()}.${fileExt}`
    const supabaseAdmin = createAdminClient()
    
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('foto-produk')
      .upload(fileName, fotoFile)

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      throw new Error('Gagal mengupload foto: ' + uploadError.message)
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from('foto-produk')
      .getPublicUrl(uploadData.path)

    fotoUrl = publicUrlData.publicUrl
  }

  // Insert to DB
  const { data: insertData, error: insertError } = await supabase
    .from('penilaian')
    .insert({
      id_murid,
      id_materi,
      id_kelas,
      id_guru,
      mata_pelajaran: materi?.mata_pelajaran,
      menu_praktik: materi?.menu_praktik,
      skor_persiapan: persiapan,
      skor_proses: proses,
      skor_hasil_produk: hasil_produk,
      skor_sikap: sikap,
      catatan_guru: catatan,
      foto_produk: fotoUrl
    } as any)
    .select('nilai_akhir')
    .single()

  if (insertError) {
    console.error('Error inserting penilaian:', insertError)
    throw new Error('Gagal menyimpan penilaian: ' + insertError.message)
  }

  revalidatePath('/riwayat')
  return insertData as any
}
