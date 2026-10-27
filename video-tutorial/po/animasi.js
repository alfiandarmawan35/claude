      // Animasi tiap adegan dari DATA (waktu relatif terhadap mulai adegan; dihitung build.py dari waktu kata narasi).
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      const ID = (sc, s) => "#" + sc.id + "-" + s;
      DATA.forEach((sc) => {
        const T = sc.mulai, akhir = T + sc.dur;
        // teks tayang per kalimat
        sc.teks.forEach(([a, b], k) => {
          const sampai = k + 1 < sc.teks.length ? sc.teks[k + 1][0] : Math.min(b + 0.8, sc.dur - 0.3);
          tl.fromTo(ID(sc, "t" + k), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.2 }, T + a - 0.05);
          tl.to(ID(sc, "t" + k), { opacity: 0, duration: 0.15 }, T + sampai - 0.1);
        });
        // keluar adegan: blur ringan
        tl.to("#" + sc.id, { opacity: 0, filter: "blur(8px)", duration: 0.3 }, akhir - 0.3);

        if (sc.jenis === "judul" || sc.jenis === "penutup") {
          tl.fromTo(ID(sc, "kartu"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, T + 0.1);
          if (sc.jenis === "judul") tl.fromTo(ID(sc, "label"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, T + 0.5);
          tl.fromTo(ID(sc, "judul"), { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.5 }, T + 0.6);
          tl.fromTo(ID(sc, "sub"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, T + 1.0);
        } else if (sc.jenis === "alur") {
          const [t0, t1, t2] = sc.ketuk;
          tl.fromTo(ID(sc, "k0"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, T + t0);
          tl.fromTo(ID(sc, "p0"), { scaleX: 0 }, { scaleX: 1, duration: 0.5 }, T + t1 - 0.4);
          tl.fromTo(ID(sc, "k1"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, T + t1);
          tl.fromTo(ID(sc, "lv") + " span", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.35 }, T + t1 + 0.6);
          tl.fromTo(ID(sc, "p1"), { scaleX: 0 }, { scaleX: 1, duration: 0.5 }, T + t2 - 0.4);
          tl.fromTo(ID(sc, "k2"), { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, T + t2);
        } else if (sc.jenis === "bagian") {
          tl.fromTo(ID(sc, "no"), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, T + 0.1);
          tl.fromTo(ID(sc, "label"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, T + 0.35);
          tl.fromTo(ID(sc, "judul"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, T + 0.45);
        } else if (sc.jenis === "catatan") {
          tl.fromTo(ID(sc, "c0"), { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.5, ease: "expo.out" }, T + sc.ketuk[0]);
          tl.fromTo(ID(sc, "c1"), { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.5, ease: "expo.out" }, T + sc.ketuk[1]);
        } else if (sc.jenis === "layar") {
          const [s0, x0, y0] = sc.awal;
          tl.fromTo(ID(sc, "bag"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, T + 0.1);
          tl.fromTo(ID(sc, "judul"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, T + 0.15);
          tl.fromTo(ID(sc, "bingkai"), { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.6, ease: "expo.out" }, T + 0.05);
          tl.fromTo(ID(sc, "img"), { x: x0, y: y0, scale: s0 }, { x: x0, y: y0, scale: s0, duration: 0.01 }, T);
          let kotakLalu = null;
          sc.fokus.forEach((f, k) => {
            const t = T + Math.max(0.2, f.t - 0.15);
            tl.to(ID(sc, "img"), { x: f.tx, y: f.ty, scale: f.s, duration: 0.75, ease: "power2.inOut" }, t);
            if (kotakLalu) tl.to(kotakLalu, { opacity: 0, duration: 0.2 }, t);
            if (f.kotak) {
              const sel = ID(sc, "s" + k);
              tl.fromTo(sel, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out", immediateRender: false }, t + 0.6);
              kotakLalu = sel;
            } else kotakLalu = null;
          });
        }
      });
