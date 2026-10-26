#!/bin/sh
# Bangun ulang film: suara -> event -> mix -> render -> mux. LIB = folder Lemo-Opuscar (untuk alat render).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
: "${LIB:?set LIB ke folder Lemo-Opuscar}"
PY=${PY:-python3}
$PY "$HERE/tools/suara.py" --cek                                        # narasi edge-tts + cek whisper
(cd "$LIB" && node core/render/events.mjs "$HERE")                       # event suara dari halaman
$PY "$HERE/mix.py"                                                       # skor + foley + ambience + narasi
(cd "$LIB" && node core/render/video.mjs "$HERE" --fps 24 --workers 2 --out "$HERE/out/video.mp4")
sh "$HERE/tools/mux.sh" "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/out/PID_POS_Satu_Alur_Isometrik.mp4"
