"""Musik hitung mundur gaya ARUS: 120 BPM (1 angka = 1 detik = 2 ketukan), 38 ketukan = 19 detik.
Tetes air, perkusi logam, kick tiap ketukan, makin rapat menjelang angka 1, hening, lalu hantaman peluncuran.
Disintesis dari nol (bebas royalti). Waktu harus sama dengan src/arus/CountdownArus.tsx.

Pakai: pip install numpy scipy && python scripts/make_arus_countdown_music.py  ->  public/music/arus_countdown.wav
"""
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 44100
BEAT = 0.5
INTRO, ANGKA, GAP, TOTAL = 4, 24, 25, 38
LEN = int(TOTAL * BEAT * SR)
rng = np.random.default_rng(33)
L = np.zeros(LEN + 4 * SR)
R = np.zeros(LEN + 4 * SR)


def t(s):
    return np.arange(int(s * SR)) / SR


def flt(x, kind, hz):
    return sosfilt(butter(2, hz, kind, fs=SR, output="sos"), x)


def note(n):
    return 440 * 2 ** ((n - 69) / 12)


def add(sig, beat, g=1.0, pan=0.0):
    i = int(round(beat * BEAT * SR))
    s = sig[: len(L) - i] * g
    L[i : i + len(s)] += s * np.sqrt(0.5 * (1 - pan))
    R[i : i + len(s)] += s * np.sqrt(0.5 * (1 + pan))


def kick():
    tt = t(0.32)
    f = 48 + 120 * np.exp(-tt * 32)
    return np.tanh(2 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)) * 0.9


def metal(dec=35):
    tt = t(0.2)
    ring = np.sin(2 * np.pi * 1730 * tt) * 0.3 + np.sin(2 * np.pi * 2610 * tt) * 0.2
    return (flt(rng.standard_normal(len(tt)), "band", (3000, 9000)) + ring) * np.exp(-tt * dec) * 0.35


def hat():
    tt = t(0.05)
    return flt(rng.standard_normal(len(tt)), "high", 8000) * np.exp(-tt * 90) * 0.3


def drop():
    tt = t(1.6)
    x = np.sin(2 * np.pi * np.cumsum(1400 * np.exp(-tt * 18) + 300) / SR) * np.exp(-tt * 6) * 0.5
    for d, g in ((0.12, 0.4), (0.27, 0.25), (0.45, 0.15)):
        k = int(d * SR)
        x[k:] += x[:-k] * g
    return x


def stab(n):
    tt = t(0.4)
    x = sum(2 * ((tt * note(m) * d) % 1) - 1 for m in (n, n + 3, n + 7) for d in (0.995, 1.005))
    return flt(x, "low", 2600) * np.exp(-tt * 8) * 0.1


def riser(beats):
    tt = t(beats * BEAT)
    k = tt / tt[-1]
    return flt(rng.standard_normal(len(tt)), "band", (500, 9000)) * k**2.5 * 0.35 + np.sin(2 * np.pi * np.cumsum(120 + 1500 * k**2) / SR) * k**3 * 0.14


def impact():
    tt = t(3.5)
    b = np.sin(2 * np.pi * np.cumsum(30 + 80 * np.exp(-tt * 5)) / SR) * np.exp(-tt * 1.0)
    n = flt(rng.standard_normal(len(tt)), "low", 3500) * np.exp(-tt * 4) * 0.6
    return np.tanh(1.7 * (b + n))


def pad(notes, dur, cut=2200):
    tt = t(dur)
    x = sum(2 * ((tt * note(n) * d) % 1) - 1 for n in notes for d in (0.995, 1.005))
    env = np.minimum(1, tt / 0.5) * np.clip((dur - tt) / 1.5, 0, 1)
    return flt(x, "low", cut) * env * 0.05


add(drop(), 0.5, 1.0)
add(pad([50, 57, 62], INTRO * BEAT, 900), 0, 0.8)
for k in range(10):
    bt = INTRO + 2 * k
    add(metal(), bt, 0.9, -0.2)
    add(stab(50 + k), bt, 1.0)
    for q in range(2):
        add(kick(), bt + q, 0.85)
        add(hat(), bt + q + 0.5, 0.7, 0.3)
        if k >= 7:  # tiga detik terakhir lebih rapat
            for s in (0.25, 0.75):
                add(hat(), bt + q + s, 0.5, -0.3)
add(riser(6), ANGKA - 6, 0.9)
add(impact(), GAP, 1.0)
add(pad([62, 69, 74, 77, 81], (TOTAL - GAP) * BEAT, 2400), GAP, 1.8)
tt = t(2.5)
add(sum(np.sin(2 * np.pi * note(n) * tt) * a for n, a in ((86, 1), (90, 0.6), (93, 0.5))) * np.exp(-tt * 2) * 0.12, GAP + 3, 1.0)

mix = np.stack([L, R], 1)[:LEN]
f0 = int((TOTAL - 3) * BEAT * SR)
mix[f0:] *= np.linspace(1, 0, LEN - f0)[:, None] ** 1.5
mix = np.tanh(mix * 1.15)
mix /= np.max(np.abs(mix)) / 0.62
out = Path(__file__).resolve().parent.parent / "public" / "music" / "arus_countdown.wav"
wavfile.write(out, SR, (mix * 32767).astype(np.int16))
print(f"{out} {len(mix) / SR:.2f} detik")
