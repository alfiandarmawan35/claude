"""Audio versi profesional (60 s): musik korporat orisinal 100 BPM + efek transisi halus + narasi Ardi -> ../video/assets/mix.wav.
Semua disintesis numpy (tanpa sampel). Pakai: python suara/mix.py"""
from pathlib import Path
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

D = Path(__file__).resolve().parent
SR, DUR, BPM = 48000, 60.0, 100
BEAT = 60 / BPM; BAR = 4 * BEAT
N = int(DUR * SR)
rng = np.random.default_rng(5)
mus, fol, vox = (np.zeros((N, 2)) for _ in range(3))

def add(buf, x, t, g=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or i < 0: return
    x = x[: N - i]; L, R = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[i:i + len(x), 0] += x * g * L * 1.414; buf[i:i + len(x), 1] += x * g * R * 1.414
tt = lambda d: np.arange(int(d * SR)) / SR
lp = lambda x, f: sosfilt(butter(2, f, "low", fs=SR, output="sos"), x)
bp = lambda x, lo, hi: sosfilt(butter(2, [lo, hi], "band", fs=SR, output="sos"), x)
hp = lambda x, f: sosfilt(butter(2, f, "high", fs=SR, output="sos"), x)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)

def pad(ms, d):
    t = tt(d); x = np.zeros(len(t))
    for m in ms:
        for det in (-0.08, 0.08):
            f = hz(m + det)
            for h in range(1, 6): x += np.sin(2 * np.pi * f * h * t + h) / h ** 1.6
    x = lp(x, 1800) / len(ms)
    return x * np.minimum(1, t / .6) * np.minimum(1, (d - t) / .8)
def pluk(m, d=.6):
    t = tt(d); f = hz(m)
    return (np.sin(2 * np.pi * f * t) + .3 * np.sin(4 * np.pi * f * t) * np.exp(-t * 9)) * np.exp(-t * 6) * np.minimum(1, t / .002)
def sub(m, d):
    t = tt(d); f = hz(m)
    return (np.sin(2 * np.pi * f * t) + .3 * np.sin(4 * np.pi * f * t)) * np.exp(-t * 3.5) * np.minimum(1, t / .005)
def kik():
    t = tt(.35); return np.sin(2 * np.pi * 55 * t * (1 + 1.6 * np.exp(-t * 28))) * np.exp(-t * 9)
def hat(): t = tt(.05); return hp(rng.standard_normal(len(t)), 7000) * np.exp(-t * 90)
def piano(m, d=2.5):
    t = tt(d); f = hz(m)
    return sum(np.sin(2 * np.pi * f * h * t) * np.exp(-t * (1.2 + h)) / h for h in range(1, 5)) * np.minimum(1, t / .003)
def whoosh(d=.5, lo=300, hi=4000): t = tt(d); return bp(rng.standard_normal(len(t)), lo, hi) * np.sin(np.pi * t / d) ** 2
def tik(): t = tt(.04); return bp(rng.standard_normal(len(t)), 2500, 8000) * np.exp(-t * 120)
def riser(d):
    t = tt(d); f = 200 + 1800 * (t / d) ** 2
    return (bp(rng.standard_normal(len(t)), 500, 6000) * (t / d) ** 2 * .6 + .2 * np.sin(2 * np.pi * np.cumsum(f) / SR) * (t / d) ** 3)
def impact():
    t = tt(2.5); return np.sin(2 * np.pi * 45 * t * (1 + .8 * np.exp(-t * 12))) * np.exp(-t * 2.2) + .3 * lp(rng.standard_normal(len(t)), 900) * np.exp(-t * 4)

CH = [([57, 60, 64, 67], 45), ([53, 57, 60, 64], 41), ([48, 55, 60, 64], 36), ([55, 59, 62, 67], 43)]   # Am7 Fmaj7 C(add) G
nbar = int(53.6 / BAR) + 1
for k in range(nbar):
    t0 = k * BAR
    if t0 >= 53.6: break
    ch, root = CH[k % 4]
    add(mus, pad(ch, BAR + .6), t0, .16)
    for b in range(4):
        tb = t0 + b * BEAT
        if tb >= 53.0: break
        if tb >= 5.2: add(mus, sub(root, BEAT * .95), tb, .3)              # denyut bas mulai di adegan 2
        if 25.6 <= tb < 48.2:
            if b in (0, 2): add(mus, kik(), tb, .35)
            add(mus, hat(), tb + BEAT / 2, .1, pan=.3)
        for h in (0, 1):                                                 # petikan seperdelapan
            th = tb + h * BEAT / 2
            if th < 5.2 and h: continue
            if th < 53.0: add(mus, pluk(ch[(b * 2 + h) % 4] + 12, .5), th, .07 if th < 13 else .09, pan=-.35 + .7 * h)
# nilai: satu akor piano per kata
for t0, ch in ((48.55, [57, 64, 69, 72]), (49.45, [53, 60, 65, 69]), (50.35, [55, 62, 67, 71])):
    for j, m in enumerate(ch): add(mus, piano(m, 2.0), t0 + j * .01, .07)
# riser ke penutup, lalu akor terbuka panjang
add(fol, riser(1.4), 52.3, .35)
add(fol, impact(), 53.85, .45)
add(mus, pad([48, 55, 60, 64, 67], 6.4), 53.7, .2)
for j, m in enumerate([60, 64, 67, 72, 76]): add(mus, piano(m, 5.0), 53.85 + j * .02, .07)
for j, m in enumerate([72, 76, 79]): add(mus, pluk(m, 1.2), 56.6 + j * .3, .08)

# transisi dan aksi
for t0 in (5.05, 13.0, 25.45, 38.1, 48.05): add(fol, whoosh(.5, 300, 3500), t0, .16)
for t0 in (16.25, 21.25): add(fol, whoosh(.4, 500, 5000), t0, .13)
for i in range(6): add(fol, tik(), 25.6 + 2.8 + i * 1.1 + .7, .35); add(mus, pluk(72 + [0, 2, 4, 7, 9, 12][i], .5), 25.6 + 2.8 + i * 1.1 + .7, .07)
for t0 in (38.9, 40.3, 41.6, 42.9): add(fol, tik(), t0, .3)
for t0 in (14.0, 18.9, 22.8): add(fol, tik(), t0, .2)

# narasi
MULAI = {"A1": .8, "A2": 5.6, "A3": 13.6, "A4": 21.6, "A5": 27.0, "A6": 38.8, "A7": 48.6, "A8": 54.6}
vmask = np.zeros(N)
for k, t0 in MULAI.items():
    sr, x = wavfile.read(D / f"{k}.wav"); x = x.astype(np.float64) / 32768
    x = np.tanh(x * 2.0) / np.tanh(2.0)
    add(vox, x, t0, 1.0)
    vmask[int(t0 * SR): min(N, int((t0 + len(x) / SR) * SR))] = 1
duck = np.convolve(vmask, np.ones(int(.3 * SR)) / int(.3 * SR), "same")
mus *= (1 - .55 * duck)[:, None]; fol *= (1 - .3 * duck)[:, None]
tsec = np.arange(N) / SR
mix = mus + fol + vox
mix *= np.minimum(1, np.minimum(tsec / .3, (DUR - tsec) / 1.0))[:, None]
mix /= np.abs(mix).max() / .89
out = D.parent / "video" / "assets" / "mix.wav"
wavfile.write(out, SR, (mix * 32767).astype(np.int16))
print(out)
