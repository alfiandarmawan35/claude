"""Musik latar (backsound) untuk video perkenalan dan episode tutorial: tenang, 100 BPM, 16 bar,
bisa diulang tanpa sambungan terdengar. Disintesis dari nol (bebas royalti).

Pakai: pip install numpy scipy && python scripts/make_bed.py  ->  public/music/bed.wav
"""
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 44100
BPM = 100
BEAT = 60 / BPM
BARS = 16
LOOP = int(round(BARS * 4 * BEAT * SR))
TAIL = 4 * SR
rng = np.random.default_rng(11)
buf = np.zeros((LOOP + TAIL, 2))


def t(sec):
    return np.arange(int(sec * SR)) / SR


def lp(x, hz):
    return sosfilt(butter(2, hz, "low", fs=SR, output="sos"), x)


def hp(x, hz):
    return sosfilt(butter(2, hz, "high", fs=SR, output="sos"), x)


def note(n):
    return 440 * 2 ** ((n - 69) / 12)


def add(sig, beat, gain=1.0, pan=0.0):
    i = int(round(beat * BEAT * SR))
    s = sig[: len(buf) - i] * gain
    buf[i : i + len(s), 0] += s * np.sqrt(0.5 * (1 - pan))
    buf[i : i + len(s), 1] += s * np.sqrt(0.5 * (1 + pan))


def pad(notes, beats):
    dur = beats * BEAT + 1.5
    tt = t(dur)
    x = sum(
        (2 * ((tt * note(n) * d) % 1) - 1) for n in notes for d in (0.996, 1.0, 1.004)
    )
    env = np.minimum(1, tt / 1.2) * np.clip((dur - tt) / 1.5, 0, 1)
    return lp(x, 900) * env * 0.035


def keys(n, dur=1.4):
    # bunyi seperti piano listrik: sinus dengan harmoni yang cepat meredup
    tt = t(dur)
    f = note(n)
    x = np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * 2 * f * tt) * np.exp(-tt * 6)
    x += 0.15 * np.sin(2 * np.pi * 3 * f * tt) * np.exp(-tt * 10)
    return x * np.exp(-tt * 2.6) * np.minimum(1, tt * 400) * 0.16


def sub(n, beats):
    tt = t(beats * BEAT)
    env = np.minimum(1, tt * 60) * np.exp(-tt * 0.8)
    return np.sin(2 * np.pi * note(n) * tt) * env * 0.22


def kick():
    tt = t(0.35)
    f = 45 + 70 * np.exp(-tt * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9) * 0.35


def shaker():
    tt = t(0.07)
    return hp(rng.standard_normal(len(tt)), 6000) * np.exp(-tt * 60) * 0.06


# Cmaj7 - Am7 - Fmaj7 - G6, masing-masing 2 bar
CHORDS = [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 64]]
ROOTS = [36, 33, 41, 43]
ARP = [0, 2, 1, 3, 2, 1, 3, 2]

for bar in range(BARS):
    c = (bar // 2) % 4
    b0 = bar * 4
    if bar % 2 == 0:
        add(pad(CHORDS[c], 8), b0, 1.0)
        add(sub(ROOTS[c], 4), b0, 1.0)
        add(sub(ROOTS[c], 4), b0 + 4, 0.8)
    for k in range(8):
        n = CHORDS[c][ARP[k]] + 12
        add(keys(n), b0 + k * 0.5, 0.9 if k % 2 == 0 else 0.6, -0.35 if k % 2 else 0.35)
    # ketukan lembut hanya di separuh kedua lingkaran, supaya ada naik-turun
    if bar >= 4:
        add(kick(), b0, 1.0)
        add(kick(), b0 + 2, 0.8)
        for k in range(8):
            add(shaker(), b0 + k * 0.5 + 0.25, 1.0 if k % 2 else 0.6, 0.4)

# Ekor yang melewati akhir lingkaran dipindah ke awal, jadi pengulangannya mulus.
out = buf[:LOOP].copy()
out[:TAIL] += buf[LOOP:]

# gema ringan
for d, g in ((0.11, 0.22), (0.23, 0.14), (0.37, 0.08)):
    k = int(d * SR)
    out += np.roll(out, k, axis=0)[:, ::-1] * g

out = np.tanh(out * 1.2)
out /= np.max(np.abs(out)) / 0.7
p = Path(__file__).resolve().parent.parent / "public" / "music" / "bed.wav"
p.parent.mkdir(parents=True, exist_ok=True)
wavfile.write(p, SR, (out * 32767).astype(np.int16))
print(f"{p} {len(out) / SR:.2f} detik (lingkaran)")
