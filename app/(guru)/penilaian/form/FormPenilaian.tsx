'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { simpanPenilaian } from '../actions'

const compressImage = (file: File, maxWidth = 1080, quality = 0.7): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(newFile);
              } else {
                resolve(file); // fallback to original if blob fails
              }
            },
            'image/jpeg',
            quality
          );
        } else {
          resolve(file);
        }
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

interface FormPenilaianProps {
  murid: any
  kelas: any
  materi: any
}

export default function FormPenilaian({ murid, kelas, materi }: FormPenilaianProps) {
  const router = useRouter()
  
  // State for form
  const [persiapan, setPersiapan] = useState<string>('')
  const [proses, setProses] = useState<string>('')
  const [hasil, setHasil] = useState<string>('')
  const [sikap, setSikap] = useState<string>('')
  const [catatan, setCatatan] = useState<string>('')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  
  // State for success
  const [successData, setSuccessData] = useState<{ nilai_akhir: number } | null>(null)

  // Live preview calculation
  const nilaiAkhir = useMemo(() => {
    const p = parseFloat(persiapan) || 0
    const pr = parseFloat(proses) || 0
    const h = parseFloat(hasil) || 0
    const s = parseFloat(sikap) || 0
    return ((p * 0.15) + (pr * 0.35) + (h * 0.30) + (s * 0.20)).toFixed(2)
  }, [persiapan, proses, hasil, sikap])

  const validateScore = (val: string) => {
    const num = parseFloat(val)
    return val === '' || (!isNaN(num) && num >= 0 && num <= 100)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.append('id_murid', murid.id_murid)
    formData.append('id_materi', materi.id_materi)
    formData.append('id_kelas', kelas.id_kelas)
    if (selectedFile) {
      formData.append('foto', selectedFile)
    }

    try {
      const data = await simpanPenilaian(formData)
      setSuccessData(data)
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan penilaian')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (successData) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Penilaian Berhasil Tersimpan!</h2>
        <p className="text-gray-600 mb-6">Murid: <span className="font-semibold">{murid.nama_murid}</span></p>
        
        <div className="bg-gray-50 rounded-lg p-6 inline-block mb-8">
          <p className="text-sm text-gray-500 mb-1">Nilai Akhir</p>
          <p className="text-4xl font-bold text-sage-600">{Number(successData.nilai_akhir).toFixed(2)}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href={`/murid?kelasId=${kelas.id_kelas}&materiId=${materi.id_materi}`}
            className="px-6 py-3 bg-sage-600 text-white font-medium rounded-lg hover:bg-sage-700 transition-colors"
          >
            Nilai Murid Berikutnya
          </Link>
          <Link 
            href="/dashboard"
            className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-8">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skor Persiapan (15%)</label>
              <input
                type="number"
                name="persiapan"
                required
                min="0"
                max="100"
                value={persiapan}
                onChange={(e) => validateScore(e.target.value) && setPersiapan(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-green-500 focus:border-sage-500 outline-none"
                placeholder="0-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skor Proses Praktik (35%)</label>
              <input
                type="number"
                name="proses"
                required
                min="0"
                max="100"
                value={proses}
                onChange={(e) => validateScore(e.target.value) && setProses(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-green-500 focus:border-sage-500 outline-none"
                placeholder="0-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skor Hasil Produk (30%)</label>
              <input
                type="number"
                name="hasil_produk"
                required
                min="0"
                max="100"
                value={hasil}
                onChange={(e) => validateScore(e.target.value) && setHasil(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-green-500 focus:border-sage-500 outline-none"
                placeholder="0-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skor Sikap (20%)</label>
              <input
                type="number"
                name="sikap"
                required
                min="0"
                max="100"
                value={sikap}
                onChange={(e) => validateScore(e.target.value) && setSikap(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-green-500 focus:border-sage-500 outline-none"
                placeholder="0-100"
              />
            </div>
          </div>

          {/* Live Preview Section */}
          <div className="flex items-center justify-center bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200">
            <div className="text-center">
              <p className="text-gray-500 font-medium mb-2">Live Preview Nilai Akhir</p>
              <h3 className="text-6xl font-bold text-sage-600">
                {nilaiAkhir}
              </h3>
            </div>
          </div>
        </div>

        <hr className="my-6" />

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Hasil Produk</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-sage-50 text-sage-700 border border-sage-200 rounded-lg hover:bg-sage-100 cursor-pointer font-bold transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Buka Kamera (Mobile/Tablet)
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="sr-only"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setIsCompressing(true)
                      try {
                        const compressed = await compressImage(file)
                        setSelectedFile(compressed)
                        setSelectedFileName(compressed.name + ` (${(compressed.size / 1024 / 1024).toFixed(2)} MB)`)
                      } catch (err) {
                        setSelectedFile(file)
                        setSelectedFileName(file.name)
                      } finally {
                        setIsCompressing(false)
                      }
                    }
                  }}
                />
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer font-bold transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                Pilih dari Galeri/File
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setIsCompressing(true)
                      try {
                        const compressed = await compressImage(file)
                        setSelectedFile(compressed)
                        setSelectedFileName(compressed.name + ` (${(compressed.size / 1024 / 1024).toFixed(2)} MB)`)
                      } catch (err) {
                        setSelectedFile(file)
                        setSelectedFileName(file.name)
                      } finally {
                        setIsCompressing(false)
                      }
                    }
                  }}
                />
              </label>
            </div>
            {isCompressing && (
              <p className="mt-2 text-sm text-yellow-600 font-medium">⏳ Mengompres foto agar cepat diupload...</p>
            )}
            {!isCompressing && selectedFileName && (
              <p className="mt-2 text-sm text-sage-600 font-medium">📸 Terpilih: {selectedFileName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Guru</label>
            <textarea
              name="catatan"
              rows={3}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 focus:ring-green-500 focus:border-sage-500 outline-none"
              placeholder="Tambahkan catatan evaluasi..."
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Penilaian'}
          </button>
        </div>
      </form>
    </div>
  )
}
