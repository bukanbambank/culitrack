'use client'

import { useState } from 'react'
import { createGuru, updateGuru, deleteGuru } from '../actions/guru'

interface GuruClientProps {
  initialData: any[]
}

export default function GuruClient({ initialData }: GuruClientProps) {
  const [showModal, setShowModal] = useState(false)
  const [editingData, setEditingData] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpenAdd = () => {
    setEditingData(null)
    setShowModal(true)
    setError(null)
  }

  const handleOpenEdit = (guru: any) => {
    setEditingData(guru)
    setShowModal(true)
    setError(null)
  }

  const handleDelete = async (id_guru: string) => {
    if (!confirm('Yakin ingin menghapus guru ini?')) return
    try {
      await deleteGuru(id_guru)
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    const formData = new FormData(e.currentTarget)

    try {
      if (editingData) {
        formData.append('id_guru', editingData.id_guru)
        await updateGuru(formData)
      } else {
        await createGuru(formData)
      }
      setShowModal(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <div className="flex justify-end mb-4">
        <button 
          onClick={handleOpenAdd}
          className="px-6 py-2.5 bg-sage-600 text-white font-medium rounded-md hover:bg-sage-700 transition-colors"
        >
          + Tambah Guru
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 border-collapse">
          <thead className="bg-gray-50 border-y text-gray-700">
            <tr>
              <th className="py-3 px-4 font-semibold">Nama Guru</th>
              <th className="py-3 px-4 font-semibold">NIP</th>
              <th className="py-3 px-4 font-semibold">No HP</th>
              <th className="py-3 px-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {initialData.map((guru) => (
              <tr key={guru.id_guru} className="hover:bg-gray-50">
                <td className="py-3 px-4">{guru.nama_guru}</td>
                <td className="py-3 px-4">{guru.nip || '-'}</td>
                <td className="py-3 px-4">{guru.no_hp || '-'}</td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => handleOpenEdit(guru)} className="text-sage-600 hover:underline mr-3">Edit</button>
                  <button onClick={() => handleDelete(guru.id_guru)} className="text-red-600 hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
            {initialData.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">Belum ada data guru.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{editingData ? 'Edit Guru' : 'Tambah Guru & Akun'}</h2>
            
            {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input required type="text" name="nama" defaultValue={editingData?.nama_guru} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIP</label>
                <input type="text" name="nip" defaultValue={editingData?.nip} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. HP</label>
                <input type="text" name="no_hp" defaultValue={editingData?.no_hp} className="w-full border rounded p-2" />
              </div>

              {!editingData && (
                <>
                  <div className="pt-2 border-t mt-4">
                    <p className="text-sm font-semibold text-gray-800 mb-2">Informasi Akun Login</p>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input required type="email" name="email" className="w-full border rounded p-2 mb-3" />
                    
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password Sementara</label>
                    <input required type="text" name="password" minLength={6} className="w-full border rounded p-2" />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 bg-gray-200 rounded hover:bg-gray-300">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-sage-600 text-white rounded hover:bg-sage-700 disabled:opacity-50">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
