# PRD — CuliTrack

### Pengembangan E-Assessment Praktik Kuliner untuk Mendukung Penilaian dan Dokumentasi Hasil Praktik Murid

**Versi:** 2.0 (konsolidasi — termasuk sistem login & role) **Tanggal:** 26 September 2026 **Pemilik Proyek:** Fadhlan (Guru Tata Boga — bahan Seminar Karya Inovasi Pendidikan) **Disusun oleh:** Tim Pengembang

---

## 1. Latar Belakang

Penilaian praktik siswa Tata Boga saat ini masih dilakukan secara manual di kertas. Proses ini rawan hilang, sulit direkap ulang, dan tidak terdokumentasi secara visual. CuliTrack dikembangkan sebagai inovasi asesmen digital yang memungkinkan guru melakukan penilaian praktik langsung dari perangkat (laptop/tablet) saat kegiatan praktik berlangsung, lengkap dengan dokumentasi foto hasil produk. Aplikasi juga dilengkapi panel admin agar data guru, murid, kelas, dan mata pelajaran dapat dikelola secara terpusat tanpa perlu mengubah kode aplikasi.

## 2. Tujuan Produk

- Menggantikan penilaian manual berbasis kertas dengan sistem digital.
- Menstandarkan penilaian menggunakan rubrik berbobot yang sudah ditetapkan.
- Menyediakan dokumentasi visual (foto) hasil praktik siswa.
- Menghasilkan nilai akhir otomatis tanpa perhitungan manual.
- Memisahkan akses berdasarkan peran (Admin vs Guru) melalui sistem login.
- Memungkinkan Admin mengelola data master (guru, murid, kelas, mapel) secara mandiri.
- Data dapat diakses lewat web dan diunduh dalam format Excel.

## 3. Peran Pengguna

| Peran | Deskripsi |
| --- | --- |
| **Admin** | Mengelola data master (Guru, Murid, Kelas, Mapel & Materi Praktik). Melihat seluruh riwayat penilaian dari semua guru. Tidak melakukan penilaian. |
| **Guru** | Login dengan akun yang dibuatkan Admin. Melakukan penilaian praktik murid. Hanya melihat riwayat penilaian miliknya sendiri. Tidak dapat mengakses halaman kelola data. |

## 4. Ruang Lingkup

### 4.1 Termasuk (MVP)

- Login berbasis email & password, dengan pembagian akses sesuai peran (Admin/Guru)
- Panel Admin: kelola Guru (termasuk pembuatan akun login), Murid, Kelas, Mata Pelajaran & Materi Praktik
- Alur penilaian guru: Pilih Kelas → Mata Pelajaran → Materi Praktik → Menu Praktik → Murid (tanpa perlu memilih nama guru — otomatis dari akun yang login)
- Form penilaian per murid (satu per satu): 4 skor numerik (0–100), catatan, 1 foto
- Perhitungan nilai akhir otomatis berdasarkan bobot rubrik
- Riwayat penilaian: guru melihat miliknya sendiri, admin melihat semua
- Unduh data riwayat dalam format Excel (.xlsx)
- Tampilan web responsif (desktop & tablet)

### 4.2 Tidak Termasuk (Fase Selanjutnya)

- Dashboard rekap otomatis / grafik perkembangan nilai dari waktu ke waktu
- Notifikasi / pengingat otomatis
- Aplikasi mobile native (cukup web responsive)
- Admin melakukan penilaian (admin murni kelola data)

## 5. Rubrik Penilaian

| Aspek Penilaian | Ranah | Contoh yang Dinilai | Bobot |
| --- | --- | --- | --- |
| Persiapan | Psikomotorik | Menyiapkan alat dan bahan, mise en place, kesiapan area kerja | 15% |
| Proses Praktik | Psikomotorik | Teknik pengolahan, penggunaan alat, mengikuti SOP, K3, ketepatan waktu | 35% |
| Hasil Produk | Psikomotorik | Rasa, tekstur, aroma, warna, bentuk, penyajian | 30% |
| Sikap | Afektif | Disiplin, tanggung jawab, kerja sama, kebersihan, ketelitian | 20% |
| Catatan Guru | Pendukung asesmen | Feedback terhadap proses dan hasil praktik | — (tidak dihitung) |
| Foto Produk | Dokumentasi | Bukti hasil produk | — (tidak dihitung) |
| **Total** |  |  | **100%** |

**Rumus Nilai Akhir:**

```
Nilai Akhir = (Persiapan × 0.15) + (Proses Praktik × 0.35) + (Hasil Produk × 0.30) + (Sikap × 0.20)
```

Guru hanya mengisi 4 skor mentah (0–100); nilai akhir dihitung otomatis oleh sistem (di level database), tanpa input manual tambahan.

## 6. Model Data

### 6.1 Entitas & Atribut

**Profiles** (terhubung ke Supabase Auth — menyimpan role login)

| Kolom | Tipe |
| --- | --- |
| id | UUID (PK, = id dari auth.users) |
| role | Text ("admin" / "guru") |
| id_guru | UUID (FK → Guru, hanya diisi jika role = guru) |
| nama | Text |

**Guru**

| Kolom | Tipe |
| --- | --- |
| id_guru | UUID (PK) |
| nama_guru | Text |
| nip | Text |
| mata_pelajaran | Text |
| email | Text |
| no_hp | Text |

**Kelas**

| Kolom | Tipe |
| --- | --- |
| id_kelas | UUID (PK) |
| nama_kelas | Text |
| tingkat | Text (XI/XII) |
| jumlah_murid | Number |

**Murid**

| Kolom | Tipe |
| --- | --- |
| id_murid | UUID (PK) |
| nama_murid | Text |
| jk | Text (L/P) |
| id_kelas | UUID (FK → Kelas) |

**Materi_Praktik**

| Kolom | Tipe |
| --- | --- |
| id_materi | UUID (PK) |
| id_kelas | UUID (FK → Kelas) |
| mata_pelajaran | Text |
| materi_praktik | Text |
| menu_praktik | Text |

**Rubrik** (data referensi, tidak diubah pengguna umum)

| Kolom | Tipe |
| --- | --- |
| id_rubrik | UUID (PK) |
| aspek_penilaian | Text |
| ranah | Text |
| contoh_dinilai | Text |
| bobot | Number |

**Penilaian** (tabel transaksi utama)

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| id_penilaian | UUID (PK, auto) |  |
| tanggal | Date | Auto-isi tanggal input |
| id_guru | UUID (FK) | Diambil otomatis dari profil user yang login |
| id_kelas | UUID (FK) |  |
| mata_pelajaran | Text | Terisi otomatis dari Materi_Praktik |
| id_materi | UUID (FK) |  |
| menu_praktik | Text | Terisi otomatis dari Materi_Praktik |
| id_murid | UUID (FK) |  |
| skor_persiapan | Number (0–100) |  |
| skor_proses | Number (0–100) |  |
| skor_hasil_produk | Number (0–100) |  |
| skor_sikap | Number (0–100) |  |
| nilai_akhir | Number (computed) | Auto-hitung di level database, read-only |
| catatan_guru | Text (long) |  |
| foto_produk | Image/URL |  |

### 6.2 Relasi Data

```
auth.users 1—1 Profiles
Profiles N—1 Guru (jika role = guru)
Kelas 1—N Murid
Kelas 1—N Materi_Praktik
Guru 1—N Penilaian
Kelas 1—N Penilaian
Materi_Praktik 1—N Penilaian
Murid 1—N Penilaian
```

## 7. Alur Pengguna (User Flow)

### 7.1 Alur Guru

```
Login (email & password)
  → Dashboard Guru
    → Pilih Kelas
      → Pilih Mata Pelajaran (terfilter dari Kelas)
        → Pilih Materi Praktik (terfilter dari Mapel)
          → Pilih Menu Praktik (terfilter dari Materi)
            → Pilih Murid (terfilter dari Kelas)
              → Form Penilaian (4 skor + catatan + foto)
                → Simpan → Nilai akhir tampil otomatis
                  → [Nilai Murid Berikutnya] atau [Kembali ke Dashboard]
```

Guru dapat membuka **Riwayat** — hanya menampilkan entri penilaian miliknya sendiri, dengan tombol Unduh Excel.

### 7.2 Alur Admin

```
Login (email & password)
  → Dashboard Admin
    → Kelola Guru (tambah/ubah/hapus akun & data guru)
    → Kelola Murid (tambah/ubah/hapus, per kelas)
    → Kelola Kelas & Mapel/Materi Praktik (tambah/ubah/hapus)
    → Riwayat (melihat seluruh data penilaian dari semua guru, unduh Excel)
```

## 8. Navigasi Aplikasi

**Navbar Guru** (statis di semua halaman guru): Logo CuliTrack | Dashboard | Penilaian | Riwayat | Logout

**Navbar Admin** (statis di semua halaman admin): Logo CuliTrack | Dashboard | Kelola Guru | Kelola Murid | Kelola Kelas & Mapel | Riwayat | Logout

**Stepper alur penilaian** (Kelas > Mapel > Materi > Menu > Murid) muncul **di dalam halaman**, hanya pada halaman-halaman alur penilaian — bukan bagian dari navbar. Step yang sudah dilewati diberi tanda centang, step aktif ditandai warna solid, step berikutnya abu-abu muda.

## 9. Daftar Layar (Screens)

**Umum**

1. Login

**Guru** 2. Dashboard Guru 3. Pilih Kelas 4. Pilih Mata Pelajaran 5. Pilih Materi Praktik 6. Pilih Menu Praktik 7. Pilih Murid 8. Form Penilaian 9. Konfirmasi Tersimpan 10. Riwayat (milik sendiri) & Unduh Data

**Admin** 11. Dashboard Admin 12. Kelola Guru (list, tambah, ubah, hapus + buat akun login) 13. Kelola Murid (list, tambah, ubah, hapus, per kelas) 14. Kelola Kelas & Mapel/Materi Praktik (list, tambah, ubah, hapus) 15. Riwayat (seluruh guru) & Unduh Data

## 10. Kebutuhan Fungsional

| ID | Kebutuhan |
| --- | --- |
| F1 | Pengguna harus login (email & password) sebelum mengakses aplikasi |
| F2 | Sistem membedakan akses berdasarkan role (Admin/Guru) dan mengarahkan ke dashboard yang sesuai |
| F3 | Sistem menampilkan daftar kelas, mapel, materi, menu, dan murid secara berjenjang (dependent filtering) |
| F4 | Guru dapat menginput 4 skor numerik (0–100) per murid |
| F5 | Sistem menghitung nilai akhir otomatis berdasarkan rumus bobot rubrik |
| F6 | Guru dapat menambahkan catatan teks bebas |
| F7 | Guru dapat mengunggah 1 foto produk per murid per sesi |
| F8 | Sistem menyimpan seluruh data penilaian secara permanen |
| F9 | Sistem menyediakan riwayat penilaian, terfilter sesuai role (guru: milik sendiri, admin: semua) |
| F10 | Sistem menyediakan fitur unduh data riwayat dalam format Excel (.xlsx) |
| F11 | Admin dapat menambah, mengubah, dan menghapus data Guru, termasuk membuat akun login guru baru |
| F12 | Admin dapat menambah, mengubah, dan menghapus data Murid |
| F13 | Admin dapat menambah, mengubah, dan menghapus data Kelas, Mata Pelajaran, dan Materi Praktik |
| F14 | Guru tidak dapat mengakses halaman kelola data (dibatasi lewat role) |
| F15 | Aplikasi dapat diakses melalui browser web di desktop maupun tablet |

## 11. Kebutuhan Non-Fungsional

- **Keamanan:** akses data dibatasi lewat Row Level Security (RLS) di level database, bukan hanya di tampilan.
- **Kegunaan:** guru & admin tanpa latar belakang teknis dapat menggunakan tanpa training tambahan.
- **Kecepatan:** satu siklus penilaian 1 murid dapat diselesaikan dalam \< 2 menit.
- **Responsif:** tampilan menyesuaikan baik di layar laptop maupun tablet.
- **Ketersediaan data:** data tidak boleh hilang; tersimpan di database persisten.

## 12. Kriteria Sukses (Definition of Done — MVP)

- Login berhasil membedakan akses Admin dan Guru sesuai peran masing-masing.
- Admin dapat mengelola seluruh data master tanpa bantuan developer.
- Guru dapat menyelesaikan alur penuh penilaian tanpa hambatan, tanpa perlu memilih nama sendiri.
- Nilai akhir selalu terhitung benar sesuai rumus, tanpa kalkulasi manual.
- Data riwayat terfilter dengan benar sesuai role saat diunduh sebagai Excel.
- Aplikasi ter-deploy dan dapat diakses publik melalui URL Vercel.

## 13. Sumber Data Awal

Data referensi (Guru, Kelas, Murid, Materi Praktik, Rubrik) bersumber dari `CULITRACK_DATABASE.xlsx` yang telah disediakan klien. Catatan: data Guru saat ini baru mencakup 1 entri dan perlu dilengkapi lewat panel Admin agar sesuai jumlah mata pelajaran yang diampu (Makanan Indonesia, Makanan Oriental, dst).

## 14. Rencana Dokumentasi Proyek

Sebagai bahan bukti pengerjaan untuk seminar karya inovasi klien, setiap tahap pengembangan (desain data, pembuatan antarmuka, hasil uji coba) akan didokumentasikan dalam bentuk tangkapan layar dan catatan progres terpisah dari dokumen ini.

## 15. Timeline Pengerjaan

| Tahap | Kegiatan |
| --- | --- |
| 1 | Finalisasi PRD & struktur data (dokumen ini) |
| 2 | Setup database & Row Level Security |
| 3 | Implementasi login & role (Admin/Guru) |
| 4 | Pengembangan panel Admin (kelola guru, murid, kelas, mapel/materi) |
| 5 | Pengembangan alur penilaian guru |
| 6 | Implementasi logika perhitungan nilai otomatis |
| 7 | Implementasi fitur riwayat & export Excel (terfilter sesuai role) |
| 8 | Pengujian alur end-to-end untuk kedua role |
| 9 | Polish tampilan (navbar, stepper, konsistensi visual) |
| 10 | Deploy ke Vercel |
| 11 | Dokumentasi akhir untuk bahan seminar |