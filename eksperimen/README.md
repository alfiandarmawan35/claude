# Eksperimen alat video: PID POS

Uji coba tiga alat pembuat video dari GitHub untuk materi PID POS. Hasil MP4 tidak disimpan di git (folder `out/`); bangun ulang dengan perintah di bawah.

| Folder | Alat | Hasil |
|---|---|---|
| `promo-fitur/` | [HyperFrames](https://github.com/heygen-com/hyperframes) (Apache-2.0): video dari HTML + GSAP | Promo 9:16, 30 s, "Satu botol AQUA": pesan → setuju → terima → kasir → DO ke SAP |
| `film-iso/` | [Lemo-Opuscar](https://github.com/lemomo-ai/lemo-opuscar) (MIT), gaya Isometric Infographic | Film penjelasan 16:9, 54 s, narasi + subtitle: satu permintaan, delapan dokumen SAP |
| `animasi-kru/` | [Claude Animation Base](https://github.com/JohnHeibel/ClaudeAnimationBase) (MIT): p5.js + p5.brush | Kartun 16:9, 18 s, tanpa teks: "Malam Panjang di Toko Kapal" dengan karakter kru toko sendiri |

Dua alat lain tidak dipakai:
- **onetake**: lisensinya PolyForm Noncommercial (hanya untuk penggunaan nonkomersial), sedangkan materi ini untuk perusahaan.
- **Collage B-roll** (kedua versi): butuh layanan berbayar untuk membuat gambar dan video (Gemini API key atau MaxFusion MCP) yang tidak tersedia di sini.

## Bangun ulang

```sh
# HyperFrames (Node 22, ffmpeg; Chrome headless lewat PRODUCER_HEADLESS_SHELL_PATH bila perlu)
cd promo-fitur && sh siapkan-aset.sh && npx hyperframes@0.8.200 check && npx hyperframes@0.8.200 render --quality delivery --output out/PID_POS_Promo_Fitur_9x16.mp4

# Lemo-Opuscar (LIB = clone lemo-opuscar dengan `sh plugin/skills/lemo-opuscar/scripts/setup.sh deps`)
cd film-iso && LIB=/path/ke/lemo-opuscar PY=python3 sh build.sh

# Claude Animation Base (tanpa GPU: --soft-gl; 12 fps "on twos" lalu digandakan ke 24 fps)
cd animasi-kru && npm install && node render.mjs --soft-gl --fps=12 --frames --workers=3 && python suara.py && sh gabung.sh
```

Narasi memakai Microsoft Edge TTS (id-ID-GadisNeural) dan dicek dengan faster-whisper. Semua musik dan efek suara disintesis sendiri (numpy), kecuali promo HyperFrames yang memakai potongan musik ARUS dari proyek `motion/`. Data di layar adalah contoh data uji dari manual.
