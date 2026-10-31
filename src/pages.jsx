import { useState as useStatePg } from "react";
import { Slot } from "./Slot.jsx";
import { Emblem, BrandMark, Ornament, CornerFlourish, DiamondStrip, SacredDivider, ArchPH, JodhpurStamp, Postmark, SectionHeader } from "./shared.jsx";
import { PRODUCTS, ProductCard } from "./catalog.jsx";
/* PAGES — Gallery, Blog, About Us */

/* ════════ GALLERY ════════ */
export function Gallery({ setRoute }) {
  const [filter, setFilter] = useStatePg("all");
  const cats = [
    { id: "all", label: "All", hindi: "सब" },
    { id: "chowki", label: "Chowki", hindi: "चौकी" },
    { id: "thali", label: "Thali", hindi: "थाली" },
    { id: "kamdhenu", label: "Kamdhenu", hindi: "कामधेनु" },
    { id: "atelier", label: "Atelier", hindi: "कार्यशाला" },
    { id: "festive", label: "Festive", hindi: "उत्सव" },
  ];
  // masonry-style varied tiles
  const tiles = [
    { cat: "chowki", tone: "maroon", span: "6", h: 480, label: "Shrinathji Pichwai Chowki" },
    { cat: "thali", tone: "dark", span: "3", h: 480, label: "Lakshmi-Ganesh Brass Thali" },
    { cat: "atelier", tone: "saffron", span: "3", h: 480, label: "Pigment grinding · atelier" },
    { cat: "kamdhenu", tone: "emerald", span: "4", h: 360, label: "Kamdhenu brass idol" },
    { cat: "festive", tone: "maroon", span: "4", h: 360, label: "Diwali altar styling" },
    { cat: "chowki", tone: "peacock", span: "4", h: 360, label: "Peacock-border chowki set" },
    { cat: "atelier", tone: "dark", span: "3", h: 420, label: "Brass casting · furnace" },
    { cat: "thali", tone: "emerald", span: "6", h: 420, label: "Marble meenakari thali · 10\"" },
    { cat: "festive", tone: "saffron", span: "3", h: 420, label: "Velvet-box gift hamper" },
    { cat: "kamdhenu", tone: "maroon", span: "4", h: 380, label: "Cow & calf · marble" },
    { cat: "chowki", tone: "dark", span: "4", h: 380, label: "Royal jharokha chowki · 18\"" },
    { cat: "atelier", tone: "peacock", span: "4", h: 380, label: "Wood embossing · low relief" },
  ];
  const shown = filter === "all" ? tiles : tiles.filter(t => t.cat === filter);

  return (
    <div>
      <section style={{ padding: "60px 40px 50px", borderBottom: "1px solid var(--gold-line)", background: "var(--paper)" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto", textAlign: "center" }}>
          <div className="uc" style={{ color: "var(--ink-soft)", marginBottom: 16 }}>Home / Gallery</div>
          <div className="hindi" style={{ fontSize: 28, color: "var(--maroon)", marginBottom: 10 }}>दर्शन दीर्घा</div>
          <h1 className="blk-h" style={{ fontSize: "clamp(48px,6.5vw,104px)", margin: "0 0 20px" }}>
            The <em style={{ color: "var(--maroon)" }}>Darshan</em> Gallery
          </h1>
          <p style={{ fontSize: 17, color: "var(--ink-soft)", maxWidth: 640, margin: "0 auto", lineHeight: 1.55 }}>
            A visual pilgrimage through our craft — finished pieces, the hands that make them, and altars dressed for festival. Drop your own photographs into any frame.
          </p>
          <div style={{ marginTop: 30, maxWidth: 300, marginLeft: "auto", marginRight: "auto" }}><Ornament width={300} /></div>
        </div>
      </section>

      {/* filter bar */}
      <section style={{ padding: "24px 40px", borderBottom: "1px solid var(--gold-line)", background: "var(--ivory-2)", position: "sticky", top: 112, zIndex: 50 }}>
        <div style={{ maxWidth: 1480, margin: "0 auto", display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
          {cats.map(c => (
            <button key={c.id} onClick={() => setFilter(c.id)} style={{ display: "flex", alignItems: "baseline", gap: 8, padding: "10px 20px", border: `1px solid ${filter === c.id ? "var(--maroon)" : "var(--gold-line)"}`, background: filter === c.id ? "var(--maroon)" : "transparent", color: filter === c.id ? "var(--paper)" : "var(--ink)", fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontStyle: filter === c.id ? "italic" : "normal", transition: "all .25s" }}>
              <span className="hindi" style={{ fontSize: 13, opacity: 0.75 }}>{c.hindi}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* grid */}
      <section style={{ padding: "50px 40px 90px" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: 20, gridAutoFlow: "dense" }}>
          {shown.map((t, i) => (
            <figure key={i} style={{ gridColumn: `span ${t.span}`, margin: 0, position: "relative", cursor: "pointer", overflow: "hidden", border: "1px solid var(--gold-line)" }} className="gal-tile">
              <div className={`ph ${t.tone}`} style={{ height: t.h, position: "relative" }}>
                <Slot id={`gal-${i}`} placeholder={`Drop photo · ${t.label}`} shape="rounded" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                {/* gold inner frame */}
                <div style={{ position: "absolute", inset: 12, border: "1px solid var(--gold-soft)", opacity: 0.4, pointerEvents: "none", zIndex: 4 }} />
                {/* hover caption */}
                <figcaption style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "40px 18px 16px", background: "linear-gradient(180deg,transparent,rgba(31,20,12,0.82))", color: "var(--paper)", zIndex: 5, transform: "translateY(8px)", opacity: 0, transition: "all .4s" }} className="gal-cap">
                  <div className="uc" style={{ color: "var(--gold-soft)", marginBottom: 4 }}>{cats.find(c => c.id === t.cat)?.label}</div>
                  <div className="serif" style={{ fontSize: 20, fontStyle: "italic" }}>{t.label}</div>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 60 }}>
          <button className="btn solid" onClick={() => setRoute("catalog")}>Shop the Catalog <span className="arrow">→</span></button>
        </div>
      </section>
      <style>{`.gal-tile:hover .gal-cap{transform:translateY(0)!important;opacity:1!important}.gal-tile:hover{box-shadow:6px 6px 0 var(--maroon)}`}</style>
    </div>
  );
}

/* ════════ BLOG ════════ */
export function Blog({ setRoute }) {
  const featured = {
    cat: "Craft Journal", date: "24 May 2026", read: "7 min",
    title: "Why the cobalt in our blue pottery is older than any nation",
    excerpt: "From the Persian potters who arrived in Jodhpur's court to the quartz-and-glass paste fired without clay — the strange, beautiful chemistry behind Jodhpur blue.",
    tone: "peacock",
  };
  const posts = [
    { cat: "Pichwai", date: "18 May 2026", read: "5 min", title: "Reading a Pichwai: the cow, the lotus, the gopis", tone: "maroon" },
    { cat: "Festive", date: "09 May 2026", read: "4 min", title: "How to dress a home altar for Diwali — a stylist's guide", tone: "saffron" },
    { cat: "Atelier", date: "02 May 2026", read: "6 min", title: "A day in the Sardarpura workshop, from log to lacquer", tone: "dark" },
    { cat: "Heritage", date: "24 Apr 2026", read: "8 min", title: "Kamdhenu: the wish-fulfilling cow across Indian art", tone: "emerald" },
    { cat: "Materials", date: "15 Apr 2026", read: "5 min", title: "Stone-ground pigment: lapis, malachite, cinnabar", tone: "peacock" },
    { cat: "Jodhpur", date: "06 Apr 2026", read: "4 min", title: "Padhāro mhāre des: a walk through the Blue City", tone: "maroon" },
  ];
  const topics = ["All", "Pichwai", "Festive", "Atelier", "Heritage", "Materials", "Jodhpur"];
  const [topic, setTopic] = useStatePg("All");

  return (
    <div>
      <section style={{ padding: "60px 40px 50px", borderBottom: "1px solid var(--gold-line)", background: "var(--paper)" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto" }}>
          <div className="uc" style={{ color: "var(--ink-soft)", marginBottom: 16 }}>Home / Journal</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40, flexWrap: "wrap" }}>
            <div>
              <div className="hindi" style={{ fontSize: 26, color: "var(--maroon)", marginBottom: 10 }}>कला पत्रिका</div>
              <h1 className="blk-h" style={{ fontSize: "clamp(48px,6vw,96px)", margin: "0 0 20px" }}>
                The <em style={{ color: "var(--maroon)" }}>Craft</em> Journal
              </h1>
              <p style={{ fontSize: 17, color: "var(--ink-soft)", maxWidth: 560, margin: 0, lineHeight: 1.55 }}>
                Stories from the atelier, guides for the altar, and the long histories behind every motif we paint.
              </p>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {topics.map(t => (
                <button key={t} onClick={() => setTopic(t)} className="uc" style={{ padding: "8px 14px", border: `1px solid ${topic === t ? "var(--maroon)" : "var(--gold-line)"}`, background: topic === t ? "var(--maroon)" : "transparent", color: topic === t ? "var(--paper)" : "var(--ink-soft)", transition: "all .25s" }}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* featured */}
      <section style={{ padding: "60px 40px" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto" }}>
          <article style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 0, border: "1px solid var(--maroon)", background: "var(--paper)", cursor: "pointer", boxShadow: "5px 5px 0 var(--maroon)" }}>
            <div className={`ph ${featured.tone}`} style={{ minHeight: 480, position: "relative" }}>
              <Slot id="blog-featured" placeholder="Drop featured article photo" shape="rounded" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
              <div style={{ position: "absolute", top: 18, left: 18, padding: "6px 12px", background: "var(--paper)", border: "1px solid var(--maroon)", zIndex: 5 }} className="uc">Featured</div>
            </div>
            <div style={{ padding: "50px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div className="uc" style={{ color: "var(--maroon)", marginBottom: 16 }}>{featured.cat} · {featured.date} · {featured.read} read</div>
              <h2 className="blk-h" style={{ fontSize: "clamp(32px,3.2vw,52px)", margin: "0 0 24px" }}>{featured.title}</h2>
              <p style={{ fontSize: 17, lineHeight: 1.65, color: "var(--ink-soft)", margin: "0 0 28px" }}>{featured.excerpt}</p>
              <Ornament width={120} />
              <button className="btn" style={{ marginTop: 28, alignSelf: "flex-start" }}>Read the story <span className="arrow">→</span></button>
            </div>
          </article>
        </div>
      </section>

      {/* grid */}
      <section style={{ padding: "20px 40px 90px" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }}>
          {posts.map((p, i) => (
            <article key={i} style={{ cursor: "pointer", position: "relative" }} className="blog-card">
              <div style={{ position: "relative", overflow: "hidden", border: "1px solid var(--gold-line)" }}>
                <div className={`ph ${p.tone}`} style={{ height: 300, position: "relative" }}>
                  <Slot id={`blog-${i}`} placeholder={`Drop photo · ${p.cat}`} shape="rounded" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transition: "transform 1s cubic-bezier(.2,.7,.2,1)" }} className="blog-img" />
                </div>
              </div>
              <div style={{ padding: "22px 4px 0" }}>
                <div className="uc" style={{ color: "var(--maroon)", marginBottom: 10 }}>{p.cat} · {p.date}</div>
                <h3 className="serif" style={{ fontSize: 26, lineHeight: 1.15, margin: "0 0 12px", fontWeight: 500 }}>{p.title}</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid var(--line)" }}>
                  <span className="uc" style={{ color: "var(--ink-soft)" }}>{p.read} read</span>
                  <span className="uc" style={{ color: "var(--maroon)" }}>Read →</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* newsletter strip */}
        <div style={{ marginTop: 70, padding: "50px 48px", background: "var(--maroon-deep)", color: "var(--paper)", position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", top: -40, right: -40, opacity: 0.18 }}><BrandMark size={200} color="#E8C97A" /></div>
          <div style={{ position: "relative", maxWidth: 620 }}>
            <div className="hindi" style={{ fontSize: 22, color: "var(--gold-bright)", marginBottom: 12 }}>हमारी पत्रिका</div>
            <h3 className="serif" style={{ fontSize: 40, fontWeight: 400, margin: "0 0 14px" }}>Subscribe to the <em style={{ color: "var(--gold-soft)" }}>Journal</em>.</h3>
            <p style={{ fontSize: 16, color: "rgba(248,239,216,0.78)", margin: "0 0 24px", lineHeight: 1.5 }}>One letter a month — new craft stories, festive lookbooks, and first look at seasonal drops.</p>
            <div style={{ display: "flex", gap: 0, maxWidth: 440, border: "1px solid var(--gold-soft)" }}>
              <input placeholder="your@email" style={{ flex: 1, background: "transparent", border: "none", color: "var(--paper)", fontFamily: "'Cormorant Garamond',serif", fontSize: 18, padding: "14px 18px", outline: "none" }} />
              <button style={{ padding: "0 24px", background: "var(--gold-soft)", color: "var(--maroon-deep)" }} className="uc">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
      <style>{`.blog-card:hover .blog-img{transform:scale(1.05)}`}</style>
    </div>
  );
}

/* ════════ ABOUT US ════════ */
export function About({ setRoute }) {
  return (
    <div>
      {/* hero */}
      <section style={{ padding: "80px 40px 60px", position: "relative", overflow: "hidden", background: "linear-gradient(180deg,var(--ivory) 0%,var(--paper) 100%)" }} className="gold-flake">
        <div aria-hidden style={{ position: "absolute", top: 30, left: 30 }}><CornerFlourish /></div>
        <div aria-hidden style={{ position: "absolute", top: 30, right: 30, transform: "scaleX(-1)" }}><CornerFlourish /></div>
        <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
          <div className="uc" style={{ color: "var(--ink-soft)", marginBottom: 18 }}>Home / About Us</div>
          <div className="hindi" style={{ fontSize: 30, color: "var(--maroon)", marginBottom: 14 }}>हमारी कहानी</div>
          <h1 className="blk-h" style={{ fontSize: "clamp(52px,7vw,116px)", margin: "0 0 20px" }}>
            Four generations,<br /><em style={{ color: "var(--maroon)" }}>one devotion.</em>
          </h1>
          <p style={{ fontSize: 19, color: "var(--ink-soft)", maxWidth: 680, margin: "0 auto", lineHeight: 1.6 }}>
            The House of Jodhana hand-finishes devotional objects in the blue lanes of Sardarpura, Jodhpur — never outsourced, never factory-made, always blessed before they leave.
          </p>
          <div style={{ marginTop: 36, maxWidth: 300, marginLeft: "auto", marginRight: "auto" }}><SacredDivider mark="॥ श्री ॥" /></div>
        </div>
      </section>

      {/* origin story split */}
      <section style={{ padding: "100px 40px" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto", display: "grid", gridTemplateColumns: "0.95fr 1.05fr", gap: 80, alignItems: "center" }}>
          <ArchPH slotId="about-founder" placeholder="Founder portrait · 600×800" tone="maroon" height={620} />
          <div>
            <div className="ornament" style={{ marginBottom: 18 }}><span className="bar" /><span className="dot" /><span className="uc" style={{ color: "var(--gold-line)" }}>It began with one chowki</span></div>
            <h2 className="blk-h" style={{ fontSize: "clamp(38px,4.6vw,68px)", margin: "0 0 24px" }}>
              From a single <em style={{ color: "var(--maroon)" }}>workbench</em> in 1978.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--ink-soft)", margin: "0 0 16px" }}>
              Our founding family began carving wooden chowkis for the neighbourhood temples of Jodhpur, painting each with the Pichwai motifs he learned from the Nathdwara masters. Word travelled — first to Jodhpur's havelis, then to temple trusts across Rajasthan.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--ink-soft)", margin: "0 0 16px" }}>
              Today his grandchildren run the atelier, with sixty-two craftsmen and a fourteen-strong apprenticeship. We still mix our own pigment, still stamp every piece by hand, and still pause for the workshop ārati each morning.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--ink-soft)", margin: 0 }}>
              What hasn't changed in four generations: the belief that an object made for devotion deserves to be made <em>with</em> devotion.
            </p>
          </div>
        </div>
      </section>

      {/* values band */}
      <section style={{ padding: "110px 40px", background: "var(--maroon)", color: "var(--paper)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.14 }}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ position: "absolute", bottom: -50, left: `${i * 20 - 10}%`, width: "22vw", height: "110%", borderRadius: "50% 50% 4px 4px / 50% 50% 4px 4px", border: "1px solid var(--gold-soft)" }} />
          ))}
        </div>
        <div style={{ position: "relative", maxWidth: 1480, margin: "0 auto" }}>
          <SectionHeader dark eyebrow="What we hold sacred" hindi="हमारे मूल्य" title={<>Four <em style={{ color: "var(--gold-soft)" }}>vows</em>.</>} sub="The promises we make to every devotee, gift-buyer and retailer." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, marginTop: 70, border: "1px solid rgba(232,201,122,0.4)" }}>
            {[
              ["i.", "Made by hand", "No factory lines. Every piece passes through human hands, twice-checked."],
              ["ii.", "Fair to makers", "Fair-trade wages, an in-house apprenticeship, no middlemen between artisan and you."],
              ["iii.", "True to tradition", "Stone-ground pigment, real Pichwai motifs, lineages we've worked with for decades."],
              ["iv.", "Blessed before dispatch", "A tilak at the workshop shrine accompanies every idol and chowki we send."],
            ].map(([n, t, d], i) => (
              <div key={i} style={{ padding: "36px 28px", borderRight: i < 3 ? "1px solid rgba(232,201,122,0.4)" : "none" }}>
                <div className="serif" style={{ fontSize: 44, color: "var(--gold-soft)", fontStyle: "italic", lineHeight: 1 }}>{n}</div>
                <div className="serif" style={{ fontSize: 26, fontWeight: 500, margin: "16px 0 12px" }}>{t}</div>
                <div style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(248,239,216,0.78)" }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* timeline */}
      <section style={{ padding: "110px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionHeader eyebrow="The long road" hindi="हमारी यात्रा" title={<>A <em>family</em> timeline.</>} sub="One workbench in Jodhpur to thirty-two countries." />
          <div style={{ marginTop: 70, position: "relative" }}>
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "var(--gold-line)", transform: "translateX(-50%)" }} />
            {[
              ["1978", "The first chowki", "The first devotional chowkis are carved for Jodhpur's temples."],
              ["1991", "The Pichwai years", "Partnership with seven Nathdwara painter families begins; hand-painted chowkis go to Marwar's havelis."],
              ["2004", "Brass & marble", "Pooja thalis and Kamdhenu idols added; the second generation takes the bench."],
              ["2016", "Beyond India", "First exports — temple trusts and luxury retailers across 12 countries."],
              ["2026", "The digital atelier", "House of Jodhana — the family craft, rebranded and online across thirty-two countries."],
            ].map(([y, t, d], i) => {
              const left = i % 2 === 0;
              return (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", marginBottom: 50, position: "relative" }}>
                  <div style={{ gridColumn: left ? "1" : "2", textAlign: left ? "right" : "left", padding: left ? "0 50px 0 0" : "0 0 0 50px" }}>
                    <div className="serif" style={{ fontSize: 48, color: "var(--maroon)", fontWeight: 500, lineHeight: 1 }}>{y}</div>
                    <div className="serif" style={{ fontSize: 26, fontWeight: 500, margin: "8px 0 10px", fontStyle: "italic" }}>{t}</div>
                    <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6 }}>{d}</div>
                  </div>
                  {/* node */}
                  <div style={{ position: "absolute", left: "50%", top: 8, transform: "translateX(-50%) rotate(45deg)", width: 14, height: 14, background: "var(--maroon)", border: "2px solid var(--ivory)" }} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* atelier photo band */}
      <section style={{ padding: "0 40px 100px" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
          {[["about-a", "Pichwai painter", "maroon"], ["about-b", "Brass casting", "dark"], ["about-c", "Marble inlay", "saffron"], ["about-d", "Velvet boxing", "emerald"]].map(([id, l, tone], i) => (
            <div key={i} className={`ph ${tone}`} style={{ height: i % 2 === 0 ? 320 : 260, marginTop: i % 2 === 0 ? 0 : 40, position: "relative" }}>
              <Slot id={id} placeholder={`Drop · ${l}`} shape="rounded" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "120px 40px", background: "var(--maroon-deep)", color: "var(--paper)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: 40, left: "50%", transform: "translateX(-50%)", width: "50%", height: "82%", borderRadius: "50% 50% 4px 4px / 35% 35% 4px 4px", border: "1px solid var(--gold-soft)", opacity: 0.22 }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <div className="hindi" style={{ fontSize: 30, color: "var(--gold-bright)", marginBottom: 18 }}>॥ पधारो ॥</div>
          <h2 className="blk-h" style={{ fontSize: "clamp(44px,5.6vw,88px)", margin: "0 0 24px" }}>
            Come <em style={{ color: "var(--gold-soft)" }}>visit</em> the atelier.
          </h2>
          <p style={{ fontSize: 18, color: "rgba(248,239,216,0.82)", maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.55 }}>
            Devotees and travellers are always welcome at our Sardarpura haveli. Watch a Pichwai take shape, or simply share a cup of chai with the family.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn" style={{ borderColor: "var(--gold-soft)", color: "var(--gold-soft)" }} onClick={() => setRoute("contact")}>Plan a visit <span className="arrow">→</span></button>
            <button className="btn" style={{ borderColor: "var(--paper)", color: "var(--paper)" }} onClick={() => setRoute("catalog")}>Browse Catalog</button>
          </div>
          <div style={{ marginTop: 56, display: "flex", justifyContent: "center" }}><DiamondStrip color="var(--gold-soft)" count={18} /></div>
        </div>
      </section>
    </div>
  );
}


/* ════════ CONTACT ════════ */
export function Contact({ setRoute }) {
  const [sent, setSent] = useStatePg(false);
  const ip = { width: "100%", border: "none", borderBottom: "1px solid var(--ink)", background: "transparent", padding: "12px 0", fontFamily: "'Cormorant Garamond',serif", fontSize: 22, outline: "none", color: "var(--ink)" };
  return (
    <div>
      <section style={{ padding: "80px 40px 60px", textAlign: "center" }} className="kamal">
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div className="uc" style={{ color: "var(--ink-soft)", marginBottom: 18 }}>Home / Contact</div>
          <div className="hindi" style={{ fontSize: 30, color: "var(--royal)", marginBottom: 12 }}>खम्मा घणी सा</div>
          <h1 className="blk-h" style={{ fontSize: "clamp(52px,7vw,116px)", margin: "0 0 22px" }}>Write to <span className="blk-chip">the haveli</span></h1>
          <p style={{ fontSize: 18, color: "var(--ink-soft)", maxWidth: 620, margin: "0 auto", lineHeight: 1.6 }}>Questions about a piece, a custom Pichwai, or a visit to our workshop — we reply within a day.</p>
        </div>
      </section>
      <section style={{ padding: "80px 40px 110px" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,.8fr)", gap: 60, alignItems: "start" }}>
          <div style={{ padding: 48, border: "1px solid var(--gold)", background: "var(--ivory)", position: "relative" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}><Emblem size={90} style={{ margin: "0 auto 20px" }} /><div className="hindi" style={{ fontSize: 28, color: "var(--royal)" }}>घणो आभार</div><div className="blk-h" style={{ fontSize: 40, margin: "10px 0" }}>Thank you</div><p style={{ color: "var(--ink-soft)" }}>Your letter is on its way to Jodhpur.</p></div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true); }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px 30px" }}>
                {[["Your name", "Meera Shah"], ["Email", "meera@email.com"], ["Phone", "+91"], ["City", "Ahmedabad"]].map(([l, p]) => <label key={l}><div className="uc" style={{ fontSize: 9, color: "var(--ink-soft)" }}>{l}</div><input style={ip} placeholder={p} /></label>)}
                <label style={{ gridColumn: "1 / -1" }}><div className="uc" style={{ fontSize: 9, color: "var(--ink-soft)" }}>Subject</div><select style={ip}>{["A product question", "Custom Pichwai", "Gifting", "Order & shipping", "Visit the workshop"].map(o => <option key={o}>{o}</option>)}</select></label>
                <label style={{ gridColumn: "1 / -1" }}><div className="uc" style={{ fontSize: 9, color: "var(--ink-soft)" }}>Message</div><textarea rows="5" style={{ ...ip, border: "1px solid var(--gold)", padding: 14, marginTop: 10, resize: "vertical" }} /></label>
                <div style={{ gridColumn: "1 / -1" }}><button className="btn solid" type="submit">Send letter <span className="arrow">→</span></button></div>
              </form>
            )}
          </div>
          <div style={{ display: "grid", gap: 24 }}>
            <div style={{ background: "var(--midnight)", color: "var(--ivory)", padding: 34 }} className="kamal-dark">
              <div className="uc" style={{ color: "var(--gold-soft)", marginBottom: 14 }}>Visit the haveli</div>
              <div className="blk-h" style={{ fontSize: 30, marginBottom: 12 }}>Sardarpura, Jodhpur</div>
              <div style={{ lineHeight: 1.9, fontSize: 15, opacity: .85 }}>Rajasthan 342003<br />hello@houseofjodhana.com<br />+91 00000 00000<br />Mon–Sat · 10:00–19:00 IST</div>
            </div>
            <div style={{ display: "flex", gap: 24, alignItems: "center", justifyContent: "center", padding: 24, border: "1px solid var(--gold)" }}><JodhpurStamp size={130} /><Postmark /></div>
          </div>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { Gallery, Blog, About, Gifting, Logistics, Contact });

/* ════════ GIFTING — dedicated page for gift sets & hampers ════════ */
export function Gifting({ setRoute, openProduct }) {
  const gifts = PRODUCTS.filter(p => p.cat === "gifts");
  const occasions = [
    { hindi: "दीपावली", label: "Diwali", tone: "saffron", slot: "gift-occ-1" },
    { hindi: "विवाह", label: "Wedding Favours", tone: "maroon", slot: "gift-occ-2" },
    { hindi: "जन्माष्टमी", label: "Janmashtami", tone: "dark", slot: "gift-occ-3" },
    { hindi: "गृह प्रवेश", label: "Housewarming", tone: "emerald", slot: "gift-occ-4" },
  ];
  return (
    <div>
      {/* hero */}
      <section style={{ padding: "80px 40px 60px", position: "relative", overflow: "hidden", background: "linear-gradient(180deg,var(--ivory) 0%,var(--paper) 100%)" }} className="gold-flake">
        <div aria-hidden style={{ position: "absolute", top: 30, left: 30 }}><CornerFlourish /></div>
        <div aria-hidden style={{ position: "absolute", top: 30, right: 30, transform: "scaleX(-1)" }}><CornerFlourish /></div>
        <div style={{ maxWidth: 1480, margin: "0 auto", display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 60, alignItems: "center" }}>
          <div>
            <div className="uc" style={{ color: "var(--ink-soft)", marginBottom: 16 }}>Home / Gifting</div>
            <div className="hindi" style={{ fontSize: 28, color: "var(--maroon)", marginBottom: 14 }}>उपहार संग्रह</div>
            <h1 className="blk-h" style={{ fontSize: "clamp(50px,6.6vw,110px)", margin: "0 0 20px" }}>
              The <em style={{ color: "var(--maroon)" }}>Gifting</em> atelier.
            </h1>
            <p style={{ fontSize: 18, color: "var(--ink-soft)", maxWidth: 540, margin: "0 0 36px", lineHeight: 1.6 }}>
              Pichwai-painted jars on metal trays, Rudraksh bells, crystal t-light stands, bowl-and-spoon sets — each gift box velvet-lined and tied with a kalāva ribbon. Curated for festival, wedding and corporate giving.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button className="btn solid" onClick={() => { const el = document.getElementById("gift-grid"); if (el) window.scrollTo({ top: el.offsetTop - 140, behavior: "smooth" }); }}>Shop hampers <span className="arrow">→</span></button>
              <button className="btn" onClick={() => setRoute("contact")}>Custom gifting</button>
            </div>
          </div>
          <div style={{ position: "relative", height: 560, display: "grid", placeItems: "center" }}>
            <div style={{ position: "absolute", inset: "20px 50px", borderRadius: "50% 50% 6px 6px / 32% 32% 6px 6px", border: "1px solid var(--gold-line)", opacity: 0.4 }} />
            <div style={{ position: "relative", width: 380, height: 520, zIndex: 2 }}>
              <ArchPH slotId="gift-hero" placeholder="Drop a hero gift-box photo" tone="maroon" height={520} />
            </div>
            <div className="float" style={{ position: "absolute", bottom: 20, left: -10, background: "var(--paper)", border: "1px solid var(--maroon)", padding: "14px 18px", boxShadow: "6px 6px 0 var(--maroon)", zIndex: 3 }}>
              <div className="uc" style={{ color: "var(--maroon)" }}>Velvet-boxed</div>
              <div className="serif" style={{ fontSize: 20, fontStyle: "italic", fontWeight: 500 }}>Ready to gift</div>
            </div>
          </div>
        </div>
      </section>

      {/* occasions strip */}
      <section style={{ padding: "70px 40px", background: "var(--ivory-2)", borderTop: "1px solid var(--gold-line)", borderBottom: "1px solid var(--gold-line)" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div className="uc" style={{ color: "var(--gold-line)", marginBottom: 10 }}>Gift by occasion</div>
            <h2 className="blk-h" style={{ fontSize: "clamp(32px,3.6vw,52px)", margin: "0 0 24px" }}>For every <em style={{ color: "var(--maroon)" }}>auspicious</em> moment.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
            {occasions.map((o, i) => (
              <div key={i} onClick={() => setRoute("gifts")} style={{ cursor: "pointer", position: "relative" }}>
                <div className={`ph ${o.tone}`} style={{ height: 280, position: "relative", border: "1px solid var(--gold-line)" }}>
                  <Slot id={o.slot} placeholder={`Drop · ${o.label}`} shape="rounded" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 20, background: "linear-gradient(180deg,transparent 50%,rgba(31,20,12,0.75))", zIndex: 5 }}>
                    <div className="hindi" style={{ fontSize: 22, color: "var(--gold-soft)" }}>{o.hindi}</div>
                    <div className="serif" style={{ fontSize: 24, fontWeight: 500, color: "var(--paper)", fontStyle: "italic" }}>{o.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* gift grid */}
      <section id="gift-grid" style={{ padding: "90px 40px" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto" }}>
          <SectionHeader eyebrow={`${gifts.length} gift sets & hampers`} hindi="हमारे उपहार" title={<>Every <em>gift set</em>, individually.</>} sub="Every hamper hand-assembled and velvet-boxed in Jodhpur." />
          <div style={{ marginTop: 70, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }}>
            {gifts.map(g => <ProductCard key={g.id} item={g} onOpen={() => openProduct(g)} />)}
          </div>
        </div>
      </section>

      {/* bespoke band */}
      <section style={{ padding: "110px 40px", background: "var(--maroon-deep)", color: "var(--paper)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: 40, left: "50%", transform: "translateX(-50%)", width: "50%", height: "82%", borderRadius: "50% 50% 4px 4px / 35% 35% 4px 4px", border: "1px solid var(--gold-soft)", opacity: 0.2 }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div className="hindi" style={{ fontSize: 28, color: "var(--gold-bright)", marginBottom: 16 }}>विशेष उपहार</div>
          <h2 className="blk-h" style={{ fontSize: "clamp(40px,5vw,80px)", margin: "0 0 24px" }}>
            Need <em style={{ color: "var(--gold-soft)" }}>bespoke</em> hampers?
          </h2>
          <p style={{ fontSize: 18, color: "rgba(248,239,216,0.82)", maxWidth: 620, margin: "0 auto 38px", lineHeight: 1.55 }}>
            Custom Pichwai motifs, your family name on the ribbon, your card inside. Write to us and we will design a box just for you.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn" style={{ borderColor: "var(--gold-soft)", color: "var(--gold-soft)" }} onClick={() => setRoute("contact")}>Request a quote <span className="arrow">→</span></button>
            <button className="btn" style={{ borderColor: "var(--paper)", color: "var(--paper)" }} onClick={() => setRoute("catalog")}>Browse Catalog</button>
          </div>
          <div style={{ marginTop: 54, display: "flex", justifyContent: "center" }}><DiamondStrip color="var(--gold-soft)" count={18} /></div>
        </div>
      </section>
    </div>
  );
}

/* ════════ LOGISTICS & SHIPMENT SERVICES ════════ */
export function Logistics({ setRoute }) {
  const services = [
    { n: "i.", t: "Domestic Courier", d: "3–7 day delivery across India. Free over ₹2,000. Insured, tracked, fragile-safe packing for every idol." },
    { n: "ii.", t: "International Air", d: "8–12 day express to 32 countries. DDP available — we clear customs, you receive at the door." },
    { n: "iii.", t: "Gift Delivery", d: "Send a gift straight to a loved one — gift-wrapped, priced invisibly, with your handwritten note inside." },
    { n: "iv.", t: "White-Glove", d: "Crated, climate-monitored handling for large idols, marble pieces and museum commissions." },
  ];
  const partners = ["DHL Express", "Blue Dart", "FedEx", "India Post", "Maersk LCL", "DTDC"];
  const steps = [
    ["Packed", "Hand-wrapped in muslin, cushioned in recycled jute, boxed and sealed at the atelier."],
    ["Dispatched", "Handed to courier with insurance binder and tracking ID sent to your phone & email."],
    ["In Transit", "Live tracking via our dashboard. Customs paperwork pre-cleared for export orders."],
    ["Delivered", "Doorstep delivery. Damage-free guarantee — if it breaks in transit, we remake it free."],
  ];
  return (
    <div>
      {/* hero */}
      <section style={{ padding: "80px 40px 60px", position: "relative", overflow: "hidden", background: "linear-gradient(180deg,var(--ivory) 0%,var(--paper) 100%)" }} className="gold-flake">
        <div aria-hidden style={{ position: "absolute", top: 30, left: 30 }}><CornerFlourish /></div>
        <div aria-hidden style={{ position: "absolute", top: 30, right: 30, transform: "scaleX(-1)" }}><CornerFlourish /></div>
        <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
          <div className="uc" style={{ color: "var(--ink-soft)", marginBottom: 18 }}>Home / Logistics &amp; Shipment</div>
          <div className="hindi" style={{ fontSize: 30, color: "var(--maroon)", marginBottom: 14 }}>परिवहन एवं प्रेषण</div>
          <h1 className="blk-h" style={{ fontSize: "clamp(50px,6.8vw,112px)", margin: "0 0 20px" }}>
            From our hands<br />to your <em style={{ color: "var(--maroon)" }}>doorstep.</em>
          </h1>
          <p style={{ fontSize: 18, color: "var(--ink-soft)", maxWidth: 660, margin: "0 auto", lineHeight: 1.6 }}>
            Forty-eight years of shipping fragile devotional craft. We pack every idol like it's bound for a temple — because often, it is. Tracked, insured, and damage-free guaranteed across 32 countries.
          </p>
          <div style={{ marginTop: 36, maxWidth: 300, marginLeft: "auto", marginRight: "auto" }}><Ornament width={300} /></div>
        </div>
      </section>

      {/* stat band */}
      <section style={{ padding: "0 40px", marginTop: -30 }}>
        <div style={{ maxWidth: 1480, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, border: "1px solid var(--maroon)", background: "var(--paper)", boxShadow: "5px 5px 0 var(--maroon)" }}>
          {[["3–7 days", "Domestic delivery"], ["32", "Countries served"], ["100%", "Insured & tracked"], ["0%", "Damage-free guarantee*"]].map(([n, l], i) => (
            <div key={i} style={{ padding: "30px 24px", borderRight: i < 3 ? "1px solid var(--gold-line)" : "none", textAlign: "center" }}>
              <div className="serif" style={{ fontSize: 40, fontWeight: 500, color: "var(--maroon)", lineHeight: 1 }}>{n}</div>
              <div className="uc" style={{ color: "var(--ink-soft)", marginTop: 12 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* services */}
      <section style={{ padding: "100px 40px" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto" }}>
          <SectionHeader eyebrow="What we offer" hindi="हमारी सेवाएँ" title={<>Four ways to <em>ship</em>.</>} sub="Every idol, chowki and gift box packed and sent with the same care." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, marginTop: 70, border: "1px solid var(--gold-line)" }}>
            {services.map((s, i) => (
              <div key={i} style={{ padding: "36px 28px", borderRight: i < 3 ? "1px solid var(--gold-line)" : "none", minHeight: 300 }}>
                <div className="serif" style={{ fontSize: 44, color: "var(--gold-line)", fontStyle: "italic", lineHeight: 1 }}>{s.n}</div>
                <div className="serif" style={{ fontSize: 25, fontWeight: 500, margin: "16px 0 12px", lineHeight: 1.15 }}>{s.t}</div>
                <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink-soft)" }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* journey / process */}
      <section style={{ padding: "110px 40px", background: "var(--maroon)", color: "var(--paper)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.14 }}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ position: "absolute", bottom: -50, left: `${i * 20 - 10}%`, width: "22vw", height: "110%", borderRadius: "50% 50% 4px 4px / 50% 50% 4px 4px", border: "1px solid var(--gold-soft)" }} />
          ))}
        </div>
        <div style={{ position: "relative", maxWidth: 1480, margin: "0 auto" }}>
          <SectionHeader dark eyebrow="The journey of a parcel" hindi="आपका पार्सल" title={<>Four <em style={{ color: "var(--gold-soft)" }}>stages</em>, fully tracked.</>} sub="From our workbench to your doorstep, you see every step." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, marginTop: 70, border: "1px solid rgba(232,201,122,0.4)" }}>
            {steps.map(([t, d], i) => (
              <div key={i} style={{ padding: "34px 26px", borderRight: i < 3 ? "1px solid rgba(232,201,122,0.4)" : "none", position: "relative" }}>
                <div className="serif" style={{ fontSize: 42, color: "var(--gold-soft)", fontStyle: "italic", lineHeight: 1 }}>0{i + 1}</div>
                <div className="serif" style={{ fontSize: 24, fontWeight: 500, margin: "14px 0 10px" }}>{t}</div>
                <div style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(248,239,216,0.78)" }}>{d}</div>
                {i < 3 && <div style={{ position: "absolute", right: -9, top: 46, color: "var(--gold-soft)", background: "var(--maroon)", padding: "0 4px", fontSize: 18, zIndex: 2 }}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* tracking + packing split */}
      <section style={{ padding: "100px 40px" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div className="ornament" style={{ marginBottom: 18 }}><span className="bar" /><span className="dot" /><span className="uc" style={{ color: "var(--gold-line)" }}>Track your order</span></div>
            <h2 className="blk-h" style={{ fontSize: "clamp(36px,4.4vw,64px)", margin: "0 0 24px" }}>
              Always know where your <em style={{ color: "var(--maroon)" }}>idol</em> is.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--ink-soft)", margin: "0 0 28px" }}>
              Enter your order ID below for live status, or sign in to your dashboard for the full transit timeline, customs documents and delivery photographs.
            </p>
            <div style={{ display: "flex", gap: 0, border: "1px solid var(--maroon)", maxWidth: 460 }}>
              <input placeholder="KK-26-XXXX · order ID" style={{ flex: 1, background: "transparent", border: "none", color: "var(--ink)", fontFamily: "'Cormorant Garamond',serif", fontSize: 18, padding: "14px 18px", outline: "none" }} />
              <button style={{ padding: "0 22px", background: "var(--maroon)", color: "var(--paper)" }} className="uc">Track →</button>
            </div>
            <button className="btn" style={{ marginTop: 20 }} onClick={() => setRoute("contact")}>Open shipment dashboard <span className="arrow">→</span></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <div className="ph maroon" style={{ height: 300, position: "relative" }}>
              <Slot id="logi-pack-1" placeholder="Muslin wrapping · 600×800" shape="rounded" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
            </div>
            <div className="ph dark" style={{ height: 300, marginTop: 30, position: "relative" }}>
              <Slot id="logi-pack-2" placeholder="Crating · 600×800" shape="rounded" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* partners */}
      <section style={{ padding: "70px 40px 110px" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto", textAlign: "center" }}>
          <div className="uc" style={{ color: "var(--ink-soft)", marginBottom: 30 }}>Our shipping partners</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 0, flexWrap: "wrap", border: "1px solid var(--gold-line)" }}>
            {partners.map((p, i) => (
              <div key={i} style={{ flex: "1 1 16%", minWidth: 160, padding: "28px 20px", borderRight: i < partners.length - 1 ? "1px solid var(--gold-line)" : "none", fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 500, color: "var(--ink-soft)" }}>{p}</div>
            ))}
          </div>
          <div style={{ marginTop: 28, fontSize: 12, color: "var(--ink-soft)", fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif" }}>*Damage-free guarantee: if a piece breaks in certified transit, we remake and reship at no cost.</div>
        </div>
      </section>
    </div>
  );
}
