"""Suara untuk "Malam Panjang di Toko Kapal": musik 120 BPM (sama dengan PROJECT.bpm) + foley per aksi + ambience.
Semua disintesis numpy (orisinal, tanpa sampel). Waktu aksi mengikuti src/scenes/toko.js.
Pakai: python suara.py  -> out/suara.wav"""
from pathlib import Path
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

D = Path(__file__).resolve().parent
SR, DUR, BEAT = 48000, 18.0, .5
N = int(DUR * SR)
rng = np.random.default_rng(11)
mus, fol, amb = (np.zeros((N, 2)) for _ in range(3))

def add(buf, x, t, g=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N: return
    x = x[: N - i]; L, R = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[i:i + len(x), 0] += x * g * L * 1.414; buf[i:i + len(x), 1] += x * g * R * 1.414
tt = lambda d: np.arange(int(d * SR)) / SR
bp = lambda x, lo, hi: sosfilt(butter(2, [lo, hi], "band", fs=SR, output="sos"), x)
lp = lambda x, f: sosfilt(butter(2, f, "low", fs=SR, output="sos"), x)
hp = lambda x, f: sosfilt(butter(2, f, "high", fs=SR, output="sos"), x)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)

def pluk(m, d=1.0, br=1.0):   # petikan lembut ala ukulele/kalimba
    t = tt(d); f = hz(m)
    return (np.sin(2 * np.pi * f * t) + .4 * br * np.sin(4 * np.pi * f * t) * np.exp(-t * 6) + .2 * br * np.sin(6 * np.pi * f * t) * np.exp(-t * 10)) * np.exp(-t * 3.5) * np.minimum(1, t / .003)
def glock(m, d=1.4):
    t = tt(d); f = hz(m)
    return (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 4)) * np.exp(-t * 2.5) * np.minimum(1, t / .001)
def bas(m, d):
    t = tt(d); f = hz(m)
    return (np.sin(2 * np.pi * f * t) + .4 * np.sin(4 * np.pi * f * t)) * np.exp(-t * 2) * np.minimum(1, t / .01) * np.minimum(1, (d - t) / .04)
def noise(d, lo, hi, dec=0.0):
    t = tt(d); x = bp(rng.standard_normal(len(t)), lo, hi)
    return x * (np.exp(-t * dec) if dec else 1)
def whoosh(d, lo=300, hi=3000): t = tt(d); return noise(d, lo, hi) * np.sin(np.pi * t / d) ** 2
def thud(f=90, d=.3): t = tt(d); return np.sin(2 * np.pi * f * t * (1 + .6 * np.exp(-t * 25))) * np.exp(-t * 14)
def klik(): return noise(.03, 2000, 7000, 160)
def bip(): t = tt(.12); return np.sin(2 * np.pi * 2000 * t) * np.minimum(1, t / .003) * np.minimum(1, (.12 - t) / .01)

# ---------- musik ----------
# A (0–4.6) malam, minor, pelan; B (4.6–9.2) tegang lalu terang saat ide; C (9.2–14.2) riang; D (14.2–18) pagi, akor terbuka
for k in range(int(DUR / BEAT)):
    t = k * BEAT; bar, pos = divmod(k, 4)
    if t < 4.6:
        prog = [(45, [57, 60, 64]), (41, [53, 57, 60])][bar % 2]                 # Am F
        add(mus, pluk(prog[1][pos % 3] + 12, .9, .6), t, .1, pan=-.3)
        if pos == 0: add(mus, bas(prog[0], 2), t, .25)
    elif t < 7.2:
        if pos in (0, 2): add(mus, pluk(57 + (2 if bar % 2 else 0) + 12, .5, .5), t, .07)
        if t > 5.9 and t < 6.6: continue
    elif t < 14.0:
        prog = [(36, [60, 64, 67]), (43, [55, 59, 62]), (45, [57, 60, 64]), (41, [53, 57, 60])][bar % 4]   # C G Am F
        for h in (0, 1): add(mus, pluk(prog[1][(pos * 2 + h) % 3] + 12, .7), t + h * BEAT / 2, .11, pan=-.25 + .5 * h)
        if pos in (0, 2): add(mus, bas(prog[0], .95), t, .28)
        add(mus, noise(.06, 5000, 12000, 50), t + BEAT / 2, .12, pan=.4)   # shaker di ketukan lemah
    elif t < 17.0 and pos == 0 and bar % 2 == 0:
        for j, m in enumerate([48, 55, 60, 64, 67, 72]): add(mus, pluk(m, 3.0, .7), t + j * .04, .1)
        add(mus, bas(36, 3.5), t, .25)

# ---------- foley (waktu dari toko.js) ----------
for i in range(10):                                   # A: pensil menulis
    add(fol, noise(.16, 2500, 6000) * np.sin(np.pi * tt(.16) / .16), .5 + i * .2, .08)
for k in range(1, 13):                                # nota baru jatuh di tumpukan
    tk = k / 4.5
    if tk < 3.0: add(fol, noise(.05, 1500, 5000, 70), tk, .18)
for i in range(6): add(fol, noise(.05, 300, 1200, 40), 2.4 + i * .1, .12)   # tumpukan berderit
add(fol, noise(.8, 1000, 6000, 3) , 3.0, .35); add(fol, thud(70, .4), 3.0, .4)   # runtuh
for i in range(10): add(fol, noise(.06, 2500, 7000, 60), 3.05 + i * .07 + .03 * (i % 3), .12, pan=-.6 + .12 * i)
for i in range(3): add(mus, glock(79 + [0, 4, 7][i], .6), 3.4 + i * .12, .09)   # pusing: bintang
add(fol, whoosh(.6, 200, 2000), 4.3, .35)                                         # brush wipe
add(fol, noise(.65, 150, 900) * np.minimum(1, tt(.65) / .1), 4.9, .3); add(fol, thud(110, .3), 5.55, .5)   # peti meluncur, berhenti
add(fol, thud(140, .2), 6.55, .5); add(fol, whoosh(.5, 800, 5000), 6.55, .25)      # tutup terlempar
for i, m in enumerate([72, 76, 79, 84]): add(mus, glock(m, 1.2), 6.6 + i * .08, .12)   # cahaya tablet
add(mus, glock(91, 1.0), 7.25, .12)                                               # ide (lampu)
add(fol, klik(), 8.15, .5)                                                        # scanner tertangkap
add(fol, whoosh(.4, 300, 4000), 8.9, .35); add(fol, whoosh(.35, 300, 4000), 9.2, .3)   # whip pan
add(fol, noise(.05, 800, 3000, 60), 10.15, .3)                                    # botol di meja
for t0 in (10.5, 13.25): add(fol, bip(), t0, .22)                                # bip scan
for t0, d in ((11.15, .6), (13.65, .35)): add(fol, noise(d, 400, 2500) * (1 + .5 * np.sin(2 * np.pi * 40 * tt(d))), t0, .12)   # printer
add(fol, noise(.12, 2000, 6000, 20), 11.75, .2)                                   # struk disobek
for i, m in enumerate([76, 79, 84]): add(mus, glock(m, .8), 12.15 + i * .07, .1)   # penumpang jatuh hati
for i in range(5): add(fol, noise(.05, 200, 900, 50), 12.6 + i * .2, .12)          # langkah
add(fol, noise(.05, 800, 3000, 60), 13.25, .25)
add(fol, whoosh(.5, 400, 3000), 13.65, .25)                                       # iris ke jendela
add(fol, whoosh(.6, 400, 3000), 14.2, .2)                                         # iris dari jendela
# ---------- ambience: laut malam, lalu pagi dengan camar ----------
tsec = np.arange(N) / SR
laut = lp(rng.standard_normal(N), 400) * (0.6 + .4 * np.sin(2 * np.pi * tsec / 5.5)) * 3
amb[:, 0] += laut * .04; amb[:, 1] += np.roll(laut, 3000) * .04
for t0 in (14.9, 15.7, 16.6):                                                     # camar
    t = tt(.35); f = 2200 - 900 * t / .35
    add(amb, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / .35) ** 2, t0, .05, pan=.5)

mix = mus + fol + amb
mix *= np.minimum(1, np.minimum(tsec / .2, (DUR - tsec) / 1.0))[:, None]
mix /= np.abs(mix).max() / .89
(D / "out").mkdir(exist_ok=True)
wavfile.write(D / "out" / "suara.wav", SR, (mix * 32767).astype(np.int16))
print("suara.wav", DUR, "s")
