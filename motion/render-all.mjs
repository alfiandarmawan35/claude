// Render semua video ke folder out/. Pakai: node render-all.mjs [id ...]
import {execFileSync} from 'node:child_process';
import {rmSync} from 'node:fs';

const all = [
  ['Perkenalan', '00_Perkenalan_PID_POS'],
  ['Ep1-AdminKapal', '01_Admin_Kapal'],
  ['Ep2-ApproveSO', '02_Approve_SO_P2'],
  ['Ep3-AdminDC', '03_Admin_DC'],
  ['Ep4-ApprovePUR', '04_Approve_PUR'],
  ['Ep5-AdminPurchase', '05_Admin_Purchase'],
  ['Ep6-ApprovePO', '06_Approve_PO'],
  ['Ep7-Kasir', '07_Kasir'],
  ['Ep0-AlurLengkap', '08_Alur_Lengkap'],
  ['Skit-Kapal', 'Skit_Kapal_Barang_kok_belum_datang'],
  ['Skit-Gudang', 'Skit_Gudang_Stok_kurang'],
  ['Skit-Kasir', 'Skit_Kasir_Antrean_panjang'],
  ['Skit-Approve', 'Skit_Approve_Mana_yang_disetujui'],
];
const pick = process.argv.slice(2);
for (const [id, name] of all) {
  if (pick.length && !pick.includes(id)) continue;
  console.log(`== ${id}`);
  execFileSync('npx', ['remotion', 'render', 'src/index.ts', id, `out/${name}.raw.mp4`, '--crf=20', '--log=error'], {
    stdio: 'inherit',
  });
  // Samakan kenyaringan audio ke standar video web (-16 LUFS), gambar tidak diubah.
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', `out/${name}.raw.mp4`, '-c:v', 'copy', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', `out/${name}.mp4`], {stdio: 'inherit'});
  rmSync(`out/${name}.raw.mp4`);
}
