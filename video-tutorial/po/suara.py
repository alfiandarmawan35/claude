"""Narasi tutorial PO: edge-tts id-ID-ArdiNeural per adegan -> suara/<id>.wav, lalu faster-whisper memberi waktu tiap kata
-> suara/waktu.json {id: {"dur": detik, "kata": [[kata, mulai, selesai], ...]}}. Pakai: python suara.py
(butuh edge-tts, faster-whisper, ffmpeg; TTS_PROXY bila lewat proxy)"""
import asyncio, json, os, subprocess
from pathlib import Path
import numpy as np
import edge_tts
from faster_whisper import WhisperModel

D = Path(__file__).resolve().parent
OUT = D / "suara"; OUT.mkdir(exist_ok=True)
ADEGAN = json.loads((D / "adegan.json").read_text())["adegan"]
# pengucapan: singkatan dibaca huruf per huruf oleh TTS bila ditulis seperti ini
# (diuji dengan whisper: "Approve" terbaca "aprofe", "draft SAP" terbaca "test HP", "Qty" dieja)
UCAP = [(r"\bApprove\b", "Aprouv"), (r"\b[Dd]raft SAP\b", "draft S A P"), (r"\b[Qq]ty\b", "kuantiti"),
        (r"\bGRPO\b", "G R P O"), (r"\bPUR\b", "P U R"), (r"\bPO\b", "P O"), (r"\bDC\b", "D C"), (r"\bSAP\b", "sap")]

def ucap(t):
    import re
    for pola, ganti in UCAP:
        t = re.sub(pola, ganti, t)
    return t

async def buat():
    for a in ADEGAN:
        mp3, wav = OUT / f"{a['id']}.mp3", OUT / f"{a['id']}.wav"
        if not mp3.exists():
            await edge_tts.Communicate(ucap(a["say"]), "id-ID-ArdiNeural", rate="+0%", proxy=os.environ.get("TTS_PROXY")).save(str(mp3))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(mp3), "-af",
                        "silenceremove=start_periods=1:start_threshold=-55dB,areverse,silenceremove=start_periods=1:start_threshold=-55dB,areverse",
                        "-ar", "48000", "-ac", "1", str(wav)], check=True)

asyncio.run(buat())
m = WhisperModel("medium", compute_type="int8")
hasil = {}
for a in ADEGAN:
    wav = OUT / f"{a['id']}.wav"
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(wav), "-ar", "16000", "-ac", "1", "-f", "f32le", "-"], capture_output=True).stdout
    x = np.frombuffer(raw, np.float32)
    seg, _ = m.transcribe(np.concatenate([np.zeros(8000, np.float32), x]), language="id", word_timestamps=True, initial_prompt=a["say"])
    kata = [[w.word.strip(), round(max(0, w.start - 0.5), 2), round(max(0, w.end - 0.5), 2)] for s in seg for w in s.words]
    hasil[a["id"]] = {"dur": round(len(x) / 16000, 3), "kata": kata}
    print(a["id"], hasil[a["id"]]["dur"], "|", " ".join(k[0] for k in kata))
(OUT / "waktu.json").write_text(json.dumps(hasil, ensure_ascii=False, indent=1))
