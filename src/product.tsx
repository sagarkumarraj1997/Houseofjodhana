import React, { useState as useStateP } from "react";
import { Button, ActionIcon, Badge, Group, Box } from "@mantine/core";
import { Slot } from "./Slot";
import { useStore } from "./store";
import { Lotus, Ornament, ArchPH } from "./shared";
import { PRODUCTS, CATS, ProductCard, Product as ProductType } from "./catalog";
/* PRODUCT DETAIL — Kalinga Arts */

export interface ProductPageProps {
  item: ProductType | null;
  setRoute: (r: string) => void;
  openProduct: (p: ProductType) => void;
}

export function Product({ item, setRoute, openProduct }: ProductPageProps) {
  const it = item || PRODUCTS[0];
  const [tab, setTab] = useStateP("story");
  const [activeImg, setActiveImg] = useStateP(0);
  const [qty, setQty] = useStateP(1);
  const [variant, setVariant] = useStateP("Standard · 12\"");

  const tiers: any[] = [];
  const activeTier = 0;
  const unitPrice = it.price;
  const total = unitPrice * qty;

  const gallery = [
    { tone: it.tone, label: "Hero · raking light", slot: `pdp-${it.id}-1` },
    { tone: "dark", label: "Detail · brush macro", slot: `pdp-${it.id}-2` },
    { tone: "ivory", label: "Scale · in hand", slot: `pdp-${it.id}-3` },
    { tone: "emerald", label: "Reverse · stamp", slot: `pdp-${it.id}-4` },
  ];

  return (
    <div>
      <section style={{ padding: "30px 40px 0", background: "var(--paper)" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto" }}>
          <div className="uc" style={{ color: "var(--ink-soft)" }}>
            <span onClick={() => setRoute("home")} style={{ cursor: "pointer" }}>Home</span>
            <span style={{ margin: "0 10px" }}>/</span>
            <span onClick={() => setRoute("catalog")} style={{ cursor: "pointer" }}>Catalog</span>
            <span style={{ margin: "0 10px" }}>/</span>
            <span>{CATS.find(c => c.id === it.cat)?.label || it.cat}</span>
            <span style={{ margin: "0 10px" }}>/</span>
            <span style={{ color: "var(--ink)" }}>{it.id}</span>
          </div>
        </div>
      </section>

      <section style={{ padding: "30px 40px 60px", background: "var(--paper)" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto", display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 60 }} className="co-grid">
          <GalleryColumn gallery={gallery} activeImg={activeImg} setActiveImg={setActiveImg} item={it} />
          <SummaryColumn it={it} qty={qty} setQty={setQty} variant={variant} setVariant={setVariant} tiers={tiers} activeTier={activeTier} unitPrice={unitPrice} total={total} setRoute={setRoute} />
        </div>
      </section>

      <section style={{ padding: "0 40px 60px", background: "var(--paper)" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--gold-line)", marginBottom: 40, overflowX: "auto" }}>
            {[
              { id: "story", l: "The Story · पिछवाई" },
              { id: "specs", l: "Specifications" },
              { id: "care", l: "Care & Materials" },
              { id: "shipping", l: "Shipping & Returns" },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "20px 28px", fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontStyle: tab === t.id ? "italic" : "normal", color: tab === t.id ? "var(--maroon)" : "var(--ink-soft)", border: "none", background: "none", borderBottom: tab === t.id ? "2px solid var(--maroon)" : "2px solid transparent", marginBottom: -1, transition: "all .3s", whiteSpace: "nowrap", cursor: "pointer" }}>{t.l}</button>
            ))}
          </div>
          <TabContent tab={tab} it={it} tiers={tiers} unitPrice={unitPrice} />
        </div>
      </section>

      <ArtisanStrip it={it} />
      <Related openProduct={openProduct} it={it} />
    </div>
  );
}

export function GalleryColumn({ gallery, activeImg, setActiveImg, item }: { gallery: any[]; activeImg: number; setActiveImg: (i: number) => void; item: ProductType }) {
  const [zoom, setZoom] = useStateP(false);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {gallery.map((g, i) => (
            <button key={i} onClick={() => setActiveImg(i)} style={{ position: "relative", padding: 0, background: "none", border: "none", cursor: "pointer" }}>
              <div className={`ph ${g.tone}`} style={{ height: 80, outline: activeImg === i ? "2px solid var(--maroon)" : "1px solid var(--gold-line)", outlineOffset: activeImg === i ? 2 : 0, position: "relative" }}>
                {/* IMAGE SLOT: "pdp-<id>-1-thumb" … "pdp-<id>-4-thumb" (auto-falls back to main slot if not set) */}
                <Slot id={g.slot + "-thumb"} placeholder="" shape="rounded" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                <div className="ph-corner" style={{ fontSize: 8, zIndex: 5 }}>0{i + 1}</div>
              </div>
            </button>
          ))}
          <div style={{ padding: "10px 0", borderTop: "1px solid var(--gold-line)", marginTop: 6 }}>
            <div className="uc" style={{ color: "var(--maroon)", textAlign: "center", cursor: "pointer" }}>360°<br />view</div>
          </div>
        </div>
        <div onClick={() => setZoom(!zoom)} style={{ cursor: zoom ? "zoom-out" : "zoom-in", position: "relative" }}>
          <div className={`ph ${gallery[activeImg].tone}`} style={{ height: 720, position: "relative" }}>
            {/* IMAGE SLOT: "pdp-<id>-1" … "pdp-<id>-4" (falls back to "pc-<id>") — Product detail main photo */}
            <Slot id={gallery[activeImg].slot} placeholder={`Drop ${item.name} photo`} shape="rounded" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
            <div className="ph-corner" style={{ zIndex: 5 }}>{item.id} · 0{activeImg + 1}/04</div>
            <div className="ph-label" style={{ zIndex: 5 }}>{gallery[activeImg].label}</div>
            <div style={{ position: "absolute", inset: 20, border: "1px solid var(--gold-soft)", opacity: 0.5, pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: 28, border: "1px solid var(--gold-soft)", opacity: 0.25, pointerEvents: "none" }} />
            <div style={{ position: "absolute", right: 18, bottom: 18, display: "flex", gap: 8, alignItems: "center", color: "rgba(248,239,216,0.9)", zIndex: 5 }}>
              <span className="uc">{zoom ? "Tap to exit" : "Tap to zoom"}</span>
              <div style={{ width: 32, height: 32, border: "1px solid currentColor", borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 14 }}>{zoom ? "−" : "+"}</div>
            </div>
            {zoom && <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", width: 240, height: 240, borderRadius: "50%", border: "2px solid var(--gold-soft)", boxShadow: "0 0 0 9999px rgba(31,20,12,0.55)", pointerEvents: "none", zIndex: 6 }} />}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 10, letterSpacing: 0.22, textTransform: "uppercase", color: "var(--ink-soft)" }}>
            <span>0{activeImg + 1} / 04</span>
            <span>Hi-res available on request</span>
            <span>Catalog PDF ↓</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SummaryColumn({ it, qty, setQty, variant, setVariant, unitPrice, total, setRoute }: any) {
  const store = useStore();
  const variants = ["Mini · 4\"", "Standard · 12\"", "Royal · 18\""];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <Badge variant="outline" color="maroon" style={{ textTransform: "uppercase", borderRadius: 2 }}>Made in Jodhpur</Badge>
        <span className="uc" style={{ color: "var(--ink-soft)" }}>{it.id}</span>
        {it.tag && <span className="uc" style={{ color: "var(--saffron)" }}>· {it.tag}</span>}
      </div>
      <div className="hindi" style={{ fontSize: 24, color: "var(--gold-line)", marginBottom: 8 }}>{CATS.find(c => c.id === it.cat)?.hindi}</div>
      <h1 className="blk-h" style={{ fontSize: "clamp(36px,3.6vw,54px)", margin: "0 0 10px" }}>{it.name}</h1>
      <div className="serif" style={{ fontSize: 22, fontStyle: "italic", color: "var(--ink-soft)", marginBottom: 20 }}>{it.line}</div>
      <Ornament width={120} />

      {/* price */}
      <div style={{ marginTop: 24, display: "flex", alignItems: "baseline", gap: 16 }}>
        <span className="serif" style={{ fontSize: 48, fontWeight: 500, color: "var(--maroon)", lineHeight: 1 }}>₹{unitPrice.toLocaleString("en-IN")}</span>
        <span style={{ fontSize: 18, color: "var(--ink-soft)", textDecoration: "line-through" }}>₹{it.mrp.toLocaleString("en-IN")}</span>
        <Badge variant="outline" color="emerald" style={{ borderRadius: 2 }}>{Math.round((1 - unitPrice / it.mrp) * 100)}% off</Badge>
      </div>
      <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 6 }}>Inclusive of all taxes · Ships from Jodhpur in {it.leadDays} days</div>

      <div style={{ marginTop: 30 }}>
        <div className="uc" style={{ color: "var(--ink-soft)", marginBottom: 14 }}>Size / Variant</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {variants.map(v => (
            <button key={v} onClick={() => setVariant(v)} style={{ padding: "12px 18px", border: `1px solid ${variant === v ? "var(--maroon)" : "var(--gold-line)"}`, background: variant === v ? "var(--maroon)" : "transparent", color: variant === v ? "var(--paper)" : "var(--ink)", fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontStyle: variant === v ? "italic" : "normal", cursor: "pointer" }}>{v}</button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 30, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, padding: "18px 22px", border: "1px solid var(--gold)", background: "var(--sand)" }}>
        <div>
          <div className="uc" style={{ color: "var(--ink-soft)", marginBottom: 10, fontSize: 9 }}>Quantity</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 34, height: 34, border: "1px solid var(--ink)", fontSize: 16, background: "none", cursor: "pointer" }}>−</button>
            <span className="blk-h" style={{ fontSize: 30, minWidth: 40, textAlign: "center" }}>{qty}</span>
            <button onClick={() => setQty(qty + 1)} style={{ width: 34, height: 34, border: "1px solid var(--ink)", fontSize: 16, background: "none", cursor: "pointer" }}>+</button>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="uc" style={{ color: "var(--ink-soft)", fontSize: 9, marginBottom: 6 }}>Total</div>
          <div className="blk-h" style={{ fontSize: 36, color: "var(--royal)" }}>₹{total.toLocaleString("en-IN")}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <Button className="btn solid" style={{ flex: 1, justifyContent: "center", height: "auto" }} onClick={() => store.add(it, qty, variant)}>Add to Bag <span className="arrow">→</span></Button>
        <ActionIcon variant="default" className="btn" style={{ width: 48, height: 48, padding: 0 }} title="Wishlist" aria-label="Save to wishlist" onClick={() => store.toggleWish(it)}>
          {store.inWish(it.id) ? "♥" : "♡"}
        </ActionIcon>
      </div>
      <Button className="btn" style={{ width: "100%", justifyContent: "center", marginTop: 12, height: "auto" }} onClick={() => { store.add(it, qty, variant, false); setRoute("checkout"); }}>Buy it now</Button>
      <div style={{ display: "flex", gap: 18, justifyContent: "center", marginTop: 16, fontSize: 12, color: "var(--ink-soft)", flexWrap: "wrap" }}><span>Free shipping over ₹2,000</span><span>·</span><span>14-day returns</span><span>·</span><span>UPI · Cards · COD</span></div>

      <div style={{ marginTop: 30, padding: "18px 20px", border: "1px solid var(--gold-line)", background: "var(--paper)", display: "flex", gap: 18, alignItems: "center" }}>
        <Lotus size={36} color="var(--royal)" />
        <div>
          <div className="serif" style={{ fontSize: 18, fontWeight: 500 }}>Blessed before dispatch</div>
          <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>Every idol & chowki receives a tilak at our workshop shrine.</div>
        </div>
      </div>
    </div>
  );
}

export function TabContent({ tab, it }: { tab: string; it: ProductType; tiers?: any[]; unitPrice?: number }) {
  if (tab === "story") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }} className="co-grid">
      <div>
        <div className="hindi" style={{ fontSize: 22, color: "var(--maroon)", marginBottom: 10 }}>हाथ की कला</div>
        <h3 className="serif" style={{ fontSize: 36, fontWeight: 400, margin: "0 0 18px", letterSpacing: "-0.01em" }}>
          A <em>devotional object</em>, four hands deep.
        </h3>
        <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--ink-soft)", margin: "0 0 16px" }}>
          {it.name} is hand-turned from seasoned mango wood, then embossed in low relief with traditional Pichwai motifs — Shrinathji's robe, the cow & calf, the lotus, the peacock. The motifs are then painted in stone-ground mineral pigment (lapis blue, malachite green, cinnabar pink) by our master Pichwai artisans.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--ink-soft)" }}>
          A beeswax wash is applied to fix the pigment and warm the wood. Brass fittings are forged separately and inset by hand. Each piece carries our atelier stamp on the underside and is blessed at our workshop shrine before dispatch.
        </p>
        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, border: "1px solid var(--gold-line)" }}>
          {[["7 days", "total lead"], ["4 hands", "passes through"], ["100%", "hand-painted"]].map(([n, l], i) => (
            <div key={i} style={{ padding: "20px 18px", borderRight: i < 2 ? "1px solid var(--gold-line)" : "none" }}>
              <div className="serif" style={{ fontSize: 26, fontWeight: 500, lineHeight: 1, color: "var(--maroon)" }}>{n}</div>
              <div className="uc" style={{ color: "var(--ink-soft)", marginTop: 8 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div><ArchPH slotId={`story-${it.id}`} placeholder={`Process · ${it.name}`} tone="maroon" height={460} /></div>
    </div>
  );
  if (tab === "specs") return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, border: "1px solid var(--gold-line)" }} className="g4">
      {[
        ["Material", "Mango wood + brass"], ["Dimensions", "12\" × 9\" × 4\""], ["Weight", "720 g"], ["Finish", "Beeswax + gold"],
        ["Painting", "Hand-Pichwai"], ["Origin", "Sardarpura, Jodhpur"], ["Lead time", `${it.leadDays} days`], ["Hallmark", "House of Jodhana seal"],
      ].map(([k, v], i) => {
        const row = Math.floor(i / 4), col = i % 4;
        return (
          <div key={i} style={{ padding: "22px 20px", borderRight: col < 3 ? "1px solid var(--gold-line)" : "none", borderBottom: row < 1 ? "1px solid var(--gold-line)" : "none" }}>
            <div className="uc" style={{ color: "var(--ink-soft)", marginBottom: 10 }}>{k}</div>
            <div className="serif" style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.1 }}>{v}</div>
          </div>
        );
      })}
    </div>
  );
  if (tab === "care") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }} className="co-grid">
      <div>
        <h3 className="serif" style={{ fontSize: 30, fontWeight: 400, margin: "0 0 16px" }}>Materials, named.</h3>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {[
            ["Mango wood", "Seasoned 9 months · sustainably sourced"],
            ["Brass fittings", "Solid · forged in Moradabad"],
            ["Lapis lazuli", "Mineral blue · stone-ground"],
            ["Malachite", "Mineral green · for foliage"],
            ["Beeswax", "Wayanad apiary · final wash"],
          ].map(([n, d], i) => (
            <li key={i} style={{ display: "grid", gridTemplateColumns: "40px 1fr", padding: "16px 0", borderBottom: "1px solid var(--line)" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: ["#8B5A2B", "#B8924A", "#1E3A8A", "#10B981", "#E8C97A"][i], border: "1px solid var(--ink)" }} />
              <div>
                <div className="serif" style={{ fontSize: 20, fontWeight: 500 }}>{n}</div>
                <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>{d}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="serif" style={{ fontSize: 30, fontWeight: 400, margin: "0 0 16px" }}>Care, simply.</h3>
        <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {["Wipe with a soft dry cotton cloth once a week.", "Avoid direct sun beyond four hours per day.", "Polish brass fittings with a touch of lemon and ash.", "Do not wash with water; if needed, dab with dry muslin."].map((x, i) => (
            <li key={i} style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: 14, padding: "16px 0", borderBottom: "1px solid var(--line)" }}>
              <span className="serif" style={{ fontSize: 26, fontStyle: "italic", color: "var(--gold-line)", lineHeight: 1 }}>{["i", "ii", "iii", "iv"][i]}.</span>
              <span style={{ fontSize: 15, lineHeight: 1.5 }}>{x}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
  if (tab === "shipping") return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, border: "1px solid var(--gold-line)" }}>
      {[
        ["Within India", "3 – 7 days", "Free over ₹2,000 · ₹120 below"],
        ["Worldwide", "8 – 18 days", "DDP available · 47 countries"],
        ["Returns", "14 days", "Hassle-free · refund or exchange"],
      ].map(([t, d, m], i) => (
        <div key={i} style={{ padding: "30px 28px", borderRight: i < 2 ? "1px solid var(--gold-line)" : "none" }}>
          <div className="serif" style={{ fontSize: 26, fontWeight: 500, margin: "0 0 8px" }}>{t}</div>
          <div className="serif" style={{ fontSize: 36, fontWeight: 500, color: "var(--maroon)", lineHeight: 1 }}>{d}</div>
          <div style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 10 }}>{m}</div>
        </div>
      ))}
    </div>
  );
  return null;
}

export function ArtisanStrip({ it }: { it?: any }) {
  return (
    <section style={{ padding: "80px 40px", background: "var(--maroon-deep)", color: "var(--paper)" }}>
      <div style={{ maxWidth: 1480, margin: "0 auto", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 40, alignItems: "center" }} className="co-grid">
        <div className="ph dark" style={{ width: 120, height: 120, borderRadius: "50%", position: "relative", overflow: "hidden" }}>
          {/* IMAGE SLOT: "artisan-portrait" — Round artisan profile avatar photo */}
          <Slot id="artisan-portrait" placeholder="" shape="circle" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "var(--gold-soft)", fontFamily: "'Cormorant Garamond',serif", fontSize: 44, fontStyle: "italic", pointerEvents: "none" }}>L</div>
        </div>
        <div>
          <div className="uc" style={{ color: "var(--gold-soft)", marginBottom: 10 }}>Hand-painted by</div>
          <div className="serif" style={{ fontSize: 36, fontWeight: 500, lineHeight: 1 }}>Lakshmi Devi <span style={{ fontStyle: "italic", opacity: 0.6, fontSize: 24 }}>& atelier of 6</span></div>
          <div style={{ marginTop: 8, color: "rgba(248,239,216,0.75)", fontSize: 14 }}>Master Pichwai painter · 5th-generation lineage · Nathdwara</div>
        </div>
        <Button className="btn" style={{ borderColor: "var(--gold-soft)", color: "var(--gold-soft)", height: "auto" }}>Read her story <span className="arrow">→</span></Button>
      </div>
    </section>
  );
}

export function Related({ openProduct, it }: { openProduct: (p: ProductType) => void; it: ProductType }) {
  const related = PRODUCTS.filter(p => p.cat === it.cat && p.id !== it.id).slice(0, 4);
  return (
    <section style={{ padding: "100px 40px" }}>
      <div style={{ maxWidth: 1480, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
          <div>
            <div className="hindi" style={{ fontSize: 20, color: "var(--gold-line)", marginBottom: 6 }}>इसी संग्रह से</div>
            <h2 className="serif" style={{ fontSize: 48, margin: 0, fontWeight: 400 }}>From the <em>same collection</em></h2>
          </div>
          <div className="uc" style={{ color: "var(--ink-soft)", cursor: "pointer" }}>View all →</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {related.map(r => <ProductCard key={r.id} item={r} onOpen={() => openProduct(r)} />)}
        </div>
      </div>
    </section>
  );
}
