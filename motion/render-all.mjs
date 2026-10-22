// Render semua video ke folder out/. Pakai: node render-all.mjs [id ...]
import {execFileSync} from 'node:child_process';

const all = [
  ['Perkenalan', '00_Perkenalan_PID_POS'],
  ['Ep1-AdminKapal', '01_Admin_Kapal'],
  ['Ep2-ApproveSO', '02_Approve_SO_P2'],
  ['Ep3-AdminDC', '03_Admin_DC'],
  ['Ep4-ApprovePUR', '04_Approve_PUR'],
  ['Ep5-AdminPurchase', '05_Admin_Purchase'],
  ['Ep6-ApprovePO', '06_Approve_PO'],
  ['Ep7-Kasir', '07_Kasir'],
];
const pick = process.argv.slice(2);
for (const [id, name] of all) {
  if (pick.length && !pick.includes(id)) continue;
  console.log(`== ${id}`);
  execFileSync('npx', ['remotion', 'render', 'src/index.ts', id, `out/${name}.mp4`, '--crf=20', '--log=error'], {
    stdio: 'inherit',
  });
}
