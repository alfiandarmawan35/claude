"""Musik orisinal showreel "ARUS": techno perkusif 128 BPM, 96 ketukan = 45 detik, efek suara di ketukannya.
Disintesis dari nol (bebas royalti). Waktu babak harus sama dengan src/arus/beats.ts.

Pakai: pip install numpy scipy && python scripts/make_arus_music.py  ->  public/music/arus.wav
"""
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 44100
BEAT = 60 / 128
TOTAL = 96
LEN = int(TOTAL * BEAT * SR)
TETES, KATA, KAPAL, TEROWONGAN, SAPUAN, MOSAIK, KASIR, HENING, MUARA = 0, 6, 16, 30, 42, 48, 64, 76, 80
LOGO = 88
rng = np.random.default_rng(21)
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
    if i >= len(L):
        return
    s = sig[: len(L) - i] * g
    L[i : i + len(s)] += s * np.sqrt(0.5 * (1 - pan))
    R[i : i + len(s)] += s * np.sqrt(0.5 * (1 + pan))


def kick():
    tt = t(0.32)
    f = 48 + 120 * np.exp(-tt * 32)
    return np.tanh(2 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)) * 0.9


def metal(dec=40, hz=(3000, 9000)):
    tt = t(0.18)
    ring = np.sin(2 * np.pi * 1730 * tt) * 0.3 + np.sin(2 * np.pi * 2610 * tt) * 0.2
    n = flt(rng.standard_normal(len(tt)), "band", hz)
    return (n + ring) * np.exp(-tt * dec) * 0.35


def hat():
    tt = t(0.05)
    return flt(rng.standard_normal(len(tt)), "high", 8000) * np.exp(-tt * 90) * 0.3


def bass(n, dur):
    tt = t(dur)
    x = 2 * ((tt * note(n)) % 1) - 1
    env = np.minimum(1, tt * 300) * np.exp(-tt * 5)
    return flt(x, "low", 420) * env * 0.8


def drop():
    tt = t(1.6)
    f = 1400 * np.exp(-tt * 18) + 300
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 6) * 0.5
    for d, g in ((0.12, 0.4), (0.27, 0.25), (0.45, 0.15)):
        k = int(d * SR)
        x[k:] += x[:-k] * g
    return x


def whoosh(sec, up=True):
    tt = t(sec)
    env = (tt / sec) ** 2 if up else np.sin(np.pi * tt / sec) ** 2
    return flt(rng.standard_normal(len(tt)), "band", (400, 8000)) * env * 0.4


def flap():
    out = np.zeros(int(0.25 * SR))
    for k in range(6):
        tt = t(0.012)
        s = flt(rng.standard_normal(len(tt)), "band", (1500, 5000)) * np.exp(-tt * 300) * 0.4
        i = int(k * 0.035 * SR)
        out[i : i + len(s)] += s
    return out


def beep():
    tt = t(0.08)
    return np.sin(2 * np.pi * 2093 * tt) * 0.22


def glitch():
    tt = t(0.12)
    return np.sign(np.sin(2 * np.pi * 180 * tt)) * flt(rng.standard_normal(len(tt)), "band", (800, 6000)) * 0.3


def impact():
    tt = t(3.5)
    b = np.sin(2 * np.pi * np.cumsum(30 + 80 * np.exp(-tt * 5)) / SR) * np.exp(-tt * 1.0)
    n = flt(rng.standard_normal(len(tt)), "low", 3500) * np.exp(-tt * 4) * 0.6
    return np.tanh(1.7 * (b + n))


def pad(notes, dur, cut=1600):
    tt = t(dur)
    x = sum(2 * ((tt * note(n) * d) % 1) - 1 for n in notes for d in (0.995, 1.005))
    env = np.minimum(1, tt / 0.5) * np.clip((dur - tt) / 1.2, 0, 1)
    return flt(x, "low", cut) * env * 0.05


def riser(beats):
    tt = t(beats * BEAT)
    k = tt / tt[-1]
    return flt(rng.standard_normal(len(tt)), "band", (500, 9000)) * k**2.5 * 0.35 + np.sin(2 * np.pi * np.cumsum(120 + 1500 * k**2) / SR) * k**3 * 0.14


ROOTS = [38, 34, 41, 36]  # D - Bb - F - C
CH = [[62, 65, 69], [58, 62, 65], [65, 69, 72], [60, 64, 67]]

# 1. Tetes
add(drop(), 1, 1.0)
add(pad([50, 57, 62], 6 * BEAT, 900), 0, 0.8)
add(whoosh(1.3), 4.6, 0.7)

for bt in range(KATA, HENING):
    ch = ((bt - KATA) // 4) % 4
    add(kick(), bt, 0.85)
    if bt >= KAPAL:
        add(hat(), bt + 0.5, 0.8, 0.3)
    if bt >= TEROWONGAN:
        for q in (0.25, 0.75):
            add(hat(), bt + q, 0.45, -0.3)
    if bt % 2 == 1:
        add(metal(), bt, 0.7, -0.2)
    if bt >= KAPAL and bt % 4 == 3:
        add(metal(25, (1500, 6000)), bt + 0.75, 0.5, 0.4)
    for h in (0, 0.5) if bt < MOSAIK else (0, 0.25, 0.5, 0.75):
        add(bass(ROOTS[ch] + (12 if h in (0.5, 0.75) and bt >= MOSAIK else 0), BEAT * 0.4), bt + h, 0.75)
    if (bt - KATA) % 4 == 0:
        add(pad(CH[ch], 4 * BEAT), bt, 0.9)

# 2. Arus kata: whoosh tiap kata
for bt in (8, 10, 12, 14):
    add(whoosh(0.35), bt - 0.35, 0.6)
add(whoosh(0.5, up=False), 15.5, 0.7)
# 3. Kapal: klik laci dek
for bt in (18, 20, 22, 24, 26):
    add(metal(60, (2000, 7000)), bt, 0.8)
add(riser(4), TEROWONGAN - 4, 0.6)
# 4. Terowongan: flap + glitch tiap kartu
for bt in (30, 32, 34, 36, 38, 40):
    add(whoosh(0.3), bt - 0.3, 0.5)
    add(flap(), bt + 0.4, 0.8)
    add(glitch(), bt + 1.0, 0.6)
# 5. Sapuan: tiga hantaman
for bt in (42, 44, 46):
    add(impact()[: int(0.6 * SR)], bt, 0.5)
# 6. Mosaik: geser tiap ketukan
for bt in range(MOSAIK, KASIR):
    add(metal(80, (4000, 10000)), bt + 0.5, 0.35, 0.5 if bt % 2 else -0.5)
add(riser(4), KASIR - 4, 0.7)
# 7. Kasir: bip tiap setengah ketukan, F12, lunas, printer
for k in range(16):
    add(beep(), KASIR + k * 0.5, 0.8)
    if k % 2:
        add(glitch(), KASIR + k * 0.5, 0.25)
add(impact()[: int(1.0 * SR)], 72, 0.6)
tt = t(1.4)
add((np.sin(2 * np.pi * 1318 * tt) + 0.6 * np.sin(2 * np.pi * 1976 * tt)) * np.exp(-tt * 4) * 0.2, 73, 1.0)
tt = t(2 * BEAT)
add(flt(np.sign(np.sin(2 * np.pi * 95 * tt)) + rng.standard_normal(len(tt)) * 0.4, "band", (300, 3000)) * 0.14, 74, 1.0)
# 8. Hening: hanya dengung pelan
add(pad([50, 57], 4 * BEAT, 500), HENING, 0.6)
# 9. Muara: pusaran naik, hantaman logo, akor penutup
add(riser(8), LOGO - 8, 1.0)
for bt in range(MUARA, LOGO):
    add(kick(), bt, 0.4 + 0.07 * (bt - MUARA))
add(impact(), LOGO, 1.0)
add(pad([62, 69, 74, 77, 81], 8 * BEAT, 2400), LOGO, 1.8)
tt = t(2.5)
add(sum(np.sin(2 * np.pi * note(n) * tt) * a for n, a in ((86, 1), (90, 0.6), (93, 0.5))) * np.exp(-tt * 2) * 0.12, 90, 1.0)

mix = np.stack([L, R], 1)
duck = np.ones(len(mix))
for bt in range(KATA, HENING):
    i = int(bt * BEAT * SR)
    n = int(0.2 * SR)
    duck[i : i + n] *= 1 - 0.3 * np.exp(-np.arange(n) / SR * 15)
mix = (mix * duck[:, None])[:LEN]
f0 = int((TOTAL - 2.5) * BEAT * SR)
mix[f0:] *= np.linspace(1, 0, LEN - f0)[:, None] ** 1.5
mix = np.tanh(mix * 1.15)
mix /= np.max(np.abs(mix)) / 0.62
out = Path(__file__).resolve().parent.parent / "public" / "music" / "arus.wav"
wavfile.write(out, SR, (mix * 32767).astype(np.int16))
print(f"{out} {len(mix) / SR:.2f} detik")
