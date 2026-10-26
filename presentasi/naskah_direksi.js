// Naskah paparan direksi PID POS, satu entri per halaman deck build_direksi_template.js.
// Dipakai sebagai catatan pembicara di pptx dan ditulis ulang ke docs/Naskah_Paparan_Direksi_PID_POS.md.
module.exports = [
  {
    judul: 'PID POS', durasi: '0:30',
    teks: [
      'Selamat pagi, Bapak dan Ibu Direksi.',
      'Pada kesempatan ini kami memaparkan PID POS, aplikasi toko kapal PT Pelita Indonesia Djaya yang terhubung langsung dengan SAP Business One.',
      'Kami akan menyampaikan apa itu PID POS, bagaimana alurnya, siapa saja yang terlibat, fitur utamanya, kasir di setiap dek, keunggulan, dan batasannya saat ini.',
    ],
  },
  {
    judul: 'Satu aplikasi untuk seluruh alur toko kapal', durasi: '1:00',
    teks: [
      'PID POS terdiri dari dua bagian yang saling terhubung.',
      'Pertama, aplikasi web. Aplikasi ini dipakai oleh admin kapal, Distribution Center atau DC, dan kantor pusat untuk memesan barang, memberi persetujuan, memantau stok, dan melihat laporan.',
      'Kedua, aplikasi kasir Android untuk setiap dek. Kasir memindai barang, menerima pembayaran tunai atau QRIS, mencetak struk, dan menutup shift.',
      'Keduanya terhubung dengan SAP Business One. Setelah sebuah langkah disetujui, dokumennya dibuat otomatis di SAP, sehingga tidak ada lagi input ulang.',
    ],
  },
  {
    judul: 'Alur end-to-end: setiap langkah tercatat di SAP', durasi: '2:00',
    teks: [
      'Halaman ini menunjukkan alur lengkapnya, dari pemesanan sampai penjualan.',
      'Jalur atas selalu dijalani. Admin kapal memesan barang ke DC. Permintaan itu disetujui oleh P2, lalu terbentuk Sales Order di SAP.',
      'Admin DC memilah stok dan mengirim barang ke dek. Pengiriman ini tercatat di SAP sebagai Inventory Transfer.',
      'Kepala toko menerima barang di dek, lalu barang dijual di kasir. Penjualan harian setiap dek masuk ke SAP sebagai Delivery Order.',
      'Bila stok di DC kurang, jalur pembelian di bawah berjalan. Pergudangan menyetujui Purchase Request, Purchasing membuat Purchase Order ke vendor, dan saat barang vendor tiba di DC, dicatat sebagai Goods Receipt PO atau GRPO. Setelah itu barang lanjut dikirim ke dek.',
      'Alur ini berulang. Ketika stok dek menipis, kapal memesan lagi ke DC.',
      'Enam jenis dokumen SAP pada kotak keterangan di bawah semuanya dibuat otomatis oleh aplikasi.',
    ],
  },
  {
    judul: 'Tujuh peran, masing-masing melihat tugasnya sendiri', durasi: '1:00',
    teks: [
      'Ada tujuh peran di PID POS.',
      'Di kapal ada admin kapal atau kepala toko, dan kasir.',
      'Di kantor pusat ada empat peran: Approve SO oleh P2, Approve PUR oleh Pergudangan, serta Approve PO dan Admin PO oleh Purchasing.',
      'Di DC ada admin DC.',
      'Setiap peran hanya melihat tugas yang sedang menunggunya, melalui lonceng notifikasi dan tab Giliran saya. Dengan begitu tidak ada pekerjaan yang terlewat.',
    ],
  },
  {
    judul: 'Fitur utama aplikasi web', durasi: '1:00',
    teks: [
      'Ada tiga fitur utama di aplikasi web.',
      'Pertama, Pesan ke DC. Admin kapal memilih barang dan dek tujuan, lalu mengirim permintaan ke DC.',
      'Kedua, persetujuan berjenjang. Status setiap tahap terlihat jelas, dan setelah disetujui, permintaan otomatis menjadi Sales Order di SAP.',
      'Ketiga, posisi stok per dek. Stok setiap dek, totalnya, dan penjualan tujuh hari terakhir terlihat dalam satu tabel.',
    ],
  },
  {
    judul: 'Kasir di setiap dek', durasi: '1:00',
    teks: [
      'Di setiap dek, kasir bekerja dalam empat langkah sederhana.',
      'Scan barang dengan barcode, atau ketik nama atau kode barang.',
      'Terima pembayaran tunai atau QRIS. Kembalian dihitung otomatis.',
      'Struk tercetak, dan bisa dicetak ulang dari riwayat transaksi.',
      'Di akhir hari, penjualan dikirim ke SAP sebagai Delivery Order.',
    ],
  },
  {
    judul: 'Keunggulan PID POS', durasi: '1:00',
    teks: [
      'Keunggulan PID POS dapat diringkas dalam tiga kata.',
      'Transparan. Stok setiap dek dan status setiap permintaan terpantau secara real-time, lengkap dengan riwayatnya.',
      'Terkendali. Setiap tahap melalui persetujuan berjenjang, dan setiap persetujuan tercatat lengkap: siapa yang menyetujui dan kapan.',
      'Terintegrasi. Dokumen SAP Business One dibuat otomatis, dan penjualan harian setiap dek masuk ke SAP sebagai Delivery Order.',
    ],
  },
  {
    judul: 'Batasan aplikasi saat ini', durasi: '1:00',
    teks: [
      'Kami juga perlu menyampaikan dua batasan PID POS saat ini.',
      'Pertama, aplikasi memerlukan koneksi internet. Aplikasi web dan aplikasi kasir hanya dapat digunakan saat perangkat terhubung ke internet. Karena itu, koneksi internet di kapal, DC, dan kantor pusat perlu disiapkan.',
      'Kedua, aplikasi kasir baru tersedia di Android. Versi iOS untuk iPhone dan iPad belum tersedia, sehingga perangkat kasir di setiap dek perlu menggunakan Android.',
    ],
  },
  {
    judul: 'Terima Kasih', durasi: '0:30',
    teks: [
      'Demikian paparan kami. PID POS: satu alur, dari kapal sampai kasir.',
      'Terima kasih. Kami persilakan Bapak dan Ibu Direksi untuk memberikan arahan atau pertanyaan.',
    ],
  },
];
