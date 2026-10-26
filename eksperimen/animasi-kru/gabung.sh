#!/bin/sh
# out/frames (12 fps, digambar "on twos") -> 24 fps + suara -> out/Animasi_Kru_Toko_Kapal.mp4 (-16 LUFS)
set -e
cd "$(dirname "$0")"
ffmpeg -v error -y -framerate 12 -i out/frames/f%05d.jpg -i out/suara.wav -map 0:v -map 1:a \
  -vf "fps=24,format=yuv420p" -c:v libx264 -preset slow -crf 17 -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 48000 -c:a aac -b:a 192k \
  -shortest -movflags +faststart out/Animasi_Kru_Toko_Kapal.mp4
echo out/Animasi_Kru_Toko_Kapal.mp4
