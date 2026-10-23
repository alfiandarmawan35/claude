// Naskah skit vertikal (Reels/TikTok): dua tokoh animasi, suara TTS, sisipan layar aplikasi.
// `text` tampil sebagai takarir; ucapan TTS dibuat dari `text` lewat ucapan() (atau `say` bila diisi).

export type Pose = 'idle' | 'bingung' | 'tunjuk' | 'senang' | 'kamera';

export type Line = {
  who: 'a' | 'b'; // a = yang bertanya (kiri), b = yang mengajari (kanan)
  text: string;
  say?: string;
  pose?: Pose;
  screen?: {img: string; focus?: [number, number, number, number]};
};

export type Tokoh = {name: string; peran: string; gender: 'm' | 'f'; voice: string; baju: string; aksen: string};

export type Skit = {
  id: string;
  judul: string;
  tempat: 'kapal' | 'gudang' | 'kantor';
  papan?: string; // tulisan di papan latar
  a: Tokoh;
  b: Tokoh;
  lines: Line[];
  penutup: {judul: string; sub: string};
};

// Kata yang ditulis kuning di takarir.
export const SOROT = [
  'PID', 'POS', 'Pesan', 'DC', 'Pesanan', 'baru', 'voyage', 'lima', 'dek', 'Kirim', 'nomor', 'dipantau', 'Sales', 'Order',
  'Terima', 'barang', 'checklist', 'stok', 'SAP', 'Giliran', 'Transfer', 'PUR', 'GRPO', 'Inventory', 'otomatis',
  'Setujui', 'kapal', 'gudang', 'WA', 'tercatat', 'manual', 'vendor', 'nol',
  'kasir', 'scan', 'barcode', 'F12', 'tunai', 'QRIS', 'struk', 'Struknya', 'Retur', 'PIN', 'Riwayat', 'Rekap', 'shift', 'DO',
  'lonceng', 'Tolak', 'alasan', 'PO', 'Purchase', 'otomatis', 'kalkulator', 'Buka', 'tutup', 'biru',
];

export const SKITS: Skit[] = [
  {
    id: 'Skit-Kapal',
    judul: 'Barang kok belum datang?',
    tempat: 'kapal',
    a: {name: 'Dimas', peran: 'Admin kapal', gender: 'm', voice: 'id-ID-ArdiNeural', baju: '0F766E', aksen: '0B5A54'},
    b: {name: 'Rina', peran: 'Kepala toko', gender: 'f', voice: 'id-ID-GadisNeural', baju: '1F3B7A', aksen: 'C0392B'},
    lines: [
      {who: 'a', pose: 'bingung', text: 'Aduh, Teh Pucuk di Dek 7 habis lagi.'},
      {who: 'a', pose: 'bingung', text: 'Kemarin udah minta ke DC lewat WA, kok belum ada kabar, ya?'},
      {who: 'b', text: 'Lagi ngapain sih, Dim? Kok mukanya kusut gitu?'},
      {who: 'a', text: 'Ini, Mbak. Pesan barang ke DC, tapi nggak tahu udah sampai mana.'},
      {who: 'b', pose: 'senang', text: 'Pesan lewat WA mah nggak kelacak. Sini, aku ajarin pakai PID POS.'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g02', focus: [0.01, 0.22, 0.89, 0.15]}, text: 'Pertama, buka menu Pesan DC, terus klik Pesanan baru.'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g02', focus: [0.36, 0.37, 0.36, 0.14]}, text: 'Pilih voyage-nya, terus isi tanggal butuhnya. Minimal lima hari sebelumnya, ya.'},
      {who: 'a', screen: {img: 'g02', focus: [0.01, 0.54, 0.98, 0.34]}, text: 'Oh, terus barangnya dipilih per dek, gitu?'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g02', focus: [0.795, 0.885, 0.195, 0.1]}, text: 'Betul. Isi jumlahnya, terus klik Kirim ke DC.'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g03'}, text: 'Nah, langsung dapat nomor permintaan.'},
      {who: 'a', pose: 'senang', screen: {img: 'g04'}, text: 'Wah, ini bisa dipantau? Udah disetujui, udah jadi Sales Order.'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g05'}, text: 'Iya. Pas barang datang, tinggal buka Terima barang.'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g08', focus: [0.82, 0.8, 0.16, 0.08]}, text: 'Hitung barangnya, centang checklist, terus setujui. Stok dek langsung bertambah.'},
      {who: 'a', pose: 'senang', text: 'Wah, jadi nggak perlu nanya-nanya ke DC lagi, ya!'},
      {who: 'b', pose: 'kamera', text: 'Jadi buat kalian di kapal, mau pesan barang ke DC? Pakai PID POS aja.'},
      {who: 'b', pose: 'kamera', text: 'Semua tercatat, bisa dipantau, dan langsung masuk SAP.'},
    ],
    penutup: {judul: 'Pesan barang ke DC?', sub: 'Pakai PID POS. Tercatat, terpantau, langsung ke SAP.'},
  },
  {
    id: 'Skit-Gudang',
    judul: 'Stoknya kurang, terus gimana?',
    tempat: 'gudang',
    a: {name: 'Bayu', peran: 'Staf gudang DC', gender: 'm', voice: 'id-ID-ArdiNeural', baju: 'EA580C', aksen: 'B84308'},
    b: {name: 'Sari', peran: 'Admin DC', gender: 'f', voice: 'id-ID-GadisNeural', baju: '1F3B7A', aksen: '6D28D9'},
    lines: [
      {who: 'a', pose: 'bingung', text: 'Waduh, ada permintaan dari KM Awu.'},
      {who: 'a', pose: 'bingung', text: 'AQUA ada di gudang, tapi Teh Pucuk kosong. Terus gimana, nih?'},
      {who: 'b', text: 'Kenapa, Bay? Bingung, ya?'},
      {who: 'a', text: 'Iya, Mbak. Biasanya kan dicatat manual dulu.'},
      {who: 'b', pose: 'senang', text: 'Sekarang nggak perlu. Semuanya ada di PID POS. Sini, aku tunjukin.'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g26'}, text: 'Buka Permintaan barang, terus tab Giliran saya. Ini tugas kamu.'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g27', focus: [0.57, 0.57, 0.27, 0.26]}, text: 'Isi kolom Transfer DC sesuai stok yang ada. AQUA enam, ambil dari gudang.'},
      {who: 'a', screen: {img: 'g27', focus: [0.57, 0.57, 0.27, 0.26]}, text: 'Teh Pucuk diisi nol, dong?'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g27', focus: [0.58, 0.875, 0.29, 0.07]}, text: 'Iya. Sisanya otomatis jadi PUR, untuk dibeli. Terus klik Setujui.'},
      {who: 'a', text: 'Terus, kalau barang dari vendor udah datang?'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g28'}, text: 'Isi jumlah yang diterima, lalu klik Ajukan GRPO.'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g30'}, text: 'Habis itu, panel Inventory Transfer muncul. Jumlahnya udah diusulin otomatis.'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g31'}, text: 'Cek jumlah per dek, terus Ajukan Inventory Transfer. Barang siap dikirim ke kapal.'},
      {who: 'a', pose: 'senang', text: 'Wah, jadi nggak perlu catat manual lagi, ya!'},
      {who: 'b', pose: 'kamera', text: 'Jadi buat kalian di gudang DC, pilah stok, GRPO, sampai kirim ke kapal,'},
      {who: 'b', pose: 'kamera', text: 'semuanya lewat PID POS. Langsung tercatat di SAP.'},
    ],
    penutup: {judul: 'Stok DC kurang?', sub: 'Pilah, GRPO, dan kirim ke kapal lewat PID POS.'},
  },
  {
    id: 'Skit-Kasir',
    judul: 'Antrean panjang, kasir pusing',
    tempat: 'kapal',
    papan: 'TOKO · DEK 3',
    a: {name: 'Putri', peran: 'Kasir Dek 3', gender: 'f', voice: 'id-ID-GadisNeural', baju: '15803D', aksen: 'D97706'},
    b: {name: 'Hendra', peran: 'Kepala toko', gender: 'm', voice: 'id-ID-ArdiNeural', baju: '1F3B7A', aksen: '15306B'},
    lines: [
      {who: 'a', pose: 'bingung', text: 'Aduh, antreannya panjang banget. Aku masih hitung pakai kalkulator.'},
      {who: 'a', pose: 'bingung', text: 'Terus nanti setor penjualannya ke SAP gimana, ya?'},
      {who: 'b', text: 'Tenang, Put. Di PID POS semuanya udah otomatis.'},
      {who: 'a', text: 'Serius, Pak? Caranya gimana?'},
      {who: 'b', pose: 'senang', screen: {img: 'g44'}, text: 'Sini, Bapak tunjukin. Pertama, klik Buka kasir.'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g45'}, text: 'Tinggal scan barcode barangnya. Mau tiga sekaligus? Ketik tiga bintang kode.'},
      {who: 'a', screen: {img: 'g45', focus: [0.0, 0.88, 0.62, 0.1]}, text: 'Oh, tombol F12 itu buat bayar, ya?'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g46'}, text: 'Betul. Pilih tunai atau QRIS. Kembaliannya langsung dihitung.'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g47'}, text: 'Struknya langsung tercetak. Klik Transaksi baru buat pembeli berikutnya.'},
      {who: 'a', text: 'Terus kalau pembeli mau retur?'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g48'}, text: 'Buka Riwayat, pilih struknya, klik Retur. Pakai PIN kepala toko, ya.'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g49', focus: [0.86, 0.015, 0.135, 0.05]}, text: 'Sorenya, buka Rekap shift, klik Kirim DO hari ini. Penjualan langsung masuk SAP.'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g51', focus: [0.02, 0.85, 0.4, 0.09]}, text: 'Terakhir, tutup kasir dan cetak laporannya.'},
      {who: 'a', pose: 'senang', text: 'Wah, nggak perlu kalkulator lagi, dong!'},
      {who: 'b', pose: 'kamera', text: 'Jadi buat kasir di setiap dek: jualan, kirim DO, dan tutup kasir,'},
      {who: 'b', pose: 'kamera', text: 'semuanya cukup lewat PID POS.'},
    ],
    penutup: {judul: 'Jualan di dek?', sub: 'Scan, bayar, kirim DO. Semua di PID POS.'},
  },
  {
    id: 'Skit-Approve',
    judul: 'Mana yang harus saya setujui?',
    tempat: 'kantor',
    papan: 'KANTOR PUSAT',
    a: {name: 'Maya', peran: 'Penyetuju', gender: 'f', voice: 'id-ID-GadisNeural', baju: '6D28D9', aksen: '1F3B7A'},
    b: {name: 'Fajar', peran: 'Admin sistem', gender: 'm', voice: 'id-ID-ArdiNeural', baju: '334155', aksen: '1E293B'},
    lines: [
      {who: 'a', pose: 'bingung', text: 'Aduh, katanya ada permintaan yang nunggu persetujuan saya.'},
      {who: 'a', pose: 'bingung', text: 'Dari kapal, dari DC, dari purchasing. Yang mana duluan, ya?'},
      {who: 'b', text: 'Permisi, Bu. Ada yang bisa saya bantu?'},
      {who: 'a', text: 'Ini, Jar. Saya bingung mau setujui yang mana.'},
      {who: 'b', pose: 'senang', text: 'Gampang, Bu. Di PID POS, tugas Ibu udah dikumpulin.'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g18'}, text: 'Lihat angka di lonceng sama kartu biru ini. Itu yang lagi nunggu Ibu.'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g19', focus: [0.02, 0.48, 0.95, 0.2]}, text: 'Klik, terus periksa barang, stok, dan harga jualnya.'},
      {who: 'a', screen: {img: 'g19', focus: [0.69, 0.845, 0.28, 0.08]}, text: 'Kalau sudah sesuai, tinggal klik Setujui?'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g20'}, text: 'Iya, Bu. Sales Order langsung dibuat di SAP, satu per dek.'},
      {who: 'a', text: 'Kalau ada yang nggak sesuai?'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g19'}, text: 'Tulis alasannya, lalu klik Tolak. Dokumennya balik ke pembuatnya.'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g33'}, text: 'Buat PUR, GRPO, dan transfer juga sama. Polanya persis begitu.'},
      {who: 'b', pose: 'tunjuk', screen: {img: 'g42'}, text: 'Purchase Order juga sama, dan bisa bertingkat.'},
      {who: 'a', pose: 'senang', text: 'Wah, jadi nggak perlu tanda tangan kertas lagi, ya!'},
      {who: 'b', pose: 'kamera', text: 'Jadi buat para penyetuju: cek lonceng, periksa, lalu setujui.'},
      {who: 'b', pose: 'kamera', text: 'Semua jejaknya tercatat di PID POS dan SAP.'},
    ],
    penutup: {judul: 'Ada yang menunggu persetujuan?', sub: 'Cek lonceng di PID POS. Setujui, atau tolak dengan alasan.'},
  },
];

export const skitKey = (s: Skit, i: number) => `${s.id}/${String(i + 1).padStart(2, '0')}`;
