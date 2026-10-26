GOAL:    Kru dan kantor pusat paham dalam 30 detik: satu barang dipesan dari kapal, disetujui, diterima, dijual, dan DO-nya masuk SAP, semua di PID POS.
OUTPUT:  HyperFrames, 1080 x 1920, 30 fps
TIME:    30 s x 30 = 900 frame; musik ARUS 128 BPM (potongan detik 15-45), 1 ketukan = 0,46875 s = 14,06 frame; 64 ketukan.
LOOK:    Bidang warna penuh: navy #1F3B7A, kertas aplikasi #EEF2F8, oranye #FF6B1A. Tinta #0F1B3D dan putih.
         Aksen oranye hanya pada kata kunci per adegan dan pita tanggal di akhir.
         Huruf Plus Jakarta Sans (huruf aplikasi): judul 800, 96 px, tracking -2%; UI 600-700, 34-44 px (1,6x ukuran asli).
         Medium: potongan UI PID POS yang dibangun ulang dengan label dan angka asli dari manual (data uji).
         Kartu putih radius 28 px, bayangan 0 30 60 rgba(15,27,61,.25). Tanpa grain, tanpa glow.
OBJECTS: Baris barang AQUA BTL1500 ML/12 (SBI-000000006), tombol Kirim ke DC, chip status kuning -> hijau,
         checklist 5 butir, panel total navy Rp 38.000, toast DO 266000512 terkirim ke SAP, logo resmi PELNI Services.
MOTION:  Masuk expo.out 0,5-0,7 s; kamera/banjir warna power2.inOut 0,4 s; zoom tembus power3.in 0,35 s;
         chip/angka mendarat back.out(1.6) (spring ~0,6). Kursor 64 px, bergerak power2.inOut 0,9-1,1 s, tekan 0,08 s.
SHOTS:   S1 0-4,22    Navy. Judul "Pesan dari kapal". Kartu pesanan, qty 6 diketik, kursor klik Kirim ke DC -> iris dari titik klik.
         S2 4,22-9,38 Kertas. "Disetujui jadi Sales Order". Panel approval, klik Setujui (ketukan 15) -> chip hijau SO 266000699. Whip ke atas.
         S3 9,38-15   Oranye. "Diterima, dicek di dek". Checklist 5 butir tercentang, klik Setujui (Kepala toko) -> tombol zoom tembus jadi navy.
         S4 15-20,63  Navy. "Scan, bayar, beres". Kasir: AQUA qty 1->2, total Rp 38.000, Bayar, kembalian Rp 12.000.
         S5 20,63-24,38 Kertas, hening. "Tutup hari: kirim DO". Klik di drop (22,5 s) -> toast DO 266000512 tumbuh memenuhi layar.
         S6 24,38-30  Navy. Logo PELNI Services | PID POS, "Satu alur, dari kapal sampai kasir.", pita "Mulai Selasa, 27 Oktober 2026".
BANNED:  void gelap dengan elemen kecil; glow, partikel, gradien ungu; tiga kartu sejajar; logo di pojok;
         judul yang terus bergerak setelah mendarat; semua elemen fade+slide up; dashboard karangan.
QA:      0 s (hook terbaca tanpa suara), 3,9 s, 6 s, 8 s, 12 s, 14,6 s, 17 s, 19 s, 22,6 s, 24 s, 27 s, 29,9 s.
