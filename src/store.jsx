import { useState as useS, useEffect as useE, createContext as cCtx, useContext as useCtx } from "react";
import { Slot } from "./Slot.jsx";
import { Emblem } from "./shared.jsx";
/* STORE — cart, wishlist, customer auth (persisted) */
export const StoreCtx = cCtx(null);
export const useStore = () => useCtx(StoreCtx);
export const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
export const rupee = n => "₹" + Math.round(n).toLocaleString("en-IN");

export function StoreProvider({ children }) {
  const [cart, setCart] = useS(() => load("hoj-cart", []));
  const [wish, setWish] = useS(() => load("hoj-wish", []));
  const [user, setUser] = useS(() => load("hoj-user", null));
  const [orders, setOrders] = useS(() => load("hoj-orders", []));
  const [drawer, setDrawer] = useS(false);
  const [auth, setAuth] = useS(null); // null | "signin" | "signup" | "forgot"
  const [afterAuth, setAfterAuth] = useS(null);
  const [toast, setToast] = useS(null);
  useE(() => localStorage.setItem("hoj-cart", JSON.stringify(cart)), [cart]);
  useE(() => localStorage.setItem("hoj-wish", JSON.stringify(wish)), [wish]);
  useE(() => localStorage.setItem("hoj-user", JSON.stringify(user)), [user]);
  useE(() => localStorage.setItem("hoj-orders", JSON.stringify(orders)), [orders]);
  const flash = m => { setToast(m); clearTimeout(window.__st); window.__st = setTimeout(() => setToast(null), 2600); };
  const key = (id, v) => id + "|" + (v || "");
  const add = (item, qty = 1, variant = "Standard", open = true) => { setCart(c => { const k = key(item.id, variant); const ex = c.find(x => x.key === k); return ex ? c.map(x => x.key === k ? { ...x, qty: x.qty + qty } : x) : [...c, { key: k, id: item.id, name: item.name, line: item.line, price: item.price, mrp: item.mrp, tone: item.tone, variant, qty }]; }); if (open) setDrawer(true); else flash(`${item.name} added to your bag`); };
  const setQty = (k, q) => setCart(c => q <= 0 ? c.filter(x => x.key !== k) : c.map(x => x.key === k ? { ...x, qty: q } : x));
  const remove = k => setCart(c => c.filter(x => x.key !== k));
  const toggleWish = item => setWish(w => { const has = w.some(x => x.id === item.id); flash(has ? "Removed from wishlist" : "Saved to your wishlist"); return has ? w.filter(x => x.id !== item.id) : [...w, { id: item.id, name: item.name, price: item.price, tone: item.tone, line: item.line, mrp: item.mrp, cat: item.cat }]; });
  const inWish = id => wish.some(x => x.id === id);
  const count = cart.reduce((a, b) => a + b.qty, 0);
  const subtotal = cart.reduce((a, b) => a + b.qty * b.price, 0);
  const requireAuth = (then) => { if (user) then(); else { setAfterAuth(() => then); setAuth("signin"); } };
  const signIn = u => { setUser(u); setAuth(null); flash(`Khammā ghaṇī, ${u.first}`); if (afterAuth) { const f = afterAuth; setAfterAuth(null); setTimeout(f, 50); } };
  const signOut = () => { setUser(null); flash("You have been signed out"); };
  const placeOrder = o => { const id = "HOJ-" + (26500 + orders.length + Math.floor(Math.random() * 40)); const order = { ...o, id, date: new Date().toISOString().slice(0, 10), status: "Confirmed" }; setOrders(os => [order, ...os]); setCart([]); return order; };
  const v = { cart, wish, user, orders, count, subtotal, add, setQty, remove, toggleWish, inWish, drawer, setDrawer, auth, setAuth, requireAuth, signIn, signOut, placeOrder, flash };
  return <StoreCtx.Provider value={v}>{children}{toast && <div className="st-toast" role="status">{toast}</div>}</StoreCtx.Provider>;
}

export const STORE_CSS = `
.st-toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:var(--midnight);color:var(--ivory);padding:14px 22px;font-size:13px;letter-spacing:.04em;z-index:600;animation:fadeUp .4s both;border-radius:2px}
.st-veil{position:fixed;inset:0;background:rgba(6,23,63,.42);backdrop-filter:blur(4px);z-index:500;animation:stFade .3s both}
.st-drawer{position:fixed;top:0;right:0;bottom:0;width:min(460px,100%);background:var(--ivory);z-index:501;display:flex;flex-direction:column;animation:stSlide .5s cubic-bezier(.16,1,.3,1) both;box-shadow:-30px 0 80px rgba(6,23,63,.2)}
.st-modal{position:fixed;inset:0;z-index:501;display:grid;place-items:center;padding:20px;pointer-events:none}
.st-modal>div{pointer-events:auto;background:var(--ivory);width:min(920px,100%);max-height:92vh;overflow:auto;display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);animation:stPop .5s cubic-bezier(.16,1,.3,1) both;box-shadow:0 40px 100px rgba(6,23,63,.35)}
@media (max-width:760px){.st-modal>div{grid-template-columns:1fr}.st-modal .st-art{display:none}}
.st-in{width:100%;height:48px;border:none;border-bottom:1px solid var(--line-strong);background:transparent;font-family:'Jost',sans-serif;font-size:15px;color:var(--ink);outline:none;padding:0 2px;transition:border-color .3s}
.st-in:focus{border-bottom-color:var(--royal)}
.st-lbl{display:block;font-size:9.5px;letter-spacing:.3em;text-transform:uppercase;color:var(--ink-soft);font-weight:500;margin-bottom:2px}
.st-err{color:#9B2C2C;font-size:12px;margin-top:6px}
.st-qty{display:inline-flex;align-items:center;border:1px solid var(--line-strong);border-radius:999px}
.st-qty button{width:32px;height:32px;font-size:15px;color:var(--ink)}
.st-qty span{min-width:24px;text-align:center;font-size:13px;font-variant-numeric:tabular-nums}
.st-opt{display:flex;align-items:center;gap:14px;padding:18px 20px;border:1px solid var(--line);cursor:pointer;transition:border-color .3s,background .3s}
.st-opt.on{border-color:var(--midnight);background:var(--sand)}
.st-radio{width:16px;height:16px;border-radius:50%;border:1px solid var(--ink);display:grid;place-items:center;flex:none}
.st-opt.on .st-radio::after{content:"";width:8px;height:8px;border-radius:50%;background:var(--midnight)}
@keyframes stFade{from{opacity:0}}@keyframes stSlide{from{transform:translateX(60px);opacity:0}}@keyframes stPop{from{opacity:0;transform:translateY(24px) scale(.98)}}
`;

/* Bag drawer */
export function CartDrawer({ setRoute }) {
  const s = useStore(); if (!s.drawer) return null;
  const free = 2000, left = Math.max(0, free - s.subtotal);
  const close = () => s.setDrawer(false);
  return <>
    <div className="st-veil" onClick={close} />
    <aside className="st-drawer" role="dialog" aria-label="Your bag">
      <div style={{ padding: "26px 28px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><div className="uc" style={{ fontSize: 9.5, letterSpacing: ".36em", color: "var(--ink-soft)" }}>Your bag</div><div className="serif" style={{ fontSize: 28, marginTop: 4 }}>{s.count} {s.count === 1 ? "piece" : "pieces"}</div></div>
        <button onClick={close} aria-label="Close" style={{ fontSize: 22, width: 40, height: 40 }}>×</button>
      </div>
      {s.cart.length > 0 && <div style={{ padding: "16px 28px", borderBottom: "1px solid var(--line)", fontSize: 13 }}>
        {left > 0 ? <>Add <b style={{ fontWeight: 500 }}>{rupee(left)}</b> more for free shipping across India</> : <>Your order ships <b style={{ fontWeight: 500 }}>free</b> across India</>}
        <div style={{ height: 2, background: "var(--line)", marginTop: 10 }}><div style={{ height: 2, width: `${Math.min(100, s.subtotal / free * 100)}%`, background: "var(--royal)", transition: "width .6s" }} /></div>
      </div>}
      <div style={{ flex: 1, overflow: "auto", padding: "8px 28px" }}>
        {s.cart.length === 0 ? <div style={{ textAlign: "center", padding: "70px 0" }}><Emblem variant="blue" size={60} style={{ margin: "0 auto 20px", opacity: .5 }} /><div className="serif" style={{ fontSize: 24, marginBottom: 10 }}>Your bag is empty</div><p style={{ color: "var(--ink-soft)", fontSize: 14, margin: "0 0 28px" }}>Begin with a chowki for your altar.</p><button className="btn" onClick={() => { close(); setRoute("catalog"); }}>Explore the collection</button></div>
          : s.cart.map(it => <div key={it.key} style={{ display: "grid", gridTemplateColumns: "84px 1fr", gap: 18, padding: "20px 0", borderBottom: "1px solid var(--line)" }}>
            <div className={`ph ${it.tone}`} style={{ height: 104 }}><Slot id={`pc-${it.id}`} placeholder="" shape="rounded" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} /></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><span className="serif" style={{ fontSize: 18, lineHeight: 1.2 }}>{it.name}</span><span style={{ fontSize: 14, whiteSpace: "nowrap" }}>{rupee(it.price * it.qty)}</span></div>
              <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{it.variant}</span>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                <div className="st-qty"><button onClick={() => s.setQty(it.key, it.qty - 1)} aria-label="Decrease">−</button><span>{it.qty}</span><button onClick={() => s.setQty(it.key, it.qty + 1)} aria-label="Increase">+</button></div>
                <button className="uc" style={{ fontSize: 9, color: "var(--ink-soft)", borderBottom: "1px solid currentColor" }} onClick={() => s.remove(it.key)}>Remove</button>
              </div>
            </div>
          </div>)}
      </div>
      {s.cart.length > 0 && <div style={{ padding: "22px 28px 28px", borderTop: "1px solid var(--line)", background: "var(--sand)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span className="uc" style={{ fontSize: 10 }}>Subtotal</span><span className="serif" style={{ fontSize: 24 }}>{rupee(s.subtotal)}</span></div>
        <div style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 18 }}>GST included. Shipping calculated at checkout.</div>
        <button className="btn solid" style={{ width: "100%", justifyContent: "center" }} onClick={() => { close(); setRoute("checkout"); }}>Checkout <span className="arrow">→</span></button>
        <button className="link" style={{ display: "block", margin: "16px auto 0", background: "none" }} onClick={() => { close(); setRoute("cart"); }}>View full bag</button>
      </div>}
    </aside>
  </>;
}

/* Sign in / Sign up */
export function AuthModal() {
  const s = useStore(); const mode = s.auth; if (!mode) return null;
  return <AuthInner key={mode} mode={mode} s={s} />;
}
export function AuthInner({ mode, s }) {
  const [f, setF] = useS({ first: "", last: "", email: "", phone: "", pw: "", otp: "" }); const [err, setErr] = useS({}); const [via, setVia] = useS("email"); const [sent, setSent] = useS(false); const [busy, setBusy] = useS(false);
  const set = (k, v) => setF(x => ({ ...x, [k]: v }));
  const close = () => s.setAuth(null);
  const submit = e => {
    e.preventDefault(); const er = {};
    if (mode === "signup" && !f.first.trim()) er.first = "Please enter your first name";
    if (via === "email" || mode !== "signin") { if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Please enter a valid email"; }
    if (via === "phone" && mode === "signin") { if (!/^\d{10}$/.test(f.phone.replace(/\D/g, "").slice(-10))) er.phone = "Enter a 10-digit mobile number"; else if (!sent) { setSent(true); setErr({}); return; } else if (f.otp.length < 4) er.otp = "Enter the 4-digit code"; }
    else if (mode !== "forgot" && f.pw.length < 6) er.pw = "At least 6 characters";
    setErr(er); if (Object.keys(er).length) return;
    if (mode === "forgot") { s.flash("Reset link sent to " + f.email); s.setAuth("signin"); return; }
    setBusy(true); setTimeout(() => { const first = f.first || (f.email ? f.email.split("@")[0] : "Guest"); s.signIn({ first: first.charAt(0).toUpperCase() + first.slice(1), last: f.last, email: f.email || `+91 ${f.phone}`, phone: f.phone, since: new Date().getFullYear() }); }, 700);
  };
  const title = { signin: "Welcome back", signup: "Join the House", forgot: "Reset password" }[mode];
  return <>
    <div className="st-veil" onClick={close} />
    <div className="st-modal" role="dialog" aria-label={title}><div>
      <div className="st-art kamal-dark" style={{ color: "var(--ivory)", padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 560 }}>
        <Emblem variant="white" size={70} />
        <div>
          <div className="hindi" style={{ fontSize: 30, marginBottom: 14, color: "rgba(251,247,239,.85)" }}>पधारो म्हारे देस</div>
          <p className="serif" style={{ fontSize: 24, fontStyle: "italic", lineHeight: 1.4, margin: "0 0 28px" }}>Members receive early access to festive edits, saved altars, and order tracking from our Jodhpur workshop.</p>
          <div style={{ display: "grid", gap: 10, fontSize: 13, color: "rgba(251,247,239,.7)" }}>{["Track every order from haveli to doorstep", "Save pieces to your wishlist", "Faster checkout with saved addresses"].map(x => <div key={x} style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gilt)" }} />{x}</div>)}</div>
        </div>
      </div>
      <form onSubmit={submit} style={{ padding: "48px 44px", position: "relative" }} noValidate>
        <button type="button" onClick={close} aria-label="Close" style={{ position: "absolute", top: 18, right: 18, fontSize: 22, width: 40, height: 40 }}>×</button>
        <div className="uc" style={{ fontSize: 9.5, letterSpacing: ".36em", color: "var(--ink-soft)", marginBottom: 12 }}>House of Jodhana</div>
        <h2 className="blk-h" style={{ fontSize: 40, fontWeight: 400, margin: "0 0 8px" }}>{title}</h2>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: "0 0 30px" }}>{mode === "signin" ? "Sign in to your account." : mode === "signup" ? "Create an account in under a minute." : "We'll email you a link to set a new password."}</p>
        {mode === "signin" && <div style={{ display: "flex", gap: 24, marginBottom: 24, borderBottom: "1px solid var(--line)" }}>{[["email", "Email"], ["phone", "Mobile OTP"]].map(([k, l]) => <button type="button" key={k} onClick={() => { setVia(k); setSent(false); setErr({}); }} style={{ padding: "0 0 12px", fontSize: 11, letterSpacing: ".24em", textTransform: "uppercase", fontWeight: 500, color: via === k ? "var(--ink)" : "var(--ink-soft)", borderBottom: `1px solid ${via === k ? "var(--ink)" : "transparent"}`, marginBottom: -1 }}>{l}</button>)}</div>}
        <div style={{ display: "grid", gap: 22 }}>
          {mode === "signup" && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}><label><span className="st-lbl">First name</span><input className="st-in" value={f.first} onChange={e => set("first", e.target.value)} autoComplete="given-name" />{err.first && <div className="st-err">{err.first}</div>}</label><label><span className="st-lbl">Last name</span><input className="st-in" value={f.last} onChange={e => set("last", e.target.value)} autoComplete="family-name" /></label></div>}
          {(via === "email" || mode !== "signin") && <label><span className="st-lbl">Email</span><input className="st-in" type="email" value={f.email} onChange={e => set("email", e.target.value)} autoComplete="email" />{err.email && <div className="st-err">{err.email}</div>}</label>}
          {via === "phone" && mode === "signin" && <label><span className="st-lbl">Mobile number</span><div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 15, color: "var(--ink-soft)" }}>+91</span><input className="st-in" inputMode="numeric" value={f.phone} onChange={e => set("phone", e.target.value)} disabled={sent} /></div>{err.phone && <div className="st-err">{err.phone}</div>}</label>}
          {via === "phone" && mode === "signin" && sent && <label><span className="st-lbl">4-digit code · sent to +91 {f.phone}</span><input className="st-in" inputMode="numeric" maxLength={4} value={f.otp} onChange={e => set("otp", e.target.value.replace(/\D/g, ""))} style={{ letterSpacing: ".6em", fontSize: 20 }} autoFocus />{err.otp && <div className="st-err">{err.otp}</div>}</label>}
          {mode !== "forgot" && !(via === "phone" && mode === "signin") && <label><span className="st-lbl">Password</span><input className="st-in" type="password" value={f.pw} onChange={e => set("pw", e.target.value)} autoComplete={mode === "signup" ? "new-password" : "current-password"} />{err.pw && <div className="st-err">{err.pw}</div>}</label>}
          {mode === "signin" && via === "email" && <button type="button" onClick={() => s.setAuth("forgot")} style={{ justifySelf: "end", fontSize: 12, color: "var(--ink-soft)", marginTop: -10 }}>Forgot password?</button>}
          {mode === "signup" && <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: "var(--ink-soft)" }}><input type="checkbox" defaultChecked style={{ accentColor: "var(--royal)", marginTop: 3 }} />Send me festive edits and letters from Jodhpur</label>}
        </div>
        <button className="btn solid" type="submit" style={{ width: "100%", justifyContent: "center", marginTop: 30, opacity: busy ? .6 : 1 }} disabled={busy}>{busy ? "One moment…" : mode === "signin" ? (via === "phone" && !sent ? "Send code" : "Sign in") : mode === "signup" ? "Create account" : "Send reset link"}</button>
        {mode !== "forgot" && <>
          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "24px 0", fontSize: 10, letterSpacing: ".3em", color: "var(--ink-soft)", textTransform: "uppercase" }}><span style={{ flex: 1, height: 1, background: "var(--line)" }} />or<span style={{ flex: 1, height: 1, background: "var(--line)" }} /></div>
          <button type="button" className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={() => s.signIn({ first: "Meera", last: "Shah", email: "meera.shah@gmail.com", since: 2026 })}><span style={{ fontWeight: 600, fontSize: 14, letterSpacing: 0 }}>G</span> Continue with Google</button>
        </>}
        <div style={{ textAlign: "center", marginTop: 26, fontSize: 13, color: "var(--ink-soft)" }}>
          {mode === "signin" ? <>New to the House? <button type="button" className="link" style={{ fontSize: 10 }} onClick={() => s.setAuth("signup")}>Create account</button></> : <>Already a member? <button type="button" className="link" style={{ fontSize: 10 }} onClick={() => s.setAuth("signin")}>Sign in</button></>}
        </div>
      </form>
    </div></div>
  </>;
}

