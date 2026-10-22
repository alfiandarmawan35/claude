import {ROLES} from '../theme';
import {EPISODES, narasiEpisode} from './episodes';
import {INTRO_LINES} from './intro';
import {ucapan} from './vo';

// Semua naskah narasi: `text` = yang tampil, `say` = yang diucapkan TTS.
export const semuaNarasi = () =>
  [...INTRO_LINES, ...EPISODES.flatMap((e) => narasiEpisode(e, ROLES[e.role].name))].map((n) => ({
    ...n,
    say: ucapan(n.text),
  }));
