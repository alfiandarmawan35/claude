# Motion graphics PID POS

Video perkenalan dan tutorial per peran, dibuat dengan [Remotion](https://www.remotion.dev/) (React).
Isi dan gambar diambil dari `docs/Manual_Book_PID_POS_per_Peran_20261022` (Gambar 1–52 = `public/img/g01..g52.png`).

| Komposisi | File keluaran | Durasi |
| --- | --- | --- |
| Perkenalan | 00_Perkenalan_PID_POS.mp4 | 1:15 |
| Ep1-AdminKapal | 01_Admin_Kapal.mp4 | 2:37 |
| Ep2-ApproveSO | 02_Approve_SO_P2.mp4 | 1:44 |
| Ep3-AdminDC | 03_Admin_DC.mp4 | 1:28 |
| Ep4-ApprovePUR | 04_Approve_PUR.mp4 | 1:09 |
| Ep5-AdminPurchase | 05_Admin_Purchase.mp4 | 0:56 |
| Ep6-ApprovePO | 06_Approve_PO.mp4 | 0:47 |
| Ep7-Kasir | 07_Kasir.mp4 | 1:52 |

## Menjalankan

```bash
cd motion
npm install
npm run studio          # pratinjau dan edit di browser
node render-all.mjs     # render semua ke out/
node render-all.mjs Ep7-Kasir   # render satu video
```

Di sesi cloud tanpa unduhan Chrome, set `REMOTION_BROWSER` ke Chromium yang sudah terpasang.

## Mengubah isi

- Teks setiap langkah, gambar, kotak sorot, dan nomor dokumen SAP: `src/data/episodes.ts`.
  Durasi tiap langkah dihitung otomatis dari panjang teks.
- Kotak sorot `focus: [x, y, w, h]` dalam pecahan lebar/tinggi gambar (0–1).
- Video perkenalan (adegan dan keterangan): `src/Intro.tsx`. Peta alur: `src/components/FlowMap.tsx`.
- Warna dan peran: `src/theme.ts`.

Huruf: Plus Jakarta Sans (OFL), disimpan di `public/fonts`.

## Suara narasi

Setiap adegan punya narasi: teks langkah (`text`, atau `vo` bila berbeda) dibacakan, dan durasi adegan
menyesuaikan panjang suaranya. Singkatan diubah ke ucapan (SAP → "es a pe", F12 → "ef dua belas") di `src/data/vo.ts`.

```bash
pip install edge-tts==7.3.1
npm run suara                     # buat public/vo/*.mp3 dan src/data/vo.json
python scripts/make_vo.py --voice id-ID-ArdiNeural   # ganti ke suara laki-laki
node render-all.mjs
```

Butuh akses internet ke `speech.platform.bing.com` dan `ffprobe`. Tanpa file suara, video tetap bisa dirender dengan teks saja.

## Logo

`public/brand/pelni_services.png` diambil dari layar aplikasi (Gambar 44). Bila ada file logo resmi beresolusi tinggi, timpa file itu dengan nama yang sama.
