const DEFAULT_QUESTION_BANK = [
  {
    "id": "M01",
    "difficulty": "Mudah",
    "context": "Sekolah",
    "question": "Mendapatkan penjelasan pelajaran dari guru termasuk …",
    "options": [
      "hak murid",
      "hukuman murid",
      "larangan sekolah",
      "tugas piket"
    ],
    "correctIndex": 0,
    "explanation": "Setiap murid berhak mendapat pembelajaran dan bimbingan."
  },
  {
    "id": "M02",
    "difficulty": "Mudah",
    "context": "Sekolah",
    "question": "Saat guru menjelaskan, kewajiban kita adalah …",
    "options": [
      "meninggalkan kelas tanpa izin",
      "menyimak dengan tertib",
      "mengajak teman mengobrol",
      "bermain sendiri"
    ],
    "correctIndex": 1,
    "explanation": "Menyimak membantu kita belajar dan menghargai hak belajar teman."
  },
  {
    "id": "M03",
    "difficulty": "Mudah",
    "context": "Rumah",
    "question": "Contoh hak anak di rumah adalah …",
    "options": [
      "membantu sesuai kemampuan",
      "menjaga kebersihan kamar",
      "mendapat kasih sayang",
      "merapikan mainan"
    ],
    "correctIndex": 2,
    "explanation": "Anak berhak mendapat kasih sayang dan pengasuhan."
  },
  {
    "id": "M04",
    "difficulty": "Mudah",
    "context": "Rumah",
    "question": "Setelah bermain, bentuk tanggung jawab kita adalah …",
    "options": [
      "menyembunyikan mainan teman",
      "meninggalkan semua mainan",
      "menyuruh adik selalu merapikan",
      "merapikan mainan"
    ],
    "correctIndex": 3,
    "explanation": "Merapikan barang yang digunakan adalah bentuk tanggung jawab."
  },
  {
    "id": "M05",
    "difficulty": "Mudah",
    "context": "Sekolah",
    "question": "Setiap teman berhak menyampaikan pendapat. Kita perlu …",
    "options": [
      "mendengarkan dengan sopan",
      "memotong semua perkataan",
      "menertawakan pendapatnya",
      "memaksa teman diam"
    ],
    "correctIndex": 0,
    "explanation": "Hak berpendapat disertai kewajiban menghargai pendapat orang lain."
  },
  {
    "id": "M06",
    "difficulty": "Mudah",
    "context": "Sekolah",
    "question": "Kewajiban saat meminjam buku perpustakaan adalah …",
    "options": [
      "merobek gambar menarik",
      "menjaga dan mengembalikannya",
      "mencoret halamannya",
      "menyimpannya selamanya"
    ],
    "correctIndex": 1,
    "explanation": "Buku bersama perlu dirawat agar teman lain juga dapat membacanya."
  },
  {
    "id": "M07",
    "difficulty": "Mudah",
    "context": "Rumah",
    "question": "Anak berhak beristirahat. Contoh pelaksanaannya adalah …",
    "options": [
      "tidak pernah membantu keluarga",
      "mengganggu orang yang tidur",
      "tidur cukup sesuai kebutuhan",
      "bermain sepanjang malam"
    ],
    "correctIndex": 2,
    "explanation": "Istirahat yang cukup membantu anak tumbuh dan belajar dengan sehat."
  },
  {
    "id": "M08",
    "difficulty": "Mudah",
    "context": "Masyarakat",
    "question": "Saat menggunakan taman bermain bersama, kita wajib …",
    "options": [
      "merusak ayunan",
      "menguasai semua permainan",
      "membuang sampah sembarangan",
      "menjaga fasilitas taman"
    ],
    "correctIndex": 3,
    "explanation": "Fasilitas umum harus dijaga agar dapat digunakan semua orang."
  },
  {
    "id": "M09",
    "difficulty": "Mudah",
    "context": "Sekolah",
    "question": "Mendapat perlakuan yang adil adalah hak …",
    "options": [
      "semua murid",
      "hanya juara kelas",
      "hanya ketua kelas",
      "hanya murid yang kaya"
    ],
    "correctIndex": 0,
    "explanation": "Setiap murid berhak diperlakukan adil tanpa membeda-bedakan latar belakang."
  },
  {
    "id": "M10",
    "difficulty": "Mudah",
    "context": "Masyarakat",
    "question": "Membuang sampah pada tempatnya merupakan …",
    "options": [
      "kegiatan yang merugikan",
      "kewajiban menjaga kebersihan",
      "hak untuk merusak lingkungan",
      "tugas petugas saja"
    ],
    "correctIndex": 1,
    "explanation": "Menjaga kebersihan adalah tanggung jawab bersama."
  },
  {
    "id": "M11",
    "difficulty": "Mudah",
    "context": "Sekolah",
    "question": "Contoh kewajiban dalam kelompok adalah …",
    "options": [
      "mengaku hasil teman sebagai milik sendiri",
      "menolak mendengar anggota lain",
      "mengerjakan bagian yang disepakati",
      "menunggu semua dikerjakan teman"
    ],
    "correctIndex": 2,
    "explanation": "Pembagian tugas perlu dijalankan dengan bertanggung jawab."
  },
  {
    "id": "M12",
    "difficulty": "Mudah",
    "context": "Rumah",
    "question": "Saat memerlukan pertolongan, anak berhak …",
    "options": [
      "selalu menyelesaikan bahaya sendiri",
      "menyembunyikan semua masalah",
      "membalas dengan kekerasan",
      "meminta bantuan orang dewasa tepercaya"
    ],
    "correctIndex": 3,
    "explanation": "Anak berhak mendapat perlindungan dan bantuan ketika membutuhkan."
  },
  {
    "id": "M13",
    "difficulty": "Mudah",
    "context": "Sekolah",
    "question": "Jika belum memahami pelajaran, kita dapat …",
    "options": [
      "bertanya dengan sopan",
      "mengejek teman yang paham",
      "merusak buku",
      "mengganggu seluruh kelas"
    ],
    "correctIndex": 0,
    "explanation": "Bertanya merupakan cara menggunakan hak untuk belajar."
  },
  {
    "id": "M14",
    "difficulty": "Mudah",
    "context": "Masyarakat",
    "question": "Ketika mengantre di tempat umum, kita sebaiknya …",
    "options": [
      "mengajak teman memotong antrean",
      "menunggu giliran",
      "menyerobot antrean",
      "mendorong orang lain"
    ],
    "correctIndex": 1,
    "explanation": "Antre berarti menghargai hak orang lain mendapat giliran."
  },
  {
    "id": "M15",
    "difficulty": "Mudah",
    "context": "Rumah",
    "question": "Mematikan keran setelah dipakai menunjukkan …",
    "options": [
      "sikap tidak peduli",
      "kewajiban tetangga",
      "tanggung jawab menghemat air",
      "hak memboroskan air"
    ],
    "correctIndex": 2,
    "explanation": "Air perlu digunakan secukupnya agar tidak terbuang."
  },
  {
    "id": "M16",
    "difficulty": "Mudah",
    "context": "Sekolah",
    "question": "Murid berprestasi juga menunjukkan sikap …",
    "options": [
      "curang agar selalu menang",
      "merendahkan teman",
      "menghindari semua tugas",
      "jujur dan bertanggung jawab"
    ],
    "correctIndex": 3,
    "explanation": "Prestasi tidak hanya nilai, tetapi juga sikap baik dalam keseharian."
  },
  {
    "id": "M17",
    "difficulty": "Mudah",
    "context": "Sekolah",
    "question": "Saat ujian, kewajiban murid adalah …",
    "options": [
      "mengerjakan dengan jujur",
      "menyalin jawaban teman",
      "memberi contekan",
      "menukar lembar jawaban"
    ],
    "correctIndex": 0,
    "explanation": "Kejujuran membuat hasil belajar mencerminkan kemampuan sendiri."
  },
  {
    "id": "M18",
    "difficulty": "Mudah",
    "context": "Rumah",
    "question": "Contoh menghargai hak anggota keluarga adalah …",
    "options": [
      "memaksa semua mengikuti keinginan kita",
      "mengecilkan suara saat ada yang istirahat",
      "menyalakan suara sekeras mungkin",
      "mengambil barang tanpa izin"
    ],
    "correctIndex": 1,
    "explanation": "Setiap anggota keluarga berhak merasa nyaman di rumah."
  },
  {
    "id": "M19",
    "difficulty": "Mudah",
    "context": "Sekolah",
    "question": "Melaksanakan piket sesuai jadwal adalah contoh …",
    "options": [
      "larangan bermain",
      "hukuman tanpa alasan",
      "kewajiban di sekolah",
      "hak mendapat hadiah"
    ],
    "correctIndex": 2,
    "explanation": "Piket membantu menjaga ruang belajar tetap bersih dan nyaman."
  },
  {
    "id": "M20",
    "difficulty": "Mudah",
    "context": "Masyarakat",
    "question": "Saat melihat tanaman di taman, sikap yang tepat adalah …",
    "options": [
      "mencabut tanpa izin",
      "mematahkan ranting untuk bermain",
      "menginjak semua bunga",
      "menjaganya agar tetap tumbuh"
    ],
    "correctIndex": 3,
    "explanation": "Tanaman di fasilitas umum perlu dirawat bersama."
  },
  {
    "id": "M21",
    "difficulty": "Mudah",
    "context": "Digital",
    "question": "Sebelum memakai foto teman dalam poster, kita perlu …",
    "options": [
      "meminta izinnya",
      "langsung menyebarkannya",
      "mengeditnya untuk mengejek",
      "menjualnya kepada orang lain"
    ],
    "correctIndex": 0,
    "explanation": "Meminta izin berarti menghargai privasi dan kenyamanan teman."
  },
  {
    "id": "M22",
    "difficulty": "Mudah",
    "context": "Sekolah",
    "question": "Hak untuk merasa aman berarti murid harus …",
    "options": [
      "tidak perlu menaati aturan",
      "terlindung dari perundungan",
      "selalu mendapat peringkat satu",
      "bebas menyakiti teman"
    ],
    "correctIndex": 1,
    "explanation": "Semua murid berhak belajar tanpa ancaman atau perundungan."
  },
  {
    "id": "M23",
    "difficulty": "Mudah",
    "context": "Rumah",
    "question": "Membantu keluarga sebaiknya dilakukan …",
    "options": [
      "hingga tidak boleh sekolah",
      "dengan memaksa adik",
      "sesuai usia dan kemampuan",
      "dengan mengabaikan keselamatan"
    ],
    "correctIndex": 2,
    "explanation": "Tugas anak perlu aman, sesuai kemampuan, dan tetap memberi waktu belajar serta istirahat."
  },
  {
    "id": "M24",
    "difficulty": "Mudah",
    "context": "Sekolah",
    "question": "Setelah menggunakan alat olahraga sekolah, kita …",
    "options": [
      "membawanya pulang diam-diam",
      "membiarkannya di jalan",
      "merusaknya agar diganti",
      "mengembalikannya ke tempat semula"
    ],
    "correctIndex": 3,
    "explanation": "Merawat dan mengembalikan alat menjaga hak pengguna berikutnya."
  },
  {
    "id": "M25",
    "difficulty": "Mudah",
    "context": "Masyarakat",
    "question": "Hak dan kewajiban perlu dijalankan …",
    "options": [
      "secara seimbang dan bertanggung jawab",
      "hanya jika mendapat hadiah",
      "dengan mengabaikan orang lain",
      "hanya oleh orang dewasa"
    ],
    "correctIndex": 0,
    "explanation": "Kita menggunakan hak sambil menghormati hak orang lain dan menjalankan kewajiban."
  },
  {
    "id": "S01",
    "difficulty": "Sedang",
    "context": "Sekolah",
    "question": "Raka ingin belajar, tetapi teman di sebelahnya terus berteriak. Sikap terbaik Raka …",
    "options": [
      "mengingatkan dengan sopan dan meminta bantuan guru bila perlu",
      "membalas dengan teriakan lebih keras",
      "merusak barang temannya",
      "meninggalkan sekolah tanpa izin"
    ],
    "correctIndex": 0,
    "explanation": "Raka dapat memperjuangkan hak belajar dengan cara yang menghargai orang lain."
  },
  {
    "id": "S02",
    "difficulty": "Sedang",
    "context": "Rumah",
    "question": "Naya ingin bermain, tetapi tugas merapikan meja belum selesai. Ia sebaiknya …",
    "options": [
      "bermain hingga larut malam",
      "merapikan meja lalu bermain sesuai waktu yang disepakati",
      "menyembunyikan piring kotor",
      "menyuruh adik tanpa alasan"
    ],
    "correctIndex": 1,
    "explanation": "Mengatur waktu membantu menjalankan kewajiban dan menikmati waktu bermain."
  },
  {
    "id": "S03",
    "difficulty": "Sedang",
    "context": "Sekolah",
    "question": "Temanmu tidak membawa pensil saat belajar. Sikap yang mendukung hak belajarnya …",
    "options": [
      "menyuruhnya berhenti sekolah",
      "mengambil pensil teman lain tanpa izin",
      "meminjamkan jika ada pensil lebih",
      "mengejeknya di depan kelas"
    ],
    "correctIndex": 2,
    "explanation": "Saling membantu dapat mendukung teman belajar tanpa mengabaikan hak pemilik barang."
  },
  {
    "id": "S04",
    "difficulty": "Sedang",
    "context": "Masyarakat",
    "question": "Kamu dan teman ingin memakai lapangan yang sedang digunakan. Sebaiknya …",
    "options": [
      "mengusir pengguna sebelumnya",
      "merusak perlengkapan mereka",
      "menguasai lapangan sepanjang hari",
      "menyepakati giliran penggunaan"
    ],
    "correctIndex": 3,
    "explanation": "Fasilitas bersama perlu digunakan bergiliran secara adil."
  },
  {
    "id": "S05",
    "difficulty": "Sedang",
    "context": "Sekolah",
    "question": "Dalam diskusi, pendapatmu tidak dipilih. Sikap yang bertanggung jawab …",
    "options": [
      "menerima hasil yang adil dan tetap membantu",
      "mengganggu pekerjaan kelompok",
      "memaksa teman mengganti hasil",
      "keluar tanpa berdiskusi"
    ],
    "correctIndex": 0,
    "explanation": "Musyawarah membutuhkan sikap menghargai keputusan bersama yang adil."
  },
  {
    "id": "S06",
    "difficulty": "Sedang",
    "context": "Rumah",
    "question": "Adik sedang tidur saat kamu ingin mendengarkan musik. Kamu sebaiknya …",
    "options": [
      "memutar musik di dekat telinganya",
      "mengecilkan volume",
      "membesarkan suara agar seru",
      "membangunkan adik"
    ],
    "correctIndex": 1,
    "explanation": "Hak menikmati musik perlu dijalankan tanpa mengganggu hak istirahat orang lain."
  },
  {
    "id": "S07",
    "difficulty": "Sedang",
    "context": "Sekolah",
    "question": "Buku pinjamanmu tidak sengaja robek. Tindakan yang tepat …",
    "options": [
      "menyembunyikan buku",
      "membuangnya agar tidak diketahui",
      "melapor dan membantu memperbaiki sesuai arahan",
      "menyalahkan orang lain"
    ],
    "correctIndex": 2,
    "explanation": "Mengakui kesalahan dan memperbaikinya adalah bentuk tanggung jawab."
  },
  {
    "id": "S08",
    "difficulty": "Sedang",
    "context": "Sekolah",
    "question": "Teman baru kesulitan memahami aturan kelas. Kita sebaiknya …",
    "options": [
      "langsung mengejeknya",
      "melarangnya ikut bermain",
      "membiarkannya selalu bingung",
      "menjelaskan aturan dengan ramah"
    ],
    "correctIndex": 3,
    "explanation": "Membantu teman memahami aturan mendukung lingkungan sekolah yang ramah."
  },
  {
    "id": "S09",
    "difficulty": "Sedang",
    "context": "Masyarakat",
    "question": "Saat kerja bakti, tugas yang aman bagi anak adalah …",
    "options": [
      "mengumpulkan sampah ringan dengan pendampingan",
      "memanjat tiang listrik",
      "mengangkat benda sangat berat",
      "menyentuh pecahan kaca tanpa pelindung"
    ],
    "correctIndex": 0,
    "explanation": "Anak dapat membantu lingkungan melalui tugas yang sesuai usia dan aman."
  },
  {
    "id": "S10",
    "difficulty": "Sedang",
    "context": "Digital",
    "question": "Pesan ejekan tentang teman muncul di grup kelas. Kamu sebaiknya …",
    "options": [
      "menyimpan untuk mengancam teman",
      "tidak ikut menyebar dan melapor kepada guru",
      "meneruskan ke semua grup",
      "menambah ejekan baru"
    ],
    "correctIndex": 1,
    "explanation": "Tidak ikut menyebarkan ejekan membantu melindungi teman dari perundungan."
  },
  {
    "id": "S11",
    "difficulty": "Sedang",
    "context": "Rumah",
    "question": "Orang tua membagi tugas rumah. Agar adil, pembagian sebaiknya …",
    "options": [
      "hanya berdasarkan siapa yang paling pendiam",
      "mengabaikan waktu belajar",
      "mempertimbangkan usia dan kemampuan",
      "selalu memberatkan satu anak"
    ],
    "correctIndex": 2,
    "explanation": "Adil berarti memperhatikan kebutuhan dan kemampuan, bukan selalu memberi tugas yang sama."
  },
  {
    "id": "S12",
    "difficulty": "Sedang",
    "context": "Sekolah",
    "question": "Kamu ingin bertanya saat teman sedang berbicara. Sebaiknya …",
    "options": [
      "memotong dengan berteriak",
      "mengejek agar teman berhenti",
      "berbicara terus bersamaan",
      "menunggu giliran lalu bertanya"
    ],
    "correctIndex": 3,
    "explanation": "Mengatur giliran menjaga kesempatan berpendapat bagi semua."
  },
  {
    "id": "S13",
    "difficulty": "Sedang",
    "context": "Masyarakat",
    "question": "Kamu menemukan dompet di taman. Apa yang tepat?",
    "options": [
      "menyerahkan kepada petugas atau orang dewasa tepercaya",
      "mengambil uangnya",
      "menyembunyikannya",
      "memberikannya kepada sembarang orang"
    ],
    "correctIndex": 0,
    "explanation": "Menyerahkan barang temuan kepada pihak yang tepat membantu melindungi hak pemiliknya."
  },
  {
    "id": "S14",
    "difficulty": "Sedang",
    "context": "Sekolah",
    "question": "Seorang teman sakit dan tidak mengikuti piket. Kelompok sebaiknya …",
    "options": [
      "membiarkan kelas selalu kotor",
      "membicarakan pengganti sementara bersama guru",
      "mengejeknya karena sakit",
      "melarangnya belajar setelah sembuh"
    ],
    "correctIndex": 1,
    "explanation": "Keadaan khusus perlu dipertimbangkan tanpa menghapus hak teman untuk belajar."
  },
  {
    "id": "S15",
    "difficulty": "Sedang",
    "context": "Rumah",
    "question": "Kakak memakai barangmu tanpa izin. Kamu sebaiknya …",
    "options": [
      "membalas mengambil semua barang",
      "diam sambil menyimpan niat membalas",
      "menyampaikan keberatan dengan sopan",
      "merusak barang kakak"
    ],
    "correctIndex": 2,
    "explanation": "Mengomunikasikan batas penggunaan barang membantu menyelesaikan masalah dengan baik."
  },
  {
    "id": "S16",
    "difficulty": "Sedang",
    "context": "Sekolah",
    "question": "Teman menggunakan kursi roda dan kesulitan masuk kelas. Kita sebaiknya …",
    "options": [
      "menghalangi pintu untuk bercanda",
      "mengabaikan kesulitannya",
      "memindahkan kursi rodanya tanpa izin",
      "membantu membuka akses dan bertanya bantuan yang dibutuhkan"
    ],
    "correctIndex": 3,
    "explanation": "Semua murid berhak mendapat akses belajar; bantuan harus menghargai pilihan teman."
  },
  {
    "id": "S17",
    "difficulty": "Sedang",
    "context": "Masyarakat",
    "question": "Kamu ingin bermain bola dekat rumah tetangga. Tanggung jawabmu …",
    "options": [
      "memilih tempat aman dan tidak mengganggu",
      "menendang ke kaca rumah",
      "bermain di jalan ramai",
      "mengabaikan orang yang lewat"
    ],
    "correctIndex": 0,
    "explanation": "Bermain perlu memperhatikan keselamatan dan kenyamanan orang lain."
  },
  {
    "id": "S18",
    "difficulty": "Sedang",
    "context": "Sekolah",
    "question": "Kelompokmu mendapat tugas membuat poster. Cara pembagian yang baik …",
    "options": [
      "melarang anggota menyampaikan ide",
      "menyepakati peran dan memberi semua kesempatan",
      "hanya ketua yang mengerjakan",
      "memberi semua pekerjaan kepada satu teman"
    ],
    "correctIndex": 1,
    "explanation": "Kerja sama memerlukan kontribusi dan kesempatan yang adil."
  },
  {
    "id": "S19",
    "difficulty": "Sedang",
    "context": "Digital",
    "question": "Kamu memakai gambar buatan teman untuk tugas. Sebaiknya …",
    "options": [
      "menghapus nama teman diam-diam",
      "mengejek gambarnya setelah dipakai",
      "meminta izin dan menyebut pembuatnya",
      "mengaku menggambarnya sendiri"
    ],
    "correctIndex": 2,
    "explanation": "Menghargai karya orang lain merupakan tanggung jawab saat membuat tugas."
  },
  {
    "id": "S20",
    "difficulty": "Sedang",
    "context": "Sekolah",
    "question": "Bel berbunyi saat kamu sedang bermain. Sikap yang tepat …",
    "options": [
      "memaksa teman terus bermain",
      "bersembunyi dari guru",
      "mengganggu kelas lain",
      "mengakhiri permainan dan kembali ke kelas"
    ],
    "correctIndex": 3,
    "explanation": "Mengikuti waktu belajar membantu kegiatan sekolah berjalan tertib."
  },
  {
    "id": "S21",
    "difficulty": "Sedang",
    "context": "Rumah",
    "question": "Di rumah tersedia satu meja belajar untuk dua anak. Solusi adil …",
    "options": [
      "menyepakati jadwal dan berbagi tempat jika memungkinkan",
      "selalu memberi kepada yang lebih kuat",
      "menyembunyikan kursinya",
      "melarang adik belajar"
    ],
    "correctIndex": 0,
    "explanation": "Kesepakatan membantu kedua anak memperoleh kesempatan belajar."
  },
  {
    "id": "S22",
    "difficulty": "Sedang",
    "context": "Masyarakat",
    "question": "Keran umum masih menyala setelah digunakan orang lain. Kamu …",
    "options": [
      "merusak kerannya",
      "menutupnya jika aman",
      "membiarkannya karena bukan urusanmu",
      "membuka keran lain"
    ],
    "correctIndex": 1,
    "explanation": "Tanggung jawab menjaga sumber daya dapat dilakukan melalui tindakan kecil."
  },
  {
    "id": "S23",
    "difficulty": "Sedang",
    "context": "Sekolah",
    "question": "Teman berbeda agama meminta waktu beribadah. Sikapmu …",
    "options": [
      "memaksanya mengikuti agamamu",
      "menyembunyikan perlengkapannya",
      "menghormati dan tidak mengganggu",
      "mengejek cara ibadahnya"
    ],
    "correctIndex": 2,
    "explanation": "Kita menghargai keyakinan dan kesempatan beribadah orang lain."
  },
  {
    "id": "S24",
    "difficulty": "Sedang",
    "context": "Rumah",
    "question": "Kamu melakukan kesalahan saat membantu memasak. Sikap terbaik …",
    "options": [
      "menyalahkan adik",
      "menyembunyikan benda berbahaya",
      "meninggalkan kompor menyala",
      "mengakui kesalahan dan meminta arahan"
    ],
    "correctIndex": 3,
    "explanation": "Bertanggung jawab juga berarti meminta bantuan agar kegiatan tetap aman."
  },
  {
    "id": "S25",
    "difficulty": "Sedang",
    "context": "Sekolah",
    "question": "Murid yang belum menyelesaikan tugas tetap berhak …",
    "options": [
      "diperlakukan baik dan dibimbing memperbaiki tugas",
      "direndahkan di depan kelas",
      "diancam oleh teman",
      "ditolak saat meminta pertolongan"
    ],
    "correctIndex": 0,
    "explanation": "Kewajiban perlu dibimbing; kesalahan tidak menghapus hak untuk dihormati dan dilindungi."
  },
  {
    "id": "T01",
    "difficulty": "Sulit",
    "context": "Sekolah",
    "question": "Hanya murid berperingkat tinggi boleh memakai perpustakaan. Penilaianmu …",
    "options": [
      "tidak adil karena semua murid berhak belajar",
      "adil karena buku hanya untuk juara",
      "tepat agar murid lain tidak membaca",
      "benar jika disukai ketua kelas"
    ],
    "correctIndex": 0,
    "explanation": "Kesempatan belajar melalui perpustakaan perlu tersedia bagi semua murid."
  },
  {
    "id": "T02",
    "difficulty": "Sulit",
    "context": "Rumah",
    "question": "Tugas rumah membuat seorang anak sering tidak masuk sekolah. Solusi terbaik …",
    "options": [
      "menganggap pendidikan tidak penting",
      "membicarakan pembagian tugas agar sekolah tetap terpenuhi",
      "menyuruh anak berhenti belajar",
      "menambah tugas agar terbiasa"
    ],
    "correctIndex": 1,
    "explanation": "Kewajiban membantu keluarga perlu disesuaikan agar hak pendidikan dan istirahat tetap terpenuhi."
  },
  {
    "id": "T03",
    "difficulty": "Sulit",
    "context": "Sekolah",
    "question": "Kelas memilih ketua melalui musyawarah. Sebagian teman belum sempat bicara. Sebaiknya …",
    "options": [
      "hanya mendengar teman yang populer",
      "memilih siapa yang berteriak paling keras",
      "memberi mereka kesempatan sebelum memutuskan",
      "langsung menutup diskusi"
    ],
    "correctIndex": 2,
    "explanation": "Keputusan bersama lebih adil ketika semua mendapat kesempatan menyampaikan pendapat."
  },
  {
    "id": "T04",
    "difficulty": "Sulit",
    "context": "Masyarakat",
    "question": "Dua kelompok berebut jadwal lapangan yang sama. Langkah terbaik …",
    "options": [
      "menentukan pemenang dengan berkelahi",
      "kelompok besar mengambil semua jadwal",
      "merusak lapangan agar tidak digunakan",
      "berunding dan membuat jadwal bergiliran"
    ],
    "correctIndex": 3,
    "explanation": "Kesepakatan jadwal membantu memenuhi hak bersama tanpa kekerasan."
  },
  {
    "id": "T05",
    "difficulty": "Sulit",
    "context": "Sekolah",
    "question": "Piket sudah dibagi rata, tetapi satu teman sedang cedera. Sikap adil adalah …",
    "options": [
      "menyesuaikan tugasnya dengan kemampuan sementara",
      "memaksanya mengangkat meja",
      "menghapus semua hak belajarnya",
      "mengucilkannya dari kelompok"
    ],
    "correctIndex": 0,
    "explanation": "Pembagian yang adil mempertimbangkan kondisi, keselamatan, dan kemampuan."
  },
  {
    "id": "T06",
    "difficulty": "Sulit",
    "context": "Digital",
    "question": "Teman mengunggah fotomu tanpa izin dan kamu tidak nyaman. Tindakan tepat …",
    "options": [
      "mengunggah foto memalukan orang lain",
      "meminta foto dihapus dan meminta bantuan bila perlu",
      "menyebarkan rahasia teman sebagai balasan",
      "mengancam teman"
    ],
    "correctIndex": 1,
    "explanation": "Kita dapat menjaga privasi dengan komunikasi yang baik dan bantuan orang dewasa tepercaya."
  },
  {
    "id": "T07",
    "difficulty": "Sulit",
    "context": "Sekolah",
    "question": "Seorang murid mengaku boleh menghina karena punya hak berpendapat. Tanggapan tepat …",
    "options": [
      "hak berpendapat hanya untuk ketua",
      "orang yang dihina harus diam",
      "pendapat disampaikan dengan menghormati orang lain",
      "semua hinaan boleh dilakukan"
    ],
    "correctIndex": 2,
    "explanation": "Hak berpendapat bukan alasan untuk merendahkan atau menyakiti orang lain."
  },
  {
    "id": "T08",
    "difficulty": "Sulit",
    "context": "Rumah",
    "question": "Kamu berjanji membersihkan meja, tetapi tiba-tiba sakit. Apa yang bertanggung jawab?",
    "options": [
      "memaksa diri hingga membahayakan kesehatan",
      "diam dan menyalahkan orang lain",
      "berbohong bahwa tugas telah selesai",
      "menjelaskan keadaan dan menyepakati bantuan atau waktu lain"
    ],
    "correctIndex": 3,
    "explanation": "Tanggung jawab mencakup komunikasi jujur dan penyesuaian saat ada keadaan khusus."
  },
  {
    "id": "T09",
    "difficulty": "Sulit",
    "context": "Sekolah",
    "question": "Teman berbuat salah lalu dirundung. Pernyataan yang tepat …",
    "options": [
      "ia perlu memperbaiki kesalahan dan tetap berhak dilindungi",
      "kesalahannya membolehkan semua ejekan",
      "hak aman hanya untuk murid tanpa kesalahan",
      "guru tidak perlu membantu"
    ],
    "correctIndex": 0,
    "explanation": "Pembinaan dan perlindungan dapat berjalan bersama; perundungan tidak dibenarkan."
  },
  {
    "id": "T10",
    "difficulty": "Sulit",
    "context": "Masyarakat",
    "question": "Warga ingin taman bersih, tetapi tidak ada yang mau menjaga. Akibat yang paling mungkin …",
    "options": [
      "tanaman tidak pernah terganggu",
      "kenyamanan bersama berkurang karena sampah menumpuk",
      "taman selalu bersih dengan sendirinya",
      "hak bermain semua orang otomatis bertambah"
    ],
    "correctIndex": 1,
    "explanation": "Hak menikmati lingkungan nyaman memerlukan kepedulian dan tindakan bersama."
  },
  {
    "id": "T11",
    "difficulty": "Sulit",
    "context": "Sekolah",
    "question": "Kelompok mendapat nilai baik, tetapi hanya satu anggota bekerja. Perbaikan terbaik …",
    "options": [
      "mengaku semua bekerja tanpa berdiskusi",
      "mengeluarkan anggota tanpa mendengar alasan",
      "mengevaluasi pembagian tugas dan melibatkan semua anggota",
      "mengulang pola yang sama selamanya"
    ],
    "correctIndex": 2,
    "explanation": "Evaluasi membantu membangun tanggung jawab dan kerja sama yang lebih adil."
  },
  {
    "id": "T12",
    "difficulty": "Sulit",
    "context": "Rumah",
    "question": "Hak bermain dan kewajiban belajar terasa bertabrakan. Rencana terbaik …",
    "options": [
      "menghapus semua waktu bermain",
      "belajar hanya jika diberi uang",
      "bermain tanpa memperhatikan waktu",
      "membuat jadwal belajar, bermain, dan istirahat yang seimbang"
    ],
    "correctIndex": 3,
    "explanation": "Jadwal yang wajar membantu kebutuhan belajar, bermain, dan istirahat berjalan bersama."
  },
  {
    "id": "T13",
    "difficulty": "Sulit",
    "context": "Sekolah",
    "question": "Teman yang pendiam tidak pernah diberi peran presentasi. Kelompok sebaiknya …",
    "options": [
      "menawarkan kesempatan dan dukungan tanpa memaksa",
      "menganggap ia tidak punya ide",
      "selalu memutuskan tanpa bertanya",
      "menertawakan jika ia mencoba"
    ],
    "correctIndex": 0,
    "explanation": "Kesempatan yang adil disertai dukungan membantu setiap anggota berkembang."
  },
  {
    "id": "T14",
    "difficulty": "Sulit",
    "context": "Masyarakat",
    "question": "Kegiatan malam memakai pengeras suara hingga mengganggu istirahat. Solusi …",
    "options": [
      "membalas dengan suara lebih keras",
      "menyepakati batas waktu dan volume yang wajar",
      "menaikkan suara agar semua mendengar",
      "melarang semua kegiatan selamanya"
    ],
    "correctIndex": 1,
    "explanation": "Kegiatan bersama perlu mempertimbangkan hak warga lain untuk beristirahat."
  },
  {
    "id": "T15",
    "difficulty": "Sulit",
    "context": "Sekolah",
    "question": "Satu alat belajar harus dipakai empat kelompok. Aturan terbaik …",
    "options": [
      "hanya kelompok ketua kelas boleh memakai",
      "alat disembunyikan agar tidak rusak",
      "jadwal bergilir dan kewajiban merawat alat",
      "kelompok tercepat memilikinya selamanya"
    ],
    "correctIndex": 2,
    "explanation": "Giliran dan perawatan menjaga kesempatan belajar semua kelompok."
  },
  {
    "id": "T16",
    "difficulty": "Sulit",
    "context": "Digital",
    "question": "Informasi buruk tentang teman belum jelas kebenarannya. Kamu sebaiknya …",
    "options": [
      "meneruskan agar cepat terkenal",
      "menambah cerita agar menarik",
      "menjadikannya bahan ejekan",
      "tidak menyebar dan meminta bantuan guru untuk menanganinya"
    ],
    "correctIndex": 3,
    "explanation": "Berhati-hati sebelum menyebarkan informasi melindungi martabat dan kenyamanan orang lain."
  },
  {
    "id": "T17",
    "difficulty": "Sulit",
    "context": "Sekolah",
    "question": "Kelas ingin memberi hadiah hanya kepada nilai tertinggi. Usul yang lebih menghargai keberagaman prestasi …",
    "options": [
      "mengapresiasi juga kemajuan, kejujuran, dan kerja sama",
      "menghina murid dengan nilai rendah",
      "menganggap sikap baik tidak penting",
      "memberi hadiah hanya kepada teman dekat"
    ],
    "correctIndex": 0,
    "explanation": "Kemajuan belajar dan sikap baik juga merupakan prestasi yang patut dihargai."
  },
  {
    "id": "T18",
    "difficulty": "Sulit",
    "context": "Rumah",
    "question": "Seorang anak menolak semua aturan karena punya hak. Penjelasan tepat …",
    "options": [
      "aturan hanya berlaku saat diawasi",
      "hak dijalankan bersama tanggung jawab menghormati orang lain",
      "hak berarti bebas merugikan siapa pun",
      "anak tidak mempunyai hak apa pun"
    ],
    "correctIndex": 1,
    "explanation": "Hak dan kewajiban saling berkaitan dalam kehidupan bersama."
  },
  {
    "id": "T19",
    "difficulty": "Sulit",
    "context": "Sekolah",
    "question": "Aturan buatan kelas membuat satu teman selalu tersisih. Kelas perlu …",
    "options": [
      "melarang teman itu mengeluh",
      "menambah aturan untuk mengucilkannya",
      "meninjau aturan melalui musyawarah agar lebih adil",
      "mempertahankan karena mayoritas menyukai"
    ],
    "correctIndex": 2,
    "explanation": "Keputusan mayoritas tetap perlu memperhatikan hak dan kebutuhan setiap orang."
  },
  {
    "id": "T20",
    "difficulty": "Sulit",
    "context": "Masyarakat",
    "question": "Jalur pejalan kaki dipakai untuk menaruh barang hingga tertutup. Solusi …",
    "options": [
      "memaksa pejalan kaki ke jalan raya",
      "menyalahkan orang yang lewat",
      "menutup seluruh jalur",
      "memindahkan barang ke tempat yang tidak menghalangi"
    ],
    "correctIndex": 3,
    "explanation": "Fasilitas bersama harus tetap dapat diakses dengan aman."
  },
  {
    "id": "T21",
    "difficulty": "Sulit",
    "context": "Sekolah",
    "question": "Teman meminta contekan agar nilainya baik. Bantuan yang tepat …",
    "options": [
      "menolak menyontek dan menawarkan belajar bersama",
      "memberi semua jawaban ujian",
      "menukar nama di lembar jawaban",
      "mengejek karena ia kesulitan"
    ],
    "correctIndex": 0,
    "explanation": "Membantu belajar mendukung hak pendidikan sekaligus menjaga kejujuran."
  },
  {
    "id": "T22",
    "difficulty": "Sulit",
    "context": "Rumah",
    "question": "Tugas rumah selalu diberikan kepada anak perempuan. Prinsip pembagian yang tepat …",
    "options": [
      "semua tugas untuk anak yang paling kecil",
      "berdasarkan kemampuan dan kesepakatan, bukan jenis kelamin",
      "anak laki-laki tidak perlu membantu",
      "anak perempuan tidak perlu istirahat"
    ],
    "correctIndex": 1,
    "explanation": "Semua anggota keluarga dapat berkontribusi sesuai kemampuan tanpa stereotip."
  },
  {
    "id": "T23",
    "difficulty": "Sulit",
    "context": "Sekolah",
    "question": "Murid ingin aturan kelas diperbaiki. Cara menyampaikan yang tepat …",
    "options": [
      "memaksa teman menandatangani ancaman",
      "menghina pembuat aturan",
      "memberi alasan dan usul melalui diskusi bersama guru",
      "merusak kelas agar didengar"
    ],
    "correctIndex": 2,
    "explanation": "Usulan yang disertai alasan membantu perbaikan aturan secara bertanggung jawab."
  },
  {
    "id": "T24",
    "difficulty": "Sulit",
    "context": "Masyarakat",
    "question": "Kamu melihat anak diejek saat bermain di lingkungan rumah. Tindakan aman …",
    "options": [
      "ikut mengejek agar diterima kelompok",
      "merekam untuk hiburan",
      "membalas dengan kekerasan",
      "mendukung korban dan meminta bantuan orang dewasa tepercaya"
    ],
    "correctIndex": 3,
    "explanation": "Mencari bantuan yang aman merupakan cara melindungi hak anak lain."
  },
  {
    "id": "T25",
    "difficulty": "Sulit",
    "context": "Sekolah",
    "question": "Mengapa murid berprestasi perlu peduli pada hak dan kewajiban?",
    "options": [
      "agar kemampuan dan sikap baik bermanfaat bagi diri serta orang lain",
      "agar selalu menang dengan cara apa pun",
      "agar bebas dari semua aturan",
      "agar boleh menentukan hak teman"
    ],
    "correctIndex": 0,
    "explanation": "Prestasi yang bermakna disertai kejujuran, tanggung jawab, dan penghormatan terhadap orang lain."
  }
];
