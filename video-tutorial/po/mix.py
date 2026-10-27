"""Audio tutorial PO: musik latar tenang orisinal (numpy) + efek transisi + narasi Ardi -> assets/mix.wav.
Waktu dari suara/jadwal.json (build.py). Pakai: python mix.py"""
import json
from pathlib import Path
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

D = Path(__file__).resolve().parent
J = json.loads((D / "suara" / "jadwal.json").read_text())
DATA = {a[0]: a for a in J["adegan"]}
SR, DUR, BPM = 48000, J["total"], 92
BEAT = 60 / BPM; BAR = 4 * BEAT
N = int(DUR * SR)
rng = np.random.default_rng(11)
mus, fol, vox = (np.zeros((N, 2)) for _ in range(3))

def add(buf, x, t, g=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or i < 0: return
    x = x[: N - i]; L, R = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[i:i + len(x), 0] += x * g * L * 1.414
    buf[i:i + len(x), 1] += x * g * R * 1.414
tt = lambda d: np.arange(int(d * SR)) / SR
lp = lambda x, f: sosfilt(butter(2, f, "low", fs=SR, output="sos"), x)
bp = lambda x, lo, hi: sosfilt(butter(2, [lo, hi], "band", fs=SR, output="sos"), x)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)

def pad(ms, d):
    t = tt(d); x = np.zeros(len(t))
    for m in ms:
        for det in (-0.07, 0.07):
            for h in range(1, 5): x += np.sin(2 * np.pi * hz(m + det) * h * t + h) / h ** 1.7
    return lp(x, 1500) / len(ms) * np.minimum(1, t / .8) * np.minimum(1, (d - t) / .8)
def pluk(m, d=.6):
    t = tt(d); f = hz(m)
    return (np.sin(2 * np.pi * f * t) + .3 * np.sin(4 * np.pi * f * t) * np.exp(-t * 9)) * np.exp(-t * 6) * np.minimum(1, t / .002)
def sub(m, d):
    t = tt(d); f = hz(m)
    return np.sin(2 * np.pi * f * t) * np.exp(-t * 3) * np.minimum(1, t / .005)
def whoosh(d=.5, lo=300, hi=4000): t = tt(d); return bp(rng.standard_normal(len(t)), lo, hi) * np.sin(np.pi * t / d) ** 2
def tik(): t = tt(.04); return bp(rng.standard_normal(len(t)), 2500, 8000) * np.exp(-t * 120)
def piano(m, d=2.5):
    t = tt(d); f = hz(m)
    return sum(np.sin(2 * np.pi * f * h * t) * np.exp(-t * (1.2 + h)) / h for h in range(1, 5)) * np.minimum(1, t / .003)

CH = [([57, 60, 64, 67], 45), ([53, 57, 60, 64], 41), ([48, 55, 60, 64], 36), ([55, 59, 62, 67], 43)]   # Am7 Fmaj7 C G
akhir_musik = DUR - 1.0
for k in range(int(akhir_musik / BAR) + 1):
    t0 = k * BAR
    if t0 >= akhir_musik: break
    ch, root = CH[k % 4]
    add(mus, pad(ch, BAR + .6), t0, .14)
    for b in range(4):
        tb = t0 + b * BEAT
        if tb >= akhir_musik - .5: break
        add(mus, sub(root, BEAT * .9), tb, .18)
        if b % 2 == 0: add(mus, pluk(ch[b % 4] + 12, .5), tb + BEAT / 2, .05, pan=-.3 + .3 * b)

# transisi antaradegan dan aksen judul bagian
for sid, jenis, mulai in J["adegan"]:
    if mulai > 0: add(fol, whoosh(.45, 300, 3500), mulai - .2, .12)
    if jenis == "bagian":
        for j, m in enumerate([60, 64, 67]): add(mus, piano(m, 2.0), mulai + .15 + j * .02, .06)
for j, m in enumerate([60, 64, 67, 72]): add(mus, piano(m, 3.5), DATA["S20"][2] + .2 + j * .02, .07)

# tik kecil saat kotak sorot muncul
html = (D / "index.html").read_text()
DATA_JS = json.loads(html.split("const DATA = ", 1)[1].split(";\n", 1)[0])
for sc in DATA_JS:
    for f in sc.get("fokus", []):
        if f["kotak"]: add(fol, tik(), sc["mulai"] + max(.2, f["t"] - .15) + .6, .22)

# narasi
vmask = np.zeros(N)
for sid, t0 in J["mulai"].items():
    sr, x = wavfile.read(D / "suara" / f"{sid}.wav"); x = x.astype(np.float64) / 32768
    x = np.tanh(x * 2.0) / np.tanh(2.0)
    add(vox, x, t0, 1.0)
    vmask[int(t0 * SR): min(N, int((t0 + len(x) / SR) * SR))] = 1
duck = np.convolve(vmask, np.ones(int(.3 * SR)) / int(.3 * SR), "same")
mus *= (1 - .6 * duck)[:, None]; fol *= (1 - .3 * duck)[:, None]
tsec = np.arange(N) / SR
mix = mus + fol + vox
mix *= np.minimum(1, np.minimum(tsec / .3, (DUR - tsec) / 1.0))[:, None]
mix /= np.abs(mix).max() / .89
wavfile.write(D / "assets" / "mix.wav", SR, (mix * 32767).astype(np.int16))
print("assets/mix.wav", round(DUR, 2), "s")
