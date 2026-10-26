# Konsep Visual Kapal untuk Video PID POS

Stok footage kapal PELNI yang berlisensi bebas hampir tidak ada. Pexels dan Pixabay tidak punya klip khusus PELNI, dan klip kapal pesiar umum terlihat "biasa" dan bukan armada kita. Dokumen ini berisi lima konsep pengganti. Semuanya bisa dibuat tanpa footage stok atau dengan footage milik sendiri.

---

## 1. Cetak Biru Kapal (rekomendasi utama)

**Ide:** kapal digambar sebagai cetak biru teknis. Garis putih tipis muncul di atas latar navy berkisi, sama seperti panggung video sekarang. Kamera lalu masuk ke **potongan melintang (cutaway)** kapal, dan setiap dek terlihat seperti laci yang terbuka: Dek 3, Dek 5, Dek 7, masing-masing dengan toko dan kasirnya.

**Kenapa tidak biasa:** penonton melihat kapal dari dalam, bukan dari luar. Ini cocok dengan inti aplikasi: stok per dek dan kasir di setiap dek.

**Urutan (±8 detik):**
1. Garis lambung kapal tergambar dari haluan ke buritan, dengan label ukuran ala gambar teknik.
2. Lambung "terbelah". Dek-dek bergeser keluar satu per satu, masing-masing dengan label "Dek 3 · Toko", "Dek 5 · Kasir", dan seterusnya.
3. Di tiap dek muncul angka stok kecil yang berubah, lalu ikon kasir menyala.
4. Kamera mundur, kapal utuh lagi, dan lampu jendela menyala satu per satu.

**Dibuat dengan:** HyperFrames (SVG + GSAP), mirip siluet kapal di adegan pembuka yang sudah ada. Tidak perlu aset luar.

---

## 2. Peta Arus Nusantara

**Ide:** peta Indonesia gelap dan minimalis. Rute pelayaran menyala sebagai garis oranye yang mengalir antarpelabuhan. Setiap kapal adalah titik cahaya kecil, dan saat sebuah titik berhenti di pelabuhan, muncul kartu kecil "Pesan ke DC → SO terbentuk".

**Kenapa tidak biasa:** skala armada terasa sekaligus, dan alur aplikasi (pesan, kirim, jual) ditempelkan langsung ke pergerakan kapal yang nyata.

**Catatan:** nama pelabuhan dan rute harus diambil dari jadwal resmi PELNI. Angka seperti jumlah kapal atau pelabuhan baru dipakai setelah dikonfirmasi tim.

**Dibuat dengan:** HyperFrames, dengan peta vektor Indonesia dari sumber berlisensi bebas (misalnya Natural Earth, domain publik).

---

## 3. Diorama Isometrik

**Ide:** kapal sebagai maket mini isometrik, seperti mainan di atas meja. Atap dek dibuka, lalu terlihat kru kecil bergerak: admin memindai, kasir melayani, troli barang naik dari dermaga.

**Kenapa tidak biasa:** hangat dan mudah diingat, berbeda dari gaya korporat biasa.

**Catatan:** gaya ini sudah pernah dicoba di `eksperimen/film-iso`, jadi tinggal dikembangkan. Nadanya lebih santai, sehingga cocok untuk sosialisasi internal atau media sosial, kurang cocok untuk direksi.

---

## 4. Rekam Sendiri: Daftar Gambar untuk Kru Kapal

**Ide:** footage terbaik adalah footage asli armada sendiri. Kru atau tim humas cukup merekam dengan ponsel (4K, 30 fps, horizontal) mengikuti daftar gambar pendek ini, dengan masing-masing klip 5–10 detik:

| No | Gambar | Arahan |
|---|---|---|
| 1 | Matahari terbit dari dek atas, haluan membelah laut | Ponsel ditahan stabil, tanpa zoom |
| 2 | Cerobong dan logo PELNI dari bawah | Gerak pelan ke atas |
| 3 | Lorong dek menuju toko | Berjalan pelan, kamera setinggi dada |
| 4 | Tangan memindai barcode di kasir | Close-up, layar aplikasi terlihat |
| 5 | Struk keluar dari printer | Close-up, cahaya cukup |
| 6 | Barang dinaikkan dari dermaga ke kapal | Dari jauh, melebar |
| 7 | Kapal sandar di pelabuhan saat senja | Dari dermaga, diam 10 detik |
| 8 | Bila ada drone: kapal berlayar dilihat dari atas | Terbang lurus pelan di atas buritan |

**Kenapa tidak biasa:** tidak ada video stok yang bisa meniru kapal kita sendiri, dan tidak ada masalah lisensi.

**Catatan:** wajah penumpang sebaiknya tidak terlihat jelas, atau diminta izinnya.

---

## 5. Foto Jadi Bergerak (Parallax 2.5D)

**Ide:** foto kapal milik PELNI (arsip humas) atau foto berlisensi bebas dari Wikimedia Commons dipisah menjadi lapisan kapal, laut, dan langit. Lapisan digerakkan pelan dengan kedalaman, sehingga foto diam terasa seperti rekaman kamera.

**Kenapa tidak biasa:** terasa sinematik walau sumbernya foto, dan kapalnya tetap kapal PELNI yang nyata.

**Catatan:** foto dari Wikimedia wajib mencantumkan atribusi sesuai lisensinya. Pencarian foto di sana sedang berjalan.

---

## Perbandingan Singkat

| Konsep | Kesan | Kebutuhan aset | Cocok untuk |
|---|---|---|---|
| 1. Cetak biru | Cerdas, teknis, premium | Tidak ada | Direksi, peluncuran |
| 2. Peta arus | Besar, nasional | Peta domain publik | Pembuka video |
| 3. Diorama | Hangat, ramah | Tidak ada | Internal, media sosial |
| 4. Rekam sendiri | Paling otentik | Rekaman kru | Semua |
| 5. Parallax foto | Sinematik | Foto kapal | Pembuka atau penutup |

**Saran:** pakai **Cetak Biru (1)** untuk video peluncuran sekarang karena bisa langsung dibuat. Sambil itu, kirim **daftar gambar (4)** ke kru kapal agar versi berikutnya memakai footage asli.

> Video klip dari YouTube atau media berita tidak dipakai, karena hak ciptanya milik pembuatnya.
