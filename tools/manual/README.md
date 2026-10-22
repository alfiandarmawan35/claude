# Manual book per peran

Pembuat `docs/Manual_Book_PID_POS_per_Peran_20261022.docx` (dan PDF-nya).

1. `cap.py langkah.json`: ambil gambar layar pos-dev dengan Edge headless (Playwright). Token sesi dev dibaca dari file di `MANUAL_TOKENS` (dibuat lewat `auth._issue` di server, dihapus setelah selesai; jangan di-commit). Gambar ke `img/`.
2. `crop.py`: potong gambar `img/` ke `img_out/` (segmen panjang digabung dengan garis putus-putus).
3. `node build.js keluaran.docx`: susun Word (npm `docx@9.5.1`). Gambar sumber juga ada di dalam .docx (`word/media`).

PDF dibuat dari Word (Simpan sebagai PDF) agar daftar isi terisi.
