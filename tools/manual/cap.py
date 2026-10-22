"""Ambil gambar layar pos-dev untuk manual book.
pakai: python cap.py langkah.json   (atau '-' untuk stdin)
langkah.json: {"user": "admin.awu", "path": "/pos/home", "steps": [ {"click": "text=Pesan"}, {"fill": ["sel", "isi"]},
  {"press": ["sel", "Enter"]}, {"wait": 800}, {"waitfor": "text=..."}, {"js": "..."}, {"shot": "nama", "full": false, "sel": "css"} ]}
Gambar disimpan ke OUT/nama.png. Token sesi dari tok_manual.json (dev saja)."""
import json, os, sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
OUT = Path(os.environ.get("MANUAL_OUT", HERE / "img"))
OUT.mkdir(parents=True, exist_ok=True)
BASE = "https://pos-dev.pidc.co.id"
TOKS = json.loads(Path(os.environ["MANUAL_TOKENS"]).read_text())  # {"username": "token sesi dev"}; jangan di-commit

spec = json.load(sys.stdin if sys.argv[1] == "-" else open(sys.argv[1], encoding="utf-8"))
tok = TOKS[spec["user"]]
w, h = spec.get("size", [1366, 800])
with sync_playwright() as p:
    b = p.chromium.launch(channel="msedge", headless=True)
    ctx = b.new_context(viewport={"width": w, "height": h}, device_scale_factor=spec.get("scale", 1.5), locale="id-ID",
                        timezone_id="Asia/Jakarta")
    ctx.add_init_script(f"try{{if(!sessionStorage.getItem('capinit')){{localStorage.setItem('sbi_pos_token', {json.dumps(tok)}); localStorage.removeItem('pid_session'); sessionStorage.setItem('capinit','1')}}}}catch(e){{}}")
    pg = ctx.new_page()
    pg.goto(BASE + spec.get("path", "/"), wait_until="load")
    pg.wait_for_timeout(spec.get("settle", 1200))
    for s in spec.get("steps", []):
        if "tryclick" in s:
            if pg.locator(s["tryclick"]).count():
                pg.locator(s["tryclick"]).first.click()
                pg.wait_for_timeout(s.get("after", 900))
        elif "click" in s:
            pg.locator(s["click"]).first.click()
            pg.wait_for_timeout(s.get("after", 900))
        elif "fill" in s:
            pg.locator(s["fill"][0]).first.fill(s["fill"][1])
            pg.wait_for_timeout(s.get("after", 400))
        elif "press" in s:
            pg.locator(s["press"][0]).first.press(s["press"][1])
            pg.wait_for_timeout(s.get("after", 700))
        elif "select" in s:
            pg.locator(s["select"][0]).first.select_option(label=s["select"][1])
            pg.wait_for_timeout(s.get("after", 500))
        elif "wait" in s:
            pg.wait_for_timeout(s["wait"])
        elif "waitfor" in s:
            pg.locator(s["waitfor"]).first.wait_for(timeout=s.get("timeout", 90000))
            pg.wait_for_timeout(500)
        elif "goto" in s:
            pg.goto(BASE + s["goto"], wait_until="load")
            pg.wait_for_timeout(s.get("after", 1200))
        elif "js" in s:
            print("js:", pg.evaluate(s["js"]))
        elif "scroll" in s:
            pg.locator(s["scroll"]).first.scroll_into_view_if_needed()
            pg.wait_for_timeout(400)
        elif "text" in s:
            print(pg.locator(s["text"]).first.inner_text()[: s.get("max", 3000)])
        elif "shot" in s:
            f = OUT / (s["shot"] + ".png")
            if s.get("sel"):
                pg.locator(s["sel"]).first.screenshot(path=str(f))
            else:
                pg.screenshot(path=str(f), full_page=s.get("full", False))
            print("shot", f.name)
    b.close()
