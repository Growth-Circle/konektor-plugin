# Permissions / Izin akses

Cursor and Grok Bot share this package's public client.
A new authorization for the same account and first selected workspace replaces the previous connection.
For multiple workspaces, manage the connection from the first selected workspace.

Cursor dan Grok Bot memakai client publik yang sama dalam paket ini.
Otorisasi baru untuk akun dan workspace pertama yang sama menggantikan koneksi sebelumnya.
Untuk beberapa workspace, kelola koneksi dari workspace pertama yang dipilih.

The plugin requests the following permissions. The Konektor consent page shows them before you authorize access.

Plugin meminta izin berikut. Halaman persetujuan Konektor menampilkannya sebelum Anda memberikan akses.

| Scope | English | Bahasa Indonesia |
| --- | --- | --- |
| `agent.workspace.read` | Read workspace information | Baca informasi workspace |
| `agent.analytics.read` | Read aggregate analytics and tracking status | Baca analitik agregat dan status tracking |
| `agent.leads.read` | Read lead records when requested | Baca data lead ketika diminta |
| `agent.conversions.read` | Read conversion delivery status and logs | Baca status pengiriman dan log konversi |
| `agent.ads.read` | Read ad performance and spend | Baca performa dan biaya iklan |
| `agent.rotators.read` | Read WhatsApp links and Lead Form settings | Baca Link WhatsApp dan pengaturan Lead Form |
| `agent.inbox.read` | Read authorized Inbox conversations and messages | Baca percakapan dan pesan Kotak Masuk yang diizinkan |
| `agent.rules.read` | Read WhatsApp rules | Baca rule WhatsApp |
| `agent.agentic.read` | Read Agentic settings and source information | Baca pengaturan Agentic dan informasi sumber |
| `offline_access` | Refresh the connection while the grant remains valid | Perbarui koneksi selama izin masih sah |

Select the workspaces you need. Selecting all workspaces also includes eligible workspaces you join as an owner or admin later.
Pilih workspace yang diperlukan. Pilihan semua workspace juga mencakup workspace baru tempat Anda menjadi owner atau admin.

Lead records and Inbox messages can contain personal data. Request them only when the task requires them.
Data lead dan pesan Kotak Masuk dapat berisi data pribadi. Minta data tersebut hanya jika tugas memerlukannya.

Write permissions are absent from this version's configuration. The server does not grant them from a read-only request.
Konfigurasi versi ini tidak meminta izin tulis. Server tidak memberikan izin tulis dari permintaan akses baca.

OAuth access can require renewal after 30 days of inactivity or 90 days from authorization.
Akses OAuth dapat memerlukan otorisasi ulang setelah tidak digunakan selama 30 hari atau 90 hari sejak persetujuan.
