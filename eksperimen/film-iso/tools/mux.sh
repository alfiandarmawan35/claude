#!/bin/sh
# Gabung gambar + mix, loudnorm dua tahap ke -14 LUFS / TP -1.2 dB (setara core/render/mux.sh Lemo-Opuscar, tanpa grain).
# Pakai: sh tools/mux.sh out/video.mp4 out/mix.wav out/film.mp4
set -e
V=$1; A=$2; O=$3
J=$(ffmpeg -hide_banner -nostats -i "$A" -af loudnorm=I=-14:TP=-1.2:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
ffmpeg -v error -y -i "$V" -i "$A" -map 0:v -map 1:a -c:v copy -shortest \
  -af "loudnorm=I=-14:TP=-1.2:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" \
  -c:a aac -b:a 192k -movflags +faststart "$O"
ffmpeg -hide_banner -nostats -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tr -s ' '
