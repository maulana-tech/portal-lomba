# Portal Lomba UTDI

## Deskripsi
**Portal Lomba UTDI** adalah sebuah platform digital yang dirancang khusus untuk mahasiswa Universitas Teknologi Digital Indonesia (UTDI). Aplikasi ini berfungsi sebagai pusat informasi kompetisi, media untuk rekrutmen tim, galeri untuk memamerkan proyek-proyek inovatif, serta wadah untuk membangun komunitas yang solid di kalangan mahasiswa UTDI.

## Tujuan Aplikasi
*   **Sentralisasi Informasi**: Menyediakan satu tempat untuk semua informasi terkait kompetisi akademik dan non-akademik, sehingga mahasiswa tidak ketinggalan kesempatan.
*   **Kolaborasi Tim**: Memfasilitasi mahasiswa dalam menemukan rekan tim dengan minat dan keahlian yang sesuai untuk berpartisipasi dalam lomba.
*   **Portofolio Proyek**: Memberikan panggung bagi mahasiswa untuk menampilkan hasil karya dan proyek yang telah mereka kerjakan, yang dapat dilihat oleh sesama mahasiswa, dosen, dan pihak industri.
*   **Membangun Komunitas**: Menciptakan ruang interaksi bagi mahasiswa UTDI untuk berdiskusi, berbagi pengetahuan, dan saling mendukung dalam pengembangan diri.

## Alur Pengguna (User Flow)
1.  **Pendaftaran & Login**: Pengguna membuat akun atau masuk ke dalam sistem.
2.  **Melengkapi Profil**: Pengguna mengisi profil pribadi, termasuk keahlian, minat, dan portofolio.
3.  **Eksplorasi**:
    *   **Mencari Lomba**: Pengguna menelusuri daftar kompetisi yang tersedia berdasarkan kategori atau kata kunci.
    *   **Mencari Tim**: Pengguna mencari tim yang sedang membuka rekrutmen anggota baru.
    *   **Showcase Proyek**: Pengguna melihat-lihat proyek yang telah diunggah oleh mahasiswa lain.
4.  **Interaksi**:
    *   **Mendaftar Lomba**: Pengguna mendaftarkan diri atau timnya pada suatu kompetisi.
    *   **Membuat & Mengelola Tim**: Pengguna dapat membuat tim baru, mengundang anggota, dan mengelola halaman tim.
    *   **Bergabung dengan Komunitas**: Pengguna bergabung dalam forum diskusi atau grup komunitas untuk berinteraksi.
5.  **Kontribusi**:
    *   **Mengunggah Proyek**: Pengguna mengunggah detail proyek mereka ke showcase.

## Fitur Utama
*   **Dashboard Informasi Lomba**: Menampilkan daftar lomba yang akan datang, sedang berlangsung, dan telah selesai.
*   **Pencarian & Filter Lomba**: Fitur pencarian canggih dengan filter berdasarkan kategori (misalnya, IT, bisnis, desain), tingkat, dan penyelenggara.
*   **Sistem Rekrutmen Tim**:
    *   Pengguna bisa membuat "postingan" pencarian anggota tim.
    *   Profil pengguna yang detail untuk menunjukkan keahlian.
    *   Fitur untuk mengirim permintaan bergabung ke sebuah tim.
*   **Showcase Proyek**: Galeri proyek mahasiswa yang dapat diurutkan berdasarkan popularitas, tanggal, atau teknologi yang digunakan.
*   **Forum Komunitas**: Ruang diskusi online di mana mahasiswa dapat bertanya, berbagi informasi, dan berjejaring.
*   **Sistem Notifikasi**: Pengingat untuk tenggat waktu pendaftaran lomba, pembaruan dari tim, dan aktivitas komunitas.

## Target Kualitas & Skalabilitas
Selain fitur-fitur fungsional di atas, pengembangan aplikasi ini juga menargetkan kualitas sebagai berikut:
*   **Backend yang Andal**: Membangun layanan backend yang efisien, aman, dan mudah untuk dikelola.
*   **UI/UX yang Interaktif**: Merancang antarmuka pengguna yang tidak hanya menarik secara visual tetapi juga intuitif dan responsif, memberikan pengalaman pengguna yang mulus.
*   **Skalabilitas Tinggi**: Mengembangkan aplikasi dengan arsitektur yang kuat, mampu menangani beban lebih dari 1000 pengguna secara bersamaan tanpa penurunan performa.

---

## Petunjuk Penggunaan Template (Untuk Developer)

### Tumpukan Teknologi
Proyek ini dibangun dengan:
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

Semua komponen shadcn/ui telah diunduh di bawah `@/components/ui`.

### Struktur File
- `index.html` - Titik masuk HTML
- `vite.config.ts` - File konfigurasi Vite
- `tailwind.config.js` - File konfigurasi Tailwind CSS
- `package.json` - Dependensi dan skrip NPM
- `src/app.tsx` - Komponen root proyek
- `src/main.tsx` - Titik masuk proyek
- `src/index.css` - Konfigurasi CSS yang ada

### Komponen
- Semua komponen shadcn/ui telah diunduh sebelumnya dan tersedia di `@/components/ui`

### Styling
- Tambahkan gaya global ke `src/index.css` atau buat file CSS baru sesuai kebutuhan
- Gunakan kelas Tailwind untuk menata komponen

### Pengembangan
- Impor komponen dari `@/components/ui` di komponen React Anda
- Sesuaikan UI dengan memodifikasi konfigurasi Tailwind

### Catatan
- Alias path `@/` menunjuk ke direktori `src/`

### Berkontribusi
Silakan baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk detail tentang kode etik kami, dan proses untuk mengirimkan pull request kepada kami.

### Perintah
**Instal Dependensi**
```shell
pnpm i
```
**Mulai Pratinjau**
```shell
pnpm run dev
```
**Untuk Build**
```shell
pnpm run build
```
