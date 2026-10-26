"""Musik hitung mundur peluncuran: 120 BPM, 44 ketukan = 22 detik. Detik jam tiap ketukan, dentum di setiap angka,
riser menjelang angka terakhir, hening satu ketukan, lalu hantaman dan akor peluncuran. Disintesis dari nol (bebas royalti).
Waktu harus sama dengan src/countdown/timing.ts.

Pakai: pip install numpy scipy && python scripts/make_countdown_music.py  ->  public/music/countdown.wav
"""
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 44100
BEAT = 0.5
INTRO, PER, N = 4, 3, 9
REVEAL = INTRO + PER * N + 1
TOTAL = REVEAL + 12
LEN = int(TOTAL * BEAT * SR)
rng = np.random.default_rng(5)
L = np.zeros(LEN + SR * 3)
R = np.zeros(LEN + SR * 3)


def t(s):
    return np.arange(int(s * SR)) / SR


def bp(x, lo, hi):
    return sosfilt(butter(2, [lo, hi], "band", fs=SR, output="sos"), x)


def lp(x, hz):
    return sosfilt(butter(2, hz, "low", fs=SR, output="sos"), x)


def note(n):
    return 440 * 2 ** ((n - 69) / 12)


def add(sig, beat, g=1.0, pan=0.0):
    i = int(beat * BEAT * SR)
    s = sig[: len(L) - i] * g
    L[i : i + len(s)] += s * np.sqrt(0.5 * (1 - pan))
    R[i : i + len(s)] += s * np.sqrt(0.5 * (1 + pan))


def tick(hi=True):
    tt = t(0.05)
    return bp(rng.standard_normal(len(tt)), 2500 if hi else 1500, 6000) * np.exp(-tt * 120) * 0.5


def boom():
    tt = t(1.2)
    f = 38 + 90 * np.exp(-tt * 18)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 3.5)
    return np.tanh(1.8 * x) * 0.8


def pad(notes, dur):
    tt = t(dur)
    x = sum(2 * ((tt * note(n) * d) % 1) - 1 for n in notes for d in (0.996, 1.004))
    env = np.minimum(1, tt / 0.6) * np.clip((dur - tt) / 1.5, 0, 1)
    return lp(x, 1800) * env * 0.06


def riser(beats):
    tt = t(beats * BEAT)
    k = tt / tt[-1]
    n = bp(rng.standard_normal(len(tt)), 600, 9000) * k**2.5 * 0.35
    s = np.sin(2 * np.pi * np.cumsum(150 + 1400 * k**2) / SR) * k**3 * 0.15
    return n + s


def impact():
    tt = t(3.0)
    b = np.sin(2 * np.pi * np.cumsum(32 + 70 * np.exp(-tt * 5)) / SR) * np.exp(-tt * 1.2)
    n = lp(rng.standard_normal(len(tt)), 4000) * np.exp(-tt * 4) * 0.6
    return np.tanh(1.6 * (b + n)) * 0.95


def chime():
    tt = t(2.5)
    x = sum(np.sin(2 * np.pi * note(n) * tt) * a for n, a in ((84, 1), (88, 0.6), (91, 0.5), (96, 0.3)))
    return x * np.exp(-tt * 2.2) * 0.12


def whoosh(sec):
    tt = t(sec)
    return bp(rng.standard_normal(len(tt)), 300, 7000) * np.sin(np.pi * tt / sec) ** 2 * 0.4


# pembuka: pad gelap, detik pelan
add(pad([45, 52, 57], (INTRO + PER * N) * BEAT), 0, 0.9)
for b in range(0, REVEAL - 1):
    add(tick(b % 2 == 0), b, 0.9 if b >= INTRO else 0.6, 0.3 if b % 2 else -0.3)
    if b >= INTRO:
        add(tick(False), b + 0.5, 0.35, 0.2)
# setiap angka: dentum + nada bas yang naik setengah langkah
for i in range(N):
    b = INTRO + PER * i
    add(boom(), b, 0.9)
    tt = t(PER * BEAT)
    add(np.sin(2 * np.pi * note(33 + i) * tt) * np.exp(-tt * 1.5) * 0.25, b, 1.0)
add(riser(9), REVEAL - 10, 0.9)
add(whoosh(0.6), REVEAL - 0.7, 0.9)
# peluncuran
add(impact(), REVEAL, 1.0)
add(pad([57, 64, 69, 73, 76], 12 * BEAT), REVEAL, 1.6)
add(chime(), REVEAL + 2, 1.0)
add(chime(), REVEAL + 6, 0.7)

mix = np.stack([L, R], 1)[:LEN]
end = LEN
f0 = int((TOTAL - 2) * BEAT * SR)
mix[f0:end] *= np.linspace(1, 0, end - f0)[:, None] ** 1.5
mix = np.tanh(mix * 1.1)
mix /= np.max(np.abs(mix)) / 0.72
out = Path(__file__).resolve().parent.parent / "public" / "music" / "countdown.wav"
wavfile.write(out, SR, (mix * 32767).astype(np.int16))
print(f"{out} {len(mix) / SR:.2f} detik")
