"""Periksa pembacaan narasi: transkripsi setiap file public/vo/*.mp3 dengan Whisper, lalu bandingkan dengan naskahnya.
Kalimat dengan kata yang berbeda dicetak, paling banyak selisih di atas. Hasil lengkap: public/vo/_cek.json

Pakai: pip install faster-whisper==1.2.1 && python scripts/cek_vo.py [--model medium]
Catatan: Whisper juga bisa salah dengar (mis. "dek" ditulis "deck"); periksa daftar ini dengan telinga.
"""
import argparse
import json
import re
import subprocess
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parent.parent
VO = ROOT / "public" / "vo"


def norm(t):
    t = t.lower().replace("-nya", "nya").replace("-", " ")
    return re.sub(r"[^\w\s]", " ", t).split()


def selisih(a, b):
    r, h = norm(a), norm(b)
    d = np.zeros((len(r) + 1, len(h) + 1), int)
    d[:, 0] = range(len(r) + 1)
    d[0, :] = range(len(h) + 1)
    for i in range(1, len(r) + 1):
        for j in range(1, len(h) + 1):
            d[i, j] = min(d[i - 1, j] + 1, d[i, j - 1] + 1, d[i - 1, j - 1] + (r[i - 1] != h[j - 1]))
    return int(d[-1, -1]), len(r)


def load(p):
    raw = subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-i", str(p), "-f", "s16le", "-ac", "1", "-ar", "16000", "-"],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768


ap = argparse.ArgumentParser()
ap.add_argument("--model", default="medium")
ap.add_argument("--cari", default="", help="hanya kalimat yang naskahnya cocok dengan regex ini")
a = ap.parse_args()
m = WhisperModel(a.model, device="cpu", compute_type="int8", cpu_threads=4)
hasil = []
E_ = N_ = 0
for n in json.loads((VO / "narasi.json").read_text(encoding="utf-8")):
    if a.cari and not re.search(a.cari, n["text"]):
        continue
    seg, _ = m.transcribe(load(VO / f"{n['key']}.mp3"), language="id", beam_size=5)
    dengar = " ".join(s.text.strip() for s in seg)
    e, k = selisih(n["text"], dengar)
    E_ += e
    N_ += k
    hasil.append({"key": n["key"], "salah": e, "naskah": n["text"], "terdengar": dengar})
hasil.sort(key=lambda x: -x["salah"])
(VO / "_cek.json").write_text(json.dumps(hasil, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(f"Total: {E_} dari {N_} kata berbeda ({E_ / N_ * 100:.1f}%)")
for h in hasil:
    if h["salah"]:
        print(f"[{h['salah']}] {h['key']}\n   naskah   : {h['naskah']}\n   terdengar: {h['terdengar']}")
