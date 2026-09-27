'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createMateri(formData: FormData) {
  const supabase = await createClient() as any

  const id_kelas = formData.get('id_kelas') as string
  const mata_pelajaran = formData.get('mata_pelajaran') as string
  const materi_praktik = formData.get('materi_praktik') as string
  const menu_praktik = formData.get('menu_praktik') as string

  const { error } = await supabase
    .from('materi_praktik')
    .insert({
      id_kelas,
      mata_pelajaran,
      materi_praktik,
      menu_praktik
    })

  if (error) {
    throw new Error('Gagal menambah materi: ' + error.message)
  }

  revalidatePath('/admin/kelas-mapel')
}

export async function updateMateri(formData: FormData) {
  const supabase = await createClient() as any

  const id_materi = formData.get('id_materi') as string
  const id_kelas = formData.get('id_kelas') as string
  const mata_pelajaran = formData.get('mata_pelajaran') as string
  const materi_praktik = formData.get('materi_praktik') as string
  const menu_praktik = formData.get('menu_praktik') as string

  const { error } = await supabase
    .from('materi_praktik')
    .update({
      id_kelas,
      mata_pelajaran,
      materi_praktik,
      menu_praktik
    })
    .eq('id_materi', id_materi)

  if (error) {
    throw new Error('Gagal mengupdate materi: ' + error.message)
  }

  revalidatePath('/admin/kelas-mapel')
}

export async function deleteMateri(id_materi: string) {
  const supabase = await createClient() as any

  const { error } = await supabase
    .from('materi_praktik')
    .delete()
    .eq('id_materi', id_materi)

  if (error) {
    throw new Error('Gagal menghapus materi (mungkin masih ada data penilaian terkait): ' + error.message)
  }

  revalidatePath('/admin/kelas-mapel')
}
