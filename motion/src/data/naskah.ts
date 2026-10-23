// Naskah narasi gaya bicara. Teks di layar tetap ringkas (episodes.ts); yang diucapkan di sini dibuat
// seperti orang menjelaskan langsung: ada kata sambung, jeda (koma), dan sapaan.
// Urutan kalimat = urutan langkah di episodes.ts.

export const PEMBUKA: Record<string, string> = {
  'Ep0-AlurLengkap':
    'Halo! Di video ini, kita ikuti satu permintaan barang dari awal sampai akhir. Mulai dari kapal memesan ke DC, sampai barangnya terjual di kasir, dan dikirim ke SAP sebagai Delivery Order.',
  'Ep1-AdminKapal':
    'Halo, Admin kapal! Di episode ini, kita akan pesan barang ke DC, terima kirimannya di dek, lalu pindahkan barang antar dek. Yuk, kita mulai.',
  'Ep2-ApproveSO':
    'Halo! Episode ini khusus untuk penyetuju Sales Order, sekaligus P2. Tugas Anda ada dua: menyetujui permintaan kapal, dan menyetujui barang yang sudah diterima di dek.',
  'Ep3-AdminDC':
    'Halo, Admin DC! Di episode ini, kita pilah stok di gudang, catat barang dari vendor, lalu kirim barangnya ke dek.',
  'Ep4-ApprovePUR':
    'Halo! Episode ini untuk penyetuju PUR. Anda akan menyetujui tiga hal: Purchase Request, GRPO, dan Inventory Transfer.',
  'Ep5-AdminPurchase':
    'Halo, Admin purchase! Episode ini singkat saja. Kita buat Purchase Order dari Purchase Request yang sudah disetujui.',
  'Ep6-ApprovePO':
    'Halo! Episode ini untuk penyetuju Purchase Order. Yuk, kita lihat cara menyetujui, dan juga cara menolaknya.',
  'Ep7-Kasir':
    'Halo, Kasir! Di video ini, kita jalani satu shift penuh. Mulai dari buka kasir, melayani pembeli, sampai tutup kasir.',
};

export const POSISI: Record<string, string> = {
  'Ep0-AlurLengkap': 'Ada tujuh peran yang terlibat, dan sembilan tahap. Perhatikan penanda di bagian atas layar, supaya Anda tahu sedang di tahap mana.',
  'Ep1-AdminKapal': 'Anda ada di dua titik alur: di awal, saat memesan barang, dan menjelang akhir, saat barang tiba di dek.',
  'Ep2-ApproveSO': 'Anda muncul dua kali di alur: setelah kapal memesan, dan setelah barang diterima di dek.',
  'Ep3-AdminDC': 'Posisi Anda ada di tengah alur. Dari memilah stok, sampai barang dikirim ke dek.',
  'Ep4-ApprovePUR': 'Anda menjaga bagian pembelian. Setiap PUR, GRPO, dan transfer, lewat persetujuan Anda.',
  'Ep5-AdminPurchase': 'Anda ada di jalur pembelian, tepat setelah PUR disetujui.',
  'Ep6-ApprovePO': 'Anda ada di jalur pembelian, tepat setelah admin purchase mengajukan PO.',
  'Ep7-Kasir': 'Anda ada di ujung alur. Barang sudah sampai di dek, dan sekarang saatnya dijual.',
};

export const LANGKAH: Record<string, string[]> = {
  'Ep0-AlurLengkap': [
    'Semuanya dimulai di kapal. Admin kapal KM Awu memesan enam AQUA untuk Dek 3, dan dua puluh empat Teh Pucuk untuk Dek 7. Lalu klik Kirim ke DC.',
    'Permintaan langsung dapat nomor, dan statusnya menunggu persetujuan.',
    'Sekarang giliran Approve SO. Periksa barang dan harga jualnya, lalu klik Setujui.',
    'Begitu disetujui, dua Sales Order langsung dibuat di SAP. Satu untuk Dek 3, satu untuk Dek 7.',
    'Lanjut ke admin DC. AQUA masih ada di gudang, jadi enam diambil dari stok DC. Teh Pucuk kosong, jadi dua puluh empat harus dibeli.',
    'Approve PUR memeriksa jumlah yang harus dibeli, lalu menyetujuinya.',
    'Purchase Request untuk Dek 7 pun dibuat di SAP.',
    'Admin purchase memilih vendor, mengisi jumlah dan harga beli, lalu mengajukan Purchase Order.',
    'Approve PO memeriksa vendor dan harganya, lalu klik Setujui.',
    'Setelah level terakhir menyetujui, Purchase Order dibuat di SAP.',
    'Beberapa hari kemudian, barang dari vendor tiba di gudang. Admin DC mengisi jumlah yang diterima, lalu mengajukan GRPO.',
    'Approve PUR menyetujui GRPO, dan stok di DC bertambah.',
    'Sekarang barang siap dikirim. Admin DC memeriksa jumlah untuk tiap dek, lalu mengajukan Inventory Transfer.',
    'Approve PUR menyetujui, dan Inventory Transfer dibuat di SAP, satu untuk setiap dek.',
    'Kiriman tiba di kapal. Admin kapal membuka Terima barang, lalu klik Periksa dan terima.',
    'Barangnya dihitung. Isi jumlah yang diterima baik, dan yang rusak, lalu konfirmasi.',
    'Kepala toko mencentang semua checklist, lalu menyetujui penerimaan.',
    'Terakhir, P2 menyetujui. Stok dek bertambah, dan Sales Order ditutup di SAP.',
    'Barang sudah ada di dek, dan siap dijual. Kasir scan dua AQUA, totalnya tiga puluh delapan ribu rupiah.',
    'Pembeli bayar lima puluh ribu, dan kembaliannya, dua belas ribu, langsung dihitung.',
    'Di akhir hari, kasir klik Kirim DO hari ini. Penjualan pun masuk ke SAP sebagai Delivery Order. Dan alurnya selesai.',
  ],
  'Ep1-AdminKapal': [
    'Begitu masuk, Anda langsung disambut Beranda. Di sini terlihat kiriman dari DC, tugas berikutnya, dan penjualan hari ini di setiap dek.',
    'Mau pindah dek? Klik tombol kapal di kanan atas. Dari situ, Anda bisa pilih satu dek, atau lihat semuanya sekaligus.',
    'Sekarang, kita buat pesanan. Klik Pesan DC, lalu Pesanan baru. Pilih nomor voyage, periode, dan pelabuhan suplainya.',
    'Lalu isi tanggal barang dibutuhkan. Ingat, minimal lima hari sebelumnya, ya. Tambahkan juga catatan untuk DC kalau perlu.',
    'Berikutnya, cari barangnya, atau langsung scan barcode. Untuk setiap barang, pilih dek tujuannya, lalu isi jumlah yang dipesan.',
    'Sudah lengkap? Klik Kirim ke DC. Kalau belum selesai, tenang saja, klik Simpan draft dulu.',
    'Permintaan Anda langsung dapat nomor, dan statusnya menunggu persetujuan.',
    'Untuk memantau, klik nomor permintaannya. Anda bisa lihat statusnya, Sales Order per dek, dan siapa saja yang sudah menyetujui.',
    'Saat kiriman dari DC tiba, buka Stok, lalu Terima barang. Di tab Kiriman masuk, klik Periksa dan terima.',
    'Hitung barangnya, lalu isi jumlah yang diterima baik, dan yang rusak. Kolom selisih akan langsung menunjukkan kalau ada yang kurang. Lalu klik Konfirmasi diterima.',
    'Sekarang giliran kepala toko. Buka tab Menunggu approval, lalu centang semua butir checklist-nya.',
    'Kalau semua sudah dicentang, klik Setujui. Penerimaan lanjut ke P2 untuk persetujuan terakhir.',
    'Perlu memindahkan barang ke dek lain? Buka Mutasi gudang, pilih dari mana, dan ke mana. Isi jumlahnya, lalu klik Pindahkan. Mutasinya langsung tercatat di SAP.',
    'Di menu Kas, Anda bisa catat kas keluar, setoran ke pusat, kas masuk, dan melihat buku kas bulan ini.',
    'Posisi stok menunjukkan stok setiap barang di tiap dek, lengkap dengan penjualan tujuh hari terakhir.',
    'Butuh laporan? Ada laporan penjualan, persediaan, mutasi, dan kas. Semuanya bisa langsung dicetak.',
    'Dan untuk memasang aplikasi kasir di HP, cukup scan kode QR untuk dek tersebut.',
    'Satu lagi. Kalau permintaan Anda ditolak, alasannya akan muncul. Perbaiki saja isinya, lalu kirim ulang.',
  ],
  'Ep2-ApproveSO': [
    'Setiap ada permintaan yang menunggu, Anda akan melihat kartu biru di Ringkasan, dan angka di lonceng.',
    'Buka Permintaan barang, lalu tab Giliran saya. Periksa barang untuk setiap dek, stoknya, dan harga jualnya.',
    'Kalau ada harga jual yang masih kosong, isi dulu. Setelah itu, klik Setujui.',
    'Begitu disetujui, Sales Order langsung dibuat di SAP, satu untuk setiap dek. Permintaan pun lanjut ke admin DC.',
    'Kalau ada yang tidak sesuai, tulis alasannya, lalu klik Tolak. Permintaan akan kembali ke admin kapal untuk diperbaiki.',
    'Tugas kedua Anda adalah sebagai P2. Buka Dokumen stok, lalu pilih yang menunggu approval terima.',
    'Periksa jumlah yang diterima, yang rusak, dan catatan dari kepala toko. Kalau sudah sesuai, klik Setujui.',
    'Setelah itu, stok di dek otomatis bertambah, dan Sales Order-nya ditutup di SAP.',
    'Selain itu, Anda juga menyetujui perubahan harga jual yang diajukan oleh kapal.',
    'Sebagai P2, Anda juga mengisi forecast, yaitu perkiraan kebutuhan sebulan untuk setiap DC.',
    'Oh ya, Anda bisa membuka hampir semua menu untuk memantau. Tapi yang bisa diubah, hanya tugas persetujuan Anda.',
  ],
  'Ep3-AdminDC': [
    'Mulai dari tab Giliran saya. Di sini, semua permintaan yang menunggu Anda sudah lengkap dengan label tugasnya.',
    'Buka permintaannya, lalu isi kolom Transfer DC dengan jumlah yang bisa diambil dari stok gudang. Sisanya, otomatis jadi PUR.',
    'Kalau barangnya sama sekali tidak ada di gudang, klik Tidak ada di stok DC. Lalu, klik Setujui PUR tahap satu.',
    'Setelah PO disetujui, barang dari vendor akan datang. Isi jumlah yang benar-benar diterima.',
    'Lalu klik Ajukan GRPO. GRPO-nya akan dibuat di SAP, setelah disetujui oleh approve PUR.',
    'Selanjutnya, panel Inventory Transfer muncul. Jumlahnya sudah diusulkan otomatis, dari stok gudang ditambah hasil GRPO.',
    'Periksa jumlah untuk setiap dek, lalu klik Ajukan Inventory Transfer.',
    'Untuk memantau gudang, buka Laporan stok DC. Kartu stoknya bahkan bisa diekspor ke Excel.',
    'Kalau pengajuan Anda ditolak, alasannya akan tampil di panel. Perbaiki jumlahnya, lalu ajukan ulang.',
  ],
  'Ep4-ApprovePUR': [
    'Buka permintaan di tab Approval PUR. Periksa berapa yang diambil dari stok DC, dan berapa yang harus dibeli.',
    'Jumlah PUR masih bisa Anda ubah. Kalau sudah pas, klik Setujui. Atau, tulis alasannya, lalu tolak.',
    'Setelah disetujui, Purchase Request langsung dibuat di SAP.',
    'Saat barang dari vendor tiba, admin DC mengajukan GRPO. Periksa jumlahnya, lalu klik Setujui.',
    'Berikutnya, transfer ke dek. Periksa barang, dek tujuan, dan jumlah yang dikirim. Lalu, klik Setujui.',
    'Inventory Transfer pun dibuat di SAP, satu untuk setiap dek. Dan kirimannya langsung muncul di kapal.',
    'Kalau ada yang perlu diperbaiki, tulis catatan, lalu klik Tolak. Dokumennya kembali ke admin DC.',
  ],
  'Ep5-AdminPurchase': [
    'Kartu biru di Ringkasan menunjukkan berapa PUR yang menunggu dibuatkan Purchase Order.',
    'Buka permintaan yang berlabel Buat PO, lalu cari dan pilih vendornya.',
    'Periksa jumlah PO-nya, lalu isi harga beli sebelum pajak. Totalnya akan dihitung otomatis.',
    'Kalau sudah, klik Ajukan Purchase Order. PO akan dibuat di SAP setelah disetujui.',
    'Kalau PO Anda ditolak, alasannya akan muncul. Vendor, jumlah, dan harga sudah terisi lagi, jadi tinggal diperbaiki, lalu ajukan ulang.',
  ],
  'Ep6-ApprovePO': [
    'Ada PO yang menunggu? Klik Buka di kartu biru, atau buka permintaan yang berlabel Approval PO.',
    'Periksa vendornya, barangnya, jumlah, dan harga belinya. Tambahkan catatan kalau perlu, lalu klik Setujui.',
    'Setelah level terakhir menyetujui, Purchase Order langsung dibuat di SAP.',
    'Kalau mau menolak, catatannya wajib diisi, ya. Lalu klik Tolak, dan PO akan kembali ke admin purchase.',
  ],
  'Ep7-Kasir': [
    'Begitu masuk, layar awal mengecek koneksi, data barang, dan sinkron SAP. Kalau semuanya hijau, klik Buka kasir.',
    'Ada pembeli datang? Scan barcode barangnya. Atau, ketik nama atau kodenya, lalu tekan Enter.',
    'Mau tiga barang sekaligus? Ketik tiga bintang, lalu kodenya. Atau, ubah jumlahnya dengan tombol plus dan minus.',
    'Supaya lebih cepat, hafalkan tombol ini. F2 untuk cari barang, F4 untuk tahan pesanan, F8 untuk ubah jumlah atau diskon, F9 untuk riwayat, dan F12 untuk bayar.',
    'Kalau muncul pesan stok habis, artinya barang itu belum ada di dek ini. Minta admin kapal untuk memindahkannya dulu.',
    'Saatnya bayar. Tekan F12, lalu pilih tunai atau QRIS. Isi uang yang diterima, dan kembaliannya langsung dihitung.',
    'Klik Selesaikan pembayaran. Struk tercetak, lalu klik Transaksi baru untuk pembeli berikutnya.',
    'Perlu cetak ulang struk? Buka Riwayat. Di sini juga ada retur barang, yang butuh PIN kepala toko.',
    'Di akhir hari, buka Rekap shift, lalu klik Kirim DO hari ini. Tunggu sebentar sampai nomor DO-nya muncul, ya.',
    'Di menu Kas, catat setiap kas keluar, setoran ke pusat, dan kas masuk. Untuk kas keluar yang besar, perlu PIN kepala toko.',
    'Selesai berjualan? Kosongkan keranjang, klik inisial akun Anda, lalu pilih Tutup kasir, dan cetak laporannya.',
    'Dan kasir pun ditutup. Uang tunai yang belum disetor akan ditampilkan, sebagai pengingat. Terima kasih sudah melayani hari ini!',
  ],
};

export const PENUTUP: Record<string, string> = {
  'Ep0-AlurLengkap':
    'Jadi, satu permintaan mengalir melewati tujuh peran. Dokumen SAP dibuat setelah setiap persetujuan, dan semuanya berakhir di Delivery Order kasir. Untuk detail tiap peran, tonton episode satu sampai tujuh.',
  'Ep1-AdminKapal':
    'Jadi, ingat tiga hal ini. Pesan ke DC paling lambat lima hari sebelumnya. Terima barang per dek, dengan checklist. Dan mutasi antar dek, langsung tercatat di SAP. Sampai jumpa di episode berikutnya!',
  'Ep2-ApproveSO':
    'Jadi, ingat tiga hal ini. Lonceng menunjukkan tugas Anda. Setujui Sales Order, satu per dek. Dan sebagai P2, Anda yang menutup penerimaan. Sampai jumpa di episode tiga!',
  'Ep3-AdminDC':
    'Jadi, ingat tiga hal ini. Isi Transfer DC, sisanya jadi PUR. Ajukan GRPO saat barang tiba. Dan ajukan transfer untuk setiap dek. Sampai jumpa di episode empat!',
  'Ep4-ApprovePUR':
    'Jadi, ada tiga yang Anda setujui. PUR, GRPO, dan transfer ke dek. Sampai jumpa di episode lima!',
  'Ep5-AdminPurchase':
    'Jadi, cukup tiga langkah. Pilih vendor, isi jumlah dan harga, lalu ajukan PO. Sampai jumpa di episode enam!',
  'Ep6-ApprovePO':
    'Jadi, ingat tiga hal ini. Periksa vendor dan harga. Setujui per level. Dan kalau menolak, wajib dengan catatan. Sampai jumpa di episode tujuh!',
  'Ep7-Kasir':
    'Jadi, ingat tiga hal ini. Jual dan bayar. Kirim DO setiap hari. Dan jangan lupa tutup kasir. Langkah lengkapnya ada di Manual Book bab delapan. Selamat bertugas!',
};

// Narasi video perkenalan, per kunci kalimat (intro.ts). Teks di layar tetap seperti di intro.ts.
export const INTRO_UCAPAN: Record<string, string> = {
  'intro/01-kapal': 'Setiap kali kapal berlayar, toko di setiap dek harus siap melayani penumpang.',
  'intro/02-masalah': 'Tapi selama ini, permintaan barang, persetujuan, dan stok, tercatat di banyak tempat. Ada di kertas, di chat, di Excel.',
  'intro/03-pidpos': 'Sekarang, ada PID POS. Satu aplikasi, satu alur, dan langsung terhubung ke SAP.',
  'intro/04-alur-1': 'Semuanya dimulai dari kapal. Admin kapal memesan barang ke DC.',
  'intro/04-alur-2': 'Setelah disetujui, Sales Order langsung dibuat di SAP, satu untuk setiap dek.',
  'intro/04-alur-3': 'Lalu admin DC memilah, mana yang bisa diambil dari stok gudang.',
  'intro/04-alur-4': 'Kalau stoknya kurang, barang dibeli lewat Purchase Request, dan Purchase Order.',
  'intro/04-alur-5': 'Barang dari vendor diterima di DC, dengan GRPO.',
  'intro/04-alur-6': 'Kemudian, barang dikirim ke dek, lewat Inventory Transfer.',
  'intro/04-alur-7': 'Di kapal, barang diperiksa, lalu disetujui kepala toko, dan P2.',
  'intro/04-alur-8': 'Dan akhirnya, barang siap dijual di kasir.',
  'intro/05-peran-1': 'Ada tujuh peran dalam alur ini, dan masing-masing hanya melihat tugasnya sendiri.',
  'intro/05-peran-2': 'Jadi Anda tidak perlu mencari-cari. Lonceng, dan tab Giliran saya, selalu menunjukkan apa yang menunggu Anda.',
  'intro/06-kasir-1': 'Di dek, kasir tinggal scan barang. Totalnya langsung muncul.',
  'intro/06-kasir-2': 'Pembeli bisa bayar tunai, atau pakai QRIS. Kembaliannya dihitung otomatis.',
  'intro/06-kasir-3': 'Struk tercetak, dan penjualan hari itu dikirim ke SAP, cukup dengan satu klik.',
  'intro/07-penutup':
    'PID POS. Dari permintaan kapal, sampai struk kasir, semuanya tercatat. Yuk, tonton video sesuai peran Anda.',
};
