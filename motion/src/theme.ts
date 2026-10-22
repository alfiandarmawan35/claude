import {continueRender, delayRender, staticFile} from 'remotion';

// Huruf Plus Jakarta Sans disimpan di public/fonts (lisensi OFL), jadi render tidak butuh internet.
export const fontFamily = 'Plus Jakarta Sans';
export const monoFamily = 'JetBrains Mono';
if (typeof document !== 'undefined') {
  const handle = delayRender('Memuat huruf');
  Promise.all(
    ['400', '500', '600', '700', '800'].map((w) =>
      new FontFace(fontFamily, `url(${staticFile(`fonts/plus-jakarta-sans-latin-${w}-normal.woff2`)}) format('woff2')`, {
        weight: w,
      })
        .load()
        .then((ff) => document.fonts.add(ff)),
    ).concat(
      ['500', '800'].map((w) =>
        new FontFace(monoFamily, `url(${staticFile(`fonts/jetbrains-mono-latin-${w}-normal.woff2`)}) format('woff2')`, {
          weight: w,
        })
          .load()
          .then((ff) => document.fonts.add(ff)),
      ),
    ),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
}

export const FPS = 30;
export const W = 1920;
export const H = 1080;

// Warna diambil dari tampilan aplikasi PID POS (perkiraan dari gambar layar manual).
export const C = {
  navy: '#1F3B7A',
  navyDark: '#14285A',
  bg: '#EEF3FB',
  white: '#FFFFFF',
  ink: '#1B2437',
  muted: '#5B6B86',
  line: '#D5DEEC',
  green: '#3A7D3A',
  red: '#C0392B',
  sea: '#2E6FB5',
  seaDark: '#1D4F8A',
};

export type RoleKey =
  | 'kapal'
  | 'so'
  | 'dc'
  | 'pur'
  | 'purchase'
  | 'po'
  | 'kasir';

export const ROLES: Record<RoleKey, {name: string; color: string; akun: string; short: string}> = {
  kapal: {name: 'Admin kapal', color: '#0F766E', akun: 'admin.awu', short: 'AK'},
  so: {name: 'Approve SO (P2)', color: '#6D28D9', akun: 'approve.so', short: 'SO'},
  dc: {name: 'Admin DC', color: '#EA580C', akun: 'admin.dc.jkt', short: 'DC'},
  pur: {name: 'Approve PUR', color: '#BE185D', akun: 'approve.pur', short: 'PR'},
  purchase: {name: 'Admin purchase', color: '#2563EB', akun: 'admin.purchase', short: 'AP'},
  po: {name: 'Approve PO', color: '#CA8A04', akun: 'approve.po', short: 'PO'},
  kasir: {name: 'Kasir', color: '#15803D', akun: 'kasir1.awu', short: 'KA'},
};
