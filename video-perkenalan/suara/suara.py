"""Narasi: edge-tts id-ID-GadisNeural per baris -> suara/<id>.wav (48 kHz mono, hening dipangkas) + suara/dur.json,
lalu cek ulang dengan faster-whisper (transkrip dicetak untuk dibandingkan dengan teks).
Pakai: python tools/suara.py [--cek]   (butuh edge-tts 7.3.1, faster-whisper, ffmpeg; TTS_PROXY bila lewat proxy)"""
import asyncio, json, os, subprocess, sys
from pathlib import Path
import edge_tts

D = Path(__file__).resolve().parent.parent
OUT = D / "suara"; OUT.mkdir(exist_ok=True)
LINES = json.loads((D / "suara" / "lines.json").read_text())

async def buat():
    durs = {}
    for l in LINES:
        mp3, wav = OUT / f"{l['id']}.mp3", OUT / f"{l['id']}.wav"
        if not mp3.exists():
            await edge_tts.Communicate(l["say"], "id-ID-GadisNeural", rate="+12%", proxy=os.environ.get("TTS_PROXY")).save(str(mp3))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(mp3), "-af",
                        "silenceremove=start_periods=1:start_threshold=-55dB,areverse,silenceremove=start_periods=1:start_threshold=-55dB,areverse",
                        "-ar", "48000", "-ac", "1", str(wav)], check=True)
        durs[l["id"]] = round(float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(wav)],
                                                   capture_output=True, text=True).stdout), 3)
    (OUT / "dur.json").write_text(json.dumps(durs, indent=1))
    print(durs)

def cek():
    import numpy as np
    from faster_whisper import WhisperModel
    m = WhisperModel("medium", compute_type="int8")
    for l in LINES:
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(OUT / f"{l['id']}.wav"), "-ar", "16000", "-ac", "1", "-f", "f32le", "-"], capture_output=True).stdout
        seg, _ = m.transcribe(np.concatenate([np.zeros(8000, np.float32), np.frombuffer(raw, np.float32)]), language="id")
        print(l["id"], "|", l["text"], "\n   ->", " ".join(s.text.strip() for s in seg))

asyncio.run(buat())
if "--cek" in sys.argv: cek()
