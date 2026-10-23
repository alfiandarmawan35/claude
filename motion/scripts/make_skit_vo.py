"""Suara skit: satu file per kalimat dengan suara tokohnya, plus waktu tiap kata (untuk takarir) dan
keras-lemah suara per frame (untuk gerak mulut). Hasil: public/skit/*.mp3 dan src/skit/skit_vo.json

Pakai: pip install edge-tts==7.3.1 numpy && node scripts/export-skit.mjs && python scripts/make_skit_vo.py
"""
import argparse, asyncio, hashlib, json, os, re, subprocess
from pathlib import Path

import edge_tts
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
DIR = ROOT / "public" / "skit"
FPS = 30


def load(p):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(p), "-f", "s16le", "-ac", "1", "-ar", "16000", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768


def amp_per_frame(x):
    n = 16000 // FPS
    k = len(x) // n
    r = np.sqrt((x[: k * n].reshape(k, n) ** 2).mean(1))
    r = r / (np.percentile(r, 95) + 1e-6)
    return [round(float(min(1.0, v)), 2) for v in r]


def align(text, say, bounds):
    """Waktu untuk setiap kata takarir, dipetakan dari kata yang diucapkan lewat posisi relatif dalam kalimat."""
    words = text.split()
    if not bounds:
        return [{"w": w, "s": 0.0, "e": 0.0} for w in words]
    pos_t, c = [], 0
    for w in words:
        pos_t.append((c + len(w) / 2) / max(1, len(text)))
        c += len(w) + 1
    pos_s, c = [], 0
    for b in bounds:
        i = say.find(b["text"], c)
        if i < 0:
            i = c
        pos_s.append((i + len(b["text"]) / 2) / max(1, len(say)))
        c = i + len(b["text"])
    out = []
    for w, p in zip(words, pos_t):
        j = int(np.argmin([abs(p - q) for q in pos_s]))
        out.append({"w": w, "s": bounds[j]["s"], "e": bounds[j]["e"]})
    for k in range(1, len(out)):  # jaga urutan waktu
        out[k]["s"] = max(out[k]["s"], out[k - 1]["s"])
    return out


async def synth(item, mp3, proxy, rate):
    bounds = []
    comm = edge_tts.Communicate(item["say"], item["voice"], rate=rate, proxy=proxy, boundary="WordBoundary")
    with open(mp3, "wb") as f:
        async for ch in comm.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                bounds.append({"text": ch["text"], "s": ch["offset"] / 1e7, "e": (ch["offset"] + ch["duration"]) / 1e7})
    return bounds


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--rate", default="+8%")
    a = ap.parse_args()
    proxy = os.environ.get("TTS_PROXY")
    items = json.loads((DIR / "lines.json").read_text(encoding="utf-8"))
    cache_f = DIR / "_cache.json"
    cache = json.loads(cache_f.read_text()) if cache_f.exists() else {}
    out = {}
    for it in items:
        mp3 = DIR / f"{it['key']}.mp3"
        mp3.parent.mkdir(parents=True, exist_ok=True)
        h = hashlib.sha1(f"{it['voice']}|{a.rate}|{it['say']}".encode()).hexdigest()
        c = cache.get(it["key"])
        if not (mp3.exists() and c and c["h"] == h):
            for _ in range(4):
                try:
                    bounds = await synth(it, mp3, proxy, a.rate)
                    break
                except Exception as ex:  # koneksi kadang putus; ulangi
                    print("ulang", it["key"], type(ex).__name__)
                    await asyncio.sleep(3)
            c = {"h": h, "bounds": bounds}
            cache[it["key"]] = c
            print(it["key"], it["say"])
        x = load(mp3)
        out[it["key"]] = {"dur": round(len(x) / 16000, 3), "words": align(it["text"], it["say"], c["bounds"]), "amp": amp_per_frame(x)}
    cache_f.write_text(json.dumps(cache, ensure_ascii=False) + "\n")
    (ROOT / "src" / "skit" / "skit_vo.json").write_text(json.dumps(out, ensure_ascii=False) + "\n")
    print(f"{len(out)} kalimat, total {sum(v['dur'] for v in out.values()):.1f} detik")


asyncio.run(main())
