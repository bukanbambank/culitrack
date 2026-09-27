'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createMurid(formData: FormData) {
  const supabase = await createClient() as any

  const nama_murid = formData.get('nama') as string
  const jk = formData.get('jk') as string
  const id_kelas = formData.get('id_kelas') as string

  const { error } = await supabase
    .from('murid')
    .insert({
      nama_murid,
      jk,
      id_kelas
    })

  if (error) {
    throw new Error('Gagal menambah murid: ' + error.message)
  }

  revalidatePath('/admin/murid')
}

export async function updateMurid(formData: FormData) {
  const supabase = await createClient() as any

  const id_murid = formData.get('id_murid') as string
  const nama_murid = formData.get('nama') as string
  const jk = formData.get('jk') as string
  const id_kelas = formData.get('id_kelas') as string

  const { error } = await supabase
    .from('murid')
    .update({
      nama_murid,
      jk,
      id_kelas
    })
    .eq('id_murid', id_murid)

  if (error) {
    throw new Error('Gagal mengupdate murid: ' + error.message)
  }

  revalidatePath('/admin/murid')
}

export async function deleteMurid(id_murid: string) {
  const supabase = await createClient() as any

  const { error } = await supabase
    .from('murid')
    .delete()
    .eq('id_murid', id_murid)

  if (error) {
    throw new Error('Gagal menghapus murid: ' + error.message)
  }

  revalidatePath('/admin/murid')
}
