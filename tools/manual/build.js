// Manual Book PID POS per peran (22-10-2026). Jalankan: node build.js <output.docx>
const fs = require('fs')
const path = require('path')
const { imageSize } = (() => { try { return require('image-size') } catch { return { imageSize: null } } })()
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun, Table, TableRow, TableCell, WidthType,
  ShadingType, BorderStyle, LevelFormat, PageBreak, TableOfContents, Footer, Header, PageNumber, TabStopType,
} = require('docx')

const IMG = path.join(__dirname, 'img_out')
const NAVY = '1F3A7A', INK = '1E2533', MUTE = '5B6577', LINE = 'D5DCE8', TINT = 'EEF3FA'
const FONT = 'Calibri'
const PAGE_W = 11906, MARGIN = 1134 // A4, margin 2 cm
const CONTENT = PAGE_W - 2 * MARGIN // 9638 DXA

let fig = 0
let stepList = 0
const out = []

const pngSize = (f) => { const b = fs.readFileSync(f); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), data: b } }
const run = (t, o = {}) => new TextRun({ text: t, font: FONT, ...o })
// teks dengan **tebal**
const rich = (s, o = {}) => s.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((p) => p.startsWith('**') ? run(p.slice(2, -2), { bold: true, ...o }) : run(p, o))

const H1 = (t, pb = true) => { out.push(new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: pb, children: [run(t)] })) }
const H2 = (t) => out.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [run(t)] }))
const H3 = (t) => out.push(new Paragraph({ heading: HeadingLevel.HEADING_3, children: [run(t)] }))
const P = (t, o = {}) => out.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 120 }, children: rich(t, o) }))
const steps = (items) => { stepList++; items.forEach((t) => out.push(new Paragraph({ numbering: { reference: 'steps', level: 0, instance: stepList }, alignment: AlignmentType.JUSTIFIED, spacing: { after: 60 }, children: rich(t) }))) }
const bullets = (items) => items.forEach((t) => out.push(new Paragraph({ numbering: { reference: 'bullets', level: 0 }, alignment: AlignmentType.JUSTIFIED, spacing: { after: 60 }, children: rich(t) })))

function figure(name, caption, maxH = 7.4) {
  const f = path.join(IMG, name + '.png')
  if (!fs.existsSync(f)) throw new Error('gambar tidak ada: ' + name)
  const { w, h, data } = pngSize(f)
  let wi = 6.6, hi = (wi * h) / w
  if (hi > maxH) { hi = maxH; wi = (hi * w) / h }
  fig++
  out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 40 }, keepNext: true,
    children: [new ImageRun({ type: 'png', data, transformation: { width: Math.round(wi * 96), height: Math.round(hi * 96) },
      altText: { title: caption, description: caption, name } })] }))
  out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [run(`Gambar ${fig}. `, { bold: true, size: 18, color: MUTE }), run(caption, { size: 18, color: MUTE })] }))
}

const border = { style: BorderStyle.SINGLE, size: 4, color: LINE }
const borders = { top: border, bottom: border, left: border, right: border }
function table(head, rows, widths) {
  const total = widths.reduce((a, b) => a + b, 0)
  const ws = widths.map((x) => Math.round((x / total) * CONTENT))
  ws[ws.length - 1] += CONTENT - ws.reduce((a, b) => a + b, 0)
  const cell = (t, i, hd) => new TableCell({ width: { size: ws[i], type: WidthType.DXA }, borders,
    shading: hd ? { fill: NAVY, type: ShadingType.CLEAR, color: 'auto' } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: String(t).split('\n').map((line) => new Paragraph({ children: rich(line, hd ? { bold: true, color: 'FFFFFF', size: 19 } : { size: 19 }) })) })
  out.push(new Table({ width: { size: CONTENT, type: WidthType.DXA }, columnWidths: ws,
    rows: [new TableRow({ tableHeader: true, children: head.map((t, i) => cell(t, i, true)) }), ...rows.map((r) => new TableRow({ children: r.map((t, i) => cell(t, i, false)) }))] }))
  out.push(new Paragraph({ spacing: { after: 120 }, children: [] }))
}
function note(title, text) {
  out.push(new Table({ width: { size: CONTENT, type: WidthType.DXA }, columnWidths: [CONTENT], rows: [new TableRow({ children: [new TableCell({
    width: { size: CONTENT, type: WidthType.DXA }, shading: { fill: TINT, type: ShadingType.CLEAR, color: 'auto' },
    borders: { top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }, bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }, right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }, left: { style: BorderStyle.SINGLE, size: 24, color: NAVY } },
    margins: { top: 100, bottom: 100, left: 180, right: 140 },
    children: [new Paragraph({ children: [run(title, { bold: true, color: NAVY })] }), ...[].concat(text).map((t) => new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { before: 40 }, children: rich(t) }))] })] })] }))
  out.push(new Paragraph({ spacing: { after: 120 }, children: [] }))
}
const roleCard = (akun, tampilan, tugas) => table(['Hal', 'Keterangan'], [['Akun uji', akun], ['Tampilan', tampilan], ['Tugas di alur utama', tugas]], [1, 3])

// ============================ SAMPUL ============================
const cover = [
  new Paragraph({ spacing: { before: 2400 }, children: [run('PID POS', { size: 28, bold: true, color: NAVY })] }),
  new Paragraph({ spacing: { before: 120 }, children: [run('Manual Book per Peran', { size: 60, bold: true, color: INK })] }),
  new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { before: 120, after: 600 }, children: [run('Permintaan barang kapal sampai barang dijual: admin kapal, approve SO (P2), admin DC, approve PUR, admin purchase, approve PO, dan kasir', { size: 26, color: MUTE })] }),
]
// ============================ ISI ============================
H1('Daftar isi', false)
out.push(new TableOfContents('Daftar isi', { hyperlink: true, headingStyleRange: '1-2' }))
out.push(new Paragraph({ children: [run('Bila daftar isi kosong, klik kanan di area ini lalu pilih Update Field (atau tekan F9).', { italics: true, color: MUTE, size: 18 })] }))

H1('1. Pendahuluan')
H2('1.1 Tentang buku ini')
P('Buku ini menjelaskan cara memakai PID POS untuk setiap login. Setiap bab berisi tugas peran itu pada **alur utama** (langkah demi langkah dengan gambar), lalu **semua menu lain** yang bisa dibuka peran tersebut.')
P('Semua gambar diambil dari uji coba langsung di server dev **pos-dev.pidc.co.id** pada 22 Oktober 2026 (rilis sagarapos-app:20261022_2202), terhubung ke SAP Business One **DB_TEST**. Nomor dokumen SAP pada gambar adalah dokumen uji sungguhan. Contoh yang dipakai: **PERMINTAAN-AWU/2610/0008** untuk KM Awu, berisi AQUA 1500 ml 6 pcs ke Dek 3 (diambil dari stok DC) dan Teh Pucuk Harum 24 pcs ke Dek 7 (dibeli lewat PUR dan PO).')
H2('1.2 Alur utama')
P('Setiap tahap dikerjakan login yang berbeda. Dokumen SAP baru dibuat setelah tahap persetujuannya selesai di web.')
table(['No', 'Login', 'Yang dilakukan', 'Dokumen SAP', 'Bab'], [
  ['1', 'Admin kapal', 'Membuat permintaan barang ke DC untuk satu atau beberapa dek, lalu Kirim ke DC', '—', '2.2'],
  ['2', 'Approve SO (P2)', 'Memeriksa, mengisi harga jual bila kosong, lalu menyetujui', 'Sales Order (satu per dek)', '3.2'],
  ['3', 'Admin DC', 'Memilah: qty diambil dari stok DC; sisanya otomatis jadi qty PUR', '—', '4.2'],
  ['4', 'Approve PUR', 'Menyetujui qty yang harus dibeli', 'Purchase Request', '5.1'],
  ['5', 'Admin purchase', 'Memilih vendor, mengisi qty dan harga beli, lalu Ajukan Purchase Order', '— (belum ke SAP)', '6.2'],
  ['6', 'Approve PO', 'Menyetujui PO (bisa bertingkat); setelah level terakhir PO dibuat', 'Purchase Order', '7.2'],
  ['7', 'Admin DC', 'Barang vendor datang: isi qty diterima, lalu Ajukan GRPO', '—', '4.3'],
  ['8', 'Approve PUR', 'Menyetujui GRPO', 'GRPO', '5.2'],
  ['9', 'Admin DC', 'Memeriksa qty kirim ke dek, lalu Ajukan Inventory Transfer', '—', '4.4'],
  ['10', 'Approve PUR', 'Menyetujui transfer', 'Inventory Transfer DC ke dek (satu per dek)', '5.3'],
  ['11', 'Admin kapal', 'Barang tiba: Periksa & terima per dek, lalu approval kepala toko dengan checklist', '—', '2.4–2.5'],
  ['12', 'Approve SO (P2)', 'Menyetujui penerimaan sebagai P2', 'Sales Order dek ditutup; stok dek bertambah', '3.4'],
  ['13', 'Kasir', 'Menjual barang di dek, Kirim DO hari ini, Tutup kasir', 'Delivery (DO)', '8'],
  ['14', 'Admin kapal', 'Mutasi barang ke dek lain di kapal yang sama', 'Inventory Transfer antar dek', '2.6'],
], [0.5, 1.4, 4, 2.1, 0.7])
note('Variasi alur', [
  '**Semua barang ada di stok DC:** langkah 4–8 dilewati. Setelah admin DC memilah, langsung ke langkah 9.',
  '**Sebagian dari stok DC, sebagian dibeli** (seperti contoh di buku ini): semua langkah dijalani. Inventory Transfer menunggu GRPO, lalu dikirim sekali (stok DC + hasil GRPO), tetap satu dokumen per dek.',
])
H2('1.3 Akun per peran')
table(['Peran', 'Akun uji (dev)', 'Tampilan', 'Bab'], [
  ['Admin kapal / kepala toko', 'admin.awu (KM Awu, 4 dek)', 'Tampilan kapal (menu Beranda, Kasir, Stok, Pesan DC, Laporan, Alat)', '2'],
  ['Approve SO (P2)', 'approve.so', 'Tampilan admin, mode Lihat saja', '3'],
  ['Admin DC', 'admin.dc.jkt (gudang DC-JKT)', 'Tampilan admin: Permintaan DC dan Stok', '4'],
  ['Approve PUR', 'approve.pur', 'Tampilan admin, mode Lihat saja', '5'],
  ['Admin purchase', 'admin.purchase', 'Tampilan admin, mode Lihat saja', '6'],
  ['Approve PO', 'approve.po', 'Tampilan admin, mode Lihat saja', '7'],
  ['Kasir', 'kasir1.awu (KM Awu – Dek 3)', 'Tampilan kasir (Kasir, Stok, Alat)', '8'],
], [1.6, 2, 3.4, 0.5])
P('Password tidak dicantumkan di buku ini. Minta ke admin sistem. Penyetuju dan admin purchase diatur di **Permintaan DC → Level approval** (tab Approval SO, Approval PUR, Admin purchase, Approval PO, Terima barang kapal).')
H2('1.4 Cara masuk dan tampilan umum')
steps([
  'Buka **https://pos-dev.pidc.co.id/login** di browser (Chrome atau Edge).',
  'Isi nama pengguna dan password, lalu klik **Masuk**.',
  'Akun kapal masuk ke tampilan kapal. Akun penyetuju, admin purchase, dan admin DC masuk ke tampilan admin.',
])
bullets([
  '**Menu atas**: klik nama menu untuk membuka submenu. **Cari menu (Ctrl K)** membuka menu lewat ketikan.',
  '**Lonceng**: jumlah tugas yang menunggu Anda. Klik untuk langsung membuka dokumennya.',
  '**Giliran saya** (di Permintaan barang): hanya permintaan yang sedang menunggu tindakan Anda.',
  '**Lihat saja**: label untuk akun penyetuju. Akun ini bisa membuka hampir semua menu admin tetapi hanya bisa melihat; yang bisa diubah hanya tugas persetujuannya sendiri.',
  '**Alur tahap** (pita panah di detail permintaan): tahap biru = tahap yang sedang berjalan, abu-abu muda = sudah lewat, abu-abu = belum.',
])
H2('1.5 Aturan umum')
bullets([
  '**Dokumen SAP dibuat setelah disetujui.** Selama status masih "Approval …", belum ada apa pun di SAP.',
  '**Menolak wajib dengan alasan.** Dokumen kembali ke pembuatnya; isian lama terisi lagi untuk diperbaiki dan diajukan ulang.',
  '**Permintaan barang minimal H-5** dari tanggal barang dibutuhkan.',
  '**Batalkan** bisa dilakukan admin kapal atau admin selama barang belum bergerak (belum ada GRPO atau Inventory Transfer). Sales Order, Purchase Request, dan Purchase Order di SAP ikut dibatalkan. Setelah barang bergerak, dokumen harus dibalik dulu di SAP.',
])

// ---------------- BAB 2 ADMIN KAPAL ----------------
H1('2. Admin kapal')
roleCard('admin.awu (KM Awu)', 'Tampilan kapal; satu akun untuk semua dek kapal', 'Membuat permintaan barang, menerima barang di dek, menyetujui sebagai kepala toko, dan memindahkan barang antar dek')
H2('2.1 Beranda dan pilih dek')
P('Beranda menampilkan kiriman dari DC yang menunggu diterima, tugas berikutnya (mis. dek yang belum buka kasir), dan penjualan hari ini per dek.')
figure('t_home', 'Beranda admin kapal KM Awu.')
bullets([
  'Tombol kapal di kanan atas (**KM Awu · semua dek / Ganti dek**) dipakai untuk berpindah dek.',
  'Halaman yang berlaku untuk satu dek (Posisi stok, Mutasi gudang, Dokumen stok, Kas, dan lainnya) menampilkan **Pilih dek** bila sedang memilih semua dek. Klik kartu dek yang ingin dibuka.',
])
H2('2.2 Membuat permintaan barang ke DC')
steps([
  'Klik menu **Pesan DC**, lalu **Pesanan baru**.',
  'DC terisi dari DC asal kapal (contoh DC-JKT); bisa diganti.',
  'Pilih **No. voyage / tahun**, isi **Periode voyage**, dan pilih **Pelabuhan suplai**. No. Supply Toko dibuat otomatis saat dikirim; No. SPBM PELNI diisi bila ada.',
  'Isi **Barang dibutuhkan tanggal** (minimal H-5) dan **Catatan untuk DC**.',
  'Cari barang (nama, kode, atau scan barcode). Untuk setiap baris pilih **Dek** tujuan dan isi **Dipesan**. Kolom Stok dek dan Stok DC membantu menentukan jumlah. Tombol **Saran pesanan** mengisi usulan otomatis.',
  'Klik **Kirim ke DC** (atau **Simpan draft** bila belum selesai).',
])
figure('01_kapal_form_isi', 'Form permintaan terisi: AQUA ke Dek 3 dan Teh Pucuk ke Dek 7.')
P('Permintaan mendapat nomor (contoh **PERMINTAAN-AWU/2610/0008**) dan berstatus **Menunggu persetujuan** di daftar Pesan DC.')
figure('02_kapal_daftar', 'Daftar permintaan barang ke DC beserta status dan nomor Sales Order SAP.')
H2('2.3 Memantau permintaan')
P('Klik nomor permintaan untuk melihat detailnya: status, nomor Sales Order per dek, jumlah dipesan dan sudah dikirim, serta riwayat persetujuan. Selama masih **Menunggu persetujuan**, permintaan bisa diubah (persetujuan diulang dari level 1), ditarik ke draft, atau dibatalkan.')
figure('79_kapal_detail_selesai', 'Detail permintaan yang sudah selesai: kedua Sales Order sudah ditutup di SAP.')
H2('2.4 Menerima barang di dek')
steps([
  'Buka **Stok → Terima barang**, tab **Kiriman masuk**. Setiap Inventory Transfer tampil per dek tujuan, lengkap dengan nomor SO dan keterangan voyage.',
  'Klik **Periksa & terima** pada baris kiriman (contoh Transfer 262000146 untuk Dek 3).',
  'Isi **Diterima baik** dan **Rusak** bila ada. Kolom **Selisih** menunjukkan beda dengan yang dikirim (pas, kurang, atau lebih).',
  'Isi catatan bila perlu, lalu klik **Konfirmasi diterima**. Ulangi untuk dek lain (contoh Transfer 262000147 untuk Dek 7).',
])
figure('29_kapal_kiriman_masuk', 'Kiriman masuk per dek.')
figure('30_kapal_periksa_terima', 'Form Periksa & terima untuk Dek 3.')
P('Penerimaan tercatat sebagai dokumen **TERIMA-…** dan menunggu approval kepala toko lalu P2. Stok dek belum bertambah sampai P2 menyetujui. Barang rusak otomatis dibuatkan dokumen barang rusak.')
H2('2.5 Approval kepala toko')
steps([
  'Buka tab **Menunggu approval**, lalu klik dokumen terima barang yang bertanda **Giliran Anda**.',
  'Periksa barang, jumlah diterima, rusak, dan selisih.',
  'Centang semua butir **Checklist terima barang** (wajib semua): jumlah sesuai surat jalan, kondisi kemasan, tanggal kedaluwarsa, kode dan nama barang, dan barang sudah disimpan di tempat yang benar.',
  'Klik **Setujui (Kepala toko)**. Untuk menolak, isi catatan lalu klik **Tolak**.',
])
figure('33_kapal_kt_checklist_kosong', 'Approval kepala toko: tombol Setujui belum aktif sebelum checklist lengkap.')
figure('34_kapal_kt_checklist_lengkap', 'Checklist lengkap, tombol Setujui (Kepala toko) aktif.')
P('Status berubah menjadi **Menunggu P2**. Lanjutannya dikerjakan Approve SO (P2), lihat bab 3.4.')
H2('2.6 Mutasi barang antar dek')
P('Admin kapal bisa memindahkan barang dari satu dek ke dek lain di kapal yang sama. Mutasi antar dek langsung dicatat di SAP sebagai **Inventory Transfer**.')
steps([
  'Buka **Stok → Mutasi gudang**, lalu pilih dek asal (contoh Dek 7).',
  'Pada **Dari** pilih gudang asal; pada **Ke** pilih dek tujuan di kelompok **Dek lain kapal ini** (contoh KM Awu – Dek 3). Tombol ⇄ menukar arah.',
  'Isi **Catatan**, cari barang, lalu isi jumlah **Dipindah** (tidak boleh melebihi stok asal).',
  'Klik **Pindahkan ke …**. Stok langsung pindah dan dokumen MUTASI terkirim ke SAP.',
])
figure('74_kapal_mutasi_isi', 'Mutasi Teh Pucuk 6 pcs dari Dek 7 ke Dek 3.')
P('Pada uji coba, mutasi **MUTASI-DEK7-AWU/2610/0001** terkirim ke SAP sebagai Inventory Transfer **262000148**. Statusnya terlihat di **Stok → Dokumen stok**.')
H2('2.7 Menu lain admin kapal')
H3('Kasir')
P('Admin kapal bisa membuka menu kasir dek yang dipilih: **Penjualan**, **Riwayat** (struk, retur, cetak ulang), **Rekap shift** (termasuk Kirim DO hari ini), dan **Kas** (kas keluar, setor ke pusat, kas masuk, buku kas bulan ini). Cara pakainya sama dengan bab 8 Kasir.')
figure('73_kapal_kas', 'Kas dek: kas keluar, setoran ke pusat, kas masuk, dan buku kas bulan ini.', 4)
H3('Stok')
table(['Menu', 'Kegunaan'], [
  ['Posisi stok', 'Stok per barang di setiap dek dan gudang kapal, total, dan terjual 7 hari.'],
  ['Kartu stok', 'Mutasi masuk dan keluar per barang dalam rentang tanggal, dengan saldo awal dan akhir. Bisa disaring stok minus.'],
  ['Terima barang', 'Kiriman dari DC: periksa, terima, dan checklist kepala toko (bab 2.4–2.5).'],
  ['Mutasi gudang', 'Pindah barang antar gudang atau antar dek (bab 2.6).'],
  ['Barang rusak', 'Catat barang rusak, kedaluwarsa, atau hilang; stok berkurang.'],
  ['Stok opname', 'Hitung fisik per gudang: mulai, isi hitungan (bisa dicicil), selesai dan setujui selisih.'],
  ['Dokumen stok', 'Semua dokumen terima, opname, rusak, mutasi, dan paket untuk dek ini, beserta status SAP. Dokumen yang belum masuk SAP bisa dibatalkan.'],
], [1.3, 5])
figure('63_kapal_posisi_stok', 'Posisi stok per dek KM Awu.', 4)
figure('64_kapal_kartu_stok', 'Kartu stok Dek 3.', 4)
figure('66_kapal_rusak', 'Barang rusak / kedaluwarsa.', 4)
figure('67_kapal_opname', 'Stok opname: mulai hitung fisik.', 3)
figure('68_kapal_dokumen_stok', 'Dokumen stok Dek 3 dengan riwayat approval penerimaan.', 5)
H3('Laporan, pengajuan harga, dan alat')
table(['Menu', 'Kegunaan'], [
  ['Laporan', 'Laporan penjualan (harian, per kapal, rekap per barang, per kasir, ranking), persediaan (kartu stok, posisi stok, buffer stok, audit stok minus), mutasi, kas, dan rekap permintaan. Bisa dilihat dan dicetak.'],
  ['Pengajuan harga', 'Ajukan perubahan harga jual (termasuk PPN). Margin dihitung otomatis; berlaku setelah disetujui.'],
  ['Label harga', 'Cetak label rak (A4 3 kolom atau stiker 50×30) untuk barang berstok di dek.'],
  ['Pasang HP kasir', 'QR tetap per dek untuk mengunduh dan memasang aplikasi Android kasir, serta daftar HP terdaftar (cabut atau buat kode pasang baru).'],
], [1.3, 5])
figure('69_kapal_laporan', 'Menu Laporan.', 4.2)
figure('72_kapal_pasang_hp', 'Pasang HP kasir: QR per dek dan HP terdaftar.', 4.2)

// ---------------- BAB 3 APPROVE SO ----------------
H1('3. Approve SO (P2)')
roleCard('approve.so', 'Tampilan admin, mode Lihat saja', 'Menyetujui permintaan kapal (Sales Order) dan menyetujui penerimaan barang di kapal sebagai P2')
H2('3.1 Beranda dan notifikasi')
P('Kartu biru di Ringkasan dan angka di lonceng menunjukkan permintaan yang menunggu persetujuan Anda. Klik **Buka** untuk langsung ke permintaannya.')
figure('03_so_beranda', 'Ringkasan approve SO: 1 permintaan menunggu approval SO.')
H2('3.2 Menyetujui permintaan (Sales Order)')
steps([
  'Buka **Permintaan DC → Permintaan barang**, tab **Approval SO** atau **Giliran saya**, lalu klik permintaannya.',
  'Periksa alur tahap, barang per dek, stok dek, stok DC, dan harga jual. Qty, barang, tanggal, dan catatan boleh diubah; klik **Simpan perubahan** bila mengubah.',
  'Bila ada barang tanpa harga jual, isi kolom **Harga jual** dulu.',
  'Klik **Setujui level 1 (Approval SO)**.',
])
figure('05_so_detail', 'Detail permintaan pada tahap Approval SO.')
P('Sales Order dibuat di SAP satu per dek (contoh **266000699** untuk Dek 3 dan **266000700** untuk Dek 7). Permintaan lanjut ke admin DC untuk dipilah.')
figure('07_so_terbentuk', 'Sales Order per dek tampil di tabel Dokumen SAP.')
H2('3.3 Menolak permintaan')
P('Isi **Catatan approval / alasan** lalu klik **Tolak**. Permintaan kembali ke admin kapal dengan alasan Anda; admin kapal memperbaiki lalu mengirim ulang.')
H2('3.4 P2: menyetujui penerimaan barang kapal')
steps([
  'Buka **Stok → Dokumen stok**. Pilih status **Menunggu approval terima**. Dokumen yang menunggu Anda bertanda **Giliran Anda**.',
  'Klik dokumen terima barang, periksa barang, jumlah diharapkan, diterima, dan rusak, serta riwayat approval kepala toko.',
  'Klik **Setujui (P2)**. Untuk menolak, isi catatan lalu klik **Tolak**.',
])
figure('37_p2_detail', 'Penerimaan Dek 3 pada giliran P2.')
P('Setelah P2 menyetujui, stok dek bertambah dan Sales Order dek itu **ditutup** di SAP (pada uji coba SO 266000699 dan 266000700 tertutup otomatis).')
figure('38_p2_selesai', 'Penerimaan selesai: riwayat mencatat admin kapal, kepala toko, dan P2.', 4)
H2('3.5 Menu lain (lihat saja)')
P('Akun penyetuju bisa membuka hampir semua menu admin untuk memantau, tetapi tidak bisa mengubah data. Yang bisa dikerjakan hanya tugas persetujuan: approval SO, P2 terima barang, approval pengajuan harga, dan mengisi forecast DC.')
table(['Kelompok menu', 'Menu dan kegunaan'], [
  ['Ringkasan', '**Ringkasan**: penjualan hari ini, kasir buka, antrean SAP, ranking penjualan, peringatan. **Monitor kapal & DC**: kasir, stok menipis, dan kiriman per dek. **Antrean SAP**: DO harian, A/R, dokumen gagal kirim.'],
  ['Permintaan DC', '**Permintaan barang**: semua permintaan per tahap. **Transfer stok DC**: pilah stok, PO, GRPO, transfer (lihat saja). **Forecast DC**: kebutuhan bulanan per DC dan 10 barang prioritas (P2 boleh mengisi).'],
  ['Stok', '**Dokumen stok**: terima, rusak, mutasi, opname (P2 menyetujui penerimaan di sini). **Kartu stok**: mutasi per barang dan gudang.'],
  ['Kas & laporan', '**Kas toko & kapal**, **Laporan** penjualan dan stok, **Margin & shift**.'],
  ['Barang & harga', '**Master barang** (dari SAP), **Barang & harga jual**, **Pengajuan harga** (menyetujui perubahan harga dari kapal), **Resep paket**.'],
  ['Pengaturan', '**Toko & kapal**, **Pengguna**, **Perangkat Android**, **Pengaturan** (lihat saja).'],
], [1.3, 5])
figure('91_ap_pengajuan_harga', 'Pengajuan harga dari kapal menunggu persetujuan.', 4)
figure('91_ap_forecast', 'Forecast kebutuhan DC (P2 mengisi kebutuhan sebulan per DC).', 4.2)
figure('91_ap_monitor', 'Monitor kapal & DC.', 4.5)

// ---------------- BAB 4 ADMIN DC ----------------
H1('4. Admin DC')
roleCard('admin.dc.jkt (gudang DC-JKT)', 'Tampilan admin: Permintaan DC dan Stok. Hanya melihat permintaan ke DC miliknya.', 'Memilah stok DC, mengajukan GRPO, dan mengajukan Inventory Transfer ke dek')
H2('4.1 Giliran saya')
P('Tab **Giliran saya** di Permintaan barang menampilkan permintaan yang menunggu Anda. Label di kanan menunjukkan tugasnya: **Pilah stok DC**, **Menunggu GRPO**, **GRPO ditolak**, **Buat Inventory Transfer**, atau **Transfer gagal**.')
figure('08_dc_giliran', 'Giliran saya admin DC: permintaan menunggu dipilah.')
H2('4.2 Memilah stok DC')
steps([
  'Klik permintaannya. Periksa Qty SO, Stok DC, dan dek tujuan setiap barang.',
  'Isi kolom **Transfer DC** dengan qty yang diambil dari stok DC (contoh AQUA 6). Barang yang tidak ada di stok DC diisi 0; seluruhnya menjadi **Qty PUR** (contoh Teh Pucuk 24).',
  'Bila tidak ada sama sekali di stok DC, klik **Tidak ada di stok DC (semua jadi PUR)**.',
  'Klik **Setujui PUR tahap 1 (stok DC)**. Permintaan pindah ke Approve PUR.',
])
figure('09_dc_pilah', 'Kolom Transfer DC terisi: AQUA 6 dari stok DC, Teh Pucuk 0 (dibeli).')
H2('4.3 Mengajukan GRPO')
P('Setelah PO disetujui dan barang dari vendor tiba di gudang DC, catat penerimaannya.')
steps([
  'Buka permintaan (tab **PO / GRPO** atau Giliran saya). Panel **Pengadaan DC** menampilkan PUR dan PO.',
  'Isi **Qty diterima (GRPO)** sesuai barang yang benar-benar datang (bawaan = qty PO).',
  'Klik **Ajukan GRPO (terima di DC)**. GRPO menunggu persetujuan Approve PUR; GRPO dibuat di SAP setelah disetujui.',
])
figure('21_dc_grpo_form', 'Panel Pengadaan DC: qty diterima siap diajukan.')
figure('22_dc_grpo_diajukan', 'GRPO diajukan, menunggu approve PUR.')
P('Bila GRPO ditolak, alasannya tampil di panel. Periksa qty, lalu ajukan ulang.')
H2('4.4 Mengajukan Inventory Transfer ke dek')
steps([
  'Setelah GRPO terbentuk (atau langsung setelah memilah bila semua dari stok DC), panel **Inventory Transfer ke dek** muncul dengan usulan qty = stok DC + hasil GRPO.',
  'Periksa **Dikirim ke dek** untuk setiap barang dan dek (tidak boleh melebihi qty diminta).',
  'Klik **Ajukan Inventory Transfer**. Bila tidak ada yang dikirim, klik **Tidak dikirim**.',
])
figure('25_dc_it_form', 'Panel Inventory Transfer ke dek: usulan qty per dek.')
figure('26_dc_it_diajukan', 'Inventory Transfer diajukan, menunggu approval PUR.')
P('Setelah disetujui, Inventory Transfer dibuat di SAP satu per dek (Series ULP26, Departemen 02, Jenis IT, Pekerjaan SBI) dan muncul di Terima barang kapal. Bila ditolak, alasan tampil di form; perbaiki qty lalu ajukan ulang. **Surat jalan** bisa dicetak dari detail permintaan.')
H2('4.5 Menu lain admin DC')
table(['Menu', 'Kegunaan'], [
  ['Permintaan barang', 'Semua permintaan ke DC Anda per tahap, dengan Giliran saya, pencarian, dan cetak permintaan atau surat jalan. Admin DC juga bisa membatalkan permintaan selama barang belum bergerak.'],
  ['Transfer stok DC', 'Daftar ringkas permintaan yang perlu dipilah, menunggu approval atau kirim, dan selesai.'],
  ['Forecast DC', 'Melihat kebutuhan bulanan per DC dan 10 barang prioritas yang diisi P2.'],
  ['Stok (Laporan stok DC)', 'Gudang DC dan koneksi SAP, serta kartu stok per barang di gudang DC (bisa diekspor CSV).'],
], [1.5, 5])
figure('80_dc_kartu_stok', 'Laporan stok DC DC-JKT.', 4)

// ---------------- BAB 5 APPROVE PUR ----------------
H1('5. Approve PUR')
roleCard('approve.pur', 'Tampilan admin, mode Lihat saja', 'Menyetujui Purchase Request, GRPO, dan Inventory Transfer')
H2('5.1 Menyetujui Purchase Request')
steps([
  'Buka **Permintaan barang**, tab **Approval PUR** atau **Giliran saya**, lalu klik permintaannya.',
  'Periksa kolom **Transfer DC** (isian admin DC) dan **Qty PUR**. Qty PUR masih bisa diubah; klik **Simpan qty PUR** bila mengubah.',
  'Klik **Setujui PUR level 1 (Approve PUR)**. Untuk menolak, isi alasan lalu **Tolak PUR**.',
])
figure('12_pur_detail', 'Tahap Approval PUR.')
P('Purchase Request dibuat di SAP untuk dek yang punya qty PUR (contoh **262000460** untuk Dek 7). Giliran berikutnya admin purchase membuat PO.')
figure('13_pur_terbentuk', 'Purchase Request terbentuk; menunggu admin purchase.')
H2('5.2 Menyetujui GRPO')
steps([
  'Buka permintaan yang berlabel **Approval GRPO** (Giliran saya atau lonceng).',
  'Periksa **Qty diterima (GRPO)** yang diajukan admin DC.',
  'Klik **Setujui**. GRPO dibuat di SAP (contoh **262001908**) dan stok DC bertambah. Untuk menolak, isi catatan lalu **Tolak**.',
])
figure('23_pur_grpo_approval', 'Approval GRPO.')
H2('5.3 Menyetujui Inventory Transfer')
steps([
  'Buka permintaan yang berlabel **Approval transfer**.',
  'Periksa barang, dek tujuan, qty diminta, dan qty yang diajukan dikirim.',
  'Klik **Setujui**. Inventory Transfer dibuat di SAP satu per dek. Untuk menolak, isi catatan lalu **Tolak**; transfer kembali ke admin DC.',
])
figure('27_pur_it_approval', 'Approval Inventory Transfer ke dek.')
figure('28_pur_it_terbentuk', 'Inventory Transfer 262000146 (Dek 3) dan 262000147 (Dek 7) terbentuk.')
H2('5.4 Menu lain')
P('Sama dengan akun penyetuju lain: semua menu admin bisa dilihat (bab 3.5), tetapi hanya tugas approval yang bisa dikerjakan.')

// ---------------- BAB 6 ADMIN PURCHASE ----------------
H1('6. Admin purchase')
roleCard('admin.purchase', 'Tampilan admin, mode Lihat saja', 'Membuat dan mengajukan Purchase Order dari Purchase Request (untuk semua DC)')
H2('6.1 Beranda dan Giliran saya')
P('Kartu biru di Ringkasan menunjukkan berapa PUR yang menunggu dibuatkan Purchase Order. Di Permintaan barang, tab **Giliran saya** atau **PO / GRPO** menampilkan permintaan berlabel **Buat PO**.')
figure('14_buyer_beranda', 'Ringkasan admin purchase: PUR menunggu dibuatkan Purchase Order.')
H2('6.2 Mengajukan Purchase Order')
steps([
  'Klik permintaannya. Panel **Pengadaan DC** menampilkan PUR (contoh 262000460).',
  'Cari dan pilih **vendor** (kode atau nama). Klik **Ganti vendor** bila salah pilih.',
  'Periksa **Qty PO** (maksimal qty PUR) dan isi **Harga beli (sebelum PPN)** setiap barang. Jumlah dan total dihitung otomatis.',
  'Klik **Ajukan Purchase Order**. PO menunggu persetujuan Approve PO; PO dibuat di SAP setelah disetujui.',
])
figure('16_buyer_form_po', 'Form Purchase Order: vendor BERKAH COD, Teh Pucuk 24 × Rp 8.000.')
figure('17_buyer_po_diajukan', 'PO diajukan, menunggu approval PO.')
P('Isian SAP PO mengikuti PO manual: Series ULP26, Departemen 02, Jenis PO, Pekerjaan SBI, PO Type BM, pajak VAT I-B.')
H2('6.3 Bila PO ditolak')
P('Permintaan kembali berlabel **PO ditolak**, dan alasan penolakan tampil di panel. Vendor, qty, dan harga sebelumnya sudah terisi lagi. Perbaiki lalu klik **Ajukan Purchase Order** lagi; persetujuan dimulai dari level 1.')
H2('6.4 Menu lain')
P('Semua menu admin bisa dilihat (bab 3.5). Yang bisa dikerjakan hanya membuat dan mengajukan PO.')

// ---------------- BAB 7 APPROVE PO ----------------
H1('7. Approve PO')
roleCard('approve.po', 'Tampilan admin, mode Lihat saja', 'Menyetujui Purchase Order yang diajukan admin purchase (bisa bertingkat)')
H2('7.1 Beranda')
figure('18_po_beranda', 'Ringkasan approve PO: 1 Purchase Order menunggu approval.')
H2('7.2 Menyetujui Purchase Order')
steps([
  'Klik **Buka** di kartu biru, atau buka Permintaan barang dan klik permintaan berlabel **Approval PO**.',
  'Periksa vendor, barang, qty PUR dan qty PO, harga beli, dan jumlah.',
  'Isi catatan bila perlu, lalu klik **Setujui**.',
])
figure('19_po_approval', 'Approval PO level 1 (Approve PO).')
P('Bila approval PO bertingkat (contoh Manager lalu Direktur), setelah level 1 menyetujui PO lanjut ke level 2. Setelah level terakhir menyetujui, **Purchase Order dibuat di SAP** (contoh **262002060**) dan admin DC menunggu barang datang untuk GRPO.')
figure('20_po_terbentuk', 'Purchase Order terbentuk di SAP.')
H2('7.3 Menolak Purchase Order')
P('Isi **Catatan** (wajib bila menolak), lalu klik **Tolak**. PO kembali ke admin purchase dengan alasan Anda.')
H2('7.4 Menu lain')
P('Semua menu admin bisa dilihat (bab 3.5). Yang bisa dikerjakan hanya approval PO.')

// ---------------- BAB 8 KASIR ----------------
H1('8. Kasir')
roleCard('kasir1.awu (KM Awu – Dek 3)', 'Tampilan kasir: menu Kasir, Stok, dan Alat', 'Menjual barang yang sudah diterima di dek, mengirim DO harian ke SAP, dan menutup kasir')
H2('8.1 Buka kasir')
steps([
  'Masuk sebagai kasir. Layar awal memeriksa koneksi server, data barang dan harga, sinkron SAP terakhir, dan struk yang belum masuk SAP.',
  'Klik **Buka kasir**. Tidak ada isian modal awal.',
])
figure('40_kasir_layar_awal', 'Layar awal kasir sebelum buka kasir.')
H2('8.2 Menjual')
bullets([
  'Scan barcode, atau ketik nama atau kode lalu **Enter**. Ketik **3*kode** untuk 3 pcs sekaligus. Atau ketuk **Barang cepat** di kanan.',
  'Ubah qty langsung di kolom **Qty** atau dengan tombol **+ / −**.',
  'Tombol fungsi: **F2** cari barang, **F4** tahan, **F8** ubah qty atau diskon, **F9** riwayat dan retur, **Del** hapus baris, **F12** bayar.',
  'Barang yang stoknya habis di dek ini ditolak dengan pesan "stok habis". Contoh: Teh Pucuk diterima di Dek 7, jadi tidak bisa dijual di Dek 3 sebelum dimutasi.',
])
figure('43_kasir_keranjang', 'Layar jual: AQUA 2 pcs, total Rp 38.000.')
H2('8.3 Bayar')
steps([
  'Klik **Bayar (F12)**.',
  'Pilih **Tunai** atau **QRIS**. Untuk tunai, isi uang diterima atau pilih **Uang pas** / nominal; kembalian dihitung otomatis.',
  'Klik **Selesaikan pembayaran**.',
  'Struk tercetak bila cetak otomatis aktif. Tersedia **Cetak ulang** dan **Struk digital**. Klik **Transaksi baru** untuk pembeli berikutnya.',
])
figure('44_kasir_bayar', 'Layar bayar tunai: uang Rp 50.000, kembalian Rp 12.000.')
figure('45_kasir_selesai', 'Transaksi selesai: struk DEK3-AWU/2610/00002.')
H2('8.4 Riwayat, cetak ulang, dan retur')
P('Menu **Kasir → Riwayat**: pilih tanggal atau cari nomor struk, lalu klik struk untuk detailnya. Status di kanan menunjukkan apakah struk sudah masuk SAP.')
bullets([
  '**Cetak ulang** tersedia untuk semua struk.',
  '**Retur barang**: isi qty yang dikembalikan, alasan, dan cara uang dikembalikan, lalu PIN kepala toko. Retur tercatat sebagai struk minus dan stok bertambah kembali.',
  'Struk yang sudah masuk SAP tidak bisa dibatalkan dari kasir; koreksinya lewat retur atau akunting di SAP.',
])
figure('51_kasir_riwayat_detail', 'Detail struk di Riwayat dengan tombol Retur barang dan Cetak ulang.', 4)
H2('8.5 Rekap shift dan Kirim DO hari ini')
steps([
  'Buka **Kasir → Rekap shift** untuk melihat penjualan, tunai, QRIS, diskon, struk dibatalkan, struk yang belum masuk SAP, dan barang terlaris.',
  'Klik **Kirim DO hari ini** untuk mengirim struk hari ini ke SAP sebagai Delivery (DO). Tunggu sampai muncul nomor DO; jangan pindah halaman.',
])
figure('49_kasir_do_terkirim', 'Rekap shift dan DO 266000512 terkirim ke SAP.', 5.5)
P('DO malam tetap dikirim otomatis untuk struk sesudahnya, tanpa dobel.')
H2('8.6 Menu lain kasir')
table(['Menu', 'Kegunaan'], [
  ['Kasir → Ditahan', 'Pesanan yang disimpan sementara (F4) untuk dilanjutkan.'],
  ['Kasir → Kas', 'Kas keluar (biaya), setor ke pusat (dengan nomor bukti), dan kas masuk. Butuh kasir dibuka. Kas keluar besar perlu PIN kepala toko.'],
  ['Stok (Posisi stok)', 'Stok barang di dek ini dan terjual 7 hari.'],
  ['Alat → Label harga', 'Cetak label rak harga jual (termasuk PPN).'],
  ['Alat → Pengaturan printer', 'Lebar kertas struk 58/80 mm, uji cetak, cetak otomatis setelah bayar, muat ulang barang dan harga.'],
], [1.6, 5])
figure('52_kasir_kas', 'Kas kasir.', 3.5)
H2('8.7 Tutup kasir')
steps([
  'Kosongkan keranjang dan pesanan ditahan.',
  'Klik inisial akun di pojok kanan atas (contoh **KA**), lalu **Tutup kasir**. Periksa ringkasan dan isi catatan bila perlu.',
  'Klik **Tutup kasir & cetak laporan**. Setelah ditutup, struk shift ini tidak bisa ditambah.',
])
figure('60_kasir_tutup', 'Tutup kasir.', 4)
figure('61_kasir_ditutup', 'Kasir ditutup; tunai yang belum disetor ditampilkan.', 3)

// ---------------- LAMPIRAN ----------------
H1('Lampiran A. Hasil uji coba 22-10-2026')
table(['Tahap', 'Login', 'Dokumen', 'Nomor'], [
  ['Permintaan kapal', 'admin.awu', 'Permintaan web', 'PERMINTAAN-AWU/2610/0008'],
  ['Approval SO', 'approve.so', 'Sales Order Dek 3 / Dek 7', '266000699 / 266000700'],
  ['Pilah stok DC', 'admin.dc.jkt', 'AQUA 6 dari stok DC; Teh Pucuk 24 jadi PUR', '—'],
  ['Approval PUR', 'approve.pur', 'Purchase Request Dek 7', '262000460'],
  ['Pengajuan & approval PO', 'admin.purchase, approve.po', 'Purchase Order (BERKAH COD, 24 × Rp 8.000)', '262002060'],
  ['GRPO', 'admin.dc.jkt, approve.pur', 'GRPO', '262001908'],
  ['Inventory Transfer', 'admin.dc.jkt, approve.pur', 'Inventory Transfer Dek 3 / Dek 7', '262000146 / 262000147'],
  ['Terima di dek', 'admin.awu (kepala toko), approve.so (P2)', 'Terima barang Dek 3 / Dek 7', 'TERIMA-DEK3-AWU/2610/0002, TERIMA-DEK7-AWU/2610/0002'],
  ['Setelah P2', '—', 'Sales Order Dek 3 / Dek 7', 'Tertutup di SAP'],
  ['Kasir', 'kasir1.awu', 'Struk (AQUA 2, Rp 38.000)', 'DEK3-AWU/2610/00002'],
  ['Kirim DO', 'kasir1.awu', 'Delivery KM Awu Dek 3', '266000512'],
  ['Tutup kasir', 'kasir1.awu', 'Shift', 'SHIFT-DEK3-AWU/2610/0002'],
  ['Mutasi antar dek', 'admin.awu', 'MUTASI-DEK7-AWU/2610/0001 (Teh Pucuk 6, Dek 7 → Dek 3)', 'Inventory Transfer 262000148'],
], [1.4, 1.6, 2.4, 2])
H2('Temuan selama uji coba')
table(['Temuan', 'Status'], [
  ['Akun penyetuju (lihat saja) melihat kotak tugas admin DC (pilah stok, GRPO, transfer) dan tombol Batalkan, padahal server menolak aksinya.', 'Diperbaiki pada rilis 20261022_2202: kotak dan tombol itu tidak lagi tampil untuk akun penyetuju.'],
  ['Admin kapal yang memilih "semua dek" melihat layar Pilih dek di halaman satu-dek.', 'Sesuai rancangan; pilih dek dulu (bab 2.1).'],
  ['Sales Order KM Awu memakai customer umum CST00000321.', 'Terbuka: isi kode customer per dek di Toko & kapal bila perlu.'],
], [3.5, 3])
P('Uji coba memakai SAP DB_TEST; semua dokumen di atas adalah data uji.', { italics: true, color: MUTE })

H1('Lampiran B. Menu per peran')
table(['Menu', 'Admin kapal', 'Approve SO (P2)', 'Admin DC', 'Approve PUR', 'Admin purchase', 'Approve PO', 'Kasir'], [
  ['Penjualan, Riwayat, Rekap shift, Kas', 'Ya', '—', '—', '—', '—', '—', 'Ya'],
  ['Pesan barang ke DC', 'Ya', '—', '—', '—', '—', '—', '—'],
  ['Terima barang + checklist kepala toko', 'Ya', '—', '—', '—', '—', '—', '—'],
  ['Mutasi gudang / antar dek', 'Ya', '—', '—', '—', '—', '—', '—'],
  ['Posisi stok, kartu stok', 'Ya', 'Lihat', 'Stok DC', 'Lihat', 'Lihat', 'Lihat', 'Posisi stok'],
  ['Barang rusak, opname, dokumen stok', 'Ya', 'Lihat + P2', '—', 'Lihat', 'Lihat', 'Lihat', '—'],
  ['Permintaan barang (admin)', '—', 'Approval SO', 'Pilah, GRPO, transfer', 'Approval PUR, GRPO, transfer', 'Buat & ajukan PO', 'Approval PO', '—'],
  ['Forecast DC', '—', 'Isi', 'Lihat', 'Lihat', 'Lihat', 'Lihat', '—'],
  ['Pengajuan harga', 'Ajukan', 'Setujui', '—', 'Lihat', 'Lihat', 'Lihat', '—'],
  ['Laporan', 'Ya', 'Lihat', '—', 'Lihat', 'Lihat', 'Lihat', '—'],
  ['Label harga', 'Ya', '—', '—', '—', '—', '—', 'Ya'],
  ['Pasang HP kasir', 'Ya', '—', '—', '—', '—', '—', '—'],
  ['Pengaturan printer', '—', '—', '—', '—', '—', '—', 'Ya'],
  ['Pengguna, Toko & kapal, Pengaturan', '—', 'Lihat', '—', 'Lihat', 'Lihat', 'Lihat', '—'],
], [2.2, 1, 1, 1, 1.1, 1, 1, 0.9])
P('Menu bisa dimatikan per akun (Pengguna) atau untuk semua akun (Pengaturan → Fitur & dokumen). Daftar di atas adalah bawaan per peran pada 22-10-2026.', { size: 18, color: MUTE })

// ============================ DOKUMEN ============================
const doc = new Document({
  creator: 'PID POS', title: 'Manual Book PID POS per Peran', description: 'Panduan per login, 22 Oktober 2026',
  styles: {
    default: { document: { run: { font: FONT, size: 21, color: INK } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 34, bold: true, color: NAVY, font: FONT }, paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 26, bold: true, color: INK, font: FONT }, paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1, keepNext: true } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 22, bold: true, color: NAVY, font: FONT }, paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2, keepNext: true } },
    ],
  },
  numbering: { config: [
    { reference: 'steps', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 420, hanging: 300 } } } }] },
    { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 420, hanging: 260 } } } }] },
  ] },
  features: { updateFields: true },
  sections: [
    { properties: { page: { size: { width: PAGE_W, height: 16838 }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } },
      children: [...cover,
        new Table({ width: { size: CONTENT, type: WidthType.DXA }, columnWidths: [2600, CONTENT - 2600], rows: [
          ['Aplikasi', 'PID POS (web) · pos-dev.pidc.co.id'], ['Rilis saat uji', 'sagarapos-app:20261022_2202'], ['SAP', 'SAP Business One, database DB_TEST (Service Layer)'],
          ['Tanggal uji coba', '22 Oktober 2026'], ['Contoh permintaan', 'PERMINTAAN-AWU/2610/0008 (KM Awu, Dek 3 dan Dek 7)'],
        ].map(([a, b]) => new TableRow({ children: [a, b].map((t, i) => new TableCell({ width: { size: i ? CONTENT - 2600 : 2600, type: WidthType.DXA }, borders,
          shading: i ? undefined : { fill: TINT, type: ShadingType.CLEAR, color: 'auto' }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [run(t, { bold: !i, size: 20 })] })] })) })) }),
      ] },
    { properties: { page: { size: { width: PAGE_W, height: 16838 }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } },
      headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [run('Manual Book PID POS per Peran', { size: 16, color: MUTE })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [run('Halaman ', { size: 16, color: MUTE }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: MUTE, font: FONT })] })] }) },
      children: out },
  ],
})
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(process.argv[2], b); console.log('ok', process.argv[2], fig, 'gambar') })
