# Konsep Video Perkenalan PID POS

**Judul kerja:** Kenalan dengan PID POS
**Durasi:** 60 detik
**Format:** 16:9, 1920×1080, 30 fps (versi 9:16 menyusul)
**Gaya:** gabungan tiga gaya (kartun gambar tangan, motion graphic dengan UI asli, peta isometrik)
**Peluncuran:** Selasa, 27 Oktober 2026

---

## 1. Tujuan dan penonton

**Tujuan:** setelah 60 detik, penonton tahu:
1. PID POS itu apa: aplikasi toko kapal PELNI Services yang terhubung dengan SAP Business One;
2. siapa saja penggunanya (tujuh peran);
3. bagaimana alurnya, dari pesanan kapal sampai Delivery Order;
4. kapan mulai dipakai.

**Penonton:** kru toko kapal (Kepala Toko, Admin Kapal, Kasir), petugas DC, purchasing, dan kantor pusat.

**Satu kalimat yang harus diingat:** *"Satu alur, dari kapal sampai kasir."*

---

## 2. Identitas visual

| Unsur | Ketentuan |
|---|---|
| Logo | **Danantara** dan **PELNI Services**, keduanya logo resmi. PID POS ditulis dengan huruf Plus Jakarta Sans 800. |
| Warna utama | Navy `#1F3B7A`, oranye `#FF6B1A`, latar krem `#F2E6D0` / kertas `#EEF2F8` |
| Huruf | Plus Jakarta Sans (OFL), semua teks dan subtitle |
| Warna dokumen SAP | SO hijau `#6FA85A` · PR kuning `#E2B24A` · PO oranye `#E87A3A` · GRPO ungu `#7C68B8` · IT magenta `#C45C8E` · DO merah `#CF5140` (sama dengan film isometrik) |
| Warna barang | AQUA biru muda `#7CC3E8` · Teh Pucuk cokelat teh `#B5793A` |
| Data di layar | Contoh data uji dari manual: AQUA 6 pcs (Dek 3), Teh Pucuk 24 pcs (Dek 7), Rp 38.000, DO 266000512. Diberi label kecil "Contoh data uji". |

### Penempatan logo Danantara

- **Adegan 2 (pengenalan):** satu baris lockup **Danantara · PELNI Services | PID POS**. Danantara di kiri, dipisah garis tipis dari PELNI Services.
- **Adegan 8 (penutup):** lockup yang sama di tengah, ukuran penuh, di atas pita tanggal.
- **Adegan 3–7:** tidak ada logo di pojok (aturan semua gaya: logo hanya muncul dengan bobot di pembuka dan penutup).
- **Kebutuhan file:** logo Danantara dalam format PNG transparan atau SVG, versi warna dan versi putih. **Belum ada; mohon dikirim.**

---

## 3. Suara

| Lapisan | Isi |
|---|---|
| Narasi | Suara perempuan Indonesia (Edge TTS `id-ID-GadisNeural`, +5%), memakai peta ucapan yang sudah teruji: D-C, es a pe, G-R-P-O, D-O, P-I-D pos. Setiap kalimat dicek ulang dengan Whisper. |
| Musik | Orisinal, disintesis sendiri (bebas royalti), 110 BPM: kalimba dan marimba, bas lembut, shaker. Musik menipis di adegan 1 (malam) dan memuncak di adegan 8. |
| Efek suara | Kertas runtuh, sapuan (whoosh) di pergantian gaya, pop kartu peran, kartu dokumen mendarat di menara, bip scan, printer struk, klik tombol. |
| Level | Musik turun sekitar 8 dB di bawah narasi; hasil akhir −14 LUFS. |
| Subtitle | Dibakar ke video dan diekspor ke `.srt`. Kartu krem, tepi tinta, di tengah bawah. |

---

## 4. Adegan per adegan

Waktu dalam detik. Gaya: **K** = kartun gambar tangan (Claude Animation Base), **M** = motion graphic dengan UI asli (HyperFrames), **I** = peta isometrik (Lemo-Opuscar).

### Adegan 1: Hook, malam di toko kapal (0–6), gaya K

- **Gambar:** toko kapal pada malam hari, lampu gantung hangat, jendela bulat berisi laut malam. Kru toko (topi navy, celemek) menulis nota. Tumpukan kertas makin tinggi, penumpang menunggu dengan botol dan mulai kesal. Tumpukan goyang lalu runtuh, kru pusing.
- **Kamera:** iris terbuka dari kepala kru, dorongan pelan.
- **Narasi (mulai 1,0):** "Toko di kapal sibuk setiap hari. Pesanan, stok, dan penjualan dicatat di banyak tempat."
- **Suara:** pensil, kertas jatuh, derit tumpukan, runtuh. Musik minor dan pelan.
- **Transisi keluar:** kertas yang beterbangan disapu ke kanan dengan sapuan kuas navy menuju adegan 2.

### Adegan 2: Pengenalan, satu aplikasi (6–11), gaya M

- **Gambar:** dari sapuan navy, kertas-kertas mengecil menjadi titik-titik lalu menyatu ke tengah. Lockup **Danantara · PELNI Services | PID POS** terbentuk. Di bawahnya tagline: *"Aplikasi toko kapal, terhubung ke SAP."*
- **Kamera:** diam; logo mendarat dengan pegas (spring) lalu diam.
- **Narasi (6,5):** "Kini semuanya ada di satu aplikasi: PID POS."
- **Suara:** whoosh naik, lalu "tok" lembut saat logo mendarat. Musik berubah ke mayor.
- **Transisi keluar:** huruf "POS" membesar dan menembus layar (zoom through) menuju adegan 3.

### Adegan 3: Apa itu PID POS (11–17), gaya M

- **Gambar:** laptop (aplikasi web, layar Beranda kapal asli) dan HP kasir Android berdampingan. Garis putus-putus bergerak dari keduanya ke blok "SAP Business One". Tiga label muncul satu per satu: **Web untuk admin** · **Android untuk kasir** · **Terhubung SAP**.
- **Narasi (11,3):** "Aplikasi toko kapal PELNI Services yang terhubung langsung dengan SAP Business One, di web dan di HP kasir."
- **Suara:** klik, tick saat label muncul.
- **Transisi keluar:** blok SAP berubah menjadi kartu pertama di adegan 4 (morph).

### Adegan 4: Tujuh peran (17–27), gaya M

- **Gambar:** tujuh kartu peran muncul bergantian, masing-masing dengan warna, ikon, dan tugas utamanya (satu baris):
  1. **Admin Kapal / Kepala Toko:** memesan ke DC, menerima barang di dek
  2. **Kasir:** menjual, mengirim DO harian
  3. **Approve SO (P2):** menyetujui permintaan jadi Sales Order
  4. **Admin DC:** memilah stok DC, mengajukan GRPO dan transfer
  5. **Approve PUR:** menyetujui PR, GRPO, dan transfer
  6. **Admin Purchase:** membuat Purchase Order ke vendor
  7. **Approve PO:** menyetujui Purchase Order
- **Tata letak:** kartu tersusun membentuk garis alur (bukan tiga kartu sejajar), dikelompokkan ke tiga lokasi: **Kapal** (1, 2), **Kantor pusat** (3, 5, 6, 7), **DC** (4).
- **Narasi (17,5):** "Tujuh peran bekerja di satu alur, dari kapal, DC, sampai kantor pusat."
- **Suara:** pop pelan per kartu, mengikuti ketukan seperdelapan.
- **Transisi keluar:** kamera mundur, kartu-kartu menjadi pin di papan isometrik adegan 5.

### Adegan 5: Alurnya, satu permintaan menjadi dokumen SAP (27–42), gaya I

- **Gambar:** papan pelabuhan isometrik: kapal KM Awu, kantor Approve SO, gudang DC-JKT (potongan dinding: AQUA ada, slot Teh Pucuk kosong), vendor dan truknya, serta menara SAP di tengah. Setiap langkah melempar satu kartu dokumen berwarna yang menjadi satu tingkat di menara:
  - SO ×2 (Approve SO menyetujui)
  - PR → PO → GRPO (Teh Pucuk dibeli dari vendor)
  - IT ×2 (dikirim ke Dek 3 dan Dek 7)
- **Angka Isotype:** 6 ikon botol AQUA dari stok DC, 24 ikon Teh Pucuk dari vendor.
- **Kamera:** mengikuti rute kapal → kantor → DC → vendor → kapal, lalu fokus: semua abu-abu kecuali slot Teh yang kosong.
- **Narasi (27,5):** "Kapal memesan, lalu disetujui menjadi Sales Order. DC mengirim dari stok, atau membeli lewat PO dan GRPO. Barang dikirim ke dek dengan Inventory Transfer."
- **Suara:** whoosh kartu terbang; setiap kartu mendarat berbunyi satu not kalimba yang naik bertahap; klakson truk vendor; ambience laut dan pelabuhan.
- **Transisi keluar:** kamera mendorong masuk ke potongan lambung kapal; dek kapal menjadi meja kasir di adegan 6 (match cut).

### Adegan 6: Di kasir (42–50), gaya M

- **Gambar:** layar kasir asli (dibangun ulang dengan label asli):
  1. scan AQUA, qty 1 → 2, total **Rp 38.000**;
  2. tombol **Bayar (F12)** → Tunai Rp 50.000, kembalian **Rp 12.000** (QRIS juga tersedia);
  3. **Struk tercetak**;
  4. Rekap shift → **Kirim DO hari ini** → toast **"DO 266000512 terkirim ke SAP"**. Kartu DO merah terbang dan menjadi tingkat ke-8 di menara SAP kecil di pojok.
- **Kamera:** punch-in ke tombol yang diklik; kursor besar.
- **Narasi (42,5):** "Kasir cukup scan dan bayar. Penjualan masuk SAP sebagai Delivery Order setiap hari."
- **Suara:** bip scan dua kali, klik, printer struk, "ting" saat toast muncul.
- **Transisi keluar:** toast navy tumbuh memenuhi layar menjadi latar adegan 7.

### Adegan 7: Manfaat (50–55), gaya M

- **Gambar:** tiga manfaat bergantian, satu per satu, masing-masing satu ikon besar dan satu baris (bukan tiga kartu sejajar):
  - **Stok terpantau per dek** (ikon rak + angka dek)
  - **Persetujuan bertingkat** (ikon stempel berjenjang)
  - **Dokumen SAP otomatis** (menara 8 tingkat dari adegan 5)
- **Narasi (50,3):** "Stok terpantau, persetujuan jelas, dokumen otomatis."
- **Suara:** tiga pop berurutan, mengikuti ketukan.
- **Transisi keluar:** ikon terakhir (menara) mengecil menjadi titik di bawah lockup penutup.

### Adegan 8: Penutup (55–60), gaya K + M

- **Gambar:** pagi di toko kapal (gaya kartun): jendela bulat berisi matahari terbit, meja rapi, kru melambai. Ini menggema adegan 1: tempat yang sama, malam berganti pagi. Di atasnya lockup **Danantara · PELNI Services | PID POS** mendarat, lalu pita oranye **"Mulai Selasa, 27 Oktober 2026"**.
- **Narasi (55,3):** "PID POS. Satu alur, dari kapal sampai kasir."
- **Suara:** akor terbuka, camar, motif kalimba penutup. Tahan 2 detik dalam hening sebelum selesai.

---

## 5. Naskah lengkap (untuk rekaman)

| Waktu | Kalimat | Ucapan untuk TTS |
|---|---|---|
| 1,0 | Toko di kapal sibuk setiap hari. Pesanan, stok, dan penjualan dicatat di banyak tempat. | (sama) |
| 6,5 | Kini semuanya ada di satu aplikasi: PID POS. | Kini semuanya ada di satu aplikasi: P-I-D pos. |
| 11,3 | Aplikasi toko kapal PELNI Services yang terhubung langsung dengan SAP Business One, di web dan di HP kasir. | … dengan es a pe Bisnis Wan, di web dan di ha pe kasir. |
| 17,5 | Tujuh peran bekerja di satu alur, dari kapal, DC, sampai kantor pusat. | … dari kapal, D-C, sampai kantor pusat. |
| 27,5 | Kapal memesan, lalu disetujui menjadi Sales Order. DC mengirim dari stok, atau membeli lewat PO dan GRPO. Barang dikirim ke dek dengan Inventory Transfer. | … menjadi Sels Order. D-C mengirim dari stok, atau membeli lewat pe o dan G-R-P-O. … dengan Inventori Transfer. |
| 42,5 | Kasir cukup scan dan bayar. Penjualan masuk SAP sebagai Delivery Order setiap hari. | … masuk es a pe sebagai Delivery Order setiap hari. |
| 50,3 | Stok terpantau, persetujuan jelas, dokumen otomatis. | (sama) |
| 55,3 | PID POS. Satu alur, dari kapal sampai kasir. | P-I-D pos. Satu alur, dari kapal sampai kasir. |

---

## 6. Produksi

| Bagian | Alat | Sumber yang dipakai ulang |
|---|---|---|
| Adegan 1 dan 8 (kartun) | Claude Animation Base (p5.brush), 12 fps on twos | `eksperimen/animasi-kru` (karakter kru, toko, jendela bulat) |
| Adegan 2, 3, 4, 6, 7 (motion graphic) | HyperFrames (HTML + GSAP) | `eksperimen/promo-fitur` (UI kasir, toast DO, lockup logo) |
| Adegan 5 (isometrik) | Lemo-Opuscar Isometric Infographic | `eksperimen/film-iso` (papan, menara SAP, kartu dokumen) |
| Gabung, suara, subtitle | ffmpeg + numpy | `mix.py`, loudnorm −14 LUFS |

**Urutan kerja:**
1. Narasi dan cek Whisper → durasi tiap kalimat mengunci waktu adegan.
2. Render tiap adegan dengan durasi pas plus 0,5 s sambungan.
3. Gabung dengan transisi (sapuan kuas, zoom tembus, match cut, toast memenuhi layar).
4. Musik dan efek suara mengikuti timeline gabungan; mix dan subtitle.
5. Cek akhir: lembar kontak per 2 s, Whisper pada mix akhir, tidak ada frame hitam, loudness.

## 7. Yang dibutuhkan dari Anda

- [ ] **Logo Danantara** (PNG transparan atau SVG; versi warna dan versi putih)
- [ ] Persetujuan naskah narasi di bagian 5
- [ ] (Opsional) tagline lain bila "Satu alur, dari kapal sampai kasir." ingin diganti
