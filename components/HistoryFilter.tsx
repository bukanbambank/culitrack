'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useMemo, useEffect } from 'react'

interface HistoryFilterProps {
  kelasList: { id_kelas: string; nama_kelas: string }[]
  materiList?: { id_kelas: string; mata_pelajaran: string; menu_praktik: string }[]
  guruList?: { id_guru: string; nama_guru: string }[]
  showGuruFilter?: boolean
}

export default function HistoryFilter({ kelasList, materiList = [], guruList = [], showGuruFilter = false }: HistoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [kelasId, setKelasId] = useState(searchParams.get('kelasId') || '')
  const [mapel, setMapel] = useState(searchParams.get('mapel') || '')
  const [menu, setMenu] = useState(searchParams.get('menu') || '')
  const [guruId, setGuruId] = useState(searchParams.get('guruId') || '')

  // Reset dependent fields when parent changes
  useEffect(() => {
    // We only want this logic if the user manually changes the select, 
    // but a simple approach is to check if current mapel is valid for current kelas
    if (kelasId) {
      const validMapels = Array.from(new Set(materiList.filter(m => m.id_kelas === kelasId).map(m => m.mata_pelajaran)))
      if (mapel && !validMapels.includes(mapel)) {
        setMapel('')
        setMenu('')
      } else if (mapel) {
        const validMenus = Array.from(new Set(materiList.filter(m => m.id_kelas === kelasId && m.mata_pelajaran === mapel).map(m => m.menu_praktik)))
        if (menu && !validMenus.includes(menu)) {
          setMenu('')
        }
      }
    }
  }, [kelasId, mapel, materiList, menu])

  const availableMapels = useMemo(() => {
    if (!kelasId) return []
    const filtered = materiList.filter(m => m.id_kelas === kelasId)
    return Array.from(new Set(filtered.map(m => m.mata_pelajaran))).sort()
  }, [kelasId, materiList])

  const availableMenus = useMemo(() => {
    if (!kelasId || !mapel) return []
    const filtered = materiList.filter(m => m.id_kelas === kelasId && m.mata_pelajaran === mapel)
    return Array.from(new Set(filtered.map(m => m.menu_praktik))).sort()
  }, [kelasId, mapel, materiList])

  const handleApply = () => {
    const params = new URLSearchParams()
    if (mapel) params.set('mapel', mapel)
    if (menu) params.set('menu', menu)
    if (kelasId) params.set('kelasId', kelasId)
    if (guruId) params.set('guruId', guruId)
    
    router.push(`?${params.toString()}`)
  }

  const handleReset = () => {
    setMapel('')
    setMenu('')
    setKelasId('')
    setGuruId('')
    router.push('?')
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg border flex flex-wrap gap-4 items-end mb-6">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Kelas</label>
        <select 
          value={kelasId}
          onChange={(e) => {
            setKelasId(e.target.value)
            setMapel('')
            setMenu('')
          }}
          className="border border-gray-300 rounded-md p-2 text-sm focus:ring-green-500 focus:border-green-500 outline-none w-40"
        >
          <option value="">Semua Kelas</option>
          {kelasList.map(k => (
            <option key={k.id_kelas} value={k.id_kelas}>{k.nama_kelas}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Mata Pelajaran</label>
        <select 
          value={mapel}
          onChange={(e) => {
            setMapel(e.target.value)
            setMenu('')
          }}
          disabled={!kelasId}
          className="border border-gray-300 rounded-md p-2 text-sm focus:ring-green-500 focus:border-green-500 outline-none w-48 disabled:bg-gray-100 disabled:text-gray-400"
        >
          <option value="">{kelasId ? 'Semua Mapel' : 'Pilih Kelas Dulu'}</option>
          {availableMapels.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Menu Praktik</label>
        <select 
          value={menu}
          onChange={(e) => setMenu(e.target.value)}
          disabled={!mapel}
          className="border border-gray-300 rounded-md p-2 text-sm focus:ring-green-500 focus:border-green-500 outline-none w-48 disabled:bg-gray-100 disabled:text-gray-400"
        >
          <option value="">{mapel ? 'Semua Menu' : 'Pilih Mapel Dulu'}</option>
          {availableMenus.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {showGuruFilter && (
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Guru Penilai</label>
          <select 
            value={guruId}
            onChange={(e) => setGuruId(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm focus:ring-green-500 focus:border-green-500 outline-none w-48"
          >
            <option value="">Semua Guru</option>
            {guruList.map(g => (
              <option key={g.id_guru} value={g.id_guru}>{g.nama_guru}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-2">
        <button 
          onClick={handleApply}
          className="px-4 py-2 bg-sage-600 text-white font-medium rounded-md hover:bg-sage-700 transition-colors text-sm"
        >
          Cari
        </button>
        <button 
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
