// Tulis public/vo/narasi.json dari naskah di src/data (dipakai scripts/make_vo.py).
import {build} from 'esbuild';
import {writeFileSync, mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';

const out = join(tmpdir(), `narasi-${process.pid}.mjs`);
await build({
  stdin: {contents: "export {semuaNarasi} from './src/data/narasi';", resolveDir: process.cwd(), loader: 'ts'},
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: out,
  logLevel: 'error',
});
const {semuaNarasi} = await import(pathToFileURL(out).href);
const list = semuaNarasi();
mkdirSync('public/vo', {recursive: true});
writeFileSync('public/vo/narasi.json', JSON.stringify(list, null, 1) + '\n');
console.log(`${list.length} kalimat narasi -> public/vo/narasi.json`);
