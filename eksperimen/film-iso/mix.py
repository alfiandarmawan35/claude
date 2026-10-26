"""Skor orisinal + foley + ambience + narasi -> out/mix.wav (48 kHz stereo). Semua disintesis numpy, tanpa sampel.
Waktu dibaca dari events.json (diekspor dari halaman) dan grid 110 BPM yang sama dengan timeline.js.
Pakai: python mix.py   (butuh numpy, scipy, soundfile atau ffmpeg; suara/*.wav dari tools/suara.py)"""
import json, subprocess
from pathlib import Path
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

D = Path(__file__).resolve().parent
SR, BPM = 48000, 110
BEAT = 60 / BPM
EV = json.loads((D / "events.json").read_text())
DUR = EV["dur"]
N = int(DUR * SR)
b = lambda n: n * BEAT
rng = np.random.default_rng(7)

mus, amb, fol, vox = (np.zeros((N, 2)) for _ in range(4))

def add(buf, x, t, g=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or i + len(x) <= 0: return
    x = x[: N - i] if i >= 0 else x[-i:]
    i = max(i, 0)
    L, R = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[i:i + len(x), 0] += x * g * L * 1.414
    buf[i:i + len(x), 1] += x * g * R * 1.414

def tt(d): return np.arange(int(d * SR)) / SR
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], "band", fs=SR, output="sos"), x)
def lp(x, f, o=2): return sosfilt(butter(o, f, "low", fs=SR, output="sos"), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, "high", fs=SR, output="sos"), x)
def midi(m): return 440 * 2 ** ((m - 69) / 12)

# ---------- instrumen ----------
def kalimba(m, d=1.4):
    t = tt(d); f = midi(m)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t * 3.2) + .35 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 14) + .12 * np.sin(2 * np.pi * f * 8.9 * t) * np.exp(-t * 26)
    return x * np.minimum(1, t / .002)
def marimba(m, d=1.0):
    t = tt(d); f = midi(m)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t * 4.5) + .3 * np.sin(2 * np.pi * f * 3.9 * t) * np.exp(-t * 12) + .08 * np.sin(2 * np.pi * f * 9.2 * t) * np.exp(-t * 30)
    return x * np.minimum(1, t / .003)
def glock(m, d=1.6):
    t = tt(d); f = midi(m)
    return (np.sin(2 * np.pi * f * t) + .45 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 3) + .2 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 6)) * np.exp(-t * 2.2) * np.minimum(1, t / .001)
def bass(m, d):
    t = tt(d); f = midi(m)
    env = np.minimum(1, t / .01) * np.exp(-t * 1.6) * np.minimum(1, (d - t) / .05)
    return (np.sin(2 * np.pi * f * t) + .45 * np.sin(4 * np.pi * f * t) + .25 * np.sin(6 * np.pi * f * t)) * env
def shaker(acc=1.0):
    x = hp(rng.standard_normal(int(.09 * SR)), 5000) * np.exp(-tt(.09) * 45); return x * .5 * acc
def woodblock(f=900):
    t = tt(.12); return (np.sin(2 * np.pi * f * t) * np.exp(-t * 50) + .3 * bp(rng.standard_normal(len(t)), 600, 2400) * np.exp(-t * 90))

# ---------- skor ----------
PENT = [60, 62, 64, 67, 69, 72, 74, 76, 79, 81]           # C pentatonik
CHORDS = [(36, [60, 64, 67]), (33, [57, 60, 64]), (29, [53, 57, 60]), (31, [55, 59, 62])]   # C Am F G per birama
TOTAL_B = int(DUR / BEAT)
fokus0, fokus1 = 27.5, 34      # ketukan: fokus Teh kosong, musik menipis; hening pendek sebelum truk
for beat in range(TOTAL_B):
    bar, pos = divmod(beat, 4); root, ch = CHORDS[bar % 4]; t = b(beat)
    sepi = fokus0 <= beat < fokus1
    akhir = beat >= 88
    if beat >= 33 and beat < 34.5: continue               # setengah birama hening
    if akhir and beat > 88: continue
    # bas: ketukan 1 dan 3; jalan perempat di bagian D
    if not sepi:
        if 54 <= beat < 76: add(mus, bass(root + [0, 4, 7, 9][pos], BEAT * .95), t, .32)
        elif pos in (0, 2): add(mus, bass(root, BEAT * 1.9), t, .3)
    # kalimba arpeggio seperdelapan
    for h in (0, 1):
        if sepi and h: continue
        note = ch[(pos * 2 + h) % 3] + 12 * (1 if (pos * 2 + h) % 4 == 3 else 0)
        add(mus, kalimba(note), t + h * BEAT / 2, (.11 if not sepi else .08), pan=-.3 + .6 * h)
    # marimba akor dari bagian B
    if 22 <= beat < 76 and not sepi and pos in (0, 2):
        for k, m in enumerate(ch): add(mus, marimba(m - 12), t + k * .012, .09, pan=.25)
    # perkusi bagian C dan D
    if 34.5 <= beat < 76:
        for h in (0, 1): add(mus, shaker(1 if h == 0 else .6), t + h * BEAT / 2, .22, pan=.4)
        if pos in (1, 3): add(mus, woodblock(), t, .18, pan=-.35)
    # akor akhir terbuka
    if beat == 88:
        for k, m in enumerate([48, 55, 60, 64, 67, 72]): add(mus, marimba(m, 4.0), t + k * .03, .12)
        add(mus, bass(36, 5.0), t, .3)
# motif kartu permintaan (4 nada) di awal dan di judul akhir
for t0 in (b(1), b(82)):
    for k, m in enumerate([76, 79, 81, 84]): add(mus, kalimba(m, 1.8), t0 + k * BEAT / 2, .2)

# ---------- foley dan isotype ----------
def whoosh(d=.35, lo=300, hi=3000):
    t = tt(d); x = rng.standard_normal(len(t)); env = np.sin(np.pi * t / d) ** 2
    return bp(x, lo, hi) * env
def thump(f=110, d=.25):
    t = tt(d); return np.sin(2 * np.pi * f * t * (1 + .5 * np.exp(-t * 30))) * np.exp(-t * 18)
def klik(): t = tt(.03); return bp(rng.standard_normal(len(t)), 2000, 6000) * np.exp(-t * 150)
def bip(): t = tt(.14); return np.sin(2 * np.pi * 1800 * t) * np.minimum(1, t / .003) * np.minimum(1, (.14 - t) / .01)
def klakson(): t = tt(.55); x = np.sin(2 * np.pi * 233 * t) + np.sin(2 * np.pi * 294 * t); return lp(np.tanh(2 * x), 2500) * np.minimum(1, t / .02) * np.minimum(1, (.55 - t) / .08) * .5
def mesin(d):
    t = tt(d); x = lp(rng.standard_normal(len(t)), 180) * 6 + .4 * np.sin(2 * np.pi * 42 * t) * (1 + .3 * np.sin(2 * np.pi * 7 * t))
    return x * np.minimum(1, t / .4) * np.minimum(1, (d - t) / .5)

for e in EV["ev"]:
    t, ty = e["t"], e["type"]
    if ty == "kertas": add(fol, bp(rng.standard_normal(int(.12 * SR)), 1500, 7000) * np.exp(-tt(.12) * 30) * .6, t, .7); add(fol, thump(160, .15), t, .3)
    elif ty == "stempel": add(fol, thump(95, .3), t, .9); add(fol, woodblock(520), t, .5)
    elif ty == "terbang": add(fol, whoosh(.32, 600, 4000), t, .25, pan=.2 * (1 if e["i"] % 2 else -1))
    elif ty == "mendarat": add(mus, kalimba(PENT[2 + e["i"]], 1.2), t, .22); add(fol, thump(180 + 20 * e["i"], .12), t, .35)
    elif ty == "potong": [add(fol, klik(), t + k * .09, .6) for k in range(3)]
    elif ty == "geser": add(fol, whoosh(.4, 200, 1800), t, .5)
    elif ty == "ikon":
        if e.get("kecil"): add(mus, kalimba(PENT[e["i"] % 10] + 12, .5), t, .07, pan=-.5 + e["i"] / 24)
        else: add(mus, glock(PENT[e["i"] + 2], .8), t, .12)
    elif ty == "truk": add(amb, mesin(e["dur"] + .6), t - .3, .28)
    elif ty == "cek": add(mus, glock(PENT[5 + EV["ev"].index(e) % 3], 1.2), t, .14)
    elif ty == "inset": add(fol, whoosh(.3, 800, 5000), t, .3)
    elif ty == "bip": add(fol, bip(), t, .25); add(fol, bip(), t + BEAT / 2, .25)
    elif ty == "mundur": add(fol, whoosh(1.6, 150, 2500), t, .35)
    elif ty == "stasiun": add(mus, kalimba(PENT[4 + e["i"]], 1.5), t, .2)
# klakson truk vendor: bunyi pertama sesudah hening pendek
add(fol, klakson(), b(34.5), .45)

# ---------- ambience: laut (bergelombang pelan), pelabuhan ----------
laut = lp(rng.standard_normal(N), 500) * (0.6 + .4 * np.sin(2 * np.pi * np.arange(N) / SR / 6.5)) * 3
w = np.ones(N)
tsec = np.arange(N) / SR
w *= np.where((tsec > 12) & (tsec < 19), .35, 1.0)      # di dalam gudang: laut lebih pelan
amb[:, 0] += laut * w * .05; amb[:, 1] += np.roll(laut, 2400) * w * .05

# ---------- narasi ----------
SUBS = {"L1": b(3), "L2": b(11), "L3": b(23.5), "L4": b(36), "L5": b(47.5), "L6": b(54.5), "L7": b(67), "L8": b(80.5)}
vmask = np.zeros(N)
for k, t0 in SUBS.items():
    sr, x = wavfile.read(D / "suara" / f"{k}.wav"); x = x.astype(np.float64) / 32768
    # kompresi ringan: rata-rata puncak
    x = np.tanh(x * 2.2) / np.tanh(2.2)
    add(vox, x, t0, .9)
    i0, i1 = int(t0 * SR), min(N, int((t0 + len(x) / SR) * SR)); vmask[i0:i1] = 1
# ducking halus
sm = int(.25 * SR); kern = np.ones(sm) / sm
duck = np.convolve(vmask, kern, "same")
mus *= (1 - .6 * duck)[:, None]   # sekitar -8 dB
amb *= (1 - .55 * duck)[:, None]  # sekitar -7 dB

mix = mus + amb + fol + vox
fade = np.minimum(1, np.minimum(tsec / .3, (DUR - tsec) / 1.5))[:, None]
mix *= fade
mix /= max(1e-9, np.abs(mix).max()) / .89
(D / "out").mkdir(exist_ok=True)
# 2 s hening di akhir: pemeriksaan durasi mux.sh tertinggal ~3 s karena lookahead loudnorm; mux memotong ke panjang gambar
mix = np.vstack([mix, np.zeros((2 * SR, 2))])
wavfile.write(D / "out" / "mix.wav", SR, (mix * 32767).astype(np.int16))
print("mix.wav", DUR, "s, puncak", round(float(np.abs(mix).max()), 3))
