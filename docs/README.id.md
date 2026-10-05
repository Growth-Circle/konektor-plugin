# Konektor

[English](../README.md) · [Konektor](https://konektor.id) · [Izin akses](permissions.md)

Plugin ini menghubungkan Cursor dan Grok Bot ke workspace Konektor yang Anda izinkan melalui MCP dan OAuth.
GROW mengelola plugin ini di organisasi GitHub Growth-Circle.

**Pratinjau:** Client OAuth publik sudah dirilis. Pemeriksaan metadata produksi dan redirect ke login lulus.
Pengujian login Cursor dan Grok Bot serta persetujuan marketplace masih menunggu. Lihat [checklist rilis](release.md).

Anda dapat meminta ringkasan lead, hasil campaign, status pengiriman konversi, tracking WhatsApp, serta data lead atau Kotak Masuk yang diizinkan.
Plugin meminta akses baca. Plugin tidak meminta izin mengubah lead, mengirim pesan, atau mengubah anggaran iklan.

## Sebelum menghubungkan

- Gunakan akun Konektor dengan peran owner atau admin di workspace yang memenuhi syarat.
- Workspace harus berada dalam masa coba aktif atau memakai paket Starter atau lebih tinggi yang memenuhi syarat.
- Gunakan versi Cursor atau Grok Bot yang mendukung MCP HTTPS dan konfigurasi OAuth dengan client ID tetap.
- Admin tim mungkin perlu mengizinkan plugin atau server MCP.

## Hubungkan

Setelah listing marketplace disetujui, pasang **Konektor** dari Marketplace dan pilih **Authenticate** atau **Connect**.
Sebelum listing disetujui, gunakan konfigurasi MCP langsung untuk menguji koneksi.

1. Salin entri `konektor` dari [mcp.json](../mcp.json) ke konfigurasi MCP Anda.
2. Di Cursor, gunakan `.cursor/mcp.json` untuk proyek atau `~/.cursor/mcp.json` untuk akun Anda.
3. Di Grok Bot, tambahkan server MCP kustom dengan jenis **Remote HTTPS**.
4. Isi URL server dengan `https://mcp.konektor.id/mcp/claude`.
5. Isi OAuth client ID dengan `https://konektor.id/oauth/clients/cursor.json`.
6. Kosongkan client secret.
7. Mulai autentikasi dan masuk ke Konektor melalui browser.
8. Periksa izin yang diminta dan pilih workspace yang ingin dihubungkan.
9. Klik **Izinkan**. Dalam bahasa Inggris, tombolnya **Allow**.
10. Minta agent menampilkan daftar tool Konektor yang tersedia.

Klien menyimpan kredensial OAuth. Paket plugin tidak menyimpan kredensial dan tidak menjalankan server lokal.
Anda tidak perlu memasang Node.js untuk memakai plugin.

## Coba gunakan

- “Berapa total lead dan funnel konversi bulan ini?”
- “Campaign mana yang menghasilkan lead terbanyak dalam tujuh hari terakhir?”
- “Periksa konversi yang masih pending atau gagal terkirim.”
- “Tampilkan biaya iklan dan ROAS minggu ini.”
- “Periksa apakah tracking workspace saya sudah dikonfigurasi.”

Jika beberapa workspace terhubung, pilih workspace sebelum meminta datanya.
Untuk pertanyaan metrik, skill memakai tool agregat tanpa membaca isi lead atau pesan.
Tool lead dan Kotak Masuk dapat mengirim data pribadi ketika Anda secara eksplisit memintanya.

## Cabut akses

Buka **Pengaturan → API & Webhooks** di Konektor dan cari **Koneksi AI**.
Cari koneksi **Cursor / Grok Bot**, lalu klik **Cabut akses**.
Untuk beberapa workspace, buka workspace pertama yang dipilih saat persetujuan untuk menemukan dan mencabut koneksi.
Koneksi berhenti setelah akses dicabut. Menghapus plugin saja tidak mencabut izin di Konektor.

Cursor dan Grok Bot memakai client publik yang sama dalam paket ini.
Otorisasi baru untuk akun dan workspace pertama yang sama menggantikan koneksi sebelumnya.
Hubungkan ulang klien yang koneksi lamanya berhenti bekerja.

## Masalah koneksi

| Hasil | Tindakan |
| --- | --- |
| Autentikasi tidak dimulai | Periksa URL server dan client ID publik. Kosongkan client secret. |
| Permintaan tidak tersedia | Mulai autentikasi ulang. Permintaan mungkin kedaluwarsa atau sudah digunakan. |
| Tidak ada workspace | Periksa peran owner/admin dan langganan workspace. |
| Tidak ada tool | Selesaikan autentikasi dan baca ulang daftar tool. Periksa kebijakan koneksi tim. |
| Tool tertentu tidak muncul | Periksa izin yang diminta dan diberikan. Paket ini meminta akses baca. |
| Klien memakai callback lain | Cocokkan callback persis dengan metadata client yang didukung. Hubungi pengelola plugin. |

## Pengembangan dan rilis

Pemeriksaan pengelola membutuhkan Node.js 22 atau lebih baru. Paket tidak memiliki dependensi npm atau langkah build.

```sh
npm run validate
npm test
npm run verify:oauth
```

`verify:oauth` memeriksa metadata produksi dan penolakan request tanpa autentikasi.
Perintah ini tidak menyelesaikan login pengguna atau membuktikan pemanggilan tool setelah login.
Baca [checklist rilis](release.md) untuk pemeriksaan aplikasi dan marketplace berikutnya.

## Lisensi

Kode dan instruksi paket memakai [lisensi MIT](../LICENSE).
Nama dan logo Konektor menandai produk. Lisensi tidak memberikan hak merek dagang.
