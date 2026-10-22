"""Musik orisinal showreel "SATU ALUR": 124 BPM, 124 ketukan = 60 detik, dengan efek suara yang jatuh tepat di ketukan.

Semua bunyi disintesis dari nol (tanpa sampel), jadi bebas royalti.
Pakai: pip install numpy scipy && python scripts/make_music.py  ->  public/music/showreel.wav
Peta babak (dalam ketukan) harus sama dengan src/showreel/beats.ts.
"""
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 44100
BPM = 124
BEAT = 60 / BPM
TOTAL_BEATS = 124
N = int(SR * TOTAL_BEATS * BEAT) + SR  # tambah 1 detik ekor
rng = np.random.default_rng(7)

# Babak (ketukan awal)
PERCIKAN, KATA, LAUT, ALUR, LAYAR, KASIR, TEMBOK, LOGO = 0, 8, 20, 36, 56, 76, 92, 104

L = np.zeros(N)
R = np.zeros(N)


def at(beat: float) -> int:
    return int(round(beat * BEAT * SR))


def add(sig: np.ndarray, beat: float, gain=1.0, pan=0.0):
    i = at(beat)
    if i >= N:
        return
    s = sig[: N - i] * gain
    L[i : i + len(s)] += s * np.sqrt(0.5 * (1 - pan))
    R[i : i + len(s)] += s * np.sqrt(0.5 * (1 + pan))


def t(sec):
    return np.arange(int(sec * SR)) / SR


def lp(x, hz, order=2):
    return sosfilt(butter(order, hz, "low", fs=SR, output="sos"), x)


def hp(x, hz, order=2):
    return sosfilt(butter(order, hz, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi):
    return sosfilt(butter(2, [lo, hi], "band", fs=SR, output="sos"), x)


def note(n):  # MIDI -> Hz
    return 440 * 2 ** ((n - 69) / 12)


def saw(f, tt):
    return 2 * ((tt * f) % 1) - 1


# ---------- instrumen ----------
def kick(big=False):
    tt = t(0.6 if big else 0.4)
    f = 45 + 110 * np.exp(-tt * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    env = np.exp(-tt * (5 if big else 8))
    click = np.exp(-tt * 300) * rng.standard_normal(len(tt)) * 0.3
    return np.tanh(1.6 * (np.sin(ph) * env + click))


def clap():
    tt = t(0.25)
    n = rng.standard_normal(len(tt))
    env = np.exp(-tt * 22) + 0.5 * np.exp(-((tt - 0.012) % 0.011) * 400) * (tt < 0.035)
    return bp(n, 900, 4000) * env * 1.4


def hat(open_=False):
    tt = t(0.25 if open_ else 0.05)
    return hp(rng.standard_normal(len(tt)), 7000) * np.exp(-tt * (14 if open_ else 70)) * 0.5


def bass(n, dur):
    tt = t(dur)
    f = note(n)
    x = saw(f, tt) + 0.5 * np.sin(2 * np.pi * f / 2 * tt)
    env = np.minimum(1, tt * 200) * np.exp(-tt * 3)
    return lp(x, 380) * env * 0.9


def pad(notes, dur):
    tt = t(dur)
    x = sum(saw(note(n) * d, tt) for n in notes for d in (0.997, 1.003))
    env = np.minimum(1, tt / 0.4) * np.minimum(1, (dur - tt) / 0.3)
    return lp(x, 1400) * env * 0.07


def pluck(n, dur=0.18):
    tt = t(dur)
    x = np.sign(np.sin(2 * np.pi * note(n) * tt)) * 0.6 + saw(note(n), tt) * 0.4
    return lp(x, 3200) * np.exp(-tt * 18) * 0.22


def stab(notes):
    tt = t(0.35)
    x = sum(saw(note(n) * d, tt) for n in notes for d in (0.995, 1.005))
    return lp(x, 2600) * np.exp(-tt * 9) * 0.12


def riser(beats):
    tt = t(beats * BEAT)
    k = tt / tt[-1]
    n = hp(rng.standard_normal(len(tt)), 800) * k**2 * 0.35
    s = np.sin(2 * np.pi * np.cumsum(200 + 1600 * k**2) / SR) * k**3 * 0.12
    return n + s


def impact():
    tt = t(2.2)
    boom = np.sin(2 * np.pi * np.cumsum(30 + 60 * np.exp(-tt * 6)) / SR) * np.exp(-tt * 1.6)
    noise = lp(rng.standard_normal(len(tt)), 3000) * np.exp(-tt * 5) * 0.5
    return np.tanh(1.5 * (boom + noise)) * 0.9


def whoosh(sec=0.5):
    tt = t(sec)
    env = np.sin(np.pi * tt / sec) ** 2
    return bp(rng.standard_normal(len(tt)), 400, 6000) * env * 0.45


def beep():
    tt = t(0.09)
    return np.sin(2 * np.pi * 1850 * tt) * (tt < 0.08) * 0.25


def ting():
    tt = t(1.2)
    return (np.sin(2 * np.pi * 1318 * tt) + 0.6 * np.sin(2 * np.pi * 1976 * tt)) * np.exp(-tt * 5) * 0.18


def printer(sec):
    tt = t(sec)
    buzz = np.sign(np.sin(2 * np.pi * 95 * tt)) * 0.5 + rng.standard_normal(len(tt)) * 0.3
    return bp(buzz, 300, 3000) * (0.6 + 0.4 * np.sin(2 * np.pi * 18 * tt)) * 0.18


def click():
    tt = t(0.03)
    return hp(rng.standard_normal(len(tt)), 2000) * np.exp(-tt * 200) * 0.35


# ---------- aransemen ----------
# Am - F - C - G, satu akor per bar
CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
ROOTS = [45, 41, 48, 43]


def chord_at(b):
    return int(b // 4) % 4


kick_beats = []

# 1. Percikan: dentum, pad pelan, riser
add(impact(), 0, 0.9)
add(pad(CHORDS[0], 8 * BEAT), 0, 0.8)
add(riser(4), 4, 0.8)

# 2..7: groove utama
for b in range(KATA, TEMBOK + 11):
    sec = b
    if b == LOGO - 1:
        continue  # ketukan hening
    big = b in (KATA, LAUT, LAYAR, KASIR)
    kick_beats.append(b)
    add(kick(big), b, 0.95 if big else 0.8)
    if b >= LAUT and b % 2 == 1:
        add(clap(), b, 0.55, 0.1)
    if b >= LAUT:
        add(hat(), b + 0.5, 0.5, 0.3)
        if b >= LAYAR:
            add(hat(), b + 0.25, 0.25, -0.3)
            add(hat(), b + 0.75, 0.25, -0.3)
    # bas: delapanan
    if b >= LAUT:
        r = ROOTS[chord_at(b - KATA)]
        for h in (0, 0.5):
            add(bass(r - 12 + (12 if h else 0) * (b >= LAYAR), BEAT * 0.45), b + h, 0.7)
    # pad per bar
    if (b - KATA) % 4 == 0:
        add(pad(CHORDS[chord_at(b - KATA)], 4 * BEAT), b, 1.0 if b < LAYAR else 0.7)
    # arpeggio enambelasan di Alur dan Layar
    if ALUR <= b < KASIR:
        ch = CHORDS[chord_at(b - KATA)]
        for k in range(4):
            add(pluck(ch[k % 3] + 12 + (12 if k == 3 else 0)), b + k / 4, 0.9 if b >= LAYAR else 0.6, 0.4 if k % 2 else -0.4)
    # stab akor di Layar dan Kasir
    if b >= LAYAR and b % 2 == 0:
        add(stab([n + 12 for n in CHORDS[chord_at(b - KATA)]]), b + 0.5, 0.8)

# Ledakan kata: hentakan tiap kata
for b in (8, 10, 12, 14, 16):
    add(whoosh(0.25), b - 0.25, 0.6)
add(riser(2), 18, 0.7)

# Laut: whoosh masuk, riser menuju Alur
add(whoosh(0.6), LAUT - 0.5, 0.7)
add(riser(4), ALUR - 4, 0.6)

# Alur: klik tiap simpul, ting untuk dokumen SAP
for b in (37, 39, 41, 43, 44, 46, 48, 50, 52):
    add(click(), b, 1.0)
for b in (39, 43, 44, 46, 48, 52):
    add(ting(), b + 0.5, 0.8)
add(riser(4), LAYAR - 4, 0.7)
add(whoosh(0.5), LAYAR - 0.4, 0.8)

# Layar: kartu mendarat
for b in (56, 58, 60, 62):
    add(whoosh(0.3), b - 0.3, 0.5)
for b in range(64, 70):
    add(click(), b, 0.7)
add(riser(2), KASIR - 2, 0.6)
add(whoosh(0.4), KASIR - 0.35, 0.9)

# Kasir: bunyi scan tiap ketukan, F12, ting bayar, printer struk
for b in range(77, 84):
    add(beep(), b, 1.0)
add(impact(), 84, 0.5)
add(ting(), 86, 1.0)
add(printer(3.5 * BEAT), 88, 1.0)
add(whoosh(0.5), TEMBOK - 0.4, 0.8)

# Tembok kata: riser panjang lalu hening satu ketukan
add(riser(10), 93, 0.7)

# Logo: hantaman besar, pad panjang, ting penutup
add(impact(), LOGO, 1.1)
add(kick(True), LOGO, 1.0)
add(pad(CHORDS[0], 8 * BEAT), LOGO, 1.2)
add(pad([n + 12 for n in CHORDS[1]], 4 * BEAT), LOGO + 8, 0.8)
add(pad([n + 12 for n in CHORDS[0]], 8 * BEAT), LOGO + 12, 0.9)
add(ting(), 112, 0.8)
for b in range(LOGO + 1, LOGO + 12):
    if b % 2 == 0:
        add(hat(True), b, 0.25)

# ---------- master ----------
# sidechain sederhana: redam pad/bas setelah kick (diterapkan ke seluruh campuran, ringan)
duck = np.ones(N)
for b in kick_beats:
    i = at(b)
    n = min(int(0.22 * SR), N - i)
    duck[i : i + n] *= 1 - 0.35 * np.exp(-np.arange(n) / SR * 14)
mix = np.stack([L, R], 1) * duck[:, None]

# gema pendek
for d, g in ((0.031, 0.25), (0.047, 0.18), (0.089, 0.12)):
    k = int(d * SR)
    mix[k:] += mix[:-k][:, ::-1] * g * 0.5

# akhiri pelan di 2 ketukan terakhir
end = at(TOTAL_BEATS)
fade0 = at(TOTAL_BEATS - 3)
mix[fade0:end] *= np.linspace(1, 0, end - fade0)[:, None] ** 1.5
mix = mix[:end]
mix = np.tanh(mix * 1.1)
mix /= np.max(np.abs(mix)) / 0.72

out = Path(__file__).resolve().parent.parent / "public" / "music" / "showreel.wav"
out.parent.mkdir(parents=True, exist_ok=True)
wavfile.write(out, SR, (mix * 32767).astype(np.int16))
print(f"{out} {len(mix) / SR:.2f} detik")
