// Tulis public/skit/lines.json dari naskah skit (dipakai scripts/make_skit_vo.py).
import {build} from 'esbuild';
import {writeFileSync, mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';

const out = join(tmpdir(), `skit-${process.pid}.mjs`);
await build({
  stdin: {
    contents: "export {SKITS, skitKey} from './src/skit/data'; export {ucapan} from './src/data/vo';",
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: out,
  logLevel: 'error',
});
const {SKITS, skitKey, ucapan} = await import(pathToFileURL(out).href);
const list = SKITS.flatMap((s) =>
  s.lines.map((l, i) => ({key: skitKey(s, i), voice: s[l.who].voice, text: l.text, say: ucapan(l.say ?? l.text)})),
);
mkdirSync('public/skit', {recursive: true});
writeFileSync('public/skit/lines.json', JSON.stringify(list, null, 1) + '\n');
console.log(`${list.length} kalimat skit -> public/skit/lines.json`);
