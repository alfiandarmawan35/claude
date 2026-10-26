"""Musik hitung mundur (15 s) senada video perkenalan profesional -> assets/musik.wav.
Tik per detik 1,8–10,8 s, riser ke 11,8 s, hantaman dan akor terbuka saat kartu peluncuran. Pakai: python countdown/suara.py"""
from pathlib import Path
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

D = Path(__file__).resolve().parent
SR, DUR, MULAI = 48000, 15.0, 1.8
AKHIR = MULAI + 10
N = int(DUR * SR)
rng = np.random.default_rng(7)
buf = np.zeros((N, 2))

def add(x, t, g=1.0, pan=0.0):
    i = int(t * SR)
    x = x[: N - i]; L, R = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[i:i + len(x), 0] += x * g * L * 1.414; buf[i:i + len(x), 1] += x * g * R * 1.414
tt = lambda d: np.arange(int(d * SR)) / SR
lp = lambda x, f: sosfilt(butter(2, f, "low", fs=SR, output="sos"), x)
bp = lambda x, lo, hi: sosfilt(butter(2, [lo, hi], "band", fs=SR, output="sos"), x)
hp = lambda x, f: sosfilt(butter(2, f, "high", fs=SR, output="sos"), x)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)

def pad(ms, d, cut=1800):
    t = tt(d); x = np.zeros(len(t))
    for m in ms:
        for det in (-0.08, 0.08):
            for h in range(1, 6): x += np.sin(2 * np.pi * hz(m + det) * h * t + h) / h ** 1.6
    return lp(x, cut) / len(ms) * np.minimum(1, t / .8) * np.minimum(1, (d - t) / .8)
def pluk(m, d=.6):
    t = tt(d); f = hz(m)
    return (np.sin(2 * np.pi * f * t) + .3 * np.sin(4 * np.pi * f * t) * np.exp(-t * 9)) * np.exp(-t * 6) * np.minimum(1, t / .002)
def kik():
    t = tt(.4); return np.sin(2 * np.pi * 52 * t * (1 + 1.6 * np.exp(-t * 28))) * np.exp(-t * 8)
def tik(): t = tt(.05); return bp(rng.standard_normal(len(t)), 2500, 8000) * np.exp(-t * 110)
def piano(m, d=3.0):
    t = tt(d); f = hz(m)
    return sum(np.sin(2 * np.pi * f * h * t) * np.exp(-t * (1.0 + h)) / h for h in range(1, 5)) * np.minimum(1, t / .003)
def whoosh(d, lo, hi): t = tt(d); return bp(rng.standard_normal(len(t)), lo, hi) * np.sin(np.pi * t / d) ** 2
def riser(d):
    t = tt(d); f = 180 + 2200 * (t / d) ** 2
    return bp(rng.standard_normal(len(t)), 500, 7000) * (t / d) ** 2 * .6 + .25 * np.sin(2 * np.pi * np.cumsum(f) / SR) * (t / d) ** 3
def impact():
    t = tt(3.0); return np.sin(2 * np.pi * 44 * t * (1 + .8 * np.exp(-t * 12))) * np.exp(-t * 1.8) + .35 * lp(rng.standard_normal(len(t)), 900) * np.exp(-t * 4)

# pembuka: akor lembut dan desir saat cincin tergambar
add(pad([57, 60, 64, 69], MULAI + 10.2, 1400), 0, .14)
add(whoosh(1.0, 300, 3000), .55, .14)
# tiap detik: tik + petikan naik + kik; makin rapat dan keras di 3 detik terakhir
nada = [69, 71, 72, 74, 76, 77, 79, 81, 83, 84]
for i in range(10):
    t = MULAI + i
    add(tik(), t, .3 + .03 * i, pan=.25)
    add(pluk(nada[i], .7), t, .09 + .006 * i, pan=-.2)
    add(kik(), t, .28 + .02 * i)
    if i >= 7: add(kik(), t + .5, .22); add(tik(), t + .5, .25, pan=-.25)
add(riser(2.6), AKHIR - 2.6, .4)
# nol: hantaman + akor C terbuka, petikan naik di kartu
add(impact(), AKHIR, .55)
add(pad([48, 55, 60, 64, 67, 72], DUR - AKHIR, 2400), AKHIR, .22)
for j, m in enumerate([60, 64, 67, 72, 76]): add(piano(m, 3.2), AKHIR + .02 * j, .08)
for j, m in enumerate([72, 76, 79, 84]): add(pluk(m, 1.0), AKHIR + .6 + j * .18, .07, pan=-.3 + .2 * j)

tsec = np.arange(N) / SR
buf *= np.minimum(1, np.minimum(tsec / .2, (DUR - tsec) / .9))[:, None]
buf /= np.abs(buf).max() / .89
out = D / "assets" / "musik.wav"
wavfile.write(out, SR, (buf * 32767).astype(np.int16))
print(out)
