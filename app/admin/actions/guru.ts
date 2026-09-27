'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function createGuru(formData: FormData) {
  const supabaseAdmin = createAdminClient() as any

  const nama = formData.get('nama') as string
  const nip = formData.get('nip') as string
  const no_hp = formData.get('no_hp') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 1. Create User in Supabase Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true // auto confirm
  })

  if (authError) {
    throw new Error('Gagal membuat akun login: ' + authError.message)
  }

  const userId = authData.user.id

  // 2. Insert into Guru table
  const { data: guruData, error: guruError } = await supabaseAdmin
    .from('guru')
    .insert({
      nama_guru: nama,
      nip,
      no_hp
    })
    .select('id_guru')
    .single()

  if (guruError) {
    // Rollback auth user
    await supabaseAdmin.auth.admin.deleteUser(userId)
    throw new Error('Gagal menyimpan data guru: ' + guruError.message)
  }

  const idGuru = guruData.id_guru

  // 3. Insert into Profiles table
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({
      id: userId,
      role: 'guru',
      id_guru: idGuru,
      nama: nama
    })

  if (profileError) {
    // Rollback auth user and guru
    await supabaseAdmin.from('guru').delete().eq('id_guru', idGuru)
    await supabaseAdmin.auth.admin.deleteUser(userId)
    throw new Error('Gagal menyambungkan profil: ' + profileError.message)
  }

  revalidatePath('/admin/guru')
}

export async function updateGuru(formData: FormData) {
  const supabaseAdmin = createAdminClient() as any
  
  const id_guru = formData.get('id_guru') as string
  const nama = formData.get('nama') as string
  const nip = formData.get('nip') as string
  const no_hp = formData.get('no_hp') as string

  const { error } = await supabaseAdmin
    .from('guru')
    .update({
      nama_guru: nama,
      nip,
      no_hp
    })
    .eq('id_guru', id_guru)

  if (error) {
    throw new Error('Gagal mengupdate data guru: ' + error.message)
  }

  // Also update profile name
  await supabaseAdmin.from('profiles').update({ nama }).eq('id_guru', id_guru)

  revalidatePath('/admin/guru')
}

export async function deleteGuru(id_guru: string) {
  const supabaseAdmin = createAdminClient() as any

  // Find profile to delete auth user
  const { data } = await supabaseAdmin.from('profiles').select('id').eq('id_guru', id_guru).single()
  const profile = data as any

  if (profile) {
    await supabaseAdmin.auth.admin.deleteUser(profile.id)
  }

  // Delete guru (profile is deleted by cascade from auth.users, or we just rely on supabase admin)
  // Wait, profile has 'on delete cascade' to auth.users.id.
  // And guru delete? If guru is deleted, what about penilaian? Penilaian references id_guru.
  // If there are constraints, this might fail. We should be careful.
  const { error } = await supabaseAdmin
    .from('guru')
    .delete()
    .eq('id_guru', id_guru)

  if (error) {
    throw new Error('Gagal menghapus guru. Mungkin masih ada data penilaian yang terkait. (' + error.message + ')')
  }

  revalidatePath('/admin/guru')
}
