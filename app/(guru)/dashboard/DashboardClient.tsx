'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, Users, BookOpen, Star, Play, X } from 'lucide-react'

interface Murid {
  id_murid: string
  nama_murid: string
  jk: string
}

interface Kelas {
  id_kelas: string
  nama_kelas: string
  tingkat: string
  murids: Murid[]
}

interface Materi {
  id_materi: string
  id_kelas: string
  mata_pelajaran: string
  materi_praktik: string
  menu_praktik: string
}

interface DashboardClientProps {
  kelasList: Kelas[]
  materiList: Materi[]
}

export default function DashboardClient({ kelasList, materiList }: DashboardClientProps) {
  const [expandedKelas, setExpandedKelas] = useState<Record<string, boolean>>({})
  const [selectedKelasMurid, setSelectedKelasMurid] = useState<Kelas | null>(null)

  const toggleKelas = (kelasId: string) => {
    setExpandedKelas(prev => ({
      ...prev,
      [kelasId]: !prev[kelasId]
    }))
  }

  return (
    <div className="space-y-10 mt-10">
      {/* SECTION: Kelas Saya */}
      <section>
        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2 border-l-4 border-sage-500 pl-3">
          <Users className="w-6 h-6 text-sage-600" />
          Kelas Saya
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kelasList.map(kelas => (
            <div key={kelas.id_kelas} className="bg-white rounded-2xl shadow-sm border p-5 hover:border-sage-400 hover:shadow-md hover:scale-[1.01] transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{kelas.nama_kelas}</h3>
                  <p className="text-sm text-gray-500">Tingkat {kelas.tingkat}</p>
                </div>
                <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
                  {kelas.murids.length} Murid
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedKelasMurid(kelas)}
                  className="flex-1 py-2 text-sm font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Lihat Murid
                </button>
                <Link 
                  href={`/mapel?kelasId=${kelas.id_kelas}`}
                  className="flex-1 py-2 text-sm font-bold text-center text-white bg-sage-600 rounded-lg hover:bg-sage-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Play className="w-4 h-4" /> Nilai Kelas Ini
                </Link>
              </div>
            </div>
          ))}
          {kelasList.length === 0 && (
            <div className="col-span-full p-6 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed">
              Tidak ada data kelas.
            </div>
          )}
        </div>
      </section>

      {/* SECTION: Materi Praktik */}
      <section>
        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2 border-l-4 border-sage-500 pl-3">
          <BookOpen className="w-6 h-6 text-sage-600" />
          Materi Praktik per Kelas
        </h2>
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          {kelasList.map(kelas => {
            const materiForKelas = materiList.filter(m => m.id_kelas === kelas.id_kelas)
            if (materiForKelas.length === 0) return null
            const isExpanded = expandedKelas[kelas.id_kelas]
            
            return (
              <div key={kelas.id_kelas} className="border-b last:border-b-0">
                <button 
                  onClick={() => toggleKelas(kelas.id_kelas)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                    <span className="font-bold text-gray-800 text-lg">{kelas.nama_kelas}</span>
                  </div>
                  <span className="text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                    {materiForKelas.length} Materi
                  </span>
                </button>
                
                {isExpanded && (
                  <div className="px-6 pb-4 pt-1 bg-gray-50/50">
                    <div className="space-y-3 mt-2">
                      {materiForKelas.map(materi => (
                        <div key={materi.id_materi} className="bg-white border rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:border-sage-400 hover:shadow-md hover:scale-[1.01] transition-all">
                          <div>
                            <p className="text-xs font-bold text-sage-600 mb-1 uppercase tracking-wider">{materi.mata_pelajaran}</p>
                            <h4 className="font-bold text-gray-800 leading-tight text-lg mb-1">{materi.materi_praktik}</h4>
                            <p className="text-sm text-gray-500">{materi.menu_praktik}</p>
                          </div>
                          <Link
                            href={`/murid?kelasId=${kelas.id_kelas}&materiId=${materi.id_materi}`}
                            className="inline-flex items-center justify-center gap-1 px-5 py-2.5 text-sm font-bold text-sage-700 bg-sage-50 border border-sage-200 rounded-lg hover:bg-sage-600 hover:text-white hover:border-sage-600 transition-all whitespace-nowrap"
                          >
                            <Star className="w-4 h-4" /> Mulai Nilai
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          {kelasList.every(k => materiList.filter(m => m.id_kelas === k.id_kelas).length === 0) && (
            <div className="p-8 text-center text-gray-500">
              Belum ada materi praktik yang terdaftar.
            </div>
          )}
        </div>
      </section>

      {/* Modal Daftar Murid */}
      {selectedKelasMurid && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Daftar Murid</h3>
                <p className="text-sm text-gray-500">Kelas {selectedKelasMurid.nama_kelas}</p>
              </div>
              <button 
                onClick={() => setSelectedKelasMurid(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-5">
              {selectedKelasMurid.murids.length > 0 ? (
                <div className="space-y-2">
                  {selectedKelasMurid.murids.map((murid, idx) => (
                    <div key={murid.id_murid} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-400 w-5">{idx + 1}.</span>
                        <span className="font-medium text-gray-800">{murid.nama_murid}</span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-white border rounded text-gray-500 font-medium">
                        {murid.jk === 'L' ? 'Laki-laki' : murid.jk === 'P' ? 'Perempuan' : murid.jk}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Belum ada murid di kelas ini.
                </div>
              )}
            </div>
            
            <div className="p-4 border-t bg-gray-50 text-right">
              <button 
                onClick={() => setSelectedKelasMurid(null)}
                className="px-4 py-2 bg-white border rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
