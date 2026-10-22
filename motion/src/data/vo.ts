import voJson from './vo.json';

// Durasi (detik) setiap file narasi di public/vo, dibuat oleh scripts/make_vo.py.
// Kosong = belum ada suara; video tetap jalan dengan teks saja.
const VO = voJson as Record<string, number>;

export const voSec = (key: string): number | undefined => VO[key];
export const voFile = (key: string) => `vo/${key}.mp3`;

// Frame untuk satu bagian: cukup untuk teks (minFrames) dan untuk suara + jeda.
export const fitFrames = (key: string, minFrames: number, fps: number, pad = 0.9) => {
  const s = voSec(key);
  return s ? Math.max(minFrames, Math.round((s + pad) * fps)) : minFrames;
};

const ANGKA: Record<string, string> = {
  '2': 'dua',
  '4': 'empat',
  '8': 'delapan',
  '9': 'sembilan',
  '12': 'dua belas',
};

// Ubah teks layar menjadi teks ucapan agar singkatan dibaca dengan benar.
export const ucapan = (t: string) =>
  t
    .replace(/·/g, ',')
    .replace(/ & /g, ' dan ')
    .replace(/\+ dan −/g, 'plus dan minus')
    .replace(/3\*kode/g, 'tiga bintang kode')
    .replace(/H-5/g, 'ha min lima')
    .replace(/\bF(\d+)\b/g, (_, n) => `ef ${ANGKA[n] ?? n}`)
    .replace(/\/(?=\w)/g, ' atau ')
    .replace(/\bGRPO\b/g, 'ge er pe o')
    .replace(/\bPUR\b/g, 'pe u er')
    .replace(/\bPO\b/g, 'pe o')
    .replace(/\bSO\b/g, 'es o')
    .replace(/\bSAP\b/g, 'es a pe')
    .replace(/\bDC\b/g, 'de ce')
    .replace(/\bDO\b/g, 'de o')
    .replace(/\bQRIS\b/g, 'kiu-ris')
    .replace(/\bPPN\b/g, 'pe pe en')
    .replace(/\bP2\b/g, 'pe dua')
    .replace(/\bCSV\b/g, 'ce es ve')
    .replace(/\bHP\b/g, 'ha pe')
    .replace(/\bQR\b/g, 'kiu ar')
    .replace(/\bKM\b/g, 'ka em')
    .replace(/\bPOS\b/g, 'pos')
    .replace(/\bPID\b/g, 'pe i de')
    .replace(/\b[Qq]ty\b/g, 'jumlah')
    .replace(/\bpcs\b/g, 'pis')
    .replace(/\bNo\. /g, 'nomor ')
    .replace(/[()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
