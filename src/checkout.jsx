import React, { useState as useSC, useEffect as useEC } from "react";
import { Slot } from "./Slot.jsx";
import { useStore, rupee } from "./store.jsx";
import { Emblem } from "./shared.jsx";
import { PRODUCTS, ProductCard } from "./catalog.jsx";
/* CART · CHECKOUT · CONFIRMATION · ACCOUNT */
export const CODES = { DIWALI26: { t: "pct", v: 15, min: 2000, label: "15% off · Diwali" }, KHAMMAGHANI: { t: "flat", v: 250, min: 1500, label: "₹250 off · Welcome" }, PICHWAI10: { t: "pct", v: 10, min: 0, label: "10% off" } };
export const calcDisc = (code, sub) => { const c = CODES[code]; if (!c || sub < c.min) return 0; return c.t === "pct" ? Math.round(sub * c.v / 100) : c.v; };

export function Crumbs({ step }) {
  const steps = ["Bag", "Information", "Delivery", "Payment"];
  return <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>{steps.map((x, i) => <React.Fragment key={x}><span className="uc" style={{ fontSize: 9.5, letterSpacing: ".3em", color: i === step ? "var(--ink)" : i < step ? "var(--royal)" : "var(--ink-soft)", opacity: i > step ? .5 : 1 }}>{x}</span>{i < steps.length - 1 && <span style={{ width: 24, height: 1, background: "var(--line-strong)" }} />}</React.Fragment>)}</div>;
}

export function Summary({ s, code, setCode, ship, editable }) {
  const [inp, setInp] = useSC(code || ""); const [err, setErr] = useSC("");
  const disc = calcDisc(code, s.subtotal); const total = s.subtotal - disc + (ship || 0);
  const apply = () => { const c = inp.trim().toUpperCase(); if (!CODES[c]) return setErr("This code isn't valid"); if (s.subtotal < CODES[c].min) return setErr(`Minimum order ${rupee(CODES[c].min)}`); setErr(""); setCode(c); s.flash(`${c} applied`); };
  return (
    <aside style={{ background: "var(--sand)", padding: "34px 32px", position: "sticky", top: 130, alignSelf: "start" }}>
      <div className="uc" style={{ fontSize: 9.5, letterSpacing: ".36em", color: "var(--ink-soft)", marginBottom: 20 }}>Order summary</div>
      <div style={{ display: "grid", gap: 16, maxHeight: 300, overflow: "auto", paddingRight: 4 }}>
        {s.cart.map(it => <div key={it.key} style={{ display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 14, alignItems: "center" }}>
          <div style={{ position: "relative" }}><div className={`ph ${it.tone}`} style={{ height: 72 }}><Slot id={`pc-${it.id}`} placeholder="" shape="rounded" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} /></div><span style={{ position: "absolute", top: -7, right: -7, minWidth: 20, height: 20, borderRadius: 10, background: "var(--midnight)", color: "var(--ivory)", fontSize: 10, display: "grid", placeItems: "center" }}>{it.qty}</span></div>
          <div><div className="serif" style={{ fontSize: 16, lineHeight: 1.2 }}>{it.name}</div><div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{it.variant}</div></div>
          <span style={{ fontSize: 13 }}>{rupee(it.price * it.qty)}</span>
        </div>)}
      </div>
      {editable !== false && <div style={{ marginTop: 24, paddingTop: 22, borderTop: "1px solid var(--line)" }}>
        <div style={{ display: "flex", gap: 10 }}><input className="st-in" style={{ height: 42, textTransform: "uppercase", letterSpacing: ".1em" }} placeholder="Gift card or discount code" value={inp} onChange={e => setInp(e.target.value)} /><button className="btn" style={{ padding: "10px 20px" }} onClick={apply}>Apply</button></div>
        {err && <div className="st-err">{err}</div>}
        {code && !err && <div style={{ fontSize: 12, color: "var(--royal)", marginTop: 8, display: "flex", justifyContent: "space-between" }}><span>{code} · {CODES[code].label}</span><button onClick={() => { setCode(""); setInp(""); }} style={{ fontSize: 12, color: "var(--ink-soft)" }}>Remove</button></div>}
        {!code && <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 8 }}>Try DIWALI26 or KHAMMAGHANI</div>}
      </div>}
      <div style={{ display: "grid", gap: 10, marginTop: 22, paddingTop: 22, borderTop: "1px solid var(--line)", fontSize: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--ink-soft)" }}>Subtotal</span><span>{rupee(s.subtotal)}</span></div>
        {disc > 0 && <div style={{ display: "flex", justifyContent: "space-between", color: "var(--royal)" }}><span>Discount</span><span>−{rupee(disc)}</span></div>}
        <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--ink-soft)" }}>Shipping</span><span>{ship == null ? "Next step" : ship === 0 ? "Free" : rupee(ship)}</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 14, borderTop: "1px solid var(--line)", marginTop: 4 }}><span className="uc" style={{ fontSize: 10 }}>Total</span><span className="serif" style={{ fontSize: 30 }}>{rupee(total)}</span></div>
        <div style={{ fontSize: 11, color: "var(--ink-soft)" }}>Including {rupee((s.subtotal - disc) * 12 / 112)} GST</div>
      </div>
    </aside>
  );
}

export function CartPage({ setRoute, openProduct }) {
  const s = useStore(); const [code, setCode] = useSC(() => sessionStorage.getItem("hoj-code") || "");
  useEC(() => sessionStorage.setItem("hoj-code", code), [code]);
  const recs = PRODUCTS.filter(p => !s.cart.some(c => c.id === p.id)).slice(0, 4);
  return (
    <div style={{ padding: "60px 48px 120px", maxWidth: 1400, margin: "0 auto" }}>
      <Crumbs step={0} />
      <h1 className="blk-h" style={{ fontSize: "clamp(42px,5vw,80px)", fontWeight: 400, margin: "30px 0 50px" }}>Your <em>bag</em></h1>
      {s.cart.length === 0 ? <div style={{ textAlign: "center", padding: "80px 0", borderTop: "1px solid var(--line)" }}><div className="serif" style={{ fontSize: 30, marginBottom: 14 }}>Nothing here yet</div><p style={{ color: "var(--ink-soft)", margin: "0 0 32px" }}>Discover pieces painted by hand in Jodhpur.</p><button className="btn solid" onClick={() => setRoute("catalog")}>Explore the collection <span className="arrow">→</span></button></div> :
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) minmax(320px,1fr)", gap: 60 }} className="co-grid">
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 110px", gap: 20, padding: "0 0 14px", borderBottom: "1px solid var(--line)" }} className="uc co-hd"><span style={{ fontSize: 9.5 }}>Piece</span><span style={{ fontSize: 9.5, textAlign: "center" }}>Quantity</span><span style={{ fontSize: 9.5, textAlign: "right" }}>Total</span></div>
            {s.cart.map(it => <div key={it.key} style={{ display: "grid", gridTemplateColumns: "1fr 120px 110px", gap: 20, alignItems: "center", padding: "28px 0", borderBottom: "1px solid var(--line)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 24, alignItems: "center" }}>
                <div className={`ph ${it.tone}`} style={{ height: 136, cursor: "pointer" }} onClick={() => { const p = PRODUCTS.find(x => x.id === it.id); p && openProduct(p); }}><Slot id={`pc-${it.id}`} placeholder="" shape="rounded" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} /></div>
                <div><div className="serif" style={{ fontSize: 22, lineHeight: 1.2 }}>{it.name}</div><div style={{ fontSize: 13, color: "var(--ink-soft)", margin: "6px 0 4px" }}>{it.variant} · {rupee(it.price)} each</div><div style={{ fontSize: 12, color: "var(--ink-soft)" }}>Made in Jodhpur · ships in 5–7 days</div>
                  <div style={{ display: "flex", gap: 20, marginTop: 14 }}><button className="uc" style={{ fontSize: 9, borderBottom: "1px solid currentColor", color: "var(--ink-soft)" }} onClick={() => s.remove(it.key)}>Remove</button><button className="uc" style={{ fontSize: 9, borderBottom: "1px solid currentColor", color: "var(--ink-soft)" }} onClick={() => { s.toggleWish(it); s.remove(it.key); }}>Save for later</button></div></div>
              </div>
              <div style={{ textAlign: "center" }}><div className="st-qty"><button onClick={() => s.setQty(it.key, it.qty - 1)} aria-label="Decrease">−</button><span>{it.qty}</span><button onClick={() => s.setQty(it.key, it.qty + 1)} aria-label="Increase">+</button></div></div>
              <div style={{ textAlign: "right", fontSize: 15 }}>{rupee(it.price * it.qty)}</div>
            </div>)}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 40 }} className="co-perks">{[["Gift wrapping", "Velvet box & kalāva ribbon"], ["Free shipping", "Across India over ₹2,000"], ["Blessed", "A tilak before dispatch"]].map(([t, d]) => <div key={t} style={{ padding: "20px 0", borderTop: "1px solid var(--line)" }}><div className="uc" style={{ fontSize: 9.5, marginBottom: 6 }}>{t}</div><div style={{ fontSize: 13, color: "var(--ink-soft)" }}>{d}</div></div>)}</div>
          </div>
          <div>
            <Summary s={s} code={code} setCode={setCode} ship={null} />
            <button className="btn solid" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={() => setRoute("checkout")}>Proceed to checkout <span className="arrow">→</span></button>
            <div style={{ textAlign: "center", fontSize: 11, color: "var(--ink-soft)", marginTop: 14, letterSpacing: ".08em" }}>Secure checkout · UPI · Cards · Net banking · COD</div>
          </div>
        </div>}
      {recs.length > 0 && <div style={{ marginTop: 120 }}><div className="uc" style={{ fontSize: 9.5, letterSpacing: ".36em", color: "var(--ink-soft)", marginBottom: 16 }}>Complete the altar</div><h2 className="blk-h" style={{ fontSize: 40, fontWeight: 400, margin: "0 0 40px" }}>You may also <em>love</em></h2><div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 32 }}>{recs.map(p => <ProductCard key={p.id} item={p} onOpen={() => openProduct(p)} />)}</div></div>}
    </div>
  );
}

export function Checkout({ setRoute, setLastOrder }) {
  const s = useStore();
  const [step, setStep] = useSC(1); const [code, setCode] = useSC(() => sessionStorage.getItem("hoj-code") || "");
  const [a, setA] = useSC({ email: s.user?.email || "", first: s.user?.first || "", last: s.user?.last || "", line1: "", line2: "", city: "", state: "Rajasthan", pin: "", phone: s.user?.phone || "", country: "India", gift: false, note: "" });
  const [err, setErr] = useSC({}); const [ship, setShip] = useSC("standard"); const [pay, setPay] = useSC("upi"); const [upi, setUpi] = useSC(""); const [busy, setBusy] = useSC(false);
  useEC(() => { if (s.user) setA(x => ({ ...x, email: x.email || s.user.email, first: x.first || s.user.first, last: x.last || s.user.last })); }, [s.user]);
  useEC(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);
  if (s.cart.length === 0) return <div style={{ padding: "140px 48px", textAlign: "center" }}><div className="serif" style={{ fontSize: 32, marginBottom: 20 }}>Your bag is empty</div><button className="btn solid" onClick={() => setRoute("catalog")}>Explore the collection</button></div>;
  const set = (k, v) => setA(x => ({ ...x, [k]: v }));
  const intl = a.country !== "India";
  const opts = intl ? [["intl", "International Express · DHL", "8–12 days", 1450]] : [["standard", "Standard · India Post / Blue Dart", "4–7 days", s.subtotal - calcDisc(code, s.subtotal) >= 2000 ? 0 : 120], ["express", "Express · Blue Dart Priority", "2–3 days", 280]];
  const shipCost = (opts.find(o => o[0] === ship) || opts[0])[3];
  const total = s.subtotal - calcDisc(code, s.subtotal) + (step >= 2 ? shipCost : 0) + (pay === "cod" && step === 3 ? 50 : 0);
  const v1 = () => { const e = {}; if (!/^\S+@\S+\.\S+$/.test(a.email)) e.email = "Enter a valid email";["first", "line1", "city"].forEach(k => { if (!a[k].trim()) e[k] = "Required"; }); if (!intl && !/^\d{6}$/.test(a.pin)) e.pin = "6-digit PIN code"; if (!/^\d{10}$/.test(a.phone.replace(/\D/g, "").slice(-10))) e.phone = "10-digit mobile"; setErr(e); return !Object.keys(e).length; };
  const place = () => { if (pay === "upi" && !/^[\w.\-]+@\w+$/.test(upi)) { setErr({ upi: "Enter a UPI ID like name@okhdfc" }); return; } setBusy(true); setTimeout(() => { const o = s.placeOrder({ items: s.cart, address: a, ship: (opts.find(o => o[0] === ship) || opts[0])[1], shipCost, pay, code, discount: calcDisc(code, s.subtotal), subtotal: s.subtotal, total }); sessionStorage.removeItem("hoj-code"); setLastOrder(o); setRoute("confirm"); }, 1400); };
  const F = ({ k, l, half, ph, type = "text", auto }) => <label style={{ gridColumn: half ? undefined : "1 / -1" }}><span className="st-lbl">{l}</span><input className="st-in" type={type} value={a[k]} placeholder={ph} autoComplete={auto} onChange={e => set(k, e.target.value)} />{err[k] && <div className="st-err">{err[k]}</div>}</label>;
  const Rev = ({ l, v, go }) => <div style={{ display: "grid", gridTemplateColumns: "110px 1fr auto", gap: 16, padding: "16px 0", borderBottom: "1px solid var(--line)", fontSize: 14 }}><span style={{ color: "var(--ink-soft)" }}>{l}</span><span>{v}</span><button className="uc" style={{ fontSize: 9, borderBottom: "1px solid currentColor" }} onClick={() => setStep(go)}>Change</button></div>;
  return (
    <div style={{ padding: "50px 48px 120px", maxWidth: 1400, margin: "0 auto" }}>
      <Crumbs step={step} />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(320px,1fr)", gap: 70, marginTop: 40 }} className="co-grid">
        <div>
          {step === 1 && <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 20, flexWrap: "wrap", marginBottom: 30 }}><h1 className="blk-h" style={{ fontSize: 44, fontWeight: 400, margin: 0 }}>Contact</h1>{!s.user && <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>Have an account? <button className="link" style={{ fontSize: 10 }} onClick={() => s.setAuth("signin")}>Sign in</button></span>}{s.user && <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>Signed in as {s.user.first}</span>}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "26px 28px" }}>
              {F({ k: "email", l: "Email", type: "email", auto: "email" })}
              <label style={{ gridColumn: "1 / -1", display: "flex", gap: 10, fontSize: 13, color: "var(--ink-soft)", marginTop: -10 }}><input type="checkbox" defaultChecked style={{ accentColor: "var(--royal)" }} />Email me order updates and festive edits</label>
            </div>
            <h2 className="blk-h" style={{ fontSize: 32, fontWeight: 400, margin: "50px 0 26px" }}>Delivery address</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "26px 28px" }}>
              <label style={{ gridColumn: "1 / -1" }}><span className="st-lbl">Country</span><select className="st-in" value={a.country} onChange={e => { set("country", e.target.value); setShip(e.target.value === "India" ? "standard" : "intl"); }}>{["India", "United Arab Emirates", "United Kingdom", "United States", "Canada", "Singapore", "Australia"].map(c => <option key={c}>{c}</option>)}</select></label>
              {F({ k: "first", l: "First name", half: true, auto: "given-name" })}{F({ k: "last", l: "Last name", half: true, auto: "family-name" })}
              {F({ k: "line1", l: "Address", ph: "House, street, area", auto: "address-line1" })}{F({ k: "line2", l: "Apartment, landmark (optional)", auto: "address-line2" })}
              {F({ k: "city", l: "City", half: true, auto: "address-level2" })}
              {!intl ? <label><span className="st-lbl">State</span><select className="st-in" value={a.state} onChange={e => set("state", e.target.value)}>{["Rajasthan", "Gujarat", "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "West Bengal", "Uttar Pradesh", "Kerala", "Telangana", "Punjab", "Madhya Pradesh"].map(c => <option key={c}>{c}</option>)}</select></label> : F({ k: "state", l: "State / Region", half: true })}
              {F({ k: "pin", l: intl ? "Postal code" : "PIN code", half: true, auto: "postal-code" })}{F({ k: "phone", l: "Mobile", half: true, ph: "For delivery updates", auto: "tel" })}
              <label style={{ gridColumn: "1 / -1", display: "flex", gap: 10, fontSize: 13, alignItems: "center" }}><input type="checkbox" checked={a.gift} onChange={e => set("gift", e.target.checked)} style={{ accentColor: "var(--royal)" }} />This is a gift — hide prices and add a handwritten note</label>
              {a.gift && <label style={{ gridColumn: "1 / -1" }}><span className="st-lbl">Your note (we'll write it by hand)</span><textarea className="st-in" style={{ height: 80, padding: "10px 2px", resize: "vertical" }} value={a.note} onChange={e => set("note", e.target.value)} placeholder="Shubh Deepavali…" /></label>}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 44 }}><button className="link" style={{ background: "none" }} onClick={() => setRoute("cart")}>← Return to bag</button><button className="btn solid" onClick={() => v1() && setStep(2)}>Continue to delivery <span className="arrow">→</span></button></div>
          </>}
          {step === 2 && <>
            <h1 className="blk-h" style={{ fontSize: 44, fontWeight: 400, margin: "0 0 30px" }}>Delivery</h1>
            <div style={{ marginBottom: 30 }}><Rev l="Contact" v={a.email} go={1} /><Rev l="Ship to" v={`${a.line1}, ${a.city} ${a.pin} · ${a.country}`} go={1} /></div>
            <div style={{ display: "grid", gap: 12 }}>{opts.map(([id, l, eta, c]) => <div key={id} className={`st-opt ${ship === id ? "on" : ""}`} onClick={() => setShip(id)}><span className="st-radio" /><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 500 }}>{l}</div><div style={{ fontSize: 12, color: "var(--ink-soft)" }}>Arrives in {eta} · tracked & insured</div></div><span style={{ fontSize: 14 }}>{c === 0 ? "Free" : rupee(c)}</span></div>)}</div>
            <div style={{ marginTop: 30, padding: "20px 22px", border: "1px solid var(--line)", fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.7 }}>Every piece is wrapped in muslin, cushioned in jute and boxed at our Sardarpura workshop. If anything arrives damaged, we remake it at no cost.</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 44 }}><button className="link" style={{ background: "none" }} onClick={() => setStep(1)}>← Information</button><button className="btn solid" onClick={() => setStep(3)}>Continue to payment <span className="arrow">→</span></button></div>
          </>}
          {step === 3 && <>
            <h1 className="blk-h" style={{ fontSize: 44, fontWeight: 400, margin: "0 0 30px" }}>Payment</h1>
            <div style={{ marginBottom: 30 }}><Rev l="Contact" v={a.email} go={1} /><Rev l="Ship to" v={`${a.line1}, ${a.city} ${a.pin}`} go={1} /><Rev l="Method" v={`${(opts.find(o => o[0] === ship) || opts[0])[1]} · ${shipCost ? rupee(shipCost) : "Free"}`} go={2} /></div>
            <div style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 14 }}>All transactions are secure and encrypted.</div>
            <div style={{ display: "grid", gap: 12 }}>
              {[["upi", "UPI", "Google Pay, PhonePe, Paytm, BHIM"], ["card", "Credit / Debit card", "Visa, Mastercard, RuPay, Amex"], ["net", "Net banking", "All major Indian banks"], ...(!intl ? [["cod", "Cash on delivery", "₹50 handling fee"]] : [])].map(([id, l, d]) => <div key={id}><div className={`st-opt ${pay === id ? "on" : ""}`} onClick={() => { setPay(id); setErr({}); }}><span className="st-radio" /><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 500 }}>{l}</div><div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{d}</div></div></div>
                {pay === id && id === "upi" && <div style={{ padding: "20px 22px", borderLeft: "1px solid var(--line)", borderRight: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}><span className="st-lbl">UPI ID</span><input className="st-in" value={upi} onChange={e => setUpi(e.target.value)} placeholder="yourname@okhdfc" />{err.upi && <div className="st-err">{err.upi}</div>}</div>}
                {pay === id && id === "card" && <div style={{ padding: "20px 22px", borderLeft: "1px solid var(--line)", borderRight: "1px solid var(--line)", borderBottom: "1px solid var(--line)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 24px" }}><label style={{ gridColumn: "1 / -1" }}><span className="st-lbl">Card number</span><input className="st-in" inputMode="numeric" placeholder="1234 5678 9012 3456" autoComplete="cc-number" /></label><label><span className="st-lbl">Expiry</span><input className="st-in" placeholder="MM / YY" autoComplete="cc-exp" /></label><label><span className="st-lbl">CVV</span><input className="st-in" type="password" placeholder="•••" autoComplete="cc-csc" /></label><label style={{ gridColumn: "1 / -1" }}><span className="st-lbl">Name on card</span><input className="st-in" autoComplete="cc-name" /></label></div>}
                {pay === id && id === "net" && <div style={{ padding: "20px 22px", borderLeft: "1px solid var(--line)", borderRight: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}><span className="st-lbl">Bank</span><select className="st-in">{["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra"].map(b => <option key={b}>{b}</option>)}</select></div>}
              </div>)}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 44, gap: 20, flexWrap: "wrap" }}><button className="link" style={{ background: "none" }} onClick={() => setStep(2)}>← Delivery</button><button className="btn solid" style={{ opacity: busy ? .6 : 1 }} disabled={busy} onClick={place}>{busy ? "Placing your order…" : `Pay ${rupee(total)}`} {!busy && <span className="arrow">→</span>}</button></div>
          </>}
        </div>
        <Summary s={s} code={code} setCode={setCode} ship={step >= 2 ? shipCost : null} />
      </div>
    </div>
  );
}

export function Confirmation({ order, setRoute }) {
  const s = useStore();
  if (!order) return <div style={{ padding: "140px 48px", textAlign: "center" }}><button className="btn" onClick={() => setRoute("home")}>Back to home</button></div>;
  const steps = ["Confirmed", "Being crafted", "Blessed & packed", "Shipped", "Delivered"];
  return (
    <div style={{ padding: "80px 48px 140px", maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", border: "1px solid var(--royal)", display: "grid", placeItems: "center", margin: "0 auto 30px", animation: "fadeUp .8s both" }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--royal)" strokeWidth="1.5"><path d="M5 12l5 5 9-10" /></svg></div>
      <div className="hindi" style={{ fontSize: 28, color: "var(--royal)", marginBottom: 14 }}>घणो आभार</div>
      <h1 className="blk-h" style={{ fontSize: "clamp(40px,5vw,76px)", fontWeight: 400, margin: "0 0 20px" }}>Thank you, <em>{order.address.first}</em></h1>
      <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.8, maxWidth: 560, margin: "0 auto 14px" }}>Your order <b style={{ fontWeight: 500, color: "var(--ink)" }}>{order.id}</b> is confirmed. A receipt is on its way to {order.address.email}. Our artisans in Jodhpur will now begin preparing your pieces.</p>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${steps.length},1fr)`, gap: 8, margin: "60px 0", textAlign: "left" }}>{steps.map((x, i) => <div key={x}><div style={{ height: 2, background: i === 0 ? "var(--royal)" : "var(--line)" }} /><div className="uc" style={{ fontSize: 9, marginTop: 10, color: i === 0 ? "var(--ink)" : "var(--ink-soft)" }}>{x}</div></div>)}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, textAlign: "left", padding: "36px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }} className="co-grid">
        <div><div className="uc" style={{ fontSize: 9.5, color: "var(--ink-soft)", marginBottom: 12 }}>Shipping to</div><div style={{ fontSize: 14, lineHeight: 1.8 }}>{order.address.first} {order.address.last}<br />{order.address.line1}{order.address.line2 && <>, {order.address.line2}</>}<br />{order.address.city}, {order.address.state} {order.address.pin}<br />{order.address.country}</div><div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 12 }}>{order.ship}</div></div>
        <div><div className="uc" style={{ fontSize: 9.5, color: "var(--ink-soft)", marginBottom: 12 }}>Summary</div>{order.items.map(it => <div key={it.key} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "4px 0" }}><span>{it.name} × {it.qty}</span><span>{rupee(it.price * it.qty)}</span></div>)}<div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" }}><span className="uc" style={{ fontSize: 10 }}>Paid · {order.pay.toUpperCase()}</span><span className="serif" style={{ fontSize: 24 }}>{rupee(order.total)}</span></div></div>
      </div>
      <div style={{ display: "flex", gap: 24, justifyContent: "center", alignItems: "center", marginTop: 50, flexWrap: "wrap" }}>
        <button className="btn solid" onClick={() => setRoute("catalog")}>Continue shopping <span className="arrow">→</span></button>
        {s.user ? <button className="link" style={{ background: "none" }} onClick={() => setRoute("account")}>Track in your account</button> : <button className="link" style={{ background: "none" }} onClick={() => s.setAuth("signup")}>Create an account to track</button>}
      </div>
    </div>
  );
}

export function Account({ setRoute, openProduct }) {
  const s = useStore(); const [tab, setTab] = useSC("Orders");
  if (!s.user) return <div style={{ padding: "140px 48px", textAlign: "center" }}><Emblem variant="blue" size={70} style={{ margin: "0 auto 26px" }} /><h1 className="blk-h" style={{ fontSize: 52, fontWeight: 400, margin: "0 0 16px" }}>Your <em>account</em></h1><p style={{ color: "var(--ink-soft)", margin: "0 0 36px" }}>Sign in to see your orders, wishlist and saved addresses.</p><div style={{ display: "flex", gap: 16, justifyContent: "center" }}><button className="btn solid" onClick={() => s.setAuth("signin")}>Sign in</button><button className="btn" onClick={() => s.setAuth("signup")}>Create account</button></div></div>;
  const addr = s.orders[0]?.address;
  return (
    <div style={{ padding: "60px 48px 120px", maxWidth: 1300, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, flexWrap: "wrap", marginBottom: 50 }}>
        <div><div className="hindi" style={{ fontSize: 22, color: "var(--royal)", marginBottom: 10 }}>खम्मा घणी सा</div><h1 className="blk-h" style={{ fontSize: "clamp(40px,5vw,72px)", fontWeight: 400, margin: 0 }}>{s.user.first} <em>{s.user.last}</em></h1><div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 10 }}>{s.user.email} · Member since {s.user.since}</div></div>
        <button className="link" style={{ background: "none" }} onClick={() => { s.signOut(); setRoute("home"); }}>Sign out</button>
      </div>
      <div style={{ display: "flex", gap: 34, borderBottom: "1px solid var(--line)", marginBottom: 40, overflowX: "auto" }}>{["Orders", "Wishlist", "Addresses", "Profile"].map(t => <button key={t} onClick={() => setTab(t)} className="uc" style={{ fontSize: 10, padding: "0 0 16px", borderBottom: `1px solid ${tab === t ? "var(--ink)" : "transparent"}`, marginBottom: -1, color: tab === t ? "var(--ink)" : "var(--ink-soft)", whiteSpace: "nowrap" }}>{t}{t === "Orders" ? ` (${s.orders.length})` : t === "Wishlist" ? ` (${s.wish.length})` : ""}</button>)}</div>
      {tab === "Orders" && (s.orders.length === 0 ? <div style={{ padding: "60px 0", textAlign: "center", color: "var(--ink-soft)" }}>No orders yet. <button className="link" style={{ fontSize: 10, marginLeft: 10 }} onClick={() => setRoute("catalog")}>Start shopping</button></div> :
        <div style={{ display: "grid", gap: 20 }}>{s.orders.map(o => <div key={o.id} style={{ border: "1px solid var(--line)", padding: "26px 28px", display: "grid", gridTemplateColumns: "1fr auto", gap: 20 }}>
          <div><div style={{ display: "flex", gap: 16, alignItems: "baseline", flexWrap: "wrap" }}><span className="serif" style={{ fontSize: 22 }}>{o.id}</span><span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{o.date} · {o.items.reduce((a, b) => a + b.qty, 0)} pieces</span><span className="uc" style={{ fontSize: 9, padding: "4px 10px", background: "var(--sand)", borderRadius: 20 }}>{o.status}</span></div><div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 10 }}>{o.items.map(i => i.name).join(" · ")}</div></div>
          <div style={{ textAlign: "right" }}><div className="serif" style={{ fontSize: 22 }}>{rupee(o.total)}</div><button className="link" style={{ fontSize: 9, marginTop: 10, background: "none" }} onClick={() => s.flash("Tracking details sent to your email")}>Track</button></div>
        </div>)}</div>)}
      {tab === "Wishlist" && (s.wish.length === 0 ? <div style={{ padding: "60px 0", textAlign: "center", color: "var(--ink-soft)" }}>Tap the heart on any piece to save it here.</div> :
        <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 32 }}>{s.wish.map(w => { const p = PRODUCTS.find(x => x.id === w.id) || w; return <ProductCard key={w.id} item={p} onOpen={() => openProduct(p)} />; })}</div>)}
      {tab === "Addresses" && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
        {addr && <div style={{ border: "1px solid var(--midnight)", padding: 26 }}><div className="uc" style={{ fontSize: 9, marginBottom: 12 }}>Default</div><div style={{ fontSize: 14, lineHeight: 1.8 }}>{addr.first} {addr.last}<br />{addr.line1}<br />{addr.city}, {addr.state} {addr.pin}<br />{addr.country}<br />{addr.phone}</div></div>}
        <button style={{ border: "1px dashed var(--line-strong)", padding: 26, minHeight: 180, fontSize: 13, color: "var(--ink-soft)" }} onClick={() => s.flash("Add an address at your next checkout")}>+ Add a new address</button>
      </div>}
      {tab === "Profile" && <div style={{ maxWidth: 560, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "26px 28px" }}>
        <label><span className="st-lbl">First name</span><input className="st-in" defaultValue={s.user.first} /></label><label><span className="st-lbl">Last name</span><input className="st-in" defaultValue={s.user.last} /></label>
        <label style={{ gridColumn: "1 / -1" }}><span className="st-lbl">Email</span><input className="st-in" defaultValue={s.user.email} /></label>
        <label style={{ gridColumn: "1 / -1", display: "flex", gap: 10, fontSize: 13, color: "var(--ink-soft)" }}><input type="checkbox" defaultChecked style={{ accentColor: "var(--royal)" }} />Receive festive edits and letters from Jodhpur</label>
        <div style={{ gridColumn: "1 / -1" }}><button className="btn solid" onClick={() => s.flash("Profile updated")}>Save changes</button></div>
      </div>}
    </div>
  );
}

