import {RoleKey} from '../theme';
import {fitFrames} from './vo';
import {LANGKAH, PEMBUKA, PENUTUP, POSISI} from './naskah';

// Satu langkah = satu adegan. `text` tampil di layar dan sekaligus dibacakan sebagai narasi.
export type Step = {
  img?: string; // nama gambar di public/img (g01..g52) = Gambar 1..52 di manual
  title: string;
  text: string;
  // Kotak sorot di gambar, dalam pecahan lebar/tinggi gambar: [x, y, w, h]
  focus?: [number, number, number, number];
  sap?: string; // dokumen SAP yang terbentuk di langkah ini
  icon?: 'tolak' | 'info' | 'stok';
  vo?: string; // naskah narasi bila berbeda dari `text`
};

export type Episode = {
  id: string;
  no: number;
  role: RoleKey;
  title: string;
  bab: number;
  goal: string;
  flow: string[]; // simpul peta alur yang dinyalakan
  steps: Step[];
  recap: [string, string, string];
  next?: string;
};

export const EPISODES: Episode[] = [
  {
    id: 'Ep1-AdminKapal',
    no: 1,
    role: 'kapal',
    title: 'Pesan, terima, dan mutasi barang',
    bab: 2,
    goal: 'Memesan barang ke DC, menerima kiriman di dek, menyetujui sebagai kepala toko, dan memindahkan barang antar dek.',
    flow: ['pesan', 'terima'],
    steps: [
      {img: 'g01', title: 'Beranda kapal', text: 'Beranda menampilkan kiriman dari DC, tugas berikutnya, dan penjualan hari ini per dek.'},
      {img: 'g01', title: 'Ganti dek', text: 'Klik tombol kapal di kanan atas untuk berpindah dek atau melihat semua dek.', focus: [0.7, 0.0, 0.17, 0.08]},
      {img: 'g02', title: 'Pesanan baru ke DC', text: 'Klik Pesan DC lalu Pesanan baru. Pilih No. voyage, periode voyage, dan pelabuhan suplai.', focus: [0.01, 0.22, 0.89, 0.15]},
      {img: 'g02', title: 'Tanggal dibutuhkan', text: 'Isi Barang dibutuhkan tanggal, minimal H-5, dan catatan untuk DC.', focus: [0.36, 0.37, 0.36, 0.14]},
      {img: 'g02', title: 'Pilih barang per dek', text: 'Cari barang atau scan barcode. Pilih Dek tujuan dan isi jumlah Dipesan.', focus: [0.01, 0.54, 0.98, 0.34]},
      {img: 'g02', title: 'Kirim ke DC', text: 'Klik Kirim ke DC. Bila belum selesai, klik Simpan draft.', focus: [0.795, 0.885, 0.195, 0.1]},
      {img: 'g03', title: 'Menunggu persetujuan', text: 'Permintaan mendapat nomor dan berstatus Menunggu persetujuan di daftar Pesan DC.'},
      {img: 'g04', title: 'Pantau permintaan', text: 'Klik nomor permintaan untuk melihat status, Sales Order per dek, dan riwayat persetujuan.'},
      {img: 'g05', title: 'Kiriman masuk', text: 'Buka Stok, Terima barang, tab Kiriman masuk. Klik Periksa & terima pada kiriman.'},
      {img: 'g06', title: 'Periksa & terima', text: 'Isi Diterima baik dan Rusak. Kolom Selisih menunjukkan beda dengan yang dikirim. Klik Konfirmasi diterima.'},
      {img: 'g07', title: 'Checklist kepala toko', text: 'Buka tab Menunggu approval. Centang semua butir checklist terima barang.'},
      {img: 'g08', title: 'Setujui (Kepala toko)', text: 'Setelah checklist lengkap, klik Setujui. Status menjadi Menunggu P2.', focus: [0.82, 0.8, 0.16, 0.08]},
      {img: 'g09', title: 'Mutasi antar dek', text: 'Buka Stok, Mutasi gudang. Pilih Dari dan Ke, isi jumlah, lalu klik Pindahkan.', sap: 'Inventory Transfer 262000148'},
      {img: 'g10', title: 'Kas dek', text: 'Menu Kas: kas keluar, setor ke pusat, kas masuk, dan buku kas bulan ini.'},
      {img: 'g11', title: 'Posisi stok', text: 'Stok per barang di setiap dek, total, dan terjual 7 hari.'},
      {img: 'g16', title: 'Laporan', text: 'Laporan penjualan, persediaan, mutasi, kas, dan rekap permintaan. Bisa dicetak.'},
      {img: 'g17', title: 'Pasang HP kasir', text: 'QR per dek untuk memasang aplikasi Android kasir, dan daftar HP terdaftar.'},
      {icon: 'tolak', title: 'Bila ditolak', text: 'Permintaan kembali dengan alasan penolakan. Perbaiki isinya, lalu kirim ulang ke DC.'},
    ],
    recap: ['Pesan ke DC minimal H-5', 'Terima per dek + checklist', 'Mutasi antar dek langsung ke SAP'],
    next: 'Episode 2: Approve SO (P2)',
  },
  {
    id: 'Ep2-ApproveSO',
    no: 2,
    role: 'so',
    title: 'Menyetujui Sales Order dan P2',
    bab: 3,
    goal: 'Menyetujui permintaan kapal menjadi Sales Order, dan menyetujui penerimaan barang di kapal sebagai P2.',
    flow: ['so', 'terima'],
    steps: [
      {img: 'g18', title: 'Tugas menunggu', text: 'Kartu biru di Ringkasan dan angka di lonceng menunjukkan permintaan yang menunggu Anda.'},
      {img: 'g19', title: 'Periksa permintaan', text: 'Buka Permintaan barang, tab Giliran saya. Periksa barang per dek, stok, dan harga jual.', focus: [0.02, 0.48, 0.95, 0.2]},
      {img: 'g19', title: 'Setujui level 1', text: 'Isi harga jual bila kosong, lalu klik Setujui level 1 (Approval SO).', focus: [0.69, 0.845, 0.28, 0.08]},
      {img: 'g20', title: 'Sales Order per dek', text: 'Sales Order dibuat di SAP, satu per dek. Permintaan lanjut ke admin DC.', sap: 'Sales Order 266000699 / 266000700'},
      {icon: 'tolak', title: 'Menolak permintaan', text: 'Isi Catatan approval atau alasan, lalu klik Tolak. Permintaan kembali ke admin kapal.'},
      {img: 'g21', title: 'P2: penerimaan kapal', text: 'Buka Stok, Dokumen stok, status Menunggu approval terima. Klik dokumen bertanda Giliran Anda.'},
      {img: 'g21', title: 'Setujui (P2)', text: 'Periksa jumlah diterima, rusak, dan riwayat kepala toko. Klik Setujui (P2).'},
      {img: 'g22', title: 'Stok dek bertambah', text: 'Setelah P2 menyetujui, stok dek bertambah dan Sales Order dek ditutup di SAP.', sap: 'SO ditutup'},
      {img: 'g23', title: 'Pengajuan harga', text: 'Akun ini juga menyetujui perubahan harga jual yang diajukan kapal.'},
      {img: 'g24', title: 'Forecast DC', text: 'P2 mengisi kebutuhan sebulan per DC dan 10 barang prioritas.'},
      {img: 'g25', title: 'Mode Lihat saja', text: 'Semua menu admin bisa dibuka untuk memantau, tetapi hanya tugas persetujuan yang bisa dikerjakan.'},
    ],
    recap: ['Lonceng = tugas Anda', 'Setujui SO, satu per dek', 'P2 menutup penerimaan'],
    next: 'Episode 3: Admin DC',
  },
  {
    id: 'Ep3-AdminDC',
    no: 3,
    role: 'dc',
    title: 'Pilah stok, GRPO, dan transfer ke dek',
    bab: 4,
    goal: 'Memilah stok DC, mencatat barang vendor dengan GRPO, dan mengirim barang ke dek dengan Inventory Transfer.',
    flow: ['pilah', 'grpo', 'transfer'],
    steps: [
      {img: 'g26', title: 'Giliran saya', text: 'Tab Giliran saya menampilkan permintaan yang menunggu Anda, dengan label tugasnya.'},
      {img: 'g27', title: 'Isi Transfer DC', text: 'Isi qty yang diambil dari stok DC. Sisanya otomatis menjadi Qty PUR.', focus: [0.57, 0.57, 0.27, 0.26]},
      {img: 'g27', title: 'Setujui PUR tahap 1', text: 'Bila tidak ada di stok DC, klik Tidak ada di stok DC. Lalu klik Setujui PUR tahap 1.', focus: [0.58, 0.875, 0.29, 0.07]},
      {img: 'g28', title: 'Barang vendor datang', text: 'Setelah PO disetujui dan barang tiba, isi Qty diterima (GRPO) sesuai barang yang datang.'},
      {img: 'g29', title: 'Ajukan GRPO', text: 'Klik Ajukan GRPO. GRPO dibuat di SAP setelah disetujui Approve PUR.'},
      {img: 'g30', title: 'Transfer ke dek', text: 'Panel Inventory Transfer muncul dengan usulan qty: stok DC ditambah hasil GRPO.'},
      {img: 'g31', title: 'Ajukan Inventory Transfer', text: 'Periksa qty per dek, lalu klik Ajukan Inventory Transfer.'},
      {img: 'g32', title: 'Laporan stok DC', text: 'Lihat gudang DC dan kartu stok per barang. Bisa diekspor ke CSV.'},
      {icon: 'tolak', title: 'Bila ditolak', text: 'Alasan penolakan tampil di panel. Periksa qty, perbaiki, lalu ajukan ulang.'},
    ],
    recap: ['Isi Transfer DC, sisanya PUR', 'Ajukan GRPO saat barang tiba', 'Ajukan transfer per dek'],
    next: 'Episode 4: Approve PUR',
  },
  {
    id: 'Ep4-ApprovePUR',
    no: 4,
    role: 'pur',
    title: 'Menyetujui PUR, GRPO, dan transfer',
    bab: 5,
    goal: 'Menyetujui Purchase Request, GRPO, dan Inventory Transfer yang diajukan admin DC.',
    flow: ['pur', 'grpo', 'transfer'],
    steps: [
      {img: 'g33', title: 'Approval PUR', text: 'Buka permintaan di tab Approval PUR. Periksa Transfer DC dan Qty PUR.'},
      {img: 'g33', title: 'Setujui PUR', text: 'Qty PUR masih bisa diubah. Klik Setujui PUR level 1, atau isi alasan lalu Tolak PUR.'},
      {img: 'g34', title: 'Purchase Request terbentuk', text: 'Purchase Request dibuat di SAP untuk dek yang punya qty PUR.', sap: 'Purchase Request 262000460'},
      {img: 'g35', title: 'Approval GRPO', text: 'Periksa Qty diterima yang diajukan admin DC, lalu klik Setujui.', sap: 'GRPO 262001908'},
      {img: 'g36', title: 'Approval transfer', text: 'Periksa barang, dek tujuan, dan qty dikirim. Klik Setujui.'},
      {img: 'g37', title: 'Transfer terbentuk', text: 'Inventory Transfer dibuat di SAP, satu per dek, lalu muncul di Terima barang kapal.', sap: 'Inventory Transfer 262000146 / 147'},
      {icon: 'tolak', title: 'Menolak', text: 'Isi catatan lalu klik Tolak. Dokumen kembali ke admin DC.'},
    ],
    recap: ['Setujui PUR', 'Setujui GRPO', 'Setujui transfer per dek'],
    next: 'Episode 5: Admin purchase',
  },
  {
    id: 'Ep5-AdminPurchase',
    no: 5,
    role: 'purchase',
    title: 'Membuat Purchase Order',
    bab: 6,
    goal: 'Membuat dan mengajukan Purchase Order dari Purchase Request.',
    flow: ['po'],
    steps: [
      {img: 'g38', title: 'PUR menunggu PO', text: 'Kartu biru di Ringkasan menunjukkan PUR yang menunggu dibuatkan Purchase Order.'},
      {img: 'g39', title: 'Pilih vendor', text: 'Buka permintaan berlabel Buat PO. Cari dan pilih vendor.', focus: [0.03, 0.62, 0.38, 0.065]},
      {img: 'g39', title: 'Qty dan harga beli', text: 'Periksa Qty PO dan isi Harga beli sebelum PPN. Total dihitung otomatis.', focus: [0.53, 0.75, 0.31, 0.09]},
      {img: 'g40', title: 'Ajukan Purchase Order', text: 'Klik Ajukan Purchase Order. PO dibuat di SAP setelah disetujui Approve PO.'},
      {icon: 'tolak', title: 'Bila PO ditolak', text: 'Alasan tampil di panel. Vendor, qty, dan harga terisi lagi. Perbaiki lalu ajukan ulang.'},
    ],
    recap: ['Pilih vendor', 'Isi qty dan harga beli', 'Ajukan PO'],
    next: 'Episode 6: Approve PO',
  },
  {
    id: 'Ep6-ApprovePO',
    no: 6,
    role: 'po',
    title: 'Menyetujui Purchase Order',
    bab: 7,
    goal: 'Menyetujui Purchase Order yang diajukan admin purchase. Persetujuan bisa bertingkat.',
    flow: ['po'],
    steps: [
      {img: 'g41', title: 'PO menunggu', text: 'Klik Buka di kartu biru, atau buka permintaan berlabel Approval PO.'},
      {img: 'g42', title: 'Periksa dan setujui', text: 'Periksa vendor, barang, qty, dan harga beli. Isi catatan bila perlu, lalu klik Setujui.'},
      {img: 'g43', title: 'PO terbentuk di SAP', text: 'Setelah level terakhir menyetujui, Purchase Order dibuat di SAP.', sap: 'Purchase Order 262002060'},
      {icon: 'tolak', title: 'Menolak PO', text: 'Isi catatan (wajib), lalu klik Tolak. PO kembali ke admin purchase.'},
    ],
    recap: ['Periksa vendor dan harga', 'Setujui per level', 'Tolak wajib dengan catatan'],
    next: 'Episode 7: Kasir',
  },
  {
    id: 'Ep7-Kasir',
    no: 7,
    role: 'kasir',
    title: 'Dari buka kasir sampai tutup kasir',
    bab: 8,
    goal: 'Menjual barang di dek, menerima pembayaran, mengirim DO ke SAP, dan menutup kasir.',
    flow: ['jual'],
    steps: [
      {img: 'g44', title: 'Buka kasir', text: 'Layar awal memeriksa koneksi, data barang, dan sinkron SAP. Klik Buka kasir.'},
      {img: 'g45', title: 'Scan barang', text: 'Scan barcode, atau ketik nama atau kode lalu Enter.'},
      {img: 'g45', title: 'Ubah jumlah', text: 'Ketik 3*kode untuk 3 pcs sekaligus, atau ubah qty dengan tombol + dan −.'},
      {img: 'g45', title: 'Tombol cepat', text: 'F2 cari barang · F4 tahan · F8 qty/diskon · F9 riwayat · F12 bayar.', vo: 'Tombol cepat: F2 cari barang, F4 tahan, F8 ubah qty atau diskon, F9 riwayat, dan F12 bayar.', focus: [0.0, 0.88, 0.62, 0.1]},
      {icon: 'stok', title: 'Stok habis', text: 'Barang yang stoknya habis di dek ini ditolak. Minta admin kapal memutasi barang dulu.'},
      {img: 'g46', title: 'Bayar (F12)', text: 'Pilih Tunai atau QRIS. Isi uang diterima, kembalian dihitung otomatis.'},
      {img: 'g47', title: 'Struk tercetak', text: 'Klik Selesaikan pembayaran. Struk tercetak, lalu klik Transaksi baru.'},
      {img: 'g48', title: 'Riwayat dan retur', text: 'Di Riwayat bisa cetak ulang struk. Retur butuh qty, alasan, dan PIN kepala toko.'},
      {img: 'g49', title: 'Kirim DO hari ini', text: 'Buka Rekap shift, klik Kirim DO hari ini. Tunggu sampai nomor DO muncul.', sap: 'Delivery (DO) 266000512', focus: [0.86, 0.015, 0.135, 0.05]},
      {img: 'g50', title: 'Kas kasir', text: 'Catat kas keluar, setor ke pusat, dan kas masuk. Kas keluar besar perlu PIN kepala toko.'},
      {img: 'g51', title: 'Tutup kasir', text: 'Kosongkan keranjang. Klik inisial akun, Tutup kasir, lalu Tutup kasir & cetak laporan.', focus: [0.02, 0.85, 0.4, 0.09]},
      {img: 'g52', title: 'Kasir ditutup', text: 'Setelah ditutup, struk shift ini tidak bisa ditambah. Tunai yang belum disetor ditampilkan.'},
    ],
    recap: ['Jual dan bayar', 'Kirim DO hari ini', 'Tutup kasir'],
  },
];

// Kunci file narasi per bagian episode (public/vo/<kunci>.mp3).
export const voKey = {
  open: (e: Episode) => `${e.id}/00-pembuka`,
  map: (e: Episode) => `${e.id}/01-alur`,
  step: (e: Episode, i: number) => `${e.id}/s${String(i + 1).padStart(2, '0')}`,
  recap: (e: Episode) => `${e.id}/99-penutup`,
};

// Naskah narasi episode: gaya bicara dari naskah.ts, cadangannya teks layar.
export const narasiEpisode = (e: Episode, roleName: string) => {
  const langkah = LANGKAH[e.id] ?? [];
  if (langkah.length && langkah.length !== e.steps.length) {
    throw new Error(`Naskah ${e.id}: ${langkah.length} kalimat untuk ${e.steps.length} langkah`);
  }
  return [
    {key: voKey.open(e), text: PEMBUKA[e.id] ?? `Episode ${e.no}, ${roleName}: ${e.title}. ${e.goal}`},
    {key: voKey.map(e), text: POSISI[e.id] ?? `Posisi Anda di alur: giliran ${roleName}.`},
    ...e.steps.map((s, i) => ({key: voKey.step(e, i), text: langkah[i] ?? s.vo ?? s.text})),
    {key: voKey.recap(e), text: PENUTUP[e.id] ?? `Ingat tiga hal: ${e.recap.join(', ')}.`},
  ];
};

// Durasi adegan langkah: cukup untuk membaca teksnya (sekitar 2,6 kata per detik), dan untuk narasinya bila ada.
export const stepFrames = (e: Episode, i: number, fps: number) => {
  const s = e.steps[i];
  const words = (s.title + ' ' + s.text).split(/\s+/).length;
  const sec = Math.min(10, Math.max(5, 2.2 + words / 2.6));
  return fitFrames(voKey.step(e, i), Math.round(sec * fps), fps, 1.0);
};

export const openFrames = (e: Episode, fps: number) => fitFrames(voKey.open(e), 150, fps, 1.2);
export const mapFrames = (e: Episode, fps: number) => fitFrames(voKey.map(e), 150, fps, 1.2);
export const recapFrames = (e: Episode, fps: number) => fitFrames(voKey.recap(e), 210, fps, 1.5);

export const episodeFrames = (e: Episode, fps: number) =>
  openFrames(e, fps) +
  mapFrames(e, fps) +
  e.steps.reduce((a, _, i) => a + stepFrames(e, i, fps), 0) +
  recapFrames(e, fps);
