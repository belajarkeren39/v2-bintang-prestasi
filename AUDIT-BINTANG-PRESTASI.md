# Audit Bintang Prestasi

Tanggal: 1 November 2026. Sumber: `v1-bintang-prestasi-main.zip`.
Perangkat yang dilaporkan: IFP Hisense 75 inci, menjalankan Android bawaan. Model panel, versi Android/browser, kamera, dan jarak pemain belum diketahui.

## Kesimpulan

Penyebab pemilihan kamera belakang di HP ditemukan langsung pada kode: semua permintaan kamera tidak menyertakan `facingMode`. Browser bebas menentukan kamera.

Untuk IFP, ditemukan beberapa hambatan yang dapat menjelaskan sensor lambat: deteksi sinkron di jalur animasi, jeda deteksi yang meningkat, waktu berlaku kursor yang terlalu pendek untuk perangkat lambat, serta target jawaban yang terus bergerak. Ini adalah temuan kode dan dugaan penyebab gejala; belum merupakan diagnosis perangkat Hisense melalui pengukuran langsung. Ukuran fisik 75 inci sendiri tidak menentukan kecepatan sensor; kemampuan pemrosesan Android, browser, kamera, pencahayaan, dan ukuran tangan dalam gambar perlu diuji.

## Temuan prioritas

Rujukan baris berikut mengacu pada berkas ASLI dalam ZIP pengguna.

| Prioritas | Temuan dan bukti | Dampak / tindakan |
|---|---|---|
| Tinggi | `palm.js:35`: tidak ada `facingMode` maupun pemilihan `deviceId`. | HP dapat membuka kamera belakang. Diperbaiki: kamera depan didahulukan, dengan pilihan belakang dan kamera tertentu. |
| Tinggi | `palm.js:58`: `detectForVideo()` dipanggil langsung dalam loop permainan. | Setiap deteksi memblokir pembaruan antarmuka. Diperbaiki: Worker dengan satu bingkai aktif; jalur kompatibilitas tetap tersedia. |
| Tinggi | `palm.js:58,69`: jeda hingga 140 ms, tetapi hasil tangan juga kedaluwarsa pada 140 ms; waktu hasil dihitung dari sebelum deteksi. | Saat deteksi lambat, sisa waktu tampil kursor menyusut; kursor/progres dapat putus. Diperbaiki: usia hasil adaptif dengan batas 500 ms dan penjadwalan yang lebih rapat. |
| Tinggi | `palm.js:111` dan loop game: progres tahan mengikuti putaran animasi dengan delta maksimal 100 ms, bukan bukti kamera baru. | Perangkat lambat dapat membutuhkan waktu tahan lebih lama; kursor lama juga dapat dihitung berulang. Diperbaiki: hanya sampel kamera berbeda yang menambah progres, tanpa memberi kredit untuk jeda kehilangan tangan. |
| Sedang | Resolusi 640×360 hanya `ideal`; kamera boleh mengirim resolusi lebih besar. | Beban pemrosesan nyata tidak dijamin. Diperbaiki: masukan sensor dibatasi maksimal 640×480, rasio gambar dipertahankan. |
| Sedang | Dua tangan selalu diproses; gelembung tetap bergerak ketika ditahan. | Pekerjaan sensor dan kesulitan memilih bertambah. Diperbaiki: satu tangan untuk solo/lomba, dua untuk duel/tim; gelembung berhenti selama target ditahan. |
| Sedang | ZIP awal tidak memuat `vendor/` dan `model/`. | Memerlukan CDN saat memuat sensor. Paket baru menyertakan berkas lokal. Ini memperbaiki ketergantungan pemuatan, bukan menjanjikan peningkatan FPS. |
| Sedang, belum diperbaiki | Pilihan durasi 10/15/30 menit ada di HTML, tetapi tidak dibaca oleh konfigurasi game. `buildQuestions()` tetap mengambil delapan soal. | Pilihan durasi belum berfungsi. Paket ini tetap mempertahankan sesi delapan soal; jangan mengandalkan pilihan durasi tersebut. |
| Sedang, belum diperbaiki | Pilihan jangkauan hanya mengubah kelas CSS dan `column-gap`, sedangkan arena gelembung memakai `display:block` dan posisi absolut. | Bukan kalibrasi jangkauan tangan yang sesungguhnya. Jangan mengandalkannya untuk mengompensasi jarak pemain dari kamera. |

## Isi perbaikan

- Kamera depan diminta terlebih dahulu; persyaratan ukuran dilonggarkan sebelum arah kamera dilonggarkan. Kamera USB tanpa informasi arah tetap memiliki jalur cadangan.
- Pengguna dapat memilih kamera yang terdaftar setelah izin diberikan. Pilihan kamera tertentu menggunakan ID tepat, sehingga kegagalan tidak diam-diam beralih ke kamera lain.
- Kamera lama ditutup saat berganti kamera, kembali ke beranda, atau selesai bermain. Hasil pemuatan yang terlambat setelah pembatalan dibuang.
- Mode otomatis mencoba GPU lalu CPU saat inisialisasi. Jika GPU berhasil dimuat tetapi bermasalah saat berjalan, pengguna dapat memilih CPU dan memuat ulang. Pergantian karena GPU lambat tidak dilakukan otomatis.
- Worker memisahkan pemrosesan model dari animasi; tidak menumpuk antrean bingkai. Browser tanpa dukungan yang diperlukan memakai jalur kompatibilitas yang masih dapat tersendat.
- Pemetaan titik mengikuti tampilan video dan pemotongan `object-fit:cover`; cermin dapat dinyalakan/dimatikan. Kamera belakang secara default tidak dicerminkan.
- Indikator menampilkan jumlah telapak, deteksi per detik, waktu pemrosesan rata-rata, dan mesin yang dipakai. Angka deteksi/detik adalah frekuensi hasil sensor, bukan FPS kamera.
- Masa pemanasan bingkai pertama GPU diberi waktu lebih panjang. Hasil berusia lebih dari 500 ms tidak dipakai untuk memilih jawaban; video yang membeku tidak menuntaskan progres tahan.

## Pemeriksaan yang dilakukan

1. Pemeriksaan sintaks JavaScript.
2. **13 pengujian otomatis lulus**: kamera depan/belakang, cadangan USB, pemilihan ID kamera, penolakan izin, penghentian/pembatalan stream, batas resolusi, sampel lambat, video membeku, kehilangan bukti tangan, pemetaan cermin, dan satu bingkai aktif.
3. Chrome desktop dengan kamera simulasi: model MediaPipe asli berhasil dimuat dari berkas lokal, dan inferensi berjalan pada GPU/Worker, CPU/Worker, serta CPU/Kompatibilitas.
4. Pergantian kamera melalui pilihan ID dan penghentian stream lama berhasil diuji pada jalur CPU/Worker serta CPU/Kompatibilitas.
5. Alur masuk permainan, kontrol keyboard, duel, jeda, dan kembali ke beranda berjalan tanpa exception halaman dalam pengujian.
6. Tata letak latihan diperiksa pada viewport 1280×720, 844×390, dan 3840×2160. Tangkapan layar desktop juga diperiksa secara visual.

Kamera simulasi memverifikasi alur kamera dan eksekusi model, **bukan akurasi pelacakan tangan nyata**. Tidak dilakukan benchmark pada Hisense, Android fisik, atau HP fisik. Kecepatan hasil pengujian desktop tidak boleh dijadikan prediksi performa IFP. Audit ini berfokus pada kamera dan interaksi permainan, bukan pengujian keamanan menyeluruh.

Pengujian unit dapat diulang dengan Node.js: `node --test tests/sensor.test.cjs` dari folder aplikasi.

## Uji penerimaan di IFP dan HP

1. Ekstrak ZIP perbaikan. Unggah SELURUH isi folder aplikasi, termasuk `hand-worker.js`, `sensor-engine.js`, `vendor/`, dan `model/`, ke hosting HTTPS. Hindari hanya mengganti `index.html`. Muat ulang halaman agar versi lama tidak tersimpan di cache.
2. IFP: pilih kontrol kamera, aktifkan kamera, kemudian pilih kamera USB yang benar. Mulai dengan mesin **Otomatis**. Tunggu sekitar 15 detik untuk pemanasan, lalu amati indikator selama 30 detik dengan telapak terlihat jelas.
3. Uji **CPU** pada posisi, pencahayaan, dan kamera yang sama. Bandingkan kelancaran titik dan angka deteksi/detik. Pilih mode yang lebih baik pada panel tersebut; CPU tidak selalu lebih cepat daripada GPU.
4. Coba jarak 1 m, 1,5 m, dan 2 m sebagai titik awal pengujian, bukan batas dukungan. Pastikan seluruh telapak masuk gambar, cukup besar, terang, dan tidak tertutup. Kamera sudut lebar dapat membuat tangan tampak kecil walaupun pemain merasa dekat.
5. Arahkan telapak ke target latihan, lalu jawab sepuluh kali. Target uji: titik mengikuti gerakan tanpa putus berulang, waktu tahan mendekati pengaturan, serta tidak menjawab sendiri setelah tangan ditarik. Ulangi pada duel/tim bila digunakan.
6. HP: gunakan **Depan / otomatis**, pastikan pratinjau memperlihatkan pemain. Uji **Belakang**, lalu kembali ke depan. Jika pilihan otomatis tidak cocok, pilih nama kamera dari daftar.
7. Uji putusnya kamera, kembali ke beranda saat pemuatan, dan kamera tertutup. Aplikasi harus memberikan status masalah atau berhenti menghitung tahan; kontrol sentuh tetap tersedia.

Jika masih lambat, catat model Hisense, versi Android/browser, nama kamera, jarak, serta angka deteksi/detik dan ms pada Otomatis dan CPU. Data tersebut membedakan keterbatasan pemrosesan dari tangan yang kurang jelas terlihat. Bila titik sudah lancar tetapi target sulit dijangkau, diperlukan kalibrasi jangkauan tersendiri.

## Rujukan teknis

- [Google MediaPipe: Hand Landmarker untuk Web](https://developers.google.com/edge/mediapipe/solutions/vision/hand_landmarker/web_js): operasi deteksi sinkron memblokir jalur UI; Worker disarankan untuk pemrosesan terpisah.
- [MDN: facingMode](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/facingMode): `user` berarti kamera yang menghadap pengguna; `exact` wajib, `ideal` preferensi.
- [MDN: getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia): batasan kamera dan penghentian track saat mengganti kamera.

Model dan pustaka tetap memakai MediaPipe Tasks Vision 0.10.14 seperti aplikasi awal. Sumber unduhan tercatat dalam `unduh_model.py`; lisensi MediaPipe disertakan di `vendor/mediapipe/LICENSE`. Tidak ada publikasi atau perubahan hosting yang dilakukan.
