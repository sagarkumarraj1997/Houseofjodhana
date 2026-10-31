import React, { useState as useStateC, useMemo as useMemoC } from "react";
import { Badge, Button, ActionIcon, Group, Box } from "@mantine/core";
import { Slot } from "./Slot";
import { useStore } from "./store";
import { Emblem } from "./shared";
/* CATALOG — Kalinga Arts product catalog */

export interface Product {
  id: string;
  cat: string;
  name: string;
  line?: string;
  price: number;
  mrp: number;
  moq?: number;
  leadDays?: number;
  tone: string;
  tag?: string | null;
}

export const PRODUCTS: Product[] = [
  // CHOWKI
  { id: "CHW·112", cat: "chowki", name: "Shrinathji Pichwai Chowki · 12\"", line: "Wooden · embossed · brass-fitted", price: 2860, mrp: 3400, moq: 1, leadDays: 7, tone: "maroon", tag: "bestseller" },
  { id: "CHW·113", cat: "chowki", name: "Lakshmi-Ganesh Chowki · set of 2", line: "Wooden · meenakari · lotus border", price: 1980, mrp: 2400, moq: 1, leadDays: 7, tone: "saffron", tag: "festive" },
  { id: "CHW·114", cat: "chowki", name: "Cow & Calf Embossed Chowki", line: "Wooden · hand-painted", price: 1280, mrp: 1500, moq: 2, leadDays: 6, tone: "emerald", tag: null },
  { id: "CHW·115", cat: "chowki", name: "Mini Meenakari Chowki · 4\"", line: "Single diya · velvet base", price: 56, mrp: 80, moq: 6, leadDays: 5, tone: "peacock", tag: "new" },
  { id: "CHW·116", cat: "chowki", name: "Royal Jharokha Chowki · 18\"", line: "Brass-fitted · double tier", price: 3440, mrp: 4000, moq: 1, leadDays: 9, tone: "dark", tag: "premium" },
  { id: "CHW·117", cat: "chowki", name: "Peacock Border Chowki · set of 3", line: "Wooden · embossed Pichwai", price: 2240, mrp: 2700, moq: 1, leadDays: 8, tone: "maroon", tag: null },
  // THALI
  { id: "THL·201", cat: "thali", name: "Lakshmi Ganesh Brass Thali · 6-pc", line: "Velvet box · puja kit", price: 1580, mrp: 1900, moq: 1, leadDays: 5, tone: "dark", tag: "bestseller" },
  { id: "THL·202", cat: "thali", name: "Marble Meenakari Thali · 10\"", line: "Hand-painted · kundan", price: 980, mrp: 1200, moq: 2, leadDays: 6, tone: "emerald", tag: null },
  { id: "THL·203", cat: "thali", name: "Peacock White-Metal Thali", line: "Engraved · 12\"", price: 680, mrp: 850, moq: 3, leadDays: 5, tone: "peacock", tag: "festive" },
  { id: "THL·204", cat: "thali", name: "Mini Pooja Thali · gifting size", line: "Brass · velvet box", price: 145, mrp: 200, moq: 6, leadDays: 4, tone: "saffron", tag: "new" },
  { id: "THL·205", cat: "thali", name: "Royal Brass Thali · 14-piece set", line: "Complete puja set", price: 2840, mrp: 3400, moq: 1, leadDays: 8, tone: "maroon", tag: "premium" },
  { id: "THL·206", cat: "thali", name: "Swastik Engraved Thali", line: "Brass · 8\"", price: 420, mrp: 520, moq: 4, leadDays: 5, tone: "dark", tag: null },
  // KAMDHENU
  { id: "KAM·301", cat: "kamdhenu", name: "Kamdhenu Brass Idol · 6\"", line: "Antique finish · wooden base", price: 1240, mrp: 1500, moq: 1, leadDays: 6, tone: "saffron", tag: "bestseller" },
  { id: "KAM·302", cat: "kamdhenu", name: "Kamdhenu Marble Idol · 8\"", line: "Hand-painted · meenakari", price: 2180, mrp: 2600, moq: 1, leadDays: 7, tone: "emerald", tag: null },
  { id: "KAM·303", cat: "kamdhenu", name: "Mini Cow & Calf · brass · 3\"", line: "Pocket idol · gifting", price: 480, mrp: 580, moq: 4, leadDays: 5, tone: "dark", tag: "new" },
  { id: "KAM·304", cat: "kamdhenu", name: "Royal Kamdhenu · 12\" copper-brass", line: "Lakshmi seated under", price: 4200, mrp: 4800, moq: 1, leadDays: 10, tone: "maroon", tag: "premium" },
  // GIFTS
  { id: "GFT·401", cat: "gifts", name: "Pichwai Painted Jar · set of 4", line: "Stainless · metal tray", price: 1840, mrp: 2200, moq: 1, leadDays: 6, tone: "maroon", tag: "bestseller" },
  { id: "GFT·402", cat: "gifts", name: "Rudraksh & Bell Gift Box", line: "Velvet-lined · kalāva", price: 680, mrp: 820, moq: 2, leadDays: 4, tone: "emerald", tag: "festive" },
  { id: "GFT·403", cat: "gifts", name: "Crystal Tea-Light Holder · 4-pc", line: "Brass base · diwali", price: 980, mrp: 1180, moq: 2, leadDays: 5, tone: "saffron", tag: null },
  { id: "GFT·404", cat: "gifts", name: "Pooja Bowl & Spoon Set · brass", line: "Mini puja kit", price: 320, mrp: 400, moq: 4, leadDays: 4, tone: "dark", tag: "new" },
  { id: "GFT·405", cat: "gifts", name: "Pichwai Hamper · grand box", line: "Jar + thali + bell + diya", price: 5600, mrp: 6500, moq: 1, leadDays: 10, tone: "maroon", tag: "premium" },
  { id: "GFT·406", cat: "gifts", name: "Marble Diya Set · meenakari · 4", line: "Lotus engraved", price: 760, mrp: 900, moq: 3, leadDays: 5, tone: "peacock", tag: null },
];

export const CATS = [
  { id: "all", label: "All Categories", hindi: "सब" },
  { id: "chowki", label: "Wooden Chowki", hindi: "चौकी" },
  { id: "thali", label: "Pooja Thali", hindi: "पूजा थाली" },
  { id: "kamdhenu", label: "Kamdhenu", hindi: "कामधेनु" },
];

export interface CatalogProps {
  openProduct: (p: Product) => void;
  initialCat?: string;
}

export function Catalog({ openProduct, initialCat = "all" }: CatalogProps) {
  const [cat, setCat] = useStateC(initialCat);
  const [sort, setSort] = useStateC("curated");
  const [price, setPrice] = useStateC<[number, number]>([0, 6000]);
  const [view, setView] = useStateC<"editorial" | "dense">("editorial");

  const items = useMemoC(() => {
    let r = PRODUCTS.slice();
    // Gift sets live on their own Gifting page — exclude them from the main catalog
    r = r.filter(x => x.cat !== "gifts");
    if (cat !== "all") r = r.filter(x => x.cat === cat);
    r = r.filter(x => x.price >= price[0] && x.price <= price[1]);
    if (sort === "price-asc") r.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r.sort((a, b) => b.price - a.price);
    return r;
  }, [cat, sort, price]);

  return (
    <div>
      {/* heading */}
      <section style={{ padding: "60px 40px 0", borderBottom: "1px solid var(--gold-line)", background: "var(--paper)" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto" }}>
          <div className="uc" style={{ color: "var(--ink-soft)", marginBottom: 14 }}>Home / Catalog / Festive 2026</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 30, gap: 40, flexWrap: "wrap" }}>
            <div>
              <div className="hindi" style={{ fontSize: 26, color: "var(--maroon)", marginBottom: 10 }}>हमारा संग्रह</div>
              <h1 className="blk-h" style={{ fontSize: "clamp(52px,7vw,112px)", margin: "0 0 18px" }}>
                The <em>complete</em><br /><span className="blk-chip">Catalog</span>
              </h1>
              <p style={{ fontSize: 16, color: "var(--ink-soft)", maxWidth: 580, margin: 0, lineHeight: 1.5 }}>
                Every chowki, thali, Kamdhenu and gift set we make — hand-finished in our Sardarpura workshop, Jodhpur.
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="uc" style={{ color: "var(--ink-soft)", marginBottom: 8 }}>Showing</div>
              <div className="serif" style={{ fontSize: 42, lineHeight: 1 }}>{items.length} <span style={{ color: "var(--ink-soft)", fontSize: 24, fontStyle: "italic" }}>of {PRODUCTS.filter(p => p.cat !== "gifts").length}</span></div>
            </div>
          </div>

          {/* category tabs */}
          <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
            {CATS.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)} style={{ padding: "16px 24px", fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontStyle: cat === c.id ? "italic" : "normal", fontWeight: 500, color: cat === c.id ? "var(--maroon)" : "var(--ink-soft)", borderBottom: cat === c.id ? "2px solid var(--maroon)" : "2px solid transparent", whiteSpace: "nowrap", transition: "all .25s", display: "flex", alignItems: "baseline", gap: 10, background: "none", border: "none", cursor: "pointer" }}>
                <span className="hindi" style={{ fontSize: 14, opacity: 0.7 }}>{c.hindi}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* sub-toolbar */}
      <section style={{ padding: "22px 40px", borderBottom: "1px solid var(--gold-line)", background: "var(--ivory-2)", position: "sticky", top: 112, zIndex: 50 }}>
        <div style={{ maxWidth: 1480, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            <FilterDropdown label="Sort" value={sortLabel(sort)} options={["Curated", "Price · low to high", "Price · high to low"]} onChange={(v) => setSort(sortKey(v))} />
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span className="uc" style={{ color: "var(--ink-soft)" }}>Price ₹{price[0]} – ₹{price[1]}</span>
              <input type="range" min="0" max="6000" step="100" value={price[1]} onChange={e => setPrice([0, parseInt(e.target.value)])} style={{ width: 160, accentColor: "var(--maroon)" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span className="uc" style={{ color: "var(--ink-soft)" }}>View</span>
            <button onClick={() => setView("editorial")} className="uc" style={{ color: view === "editorial" ? "var(--maroon)" : "var(--ink-soft)", borderBottom: view === "editorial" ? "1px solid var(--maroon)" : "1px solid transparent", paddingBottom: 2, background: "none", border: "none", cursor: "pointer" }}>Editorial</button>
            <button onClick={() => setView("dense")} className="uc" style={{ color: view === "dense" ? "var(--maroon)" : "var(--ink-soft)", borderBottom: view === "dense" ? "1px solid var(--maroon)" : "1px solid transparent", paddingBottom: 2, background: "none", border: "none", cursor: "pointer" }}>Dense</button>
          </div>
        </div>
      </section>

      <section style={{ padding: "50px 40px" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto" }}>
          {view === "editorial" ? <EditorialGrid items={items} openProduct={openProduct} /> : <DenseGrid items={items} openProduct={openProduct} />}
        </div>
      </section>

      {/* discovery footer */}
      <section style={{ padding: "80px 40px", background: "var(--ivory-2)", borderTop: "1px solid var(--gold-line)" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {[
            { t: "Made in Jodhpur", d: "Every piece is shaped, painted and blessed in our Sardarpura haveli — never outsourced.", cta: "Our story" },
            { t: "Custom Pichwai", d: "Want your family deity or a special motif painted? Our Pichwai master will design it with you.", cta: "Contact us" },
            { t: "Festive gifting", d: "Diwali · Janmashtami · Holi. Velvet-boxed, kalāva-tied and ready to give.", cta: "Shop gifts" },
          ].map((c, i) => (
            <div key={i} style={{ padding: 32, border: "1px solid var(--maroon)", background: "var(--paper)", position: "relative" }}>
              <div className="serif" style={{ fontSize: 42, color: "var(--gold-line)", fontStyle: "italic", lineHeight: 1, position: "absolute", top: 20, right: 26 }}>0{i + 1}</div>
              <div className="blk-h" style={{ fontSize: 30, margin: "0 0 14px", maxWidth: 250 }}>{c.t}</div>
              <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.55, marginBottom: 24 }}>{c.d}</div>
              <Button className="btn" style={{ padding: "12px 20px", height: "auto" }}>{c.cta} <span className="arrow">→</span></Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function sortLabel(k: string) { return ({ curated: "Curated", "price-asc": "Price · low to high", "price-desc": "Price · high to low" } as Record<string, string>)[k] || "Curated"; }
export function sortKey(l: string) { return ({ "Curated": "curated", "Price · low to high": "price-asc", "Price · high to low": "price-desc" } as Record<string, string>)[l] || "curated"; }

export function FilterDropdown({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useStateC(false);
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "1px solid var(--ink)", background: "var(--paper)", fontSize: 12, letterSpacing: 0.14, textTransform: "uppercase", cursor: "pointer" }}>
        <span className="mono" style={{ color: "var(--ink-soft)" }}>{label}:</span>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontStyle: "italic", textTransform: "none", letterSpacing: 0 }}>{value}</span>
        <span style={{ transition: "transform .3s", transform: open ? "rotate(180deg)" : "none" }}>▾</span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 60 }} />
          <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, minWidth: 240, background: "var(--paper)", border: "1px solid var(--ink)", zIndex: 70, boxShadow: "4px 4px 0 var(--maroon)" }}>
            {options.map(o => (
              <div key={o} onClick={() => { onChange(o); setOpen(false); }} style={{ padding: "12px 16px", fontFamily: "'Cormorant Garamond',serif", fontSize: 17, cursor: "pointer", fontStyle: value === o ? "italic" : "normal", background: value === o ? "var(--ivory-2)" : "transparent", borderBottom: "1px solid var(--line)" }}>
                {o}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function EditorialGrid({ items, openProduct }: { items: Product[]; openProduct: (p: Product) => void }) {
  const pattern = [[6, 3, 3], [3, 3, 6], [4, 4, 4], [3, 6, 3]];
  let i = 0;
  const rows = [];
  let r = 0;
  while (i < items.length) {
    const p = pattern[r % pattern.length];
    const row = [];
    for (const span of p) {
      if (i >= items.length) break;
      row.push({ span, item: items[i++] });
    }
    rows.push(row);
    r++;
  }
  return (
    <div style={{ display: "grid", gap: 24 }}>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: 24 }}>
          {row.map(({ span, item }, ci) => (
            <div key={ci} style={{ gridColumn: `span ${span}` }}>
              <ProductCard item={item} hero={span >= 6} onOpen={() => openProduct(item)} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function DenseGrid({ items, openProduct }: { items: Product[]; openProduct: (p: Product) => void }) {
  return (
    <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
      {items.map(it => <ProductCard key={it.id} item={it} onOpen={() => openProduct(it)} />)}
    </div>
  );
}

export function ProductCard({ item, hero = false, onOpen }: { item: Product; hero?: boolean; onOpen: () => void }) {
  const store = useStore();
  const [h, setH] = useStateC(false);
  return (
    <article
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      onClick={onOpen}
      onMouseMove={e => {
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        const im = e.currentTarget.firstChild as HTMLElement;
        if (im) im.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(20px)`;
      }}
      style={{ cursor: "pointer", position: "relative" }}
    >
      <div style={{ position: "relative", overflow: "hidden", transition: "transform .6s cubic-bezier(.16,1,.3,1)", transform: h ? undefined : "none", boxShadow: h ? "0 30px 60px rgba(6,23,63,.18)" : "none" }}>
        <div className={`ph ${item.tone}`} style={{ height: hero ? 520 : 380, position: "relative" }}>
          {/* IMAGE SLOT: "pc-<product_id>" (e.g. "pc-CHW·112", "pc-THL·204") — Main catalog product card photo */}
          <Slot id={`pc-${item.id}`} placeholder={`Drop ${item.name} photo`} shape="rounded" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: h ? "scale(1.04)" : "scale(1)", transition: "transform 1s cubic-bezier(.2,.7,.2,1)" }} />
          <div style={{ position: "absolute", right: 10, bottom: 10, zIndex: 5, opacity: h ? 0 : .9, transition: "opacity .3s" }}><Emblem variant="white" size={26} /></div>
        </div>
        {item.tag && (
          <Badge
            variant="filled"
            size="sm"
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              padding: "6px 12px",
              background: "rgba(251,247,239,.92)",
              color: "var(--ink)",
              borderRadius: 999,
              fontSize: 8.5,
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              zIndex: 5,
            }}
          >
            {item.tag}
          </Badge>
        )}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(180deg,transparent,rgba(6,23,63,0.8))", opacity: h ? 1 : 0, transition: "opacity .35s", color: "var(--paper)", zIndex: 5 }}>
          <span className="uc" style={{ fontSize: 9 }}>Ships in {item.leadDays} days</span>
          <Group gap={6}>
            <ActionIcon
              variant="default"
              aria-label="Save to wishlist"
              onClick={e => { e.stopPropagation(); store.toggleWish(item); }}
              style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--paper)", color: "var(--ink)", border: "none" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={store.inWish(item.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6"><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 6-8 11-8 11z" /></svg>
            </ActionIcon>
            <Button
              size="xs"
              onClick={e => { e.stopPropagation(); store.add(item, 1, "Standard · 12\""); }}
              style={{ padding: "8px 16px", borderRadius: 999, background: "var(--paper)", color: "var(--ink)", fontSize: 10, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", height: "auto" }}
            >
              Add to Bag +
            </Button>
          </Group>
        </div>
      </div>
      <div style={{ padding: "22px 2px 0", textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span className="uc" style={{ color: "var(--ink-soft)" }}>{(CATS.find(c => c.id === item.cat)?.label) || "Gift Set"}</span>
        </div>
        <div className="serif" style={{ fontSize: hero ? 28 : 21, fontWeight: 400, lineHeight: 1.25, minHeight: hero ? 54 : 48, color: h ? "var(--royal)" : "var(--ink)", transition: "color .4s" }}>{item.name}</div>
        <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic" }}>{item.line}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 14 }}>
          <div>
            <span style={{ fontSize: 14, fontWeight: 400, letterSpacing: ".08em", color: "var(--ink)" }}>₹{item.price.toLocaleString("en-IN")}</span>
            <span style={{ fontSize: 12, color: "var(--ink-soft)", marginLeft: 8, textDecoration: "line-through" }}>₹{item.mrp.toLocaleString("en-IN")}</span>
          </div>
          <span className="uc" style={{ fontSize: 9, color: "var(--turq)" }}>{Math.round((1 - item.price / item.mrp) * 100)}% off</span>
        </div>
      </div>
    </article>
  );
}
