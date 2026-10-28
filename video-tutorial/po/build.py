"""adegan.json + suara/waktu.json -> index.html (HyperFrames) + jadwal.json (mulai tiap adegan, dipakai mix.py).
Pakai: python build.py"""
import json, re, html
from pathlib import Path

D = Path(__file__).resolve().parent
SPEC = json.loads((D / "adegan.json").read_text())
W8 = json.loads((D / "suara" / "waktu.json").read_text())
IMG = SPEC["gambar"]

AWAL, JEDA = 0.6, {"judul": 1.6, "alur": 1.4, "bagian": 1.0, "layar": 1.1, "catatan": 1.6, "penutup": 3.0}
VW, VH = 1180, 706                      # viewport layar di dalam bingkai browser
SMAX = 1.25                             # zoom maks (gambar diambil pada skala 1,5x, jadi 1,25 masih tajam)

norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())

def cari_kata(kata, daftar, dari):
    k = norm(kata)
    for i in range(dari, len(daftar)):
        if norm(daftar[i][0]).startswith(k):
            return i
    raise SystemExit(f"kata '{kata}' tidak ditemukan setelah indeks {dari}: {[w[0] for w in daftar]}")

def pas(iw, ih, r=None):
    """skala dan geser gambar supaya rect r (atau seluruh gambar) terlihat di viewport"""
    s0 = min(VW / iw, VH / ih)
    if r is None:
        return s0, (VW - iw * s0) / 2, (VH - ih * s0) / 2
    x, y, w, h = r
    s = max(s0, min(VW * 0.82 / w, VH * 0.72 / h, SMAX))
    def geser(pusat, ukuran, view):
        t = view / 2 - pusat * s
        return (view - ukuran * s) / 2 if ukuran * s <= view else min(0, max(view - ukuran * s, t))
    return s, geser(x + w / 2, iw, VW), geser(y + h / 2, ih, VH)

def teks_tayang(kata):
    """kelompokkan kata whisper per kalimat -> [[mulai, selesai, teks]]"""
    out, cur = [], []
    for w in kata:
        cur.append(w)
        if re.search(r"[.?!]$", w[0]):
            out.append([cur[0][1], cur[-1][2], " ".join(c[0] for c in cur)]); cur = []
    if cur: out.append([cur[0][1], cur[-1][2], " ".join(c[0] for c in cur)])
    return out

t, jadwal, adegan = 0.0, {}, []
for a in SPEC["adegan"]:
    w = W8[a["id"]]
    dur = AWAL + w["dur"] + JEDA[a["jenis"]]
    sc = {"id": a["id"], "jenis": a["jenis"], "mulai": round(t, 3), "dur": round(dur, 3),
          "teks": [[round(AWAL + s, 2), round(AWAL + e, 2), x] for s, e, x in teks_tayang(w["kata"])]}
    for k in ("bagian", "judul", "nomor", "img"):
        if k in a: sc[k] = a[k]
    if a["jenis"] == "layar":
        iw, ih = IMG[a["img"]]
        sc["ukuran"] = [iw, ih]
        sc["awal"] = pas(iw, ih)
        fok, j = [], 0
        for f in a["fokus"]:
            j = cari_kata(f["kata"], w["kata"], j)
            s, tx, ty = pas(iw, ih, f["rect"])
            x, y, ww, hh = f["rect"]
            penuh = ww >= iw * 0.95 and hh >= ih * 0.95
            fok.append({"t": round(AWAL + w["kata"][j][1], 2), "s": round(s, 4), "tx": round(tx, 1), "ty": round(ty, 1),
                        "kotak": None if penuh else [round(tx + x * s - 10, 1), round(ty + y * s - 10, 1), round(ww * s + 20, 1), round(hh * s + 20, 1)]})
            j += 1
        sc["fokus"] = fok
    if a["jenis"] in ("alur", "catatan"):
        kunci = {"alur": ["Admin", "Approve", "final"], "catatan": ["Ingat", "bila"]}[a["jenis"]]
        j, ts = 0, []
        for k in kunci:
            j = cari_kata(k, w["kata"], j); ts.append(round(AWAL + w["kata"][j][1], 2)); j += 1
        sc["ketuk"] = ts
    adegan.append(sc); jadwal[a["id"]] = round(t + AWAL, 3)
    t += dur
TOTAL = round(t, 2)
(D / "suara" / "jadwal.json").write_text(json.dumps({"total": TOTAL, "mulai": jadwal, "adegan": [[s["id"], s["jenis"], s["mulai"]] for s in adegan]}, indent=1))

def blok(sc):
    i, j = sc["id"], sc["jenis"]
    teks = "".join(f'<div class="tt" id="{i}-t{k}">{html.escape(x)}</div>' for k, (_, _, x) in enumerate(sc["teks"]))
    if j == "judul":
        isi = f'''<div class="kartu-logo" id="{i}-kartu"><img src="assets/danantara_gelap.png" alt="Danantara Indonesia" class="lg-d"><div class="garis"></div>
  <img src="assets/pelni_services.png" alt="PELNI Services" class="lg-p"><div class="garis"></div><div class="nama">PID POS</div></div>
<div class="j-label" id="{i}-label">PANDUAN PERAN</div><div class="j-judul" id="{i}-judul">Admin Purchase &amp; Approve PO</div>
<div class="j-sub" id="{i}-sub">Membuat dan menyetujui Purchase Order</div>'''
    elif j == "alur":
        kotak = [("Buat PO", "admin purchase", 150), ("Menunggu approval", "Approve PO · level 1 … n", 770), ("PO final di SAP", "nomor PO terbit", 1390)]
        isi = '<div class="j-label" style="top:170px">ALUR PURCHASE ORDER</div>' + "".join(
            f'<div class="al-k" id="{i}-k{n}" style="left:{x}px"><b>{a}</b><small>{b}</small></div>' for n, (a, b, x) in enumerate(kotak)) + \
            f'<div class="al-p" id="{i}-p0" style="left:555px"></div><div class="al-p" id="{i}-p1" style="left:1175px"></div>' + \
            f'<div class="al-lv" id="{i}-lv"><span>Level 1</span><span>Level 2</span><span>…</span><span>Level terakhir</span></div>'
    elif j == "bagian":
        isi = f'<div class="bg-no" id="{i}-no">{sc["nomor"]}</div><div class="bg-label" id="{i}-label">BAGIAN {sc["nomor"]}</div><div class="bg-judul" id="{i}-judul">{sc["judul"]}</div>'
    elif j == "layar":
        iw, ih = sc["ukuran"]
        isi = f'''<div class="ly-bagian" id="{i}-bag">{html.escape(sc["bagian"]).upper()}</div><div class="ly-judul" id="{i}-judul">{html.escape(sc["judul"])}</div>
<div class="bingkai" id="{i}-bingkai"><div class="bar"><i></i><i></i><i></i><span>pos.pidc.co.id · Permintaan DC</span></div>
  <div class="vp"><img id="{i}-img" src="assets/img/{sc["img"]}.png" alt="{html.escape(sc["judul"])}" style="width:{iw}px;height:{ih}px">
  {"".join(f'<div class="sorot" id="{i}-s{k}" style="left:{f["kotak"][0]}px;top:{f["kotak"][1]}px;width:{f["kotak"][2]}px;height:{f["kotak"][3]}px"></div>' for k, f in enumerate(sc["fokus"]) if f["kotak"])}</div></div>'''
    elif j == "catatan":
        isi = f'''<div class="j-label" style="top:200px">PERLU DIINGAT</div>
<div class="ct" id="{i}-c0" style="top:290px"><b>PO final tidak bisa diubah atau dibatalkan dari web</b><span>Pembatalan PO yang sudah final dilakukan di SAP.</span></div>
<div class="ct" id="{i}-c1" style="top:520px"><b>PO menunggu approval diubah?</b><span>Approval mulai lagi dari level 1.</span></div>'''
    else:
        isi = f'''<div class="kartu-logo" id="{i}-kartu"><img src="assets/danantara_gelap.png" alt="Danantara Indonesia" class="lg-d"><div class="garis"></div>
  <img src="assets/pelni_services.png" alt="PELNI Services" class="lg-p"><div class="garis"></div><div class="nama">PID POS</div></div>
<div class="j-judul" id="{i}-judul" style="top:600px">Selamat bekerja dengan PID POS</div>
<div class="j-sub" id="{i}-sub" style="top:690px">Admin Purchase &amp; Approve PO</div>'''
    return f'<div id="{i}" class="clip adegan" data-start="{sc["mulai"]}" data-duration="{sc["dur"]}" data-track-index="1">{isi}<div class="teks">{teks}</div></div>'

css = (D / "gaya.css").read_text()
html_out = f'''<!doctype html>
<html lang="id" data-resolution="landscape">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
{css}
    </style>
  </head>
  <body>
    <!-- Video tutorial Admin Purchase & Approve PO. Dibuat oleh build.py dari adegan.json; jangan diedit langsung. -->
    <div id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL}" data-width="1920" data-height="1080">
      <div id="panggung" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="0"></div>
      {"".join(blok(s) for s in adegan)}
      <div id="tirai" class="clip" data-start="{TOTAL - 0.8}" data-duration="0.8" data-track-index="2"></div>
      <audio id="mix" src="assets/mix.wav" data-start="0" data-duration="{TOTAL}" data-volume="1"></audio>
    </div>
    <script>
      const DATA = {json.dumps(adegan, ensure_ascii=False)};
{(D / "animasi.js").read_text()}
      tl.fromTo("#tirai", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.7, ease: "power2.in" }}, {TOTAL - 0.75});
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
'''
(D / "index.html").write_text(html_out)
print("total", TOTAL, "detik,", len(adegan), "adegan")
