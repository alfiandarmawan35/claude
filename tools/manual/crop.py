"""Potong gambar manual: segmen vertikal (y0,y1) digabung, atau kotak (x0,y0,x1,y1); sisanya buang latar kosong di bawah."""
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw

SRC, OUT = Path("img"), Path("img_out")
OUT.mkdir(exist_ok=True)
SEG = {
    "09_dc_pilah": [(0, 700), (880, 1680)], "10_dc_pilah_selesai": [(0, 520), (1440, 1880)],
    "12_pur_detail": [(0, 540), (640, 780), (930, 1720)], "13_pur_terbentuk": [(0, 880), (1600, 1760)],
    "16_buyer_form_po": [(0, 512), (1640, 2120)], "17_buyer_po_diajukan": [(0, 512), (1640, 1900)],
    "19_po_approval": [(0, 512), (1640, 2160)], "20_po_terbentuk": [(0, 980)],
    "21_dc_grpo_form": [(0, 512), (1740, 2150)], "22_dc_grpo_diajukan": [(0, 512), (1760, 2000)],
    "23_pur_grpo_approval": [(0, 512), (1680, 2150)], "24_pur_grpo_terbentuk": [(0, 1000)],
    "25_dc_it_form": [(0, 512), (2000, 2640)], "26_dc_it_diajukan": [(0, 512), (2040, 2330)],
    "27_pur_it_approval": [(0, 512), (2040, 2500)], "28_pur_it_terbentuk": [(0, 1180)],
}
BOX = {
    "05_so_detail": (630, 520, 2049, 1780), "06_so_disetujui": (630, 520, 2049, 1780), "07_so_terbentuk": (630, 500, 2049, 1300),
    "08_dc_giliran": (0, 0, 2049, 620), "11_pur_giliran": (0, 0, 2049, 700), "14_buyer_beranda": (0, 0, 2049, 1000),
    "15_buyer_giliran": (0, 0, 2049, 900), "18_po_beranda": (0, 0, 2049, 1000), "02_kapal_daftar": (0, 0, 2049, 1500),
    "29_kapal_kiriman_masuk": (0, 0, 2049, 1300), "33_kapal_kt_checklist_kosong": (0, 0, 2049, 1400),
    "34_kapal_kt_checklist_lengkap": (0, 0, 2049, 1400), "35_kapal_menunggu_p2": (0, 0, 2049, 1000),
    "36_p2_dokumen_stok": (0, 0, 2049, 1100), "37_p2_detail": (0, 0, 2049, 1100), "38_p2_selesai": (0, 0, 2049, 850),
    "79_kapal_detail_selesai": (0, 0, 2049, 1100),
}


def trim_bottom(im):
    bg = im.getpixel((im.width - 3, im.height - 3))
    diff = ImageChops.difference(im, Image.new(im.mode, im.size, bg)).convert("L").point(lambda v: 255 if v > 12 else 0)
    box = diff.getbbox()
    return im.crop((0, 0, im.width, min(im.height, box[3] + 30))) if box else im


for f in sorted(SRC.glob("*.png")):
    im = Image.open(f).convert("RGB")
    n = f.stem
    if n in SEG:
        parts = [im.crop((0, a, im.width, min(b, im.height))) for a, b in SEG[n]]
        gap = 26
        out = Image.new("RGB", (im.width, sum(p.height for p in parts) + gap * (len(parts) - 1)), (255, 255, 255))
        y = 0
        d = ImageDraw.Draw(out)
        for i, p in enumerate(parts):
            out.paste(p, (0, y))
            y += p.height
            if i < len(parts) - 1:
                for x in range(0, im.width, 24):  # garis putus-putus = bagian dilewati
                    d.line([(x, y + gap // 2), (x + 12, y + gap // 2)], fill=(150, 160, 180), width=3)
                y += gap
        im = out
    elif n in BOX:
        im = im.crop(BOX[n])
    else:
        im = trim_bottom(im)
    im.save(OUT / f.name, optimize=True)
    print(n, im.size)
