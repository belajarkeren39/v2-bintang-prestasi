# Bintang Prestasi — perbaikan kamera IFP dan HP

1. Unggah seluruh isi folder ini ke hosting HTTPS. `index.html`, `palm.js`, `game.js`, `hand-worker.js`, `sensor-engine.js`, `vendor/`, dan `model/` harus ikut. Jangan membuka dengan klik dua kali `index.html`.
2. Pilih **Kamera Telapak Tangan**, lalu **Aktifkan kamera**. Pada HP, pilihan awal mendahulukan kamera depan. Pilihan kamera USB tersedia setelah izin kamera diberikan.
3. Di IFP Android, mulai dengan mesin **Otomatis**. Jika tersendat atau sensor berhenti, pilih **CPU**. Pergantian pilihan akan memuat ulang kamera. Tunggu pemanasan sekitar 15 detik dan bandingkan indikator pada posisi yang sama.
4. Tampilkan telapak dengan jelas. Arahkan titik kuning ke kotak latihan. Saat bermain, gelembung berhenti selama ditahan agar mudah dipilih.
5. Gunakan tombol **Cermin** jika arah gerak tidak sesuai pratinjau. Bila tetap bermasalah, kontrol sentuh tetap tersedia.

Paket sudah menyertakan model lokal sehingga sensor tidak perlu mengambilnya dari CDN selama semua berkas tersedia. Ini bukan aplikasi offline yang terpasang: halaman tetap harus bisa diakses melalui hosting yang sesuai. HTTPS atau localhost diperlukan untuk akses kamera yang dapat diandalkan; HTTP melalui alamat IP jaringan biasa umumnya tidak cukup.

Indikator `deteksi/dtk` menunjukkan frekuensi hasil sensor, sedangkan `ms` menunjukkan rata-rata waktu pemrosesan. `Worker` berarti pemrosesan terpisah; `Kompatibilitas` berarti browser memakai jalur cadangan yang dapat membebani animasi. Tidak ada jaminan kinerja pada semua Android IFP.

Catatan versi: fokus perbaikan adalah kamera dan respons tangan. Pilihan durasi 10/15/30 menit pada aplikasi awal belum berfungsi (sesi tetap delapan soal). Pilihan jangkauan belum merupakan kalibrasi gerakan. Lihat laporan `AUDIT-BINTANG-PRESTASI.md` untuk temuan lengkap dan prosedur uji.

Pengujian logika: jalankan `node --test tests/sensor.test.cjs` jika Node.js tersedia. Kamera fisik tetap perlu diuji di HP dan IFP tujuan.
