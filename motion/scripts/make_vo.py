"""Buat file suara narasi (public/vo/*.mp3) dengan Microsoft Edge TTS, lalu tulis durasinya ke src/data/vo.json.

Pakai:
    pip install edge-tts==7.3.1
    node scripts/export-narasi.mjs
    python scripts/make_vo.py [--voice id-ID-GadisNeural] [--rate +0%]

Suara Indonesia: id-ID-GadisNeural (perempuan) atau id-ID-ArdiNeural (laki-laki).
Kalimat yang tidak berubah tidak dibuat ulang. Butuh ffprobe (ffmpeg) untuk membaca durasi.
"""
import argparse
import asyncio
import hashlib
import json
import os
import subprocess
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
VO_DIR = ROOT / "public" / "vo"


def durasi(p: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)],
        capture_output=True, text=True, check=True,
    ).stdout.strip()
    return round(float(out), 3)


async def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", default="id-ID-GadisNeural")
    ap.add_argument("--rate", default="+5%")
    ap.add_argument("--proxy", default=os.environ.get("TTS_PROXY"))
    a = ap.parse_args()

    narasi = json.loads((VO_DIR / "narasi.json").read_text(encoding="utf-8"))
    hash_file = VO_DIR / "_hash.json"
    hashes = json.loads(hash_file.read_text()) if hash_file.exists() else {}
    durs = {}
    for i, n in enumerate(narasi, 1):
        mp3 = VO_DIR / f"{n['key']}.mp3"
        mp3.parent.mkdir(parents=True, exist_ok=True)
        h = hashlib.sha1(f"{a.voice}|{a.rate}|{n['say']}".encode()).hexdigest()
        if not (mp3.exists() and hashes.get(n["key"]) == h):
            print(f"[{i}/{len(narasi)}] {n['key']}: {n['say']}")
            await edge_tts.Communicate(n["say"], a.voice, rate=a.rate, proxy=a.proxy).save(str(mp3))
            hashes[n["key"]] = h
        durs[n["key"]] = durasi(mp3)
    hash_file.write_text(json.dumps(hashes, indent=1, sort_keys=True) + "\n")
    (ROOT / "src" / "data" / "vo.json").write_text(json.dumps(durs, indent=1) + "\n")
    print(f"{len(durs)} file suara, total {sum(durs.values()) / 60:.1f} menit")


asyncio.run(main())
