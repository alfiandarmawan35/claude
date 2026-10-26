# Konsep Video Perkenalan PID POS — Versi Profesional

**Judul kerja:** PID POS — Satu Alur, dari Kapal sampai Kasir
**Durasi:** 60 detik · **Format:** 16:9, 1920×1080, 30 fps
**Gaya:** film peluncuran produk korporat (seperti video peluncuran perangkat lunak perusahaan): satu bahasa visual yang konsisten, tipografi bersih, layar aplikasi asli, gerak kamera halus. Tanpa kartun.
**Alat:** satu alat untuk seluruh video (HyperFrames: HTML + GSAP) agar gaya seragam.

---

## 1. Arah visual

| Unsur | Ketentuan |
|---|---|
| Palet | Navy gelap `#0B1A3A` (latar utama), navy `#1F3B7A`, putih, aksen oranye `#FF6B1A` hanya untuk satu kata/angka per layar |
| Tipografi | Plus Jakarta Sans: judul 800 rata kiri, besar (90–140 px), tracking −2%; label kecil 600 kapital spasi lebar |
| Materi | Layar aplikasi asli (dari manual) di dalam bingkai laptop dan HP Android, dengan sorotan dan *callout* garis tipis |
| Latar | Navy gelap dengan kisi garis tipis 4% dan cahaya lembut (tanpa partikel, tanpa glow neon) |
| Gerak | Kamera meluncur pelan (*dolly*) 0,6–0,8 s per perpindahan, ease halus; teks masuk per kata dengan blur ringan; tidak ada pantulan kartun |
| Logo | **Danantara Indonesia** (versi putih) · **PELNI Services** · **PID POS** — hanya di pengungkapan (adegan 3) dan penutup (adegan 8) |

## 2. Suara

- **Narasi:** suara laki-laki formal (Edge TTS `id-ID-ArdiNeural`), tempo tenang, setiap kalimat dicek dengan Whisper.
- **Musik:** orisinal, *corporate pulse*: pad lembut + piano/pluck + denyut sub-bass 100 BPM, naik bertahap, puncak di pengungkapan logo dan penutup.
- **Efek suara:** halus dan sedikit — *whoosh* transisi, *tick* label, *riser* sebelum logo, satu *hit* saat logo mendarat.
- **Subtitle:** putih di bawah dengan latar semi-gelap, rata tengah.

## 3. Alur adegan (60 detik)

| # | Waktu | Gambar | Narasi |
|---|---|---|---|
| 1 | 0–6 | **Pembuka.** Garis tipis menggambar siluet kapal di atas laut navy; angka berjalan: *dek, kasir, gudang, pemasok*. | "Setiap hari, toko di atas kapal melayani ribuan penumpang." |
| 2 | 6–12 | **Tantangan.** Pecahan informasi melayang tidak sinkron: nota, lembar kerja, pesan singkat, stempel. Lalu semuanya tertarik ke satu titik. | "Pesanan, stok, dan penjualan selama ini tersebar di banyak tempat." |
| 3 | 12–18 | **Pengungkapan.** Titik itu meledak menjadi lockup **Danantara · PELNI Services \| PID POS** dengan sapuan cahaya; tagline *Satu alur, dari kapal sampai kasir.* | "Kini, semuanya menjadi satu: PID POS." |
| 4 | 18–29 | **Platform.** Laptop dengan Beranda kapal → kamera meluncur ke Pesan DC → Persetujuan → Stok per dek. *Callout*: "Pesan ke DC", "Persetujuan berjenjang", "Stok real-time per dek". | "Aplikasi web untuk admin kapal, DC, dan kantor pusat, terhubung langsung dengan SAP Business One." |
| 5 | 29–41 | **Alur end-to-end.** Diagram bersih: Kapal → Approve SO → DC → Purchasing → Vendor → DC → Dek → Kasir, dengan kartu dokumen **SO · PR · PO · GRPO · IT · DO** mengalir ke simpul **SAP B1**. Penghitung: *6 jenis dokumen, otomatis.* | "Dari permintaan kapal hingga penerimaan di dek, setiap langkah otomatis tercatat di SAP." |
| 6 | 41–50 | **Kasir.** HP Android kasir: scan barang, total Rp 38.000, bayar Tunai atau QRIS, struk tercetak, lalu "DO terkirim ke SAP". | "Di kasir, cukup scan dan bayar. Penjualan harian terkirim sebagai Delivery Order." |
| 7 | 50–55 | **Nilai.** Tiga baris besar bergantian: **Real-time per dek** · **Persetujuan berjenjang** · **Terintegrasi SAP B1**. | "Transparan, terkendali, terintegrasi." |
| 8 | 55–60 | **Penutup.** Lockup logo di tengah, tagline, pita oranye **Mulai Selasa, 27 Oktober 2026**. | "PID POS. Satu alur, dari kapal sampai kasir." |

## 4. Prinsip profesional yang dijaga

- Satu gaya visual dari awal sampai akhir; tidak ada pergantian dunia yang kontras.
- Setiap klaim berasal dari aplikasi sebenarnya (layar asli, data uji diberi label).
- Teks di layar maksimal 6 kata per baris; setiap baris tahan cukup lama untuk dibaca.
- Logo hanya tampil di pengungkapan dan penutup, dengan bobot penuh.
- Audio −14 LUFS, narasi jelas di atas musik.
