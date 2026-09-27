export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      guru: {
        Row: {
          email: string | null
          id_guru: string
          mata_pelajaran: string | null
          nama_guru: string
          nip: string | null
          no_hp: string | null
        }
        Insert: {
          email?: string | null
          id_guru?: string
          mata_pelajaran?: string | null
          nama_guru: string
          nip?: string | null
          no_hp?: string | null
        }
        Update: {
          email?: string | null
          id_guru?: string
          mata_pelajaran?: string | null
          nama_guru?: string
          nip?: string | null
          no_hp?: string | null
        }
      }
      kelas: {
        Row: {
          id_kelas: string
          jumlah_murid: number | null
          nama_kelas: string
          tingkat: string | null
        }
        Insert: {
          id_kelas?: string
          jumlah_murid?: number | null
          nama_kelas: string
          tingkat?: string | null
        }
        Update: {
          id_kelas?: string
          jumlah_murid?: number | null
          nama_kelas?: string
          tingkat?: string | null
        }
      }
      materi_praktik: {
        Row: {
          id_kelas: string | null
          id_materi: string
          mata_pelajaran: string | null
          materi_praktik: string | null
          menu_praktik: string | null
        }
        Insert: {
          id_kelas?: string | null
          id_materi?: string
          mata_pelajaran?: string | null
          materi_praktik?: string | null
          menu_praktik?: string | null
        }
        Update: {
          id_kelas?: string | null
          id_materi?: string
          mata_pelajaran?: string | null
          materi_praktik?: string | null
          menu_praktik?: string | null
        }
      }
      murid: {
        Row: {
          id_kelas: string | null
          id_murid: string
          jk: string | null
          nama_murid: string
        }
        Insert: {
          id_kelas?: string | null
          id_murid?: string
          jk?: string | null
          nama_murid: string
        }
        Update: {
          id_kelas?: string | null
          id_murid?: string
          jk?: string | null
          nama_murid?: string
        }
      }
      penilaian: {
        Row: {
          catatan_guru: string | null
          created_at: string | null
          foto_produk: string | null
          id_guru: string | null
          id_kelas: string | null
          id_materi: string | null
          id_murid: string | null
          id_penilaian: string
          mata_pelajaran: string | null
          menu_praktik: string | null
          nilai_akhir: number | null
          skor_hasil_produk: number | null
          skor_persiapan: number | null
          skor_proses: number | null
          skor_sikap: number | null
          tanggal: string | null
        }
        Insert: {
          catatan_guru?: string | null
          created_at?: string | null
          foto_produk?: string | null
          id_guru?: string | null
          id_kelas?: string | null
          id_materi?: string | null
          id_murid?: string | null
          id_penilaian?: string
          mata_pelajaran?: string | null
          menu_praktik?: string | null
          nilai_akhir?: never // generated column, shouldn't be inserted
          skor_hasil_produk?: number | null
          skor_persiapan?: number | null
          skor_proses?: number | null
          skor_sikap?: number | null
          tanggal?: string | null
        }
        Update: {
          catatan_guru?: string | null
          created_at?: string | null
          foto_produk?: string | null
          id_guru?: string | null
          id_kelas?: string | null
          id_materi?: string | null
          id_murid?: string | null
          id_penilaian?: string
          mata_pelajaran?: string | null
          menu_praktik?: string | null
          nilai_akhir?: never
          skor_hasil_produk?: number | null
          skor_persiapan?: number | null
          skor_proses?: number | null
          skor_sikap?: number | null
          tanggal?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          id_guru: string | null
          nama: string | null
          role: string
        }
        Insert: {
          id: string
          id_guru?: string | null
          nama?: string | null
          role: string
        }
        Update: {
          id?: string
          id_guru?: string | null
          nama?: string | null
          role?: string
        }
      }
      rubrik: {
        Row: {
          aspek_penilaian: string | null
          bobot: number | null
          contoh_dinilai: string | null
          id_rubrik: string
          ranah: string | null
        }
        Insert: {
          aspek_penilaian?: string | null
          bobot?: number | null
          contoh_dinilai?: string | null
          id_rubrik?: string
          ranah?: string | null
        }
        Update: {
          aspek_penilaian?: string | null
          bobot?: number | null
          contoh_dinilai?: string | null
          id_rubrik?: string
          ranah?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
