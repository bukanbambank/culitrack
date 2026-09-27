'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createKelas(formData: FormData) {
  const supabase = await createClient() as any

  const nama_kelas = formData.get('nama_kelas') as string
  const tingkat = formData.get('tingkat') as string

  const { error } = await supabase
    .from('kelas')
    .insert({
      nama_kelas,
      tingkat
    })

  if (error) {
    throw new Error('Gagal menambah kelas: ' + error.message)
  }

  revalidatePath('/admin/kelas-mapel')
}

export async function updateKelas(formData: FormData) {
  const supabase = await createClient() as any

  const id_kelas = formData.get('id_kelas') as string
  const nama_kelas = formData.get('nama_kelas') as string
  const tingkat = formData.get('tingkat') as string

  const { error } = await supabase
    .from('kelas')
    .update({
      nama_kelas,
      tingkat
    })
    .eq('id_kelas', id_kelas)

  if (error) {
    throw new Error('Gagal mengupdate kelas: ' + error.message)
  }

  revalidatePath('/admin/kelas-mapel')
}

export async function deleteKelas(id_kelas: string) {
  const supabase = await createClient() as any

  const { error } = await supabase
    .from('kelas')
    .delete()
    .eq('id_kelas', id_kelas)

  if (error) {
    throw new Error('Gagal menghapus kelas (mungkin masih ada data murid/materi terkait): ' + error.message)
  }

  revalidatePath('/admin/kelas-mapel')
}
