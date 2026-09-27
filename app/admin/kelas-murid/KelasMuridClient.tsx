'use client'

import { useState } from 'react'
import { createKelas, updateKelas, deleteKelas } from '../actions/kelas'
import { createMurid, updateMurid, deleteMurid } from '../actions/murid'

interface KelasMuridClientProps {
  kelasList: any[]
  muridList: any[]
}

export default function KelasMuridClient({ kelasList, muridList }: KelasMuridClientProps) {
  const [activeTab, setActiveTab] = useState<'kelas' | 'murid'>('kelas')
  const [selectedKelasId, setSelectedKelasId] = useState<string>('')
  
  // Modals state
  const [showKelasModal, setShowKelasModal] = useState(false)
  const [editingKelas, setEditingKelas] = useState<any>(null)
  
  const [showMuridModal, setShowMuridModal] = useState(false)
  const [editingMurid, setEditingMurid] = useState<any>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Handlers for Kelas
  const handleOpenAddKelas = () => { setEditingKelas(null); setShowKelasModal(true); setError(null) }
  const handleOpenEditKelas = (k: any) => { setEditingKelas(k); setShowKelasModal(true); setError(null) }
  const handleDeleteKelas = async (id: string) => {
    if (!confirm('Yakin ingin menghapus kelas ini?')) return
    try { await deleteKelas(id) } catch (err: any) { alert(err.message) }
  }
  const handleSubmitKelas = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true); setError(null)
    const formData = new FormData(e.currentTarget)
    try {
      if (editingKelas) {
        formData.append('id_kelas', editingKelas.id_kelas)
        await updateKelas(formData)
      } else {
        await createKelas(formData)
      }
      setShowKelasModal(false)
    } catch (err: any) { setError(err.message) }
    finally { setIsSubmitting(false) }
  }

  // Handlers for Murid
  const handleOpenAddMurid = () => { setEditingMurid(null); setShowMuridModal(true); setError(null) }
  const handleOpenEditMurid = (m: any) => { setEditingMurid(m); setShowMuridModal(true); setError(null) }
  const handleDeleteMurid = async (id: string) => {
    if (!confirm('Yakin ingin menghapus murid ini?')) return
    try { await deleteMurid(id) } catch (err: any) { alert(err.message) }
  }
  const handleSubmitMurid = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true); setError(null)
    const formData = new FormData(e.currentTarget)
    try {
      if (editingMurid) {
        formData.append('id_murid', editingMurid.id_murid)
        await updateMurid(formData)
      } else {
        await createMurid(formData)
      }
      setShowMuridModal(false)
    } catch (err: any) { setError(err.message) }
    finally { setIsSubmitting(false) }
  }

  // Filtered murid based on selected kelas and search term
  const filteredMurid = muridList.filter(m => {
    if (selectedKelasId && m.id_kelas !== selectedKelasId) return false
    if (searchTerm && !m.nama_murid.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b bg-gray-50">
        <button 
          className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'kelas' ? 'border-b-2 border-sage-600 text-sage-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('kelas')}
        >
          Kelas
        </button>
        <button 
          className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'murid' ? 'border-b-2 border-sage-600 text-sage-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('murid')}
        >
          Murid
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'kelas' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={handleOpenAddKelas} className="px-6 py-2.5 bg-sage-600 text-white font-medium rounded-md hover:bg-sage-700 text-sm">
                + Tambah Kelas
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600 border-collapse">
                <thead className="bg-gray-50 border-y text-gray-700">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Nama Kelas</th>
                    <th className="py-3 px-4 font-semibold">Tingkat</th>
                    <th className="py-3 px-4 font-semibold">Jumlah Murid</th>
                    <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {kelasList.map(k => (
                    <tr key={k.id_kelas} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{k.nama_kelas}</td>
                      <td className="py-3 px-4">{k.tingkat}</td>
                      <td className="py-3 px-4">{muridList.filter(m => m.id_kelas === k.id_kelas).length}</td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => handleOpenEditKelas(k)} className="text-sage-600 hover:underline mr-3">Edit</button>
                        <button onClick={() => handleDeleteKelas(k.id_kelas)} className="text-red-600 hover:underline">Hapus</button>
                      </td>
                    </tr>
                  ))}
                  {kelasList.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">Belum ada data kelas.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'murid' && (
          <div>
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
                  placeholder="Cari nama murid..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded-md p-2 flex-1 max-w-xs text-sm"
                />
              </div>
              <button onClick={handleOpenAddMurid} className="px-6 py-2.5 bg-sage-600 text-white font-medium rounded-md hover:bg-sage-700 text-sm whitespace-nowrap">
                + Tambah Murid
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600 border-collapse">
                <thead className="bg-gray-50 border-y text-gray-700">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Nama Murid</th>
                    <th className="py-3 px-4 font-semibold">Jenis Kelamin</th>
                    <th className="py-3 px-4 font-semibold">Kelas</th>
                    <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredMurid.map(m => (
                    <tr key={m.id_murid} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{m.nama_murid}</td>
                      <td className="py-3 px-4">{m.jk === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                      <td className="py-3 px-4">{m.kelas?.nama_kelas}</td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => handleOpenEditMurid(m)} className="text-sage-600 hover:underline mr-3">Edit</button>
                        <button onClick={() => handleDeleteMurid(m.id_murid)} className="text-red-600 hover:underline">Hapus</button>
                      </td>
                    </tr>
                  ))}
                  {filteredMurid.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">Tidak ada data murid.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* KELAS MODAL */}
      {showKelasModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{editingKelas ? 'Edit Kelas' : 'Tambah Kelas'}</h2>
            {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
            <form onSubmit={handleSubmitKelas} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kelas</label>
                <input required type="text" name="nama_kelas" defaultValue={editingKelas?.nama_kelas} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat</label>
                <select required name="tingkat" defaultValue={editingKelas?.tingkat || 'X'} className="w-full border rounded p-2">
                  <option value="X">X</option>
                  <option value="XI">XI</option>
                  <option value="XII">XII</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowKelasModal(false)} className="px-6 py-2.5 bg-gray-200 rounded">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-sage-600 text-white rounded">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MURID MODAL */}
      {showMuridModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{editingMurid ? 'Edit Murid' : 'Tambah Murid'}</h2>
            {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
            <form onSubmit={handleSubmitMurid} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Murid</label>
                <input required type="text" name="nama" defaultValue={editingMurid?.nama_murid} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                <select required name="jk" defaultValue={editingMurid?.jk || ''} className="w-full border rounded p-2">
                  <option value="" disabled>Pilih...</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                <select required name="id_kelas" defaultValue={editingMurid?.id_kelas || selectedKelasId || ''} className="w-full border rounded p-2">
                  <option value="" disabled>Pilih Kelas...</option>
                  {kelasList.map(k => (
                    <option key={k.id_kelas} value={k.id_kelas}>{k.nama_kelas}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowMuridModal(false)} className="px-6 py-2.5 bg-gray-200 rounded">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-sage-600 text-white rounded">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
