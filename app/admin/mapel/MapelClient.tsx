'use client'

import { useState } from 'react'
import { createMateri, updateMateri, deleteMateri } from '../actions/materi'

interface MapelClientProps {
  kelasList: any[]
  materiList: any[]
}

export default function MapelClient({ kelasList, materiList }: MapelClientProps) {
  const [showMapelModal, setShowMapelModal] = useState(false)
  const [editingMapel, setEditingMapel] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [selectedKelasId, setSelectedKelasId] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  const handleOpenAddMapel = () => { setEditingMapel(null); setShowMapelModal(true); setError(null) }
  const handleOpenEditMapel = (m: any) => { setEditingMapel(m); setShowMapelModal(true); setError(null) }
  const handleDeleteMapel = async (id: string) => {
    if (!confirm('Yakin ingin menghapus materi ini?')) return
    try { await deleteMateri(id) } catch (err: any) { alert(err.message) }
  }
  const handleSubmitMapel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true); setError(null)
    const formData = new FormData(e.currentTarget)
    try {
      if (editingMapel) {
        formData.append('id_materi', editingMapel.id_materi)
        await updateMateri(formData)
      } else {
        await createMateri(formData)
      }
      setShowMapelModal(false)
    } catch (err: any) { setError(err.message) }
    finally { setIsSubmitting(false) }
  }

  // Filtered materi
  const filteredMateri = materiList.filter(m => {
    if (selectedKelasId && m.id_kelas !== selectedKelasId) return false
    if (searchTerm && !m.mata_pelajaran.toLowerCase().includes(searchTerm.toLowerCase()) && !m.materi_praktik.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        <div className="flex gap-4 flex-1">
          <select 
            value={selectedKelasId} 
            onChange={(e) => setSelectedKelasId(e.target.value)}
            className="border rounded-md p-2 text-sm text-gray-700 bg-white"
          >
            <option value="">Semua Kelas</option>
            {kelasList.map(k => (
              <option key={k.id_kelas} value={k.id_kelas}>{k.nama_kelas}</option>
            ))}
          </select>
          <input 
            type="text" 
            placeholder="Cari mapel / materi..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-md p-2 flex-1 max-w-xs text-sm"
          />
        </div>
        <button onClick={handleOpenAddMapel} className="px-6 py-2.5 bg-sage-600 text-white font-medium rounded-md hover:bg-sage-700 text-sm whitespace-nowrap">
          + Tambah Materi
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 border-collapse">
          <thead className="bg-gray-50 border-y text-gray-700">
            <tr>
              <th className="py-3 px-4 font-semibold">Kelas</th>
              <th className="py-3 px-4 font-semibold">Mata Pelajaran</th>
              <th className="py-3 px-4 font-semibold">Materi Praktik</th>
              <th className="py-3 px-4 font-semibold">Menu Praktik</th>
              <th className="py-3 px-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredMateri.map(m => (
              <tr key={m.id_materi} className="hover:bg-gray-50">
                <td className="py-3 px-4">{m.kelas?.nama_kelas}</td>
                <td className="py-3 px-4">{m.mata_pelajaran}</td>
                <td className="py-3 px-4">{m.materi_praktik}</td>
                <td className="py-3 px-4">{m.menu_praktik}</td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => handleOpenEditMapel(m)} className="text-sage-600 hover:underline mr-3">Edit</button>
                  <button onClick={() => handleDeleteMapel(m.id_materi)} className="text-red-600 hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
            {filteredMateri.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">Belum ada data materi praktik.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MAPEL MODAL */}
      {showMapelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{editingMapel ? 'Edit Materi' : 'Tambah Materi'}</h2>
            {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
            <form onSubmit={handleSubmitMapel} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                <select required name="id_kelas" defaultValue={editingMapel?.id_kelas || selectedKelasId || ''} className="w-full border rounded p-2">
                  <option value="" disabled>Pilih Kelas...</option>
                  {kelasList.map(k => (
                    <option key={k.id_kelas} value={k.id_kelas}>{k.nama_kelas}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
                <input required type="text" name="mata_pelajaran" defaultValue={editingMapel?.mata_pelajaran} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Materi Praktik</label>
                <input required type="text" name="materi_praktik" defaultValue={editingMapel?.materi_praktik} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Menu Praktik</label>
                <input type="text" name="menu_praktik" defaultValue={editingMapel?.menu_praktik} className="w-full border rounded p-2" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowMapelModal(false)} className="px-6 py-2.5 bg-gray-200 rounded">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-sage-600 text-white rounded">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
