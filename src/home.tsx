import React, { useState as useStateH, useEffect as useEffectH, useRef as useRefH } from "react";
import { Slot } from "./Slot";
import { Emblem, PichwaiFrame, JodhpurStamp, Postmark, Tape } from "./shared";
import { PichwaiStory, ProductGrid, Process, FestiveBanner, Atelier, Reviews, CTA } from "./home-rest";
import { Product } from "./catalog";

/* HOME — House of Jodhana · premium */

export function useScrollProgress(ref: React.RefObject<HTMLElement | null>): number {
  const [p, setP] = useStateH(0);
  useEffectH(() => {
    let raf: number;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        setP(Math.min(1, Math.max(0, -r.top / (total || 1))));
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [ref]);
  return p;
}

export interface HomeProps {
  setRoute: (route: string) => void;
  openProduct: (p: Product) => void;
}

export function Home({ setRoute, openProduct }: HomeProps) {
  return (
    <div>
      <Hero setRoute={setRoute} />
      <section className="no-rv">
        <Tape items={["Handcrafted in Rajasthan", "पधारो म्हारे देस", "Made in Jodhpur", "Pichwai Painted", "खम्मा घणी", "Blessed Before Dispatch"]} tone="ivory" speed={60} />
      </section>
      <Manifesto />
      <CollectionRing setRoute={setRoute} />
      <PichwaiStory />
      <Sayings />
      <JodhpurScroll />
      <ProductGrid openProduct={openProduct} setRoute={setRoute} />
      <Process />
      <FestiveBanner setRoute={setRoute} />
      <Atelier />
      <Reviews />
      <CTA setRoute={setRoute} />
    </div>
  );
}

export interface SplitLettersProps {
  text: string;
  delay?: number;
}

export function SplitLetters({ text, delay = 0 }: SplitLettersProps) {
  let n = 0;
  return (
    <span aria-label={text} style={{ display: "inline-block" }}>
      {text.split(" ").map((w, wi, arr) => (
        <React.Fragment key={wi}>
          <span aria-hidden style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {w.split("").map((ch, i) => (
              <span key={i} style={{ display: "inline-block", animation: `letter 1.2s cubic-bezier(.16,1,.3,1) ${delay + (n++) * 0.035}s both` }}>
                {ch}
              </span>
            ))}
          </span>
          {wi < arr.length - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </span>
  );
}

export interface HeroProps {
  setRoute: (route: string) => void;
}

/* HERO — 3D layered stage */
export function Hero({ setRoute }: HeroProps) {
  const stage = useRefH<HTMLDivElement>(null);
  const sec = useRefH<HTMLElement>(null);
  const m = useRefH({ x: 0, y: 0 });

  useEffectH(() => {
    let raf: number;
    const paint = () => {
      const el = stage.current;
      if (!el) return;
      const y = Math.min(window.scrollY, window.innerHeight);
      const k = y / window.innerHeight;
      el.style.transform = `rotateY(${m.current.x * 14 - k * 18}deg) rotateX(${-m.current.y * 10 + k * 28}deg) translateZ(${-k * 260}px) scale(${1 - k * 0.12})`;
      el.style.opacity = String(1 - k * 0.6);
    };
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(paint);
    };
    const mm = (e: MouseEvent) => {
      m.current = { x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 };
      on();
    };
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("mousemove", mm);
    paint();
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("mousemove", mm);
    };
  }, []);

  return (
    <section ref={sec} className="no-rv kamal-dark" style={{ position: "relative", overflow: "hidden", minHeight: "calc(100vh - 100px)", padding: "80px 48px 100px", color: "var(--ivory)", display: "flex", alignItems: "center" }}>
      <div className="hero-grid" style={{ position: "relative", maxWidth: 1480, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(0,.95fr)", gap: 70, alignItems: "center" }}>
        <div>
          <div className="fu" style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 40 }}>
            <span className="uc" style={{ fontSize: 10, letterSpacing: ".42em", color: "rgba(251,247,239,.6)" }}>Maison · Jodhpur</span>
            <span style={{ width: 56, height: 1, background: "rgba(251,247,239,.3)" }} />
            <span className="hindi" style={{ fontSize: 17, color: "rgba(251,247,239,.7)" }}>खम्मा घणी सा</span>
          </div>
          <h1 className="blk-h hero-h1" style={{ fontSize: "clamp(52px,7vw,128px)", margin: "0 0 40px", fontWeight: 400, letterSpacing: ".04em", lineHeight: 0.98 }}>
            <SplitLetters text="Heirlooms" /><br />
            <em style={{ color: "var(--ivory)", fontSize: ".78em" }}>
              <SplitLetters text="of Marwar" delay={0.35} />
            </em>
          </h1>
          <p className="fu d2" style={{ fontSize: 17, lineHeight: 1.85, color: "rgba(251,247,239,.72)", maxWidth: 460, margin: "0 0 48px", fontWeight: 300 }}>
            Devotional objects painted with Pichwai lotuses and finished by hand in the blue lanes of Jodhpur. Made slowly, by families who have done this for generations.
          </p>
          <div className="fu d3" style={{ display: "flex", gap: 30, alignItems: "center", flexWrap: "wrap" }}>
            <button className="btn gold" onClick={() => setRoute("catalog")}>
              Discover the collection <span className="arrow">→</span>
            </button>
            <span className="link" style={{ color: "var(--ivory)" }} onClick={() => setRoute("about")}>
              The House
            </span>
          </div>
        </div>
        <div style={{ perspective: 1600, height: 640, position: "relative" }}>
          <div ref={stage} style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transition: "transform .25s ease-out" }}>
            {/* IMAGE SLOT: "hero-side-l" — 3D stage left backdrop card */}
            <div style={{ position: "absolute", left: "2%", top: "18%", width: "34%", height: "52%", transform: "translateZ(-220px) rotateY(18deg)", opacity: 0.55 }}>
              <div className="ph maroon" style={{ width: "100%", height: "100%", borderRadius: "50% 50% 2px 2px / 30% 30% 2px 2px" }}>
                <Slot id="hero-side-l" placeholder="Detail" shape="rounded" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
              </div>
            </div>
            {/* IMAGE SLOT: "hero-side-r" — 3D stage right backdrop card */}
            <div style={{ position: "absolute", right: "0%", top: "8%", width: "32%", height: "48%", transform: "translateZ(-320px) rotateY(-16deg)", opacity: 0.45 }}>
              <div className="ph emerald" style={{ width: "100%", height: "100%", borderRadius: "50% 50% 2px 2px / 30% 30% 2px 2px" }}>
                <Slot id="hero-side-r" placeholder="Detail" shape="rounded" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
              </div>
            </div>
            {/* IMAGE SLOT: "hero-pichwai" — Main centerpiece hero image in PichwaiFrame */}
            <div style={{ position: "absolute", left: "20%", right: "18%", top: 0, bottom: 40, transform: "translateZ(60px)", boxShadow: "0 60px 120px rgba(0,0,0,.45)" }}>
              <PichwaiFrame style={{ height: "100%" }}>
                <div className="ph saffron" style={{ height: 560, position: "relative" }}>
                  <Slot id="hero-pichwai" placeholder="Drop hero image · Pichwai chowki or painting" shape="rounded" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                </div>
              </PichwaiFrame>
            </div>
            <div style={{ position: "absolute", left: "8%", bottom: 0, transform: "translateZ(160px)" }}>
              <JodhpurStamp size={130} dark />
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <span className="uc" style={{ fontSize: 9, letterSpacing: ".4em", color: "rgba(251,247,239,.5)" }}>Scroll</span>
        <span style={{ width: 1, height: 44, background: "linear-gradient(rgba(251,247,239,.6),transparent)" }} />
      </div>
    </section>
  );
}

/* Manifesto — words light up with scroll */
export function Manifesto() {
  const ref = useRefH<HTMLElement>(null);
  const p = useScrollProgress(ref);
  const words = "Every chowki, thali and idol we make begins as a prayer in a Jodhpur courtyard — carved, painted and blessed by hand, then sent to an altar somewhere in the world.".split(" ");

  return (
    <section ref={ref} className="no-rv" style={{ height: "200vh", position: "relative", background: "var(--ivory)" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", display: "grid", placeItems: "center", padding: "0 48px" }}>
        <div style={{ maxWidth: 1100, textAlign: "center" }}>
          <Emblem variant="blue" size={64} style={{ margin: "0 auto 44px", transform: `rotateY(${p * 360}deg)` }} />
          <p className="serif" style={{ fontSize: "clamp(30px,3.6vw,56px)", lineHeight: 1.3, fontWeight: 400, margin: 0 }}>
            {words.map((w, i) => {
              const on = p * 1.25 * words.length > i;
              return (
                <span key={i} style={{ color: on ? "var(--midnight)" : "rgba(6,23,63,.14)", transition: "color .4s" }}>
                  {w}{" "}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}

export interface CollectionRingProps {
  setRoute: (route: string) => void;
}

/* 3D rotating ring of collections */
export function CollectionRing({ setRoute }: CollectionRingProps) {
  const ref = useRefH<HTMLElement>(null);
  const p = useScrollProgress(ref);
  const cols = [
    { id: "chowki", hi: "चौकी", name: "Wooden Chowki", from: "₹ 56", tone: "maroon" },
    { id: "thali", hi: "पूजा थाली", name: "Pooja Thali", from: "₹ 145", tone: "dark" },
    { id: "kamdhenu", hi: "कामधेनु", name: "Kamdhenu", from: "₹ 480", tone: "saffron" },
    { id: "gifts", hi: "उपहार", name: "Gift Sets", from: "₹ 320", tone: "emerald" },
  ];
  const panels = [...cols, ...cols];
  const N = panels.length;
  const R = typeof window !== "undefined" ? Math.min(520, window.innerHeight * 0.56) : 400;
  const rot = -p * 360 * 0.875;
  const active = cols[Math.round(-rot / (360 / N)) % cols.length] || cols[0];

  return (
    <section ref={ref} className="no-rv" style={{ height: "300vh", position: "relative", background: "var(--sand)" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", marginBottom: 20, position: "relative", zIndex: 2 }}>
          <div className="uc" style={{ fontSize: 10, letterSpacing: ".42em", color: "var(--ink-soft)", marginBottom: 16 }}>The Collections</div>
          <div className="hindi" style={{ fontSize: 20, color: "var(--royal)", height: 30 }}>{active.hi}</div>
          <h2 className="blk-h" style={{ fontSize: "clamp(30px,min(5vw,8vh),76px)", margin: "6px 0 14px", fontWeight: 400 }}>{active.name}</h2>
          <span className="link" onClick={() => setRoute(active.id === "gifts" ? "gifts" : active.id)}>From {active.from} — Explore</span>
        </div>
        <div style={{ perspective: 1800, width: "100%", height: "min(460px,50vh)", display: "grid", placeItems: "center" }}>
          <div style={{ position: "relative", width: "min(260px,28vh)", height: "min(400px,44vh)", transformStyle: "preserve-3d", transform: `translateZ(-${R}px) rotateX(-6deg) rotateY(${rot}deg)` }}>
            {panels.map((c, i) => (
              <div key={i} onClick={() => setRoute(c.id === "gifts" ? "gifts" : c.id)} style={{ position: "absolute", inset: 0, transform: `rotateY(${(i * 360) / N}deg) translateZ(${R}px)`, backfaceVisibility: "hidden", cursor: "pointer" }}>
                <div className={`ph ${c.tone}`} style={{ width: "100%", height: "100%", borderRadius: "50% 50% 2px 2px / 28% 28% 2px 2px", boxShadow: "0 30px 60px rgba(6,23,63,.18)" }}>
                  {/* IMAGE SLOT: "ring-<category>-a" / "ring-<category>-b" (e.g. "ring-chowki-a", "ring-thali-a", "ring-kamdhenu-a", "ring-gifts-a") */}
                  <Slot id={`ring-${c.id}-${i < cols.length ? "a" : "b"}`} placeholder={`Drop ${c.name} photo`} shape="rounded" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ width: 200, height: 1, background: "var(--hair)", marginTop: "clamp(12px,3vh,30px)", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: 1, width: `${p * 100}%`, background: "var(--royal)" }} />
        </div>
      </div>
    </section>
  );
}

/* Rajasthani sayings */
export const SAYINGS = [
  { hi: "पधारो म्हारे देस", tr: "Padhāro mhāre des", en: "Come, grace my land — the welcome every Marwari home offers its guest." },
  { hi: "खम्मा घणी", tr: "Khammā ghaṇī", en: "The royal Marwari greeting — offered with folded hands and a lowered head." },
  { hi: "रंगीलो राजस्थान", tr: "Rangīlo Rājasthān", en: "Rajasthan, drenched in colour — indigo walls, saffron turbans, gold on every border." },
  { hi: "जोधाणा री शान", tr: "Jodhāṇā rī shān", en: "The pride of Jodhpur — the old name of our city, and the name of our house." },
];

export function Sayings() {
  const [i, setI] = useStateH(0);
  useEffectH(() => {
    const t = setInterval(() => setI(x => (x + 1) % SAYINGS.length), 5500);
    return () => clearInterval(t);
  }, []);
  const s = SAYINGS[i];

  return (
    <section className="kamal-dark" style={{ padding: "160px 48px", color: "var(--ivory)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", textAlign: "center", perspective: 1200 }}>
        <div className="uc" style={{ fontSize: 10, letterSpacing: ".42em", color: "rgba(251,247,239,.5)", marginBottom: 50 }}>Marwari Kahāvat</div>
        <div key={i} style={{ animation: "flipIn 1.4s cubic-bezier(.16,1,.3,1) both", transformOrigin: "50% 100%" }}>
          <div className="hindi foil" style={{ fontSize: "clamp(52px,7.4vw,118px)", lineHeight: 1.2 }}>{s.hi}</div>
          <div className="uc" style={{ fontSize: 11, letterSpacing: ".5em", color: "rgba(251,247,239,.6)", margin: "22px 0 26px" }}>{s.tr}</div>
          <p className="serif" style={{ fontSize: "clamp(20px,2vw,28px)", fontStyle: "italic", fontWeight: 400, maxWidth: 640, margin: "0 auto", color: "rgba(251,247,239,.85)", lineHeight: 1.5 }}>{s.en}</p>
        </div>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 60 }}>
          {SAYINGS.map((_, k) => (
            <button
              key={k}
              onClick={() => setI(k)}
              aria-label={`Saying ${k + 1}`}
              style={{
                width: k === i ? 48 : 16,
                height: 1,
                border: "none",
                background: k === i ? "var(--ivory)" : "rgba(251,247,239,.3)",
                transition: "all .6s",
                cursor: "pointer"
              }}
            />
          ))}
        </div>
      </div>
      <style>{`@keyframes flipIn{from{opacity:0;transform:rotateX(-70deg) translateY(40px)}to{opacity:1;transform:none}}`}</style>
    </section>
  );
}

/* Jodhpur — 3D coverflow horizontal scroll */
export function JodhpurScroll() {
  const wrap = useRefH<HTMLElement>(null);
  const track = useRefH<HTMLDivElement>(null);
  const panels = [
    { k: "01", t: "The Blue City", hi: "नीली नगरी", d: "Brahmpuri's indigo-washed lanes beneath the fort — the colour of our emblem.", tone: "maroon" },
    { k: "02", t: "Mehrangarh", hi: "मेहरानगढ़", d: "The fort rises from the rock. Its jharokhas gave us the arch on every box we ship.", tone: "dark" },
    { k: "03", t: "Sardar Market", hi: "घंटाघर", d: "Under the clock tower — spice sellers, dyers and the brass-smiths our craftsmen still buy from.", tone: "saffron" },
    { k: "04", t: "Artisan Lanes", hi: "कारीगर", d: "Woodturners, painters and casters — families who have worked the same street for generations.", tone: "peacock" },
    { k: "05", t: "Umaid Bhawan", hi: "उम्मेद भवन", d: "Golden sandstone at sunset — the quiet grandeur we try to keep in every piece.", tone: "emerald" },
  ];

  useEffectH(() => {
    let raf: number;
    const paint = () => {
      const w = wrap.current;
      const t = track.current;
      if (!w || !t) return;
      const r = w.getBoundingClientRect();
      const total = w.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      t.style.transform = `translateX(${-p * (t.scrollWidth - window.innerWidth + 96)}px)`;
      const cx = window.innerWidth / 2;
      t.querySelectorAll<HTMLElement>("[data-cf]").forEach(c => {
        const b = c.getBoundingClientRect();
        const d = (b.left + b.width / 2 - cx) / window.innerWidth;
        c.style.transform = `rotateY(${-d * 38}deg) translateZ(${-Math.abs(d) * 220}px)`;
        c.style.opacity = String(1 - Math.min(0.6, Math.abs(d) * 0.7));
      });
    };
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  return (
    <section ref={wrap} className="no-rv" style={{ height: "340vh", position: "relative", background: "var(--ivory)" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ padding: "0 48px", marginBottom: "clamp(20px,5vh,50px)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 30, flexWrap: "wrap" }}>
          <div>
            <div className="uc" style={{ fontSize: 10, letterSpacing: ".42em", color: "var(--ink-soft)", marginBottom: 18 }}>An authentic Rajasthani experience</div>
            <h2 className="blk-h" style={{ fontSize: "clamp(30px,min(5vw,8vh),80px)", margin: 0, fontWeight: 400 }}>Walk with us<br /><em>through Jodhpur</em></h2>
          </div>
          <Postmark />
        </div>
        <div style={{ perspective: 1400 }}>
          <div ref={track} style={{ display: "flex", gap: 40, padding: "0 48px", willChange: "transform", transformStyle: "preserve-3d" }}>
            {panels.map(p => (
              <article key={p.k} data-cf style={{ flex: "0 0 min(440px,78vw)", transformStyle: "preserve-3d", transition: "opacity .2s" }}>
                {/* IMAGE SLOT: "jdh-01" … "jdh-05" — Jodhpur coverflow photo */}
                <div className={`ph ${p.tone}`} style={{ height: "min(380px,42vh)", position: "relative" }}>
                  <Slot id={`jdh-${p.k}`} placeholder={`Drop photo · ${p.t}`} shape="rounded" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                </div>
                <div style={{ padding: "18px 4px 0", display: "grid", gridTemplateColumns: "auto 1fr", gap: 22 }}>
                  <span className="serif" style={{ fontSize: 15, color: "var(--ink-soft)", paddingTop: 6 }}>{p.k}</span>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                      <span className="blk-h" style={{ fontSize: 28, fontWeight: 400 }}>{p.t}</span>
                      <span className="hindi" style={{ fontSize: 16, color: "var(--royal)" }}>{p.hi}</span>
                    </div>
                    <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-soft)", margin: "8px 0 0" }}>{p.d}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
