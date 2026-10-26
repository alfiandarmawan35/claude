"""Audio video perkenalan PID POS (60 s): skor orisinal + efek suara + ambience + narasi -> ../master/assets/mix.wav.
Semua disintesis numpy (tanpa sampel). Waktu aksi mengikuti komposisi master dan potongan kartun/isometrik.
Pakai: python suara/mix.py   (setelah suara/suara.py)"""
import json
from pathlib import Path
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

D = Path(__file__).resolve().parent
SR, DUR, BPM = 48000, 60.0, 110
BEAT = 60 / BPM
N = int(DUR * SR)
rng = np.random.default_rng(21)
mus, fol, amb, vox = (np.zeros((N, 2)) for _ in range(4))

def add(buf, x, t, g=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or i < 0: return
    x = x[: N - i]; L, R = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[i:i + len(x), 0] += x * g * L * 1.414; buf[i:i + len(x), 1] += x * g * R * 1.414
tt = lambda d: np.arange(int(d * SR)) / SR
bp = lambda x, lo, hi: sosfilt(butter(2, [lo, hi], "band", fs=SR, output="sos"), x)
lp = lambda x, f: sosfilt(butter(2, f, "low", fs=SR, output="sos"), x)
hp = lambda x, f: sosfilt(butter(2, f, "high", fs=SR, output="sos"), x)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)

def kalimba(m, d=1.3, g=1.0):
    t = tt(d); f = hz(m)
    return g * (np.sin(2 * np.pi * f * t) * np.exp(-t * 3.2) + .35 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 14)) * np.minimum(1, t / .002)
def marimba(m, d=1.0):
    t = tt(d); f = hz(m)
    return (np.sin(2 * np.pi * f * t) * np.exp(-t * 4.5) + .3 * np.sin(2 * np.pi * f * 3.9 * t) * np.exp(-t * 12)) * np.minimum(1, t / .003)
def glock(m, d=1.4):
    t = tt(d); f = hz(m)
    return (np.sin(2 * np.pi * f * t) + .45 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 3)) * np.exp(-t * 2.4) * np.minimum(1, t / .001)
def bass(m, d):
    t = tt(d); f = hz(m)
    return (np.sin(2 * np.pi * f * t) + .45 * np.sin(4 * np.pi * f * t) + .25 * np.sin(6 * np.pi * f * t)) * np.exp(-t * 1.6) * np.minimum(1, t / .01) * np.minimum(1, (d - t) / .05)
def noise(d, lo, hi, dec=0.0):
    t = tt(d); x = bp(rng.standard_normal(len(t)), lo, hi); return x * (np.exp(-t * dec) if dec else 1)
def whoosh(d=.35, lo=300, hi=3000): t = tt(d); return noise(d, lo, hi) * np.sin(np.pi * t / d) ** 2
def thud(f=100, d=.3): t = tt(d); return np.sin(2 * np.pi * f * t * (1 + .6 * np.exp(-t * 25))) * np.exp(-t * 14)
def klik(): return noise(.03, 2000, 7000, 160)
def pop(f=900): t = tt(.08); return np.sin(2 * np.pi * f * t * (1 + .5 * np.exp(-t * 60))) * np.exp(-t * 45)
def bip(): t = tt(.12); return np.sin(2 * np.pi * 2000 * t) * np.minimum(1, t / .003) * np.minimum(1, (.12 - t) / .01)

# ---------- skor ----------
MINOR = [(45, [57, 60, 64]), (41, [53, 57, 60])]                                   # Am F (malam)
MAYOR = [(36, [60, 64, 67]), (43, [55, 59, 62]), (45, [57, 60, 64]), (41, [53, 57, 60])]   # C G Am F
for k in range(int(DUR / BEAT)):
    t = k * BEAT; bar, pos = divmod(k, 4)
    if t < 7.4:                                   # 1 malam: tipis, minor
        r, ch = MINOR[bar % 2]
        add(mus, kalimba(ch[pos % 3] + 12, 1.0), t, .09, pan=-.3 + .2 * pos)
        if pos == 0: add(mus, bass(r, 2.0), t, .22)
        continue
    if 51.3 <= t: continue                        # penutup: akor panjang di bawah
    r, ch = MAYOR[bar % 4]
    padat = 1 if t < 25.9 else (1.2 if t < 39.2 else 1.1)
    for h in (0, 1):
        add(mus, kalimba(ch[(pos * 2 + h) % 3] + 12 * (1 if (pos * 2 + h) % 4 == 3 else 0), 1.0), t + h * BEAT / 2, .1 * padat, pan=-.3 + .6 * h)
    if pos in (0, 2): add(mus, bass(r, BEAT * 1.9), t, .28)
    if t >= 19.8 and pos in (0, 2):
        for j, m in enumerate(ch): add(mus, marimba(m - 12), t + j * .012, .08, pan=.25)
    if 25.9 <= t < 46.4:                          # perkusi di bagian alur dan kasir
        for h in (0, 1): add(mus, noise(.08, 5000, 12000, 45), t + h * BEAT / 2, .1 if h else .16, pan=.4)
for j, m in enumerate([48, 55, 60, 64, 67, 72, 76]): add(mus, marimba(m, 6.0), 52.4 + j * .03, .1)
add(mus, bass(36, 6.5), 52.4, .3)
for j, m in enumerate([76, 79, 81, 84]): add(mus, kalimba(m, 2.0), 57.0 + j * BEAT / 2, .18)     # motif penutup

# ---------- efek suara ----------
# 1 kartun malam (waktu shot A dipetakan oleh WARP di kartun/src/scenes/kenalan.js)
for i in range(16): add(fol, noise(.16, 2500, 6000) * np.sin(np.pi * tt(.16) / .16), .5 + i * .24, .07)
for k in range(1, 14):
    tk = k / 4.5
    m = tk if tk < 1.6 else 1.6 + (tk - 1.6) * (2.8 / .8) if tk < 2.4 else None
    if m and m < 4.4: add(fol, noise(.05, 1500, 5000, 70), m, .16)
for i in range(6): add(fol, noise(.05, 300, 1200, 40), 4.4 + i * .1, .12)
add(fol, noise(.8, 1000, 6000, 3), 5.0, .32); add(fol, thud(70, .4), 5.0, .4)
for i in range(10): add(fol, noise(.06, 2500, 7000, 60), 5.05 + i * .08, .1, pan=-.6 + .12 * i)
for i in range(3): add(mus, glock(79 + [0, 4, 7][i], .6), 5.6 + i * .14, .08)
add(fol, whoosh(.6, 200, 2000), 7.15, .35)
# 2 pengenalan
add(fol, whoosh(.8, 400, 4000), 7.6, .3); add(fol, thud(120, .3), 8.35, .45)
for j, m in enumerate([72, 76, 79, 84]): add(mus, glock(m, 1.4), 8.4 + j * .06, .1)
add(fol, whoosh(.5, 300, 3000), 12.05, .3)
# 3 apa itu
add(fol, whoosh(.35, 300, 2500), 12.7, .2); add(fol, whoosh(.35, 300, 2500), 13.15, .2)
add(fol, pop(700), 15.95, .4); add(mus, glock(84, 1.2), 15.95, .12)
for t0 in (16.5, 17.7, 18.3): add(fol, klik(), t0, .5)
add(fol, whoosh(.25, 800, 5000), 19.45, .2)
# 4 tujuh peran
for i in range(7): add(fol, pop(700 + i * 70), 20.55 + i * .42, .32); add(mus, kalimba([72, 74, 76, 79, 81, 84, 86][i], .8), 20.55 + i * .42, .08)
add(fol, whoosh(1.0, 400, 3000), 23.7, .18); add(fol, whoosh(.5, 200, 1500), 25.4, .25)
# 5 isometrik: event film "Satu Alur" detik 5,6–30,5 dipadatkan ke 25,9–39,2
ev = json.loads((D.parent.parent / "eksperimen" / "film-iso" / "events.json").read_text())["ev"]
PENT = [60, 62, 64, 67, 69, 72, 74, 76, 79, 81]
for e in ev:
    tf = e["t"]
    if not 5.6 <= tf <= 30.5: continue
    t = 25.9 + (tf - 5.6) * 13.3 / 24.9; ty = e["type"]
    if ty == "stempel": add(fol, thud(95, .3), t, .7)
    elif ty == "terbang": add(fol, whoosh(.25, 600, 4000), t, .2)
    elif ty == "mendarat": add(mus, kalimba(PENT[2 + e["i"]], 1.0), t, .2); add(fol, thud(180 + 20 * e["i"], .12), t, .3)
    elif ty == "potong": [add(fol, klik(), t + k * .06, .5) for k in range(3)]
    elif ty == "geser": add(fol, whoosh(.3, 200, 1800), t, .4)
    elif ty == "ikon": add(mus, kalimba(PENT[e["i"] % 10] + 12, .4), t, .05 if e.get("kecil") else .09)
    elif ty == "truk": add(amb, lp(rng.standard_normal(int((e["dur"] * 13.3 / 24.9 + .4) * SR)), 180) * 5, t - .2, .22)
    elif ty == "cek": add(mus, glock(84, .8), t, .1)
# 6 kasir
for t0 in (39.85, 40.4): add(fol, bip(), t0, .2)
for t0 in (40.9, 42.1, 43.05): add(fol, klik(), t0, .6)
add(fol, pop(800), 41.5, .3)
add(fol, noise(.4, 400, 2500) * (1 + .5 * np.sin(2 * np.pi * 40 * tt(.4))), 42.2, .12)
for j, m in enumerate([79, 84]): add(mus, glock(m, 1.0), 43.15 + j * .08, .12)
add(fol, thud(160, .2), 43.85, .35)
add(fol, whoosh(.6, 300, 3000), 45.85, .3)
# 7 manfaat
for t0 in (46.65, 48.3, 49.8): add(fol, pop(600), t0, .35); add(fol, whoosh(.3, 500, 4000), t0 - .05, .15)
for i in range(8): add(mus, kalimba(PENT[i] + 12, .4), 49.85 + i * .07, .06)
# 8 pagi
add(fol, whoosh(.6, 200, 2000), 51.8, .3); add(fol, thud(110, .3), 52.9, .4); add(fol, pop(900), 53.15, .35)
for t0 in (54.6, 55.5, 56.6):
    t = tt(.35); f = 2200 - 900 * t / .35
    add(amb, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / .35) ** 2, t0, .04, pan=.5)

# ---------- ambience: laut ----------
tsec = np.arange(N) / SR
laut = lp(rng.standard_normal(N), 450) * (0.6 + .4 * np.sin(2 * np.pi * tsec / 6)) * 3
lvl = np.where(tsec < 7.6, .05, np.where((tsec > 25.9) & (tsec < 39.2), .05, np.where(tsec > 51.8, .05, .015)))
amb[:, 0] += laut * lvl; amb[:, 1] += np.roll(laut, 3000) * lvl

# ---------- narasi ----------
MULAI = {"N1": .6, "N2": 8.0, "N3": 12.6, "N4": 20.1, "N5": 26.3, "N6": 39.6, "N7": 46.7, "N8": 53.4}
vmask = np.zeros(N)
for k, t0 in MULAI.items():
    sr, x = wavfile.read(D / f"{k}.wav"); x = x.astype(np.float64) / 32768
    x = np.tanh(x * 2.2) / np.tanh(2.2)
    add(vox, x, t0, .95)
    vmask[int(t0 * SR): min(N, int((t0 + len(x) / SR) * SR))] = 1
duck = np.convolve(vmask, np.ones(int(.25 * SR)) / int(.25 * SR), "same")
mus *= (1 - .6 * duck)[:, None]; amb *= (1 - .55 * duck)[:, None]; fol *= (1 - .3 * duck)[:, None]

mix = mus + amb + fol + vox
mix *= np.minimum(1, np.minimum(tsec / .2, (DUR - tsec) / 1.2))[:, None]
mix /= np.abs(mix).max() / .89
out = D.parent / "master" / "assets" / "mix.wav"
wavfile.write(out, SR, (mix * 32767).astype(np.int16))
print(out, DUR, "s")
