# DUIT by classy — Web Akuntansi & Kas Kelas

Aplikasi web pencatatan keuangan dan transparansi kas bulanan kelas yang terintegrasi langsung dengan platform akademik **Classy** ([classy.exars.my.id](https://classy.exars.my.id)).

---

## ✨ Fitur Unggulan

1. **Dashboard Pengeluaran Kas & Bukti Nota Fisik (Default View)**:
   - Pantau riwayat belanja kelas, kategori belanja, nominal, dan bukti foto struk/nota fisik.
   - Filter pencarian cepat dan kategori (*Operasional, Kebersihan, Fotokopi, Konsumsi, Wishlist*).
2. **Kas Bulanan (Semester Ganjil & Genap)**:
   - Pencatatan format bulanan dengan matriks transparansi pembayaran per siswa.
   - 1-Click WhatsApp reminder ke siswa penunggak atau broadcast tagihan ke grup kelas.
3. **Modal "Kumpulin Kas"**:
   - Pembayaran fleksibel via QRIS dinamis, transfer Bank/E-Wallet (1-click copy no rekening), atau tunai.
   - Kirim bukti konfirmasi pembayaran otomatis via WhatsApp ke nomor bendahara.
4. **Wishlist Pengadaan Kelas**:
   - Tentukan target barang kebutuhan kelas (misal: kipas angin, dispenser, dispenser sabun, dekorasi).
   - Alokasi dana kas langsung dari saldo aktif dengan progress bar tercapai/proses.
5. **Sinkronisasi Otomatis Database Classy**:
   - Terhubung langsung ke workspace **M.Log B (26B)** dari Classy untuk sinkronisasi daftar mahasiswa dan nomor kontak.
6. **Ekspor & Cetak Laporan (Mading Mode)**:
   - Unduh rekapan lengkap dalam file Excel (.CSV).
   - Tampilan cetak ramah printer / simpan PDF untuk arsip mading kelas.

---

## 🚀 Cara Menjalankan di Lokal

1. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
2. Buka peramban di [http://localhost:3000](http://localhost:3000).

---

## 🔒 Akses Default Bendahara

- **PIN Default**: `1234`
- Klik tombol **"Masuk Bendahara"** di pojok kanan atas, lalu masukkan angka `1234`.
- Anda dapat mengganti PIN ini kapan saja di tab **"Siswa & Pengaturan"** -> **"Profil & Pengaturan"**.

---

## ☁️ Menghubungkan ke Supabase (Opsional / Siap Pakai)

Aplikasi ini sudah dilengkapi dengan **penyimpanan lokal otomatis (LocalStorage)** sehingga langsung dapat digunakan dan datanya tersimpan di peramban.

Untuk mengaktifkan sinkronisasi cloud real-time dengan project Supabase Anda:
1. Buka Supabase Dashboard project Anda di:
   [https://supabase.com/dashboard/project/qgdwpxqqybvtdogydgxa](https://supabase.com/dashboard/project/qgdwpxqqybvtdogydgxa)
2. Masuk ke menu **SQL Editor**, buka file `supabase/schema.sql` dari proyek ini, lalu klik **Run** untuk membuat tabel dan data awal.
3. Salin **anon public key** dari menu **Settings -> API**, lalu masukkan ke file `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://qgdwpxqqybvtdogydgxa.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=masukkan_anon_key_anda_disini
   ```
4. Restart development server (`npm run dev`).
