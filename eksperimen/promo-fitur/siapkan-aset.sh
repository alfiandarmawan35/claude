#!/bin/sh
# Potong musik ARUS (detik 15-45) dari proyek motion sebagai musik promo. Jalankan sekali sebelum render.
set -e
cd "$(dirname "$0")"
ffmpeg -v error -y -ss 15 -i ../../motion/public/music/arus.wav -t 30 -c:a pcm_s16le assets/musik.wav
echo assets/musik.wav
