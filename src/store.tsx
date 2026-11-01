import React, { useState as useS, useEffect as useE, createContext as cCtx, useContext as useCtx } from "react";
import { Drawer, Modal, ScrollArea, CloseButton, Loader } from "@mantine/core";
import { Slot } from "./Slot";
import { Emblem } from "./shared";
import {
  isFirebaseConfigured,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  resetPassword,
  logout as firebaseLogout,
  subscribeToAuthChanges,
  formatAuthError,
} from "./firebase";

export interface CartItem {
  key: string;
  id: string;
  name: string;
  line?: string;
  price: number;
  mrp?: number;
  tone?: string;
  variant: string;
  qty: number;
}

export interface WishItem {
  id: string;
  name: string;
  price: number;
  tone?: string;
  line?: string;
  mrp?: number;
  cat?: string;
}

export interface User {
  uid?: string;
  first: string;
  last?: string;
  email: string;
  phone?: string;
  photoURL?: string;
  since: number | string;
}

export interface OrderAddress {
  email: string;
  first: string;
  last?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pin: string;
  phone: string;
  country: string;
  gift?: boolean;
  note?: string;
}

export type Address = OrderAddress;

export interface Order {
  id: string;
  date: string;
  status: string;
  items: CartItem[];
  address: OrderAddress;
  ship: string;
  shipCost: number;
  pay: string;
  code?: string;
  discount: number;
  subtotal: number;
  total: number;
}

export interface StoreContextType {
  cart: CartItem[];
  wish: WishItem[];
  user: User | null;
  orders: Order[];
  count: number;
  subtotal: number;
  add: (item: any, qty?: number, variant?: string, open?: boolean) => void;
  setQty: (k: string, q: number) => void;
  remove: (k: string) => void;
  toggleWish: (item: any) => void;
  inWish: (id: string) => boolean;
  drawer: boolean;
  setDrawer: (open: boolean) => void;
  auth: "signin" | "signup" | "forgot" | null;
  setAuth: (mode: "signin" | "signup" | "forgot" | null) => void;
  requireAuth: (then: () => void) => void;
  signIn: (u: User) => void;
  signOut: () => void;
  placeOrder: (o: any) => Order;
  flash: (m: string) => void;
}

/* STORE — cart, wishlist, customer auth (persisted) */
export const StoreCtx = cCtx<StoreContextType | null>(null);
export const useStore = () => useCtx(StoreCtx) as StoreContextType;
export const load = <T,>(k: string, d: T): T => {
  try {
    return JSON.parse(localStorage.getItem(k) ?? "") ?? d;
  } catch {
    return d;
  }
};
export const rupee = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useS<CartItem[]>(() => load("hoj-cart", []));
  const [wish, setWish] = useS<WishItem[]>(() => load("hoj-wish", []));
  const [user, setUser] = useS<User | null>(() => load("hoj-user", null));
  const [orders, setOrders] = useS<Order[]>(() => load("hoj-orders", []));
  const [drawer, setDrawer] = useS(false);
  const [auth, setAuth] = useS<"signin" | "signup" | "forgot" | null>(null);
  const [afterAuth, setAfterAuth] = useS<(() => void) | null>(null);
  const [toast, setToast] = useS<string | null>(null);

  useE(() => localStorage.setItem("hoj-cart", JSON.stringify(cart)), [cart]);
  useE(() => localStorage.setItem("hoj-wish", JSON.stringify(wish)), [wish]);
  useE(() => localStorage.setItem("hoj-user", JSON.stringify(user)), [user]);
  useE(() => localStorage.setItem("hoj-orders", JSON.stringify(orders)), [orders]);

  // Subscribe to live Firebase auth changes
  useE(() => {
    const unsub = subscribeToAuthChanges(fbUser => {
      if (fbUser) {
        const parts = (fbUser.displayName || "").trim().split(/\s+/);
        const first = parts[0] || (fbUser.email ? fbUser.email.split("@")[0] : "Customer");
        const last = parts.slice(1).join(" ") || undefined;
        const creationYear = fbUser.metadata?.creationTime
          ? new Date(fbUser.metadata.creationTime).getFullYear()
          : new Date().getFullYear();

        const formattedUser: User = {
          uid: fbUser.uid,
          first: first.charAt(0).toUpperCase() + first.slice(1),
          last: last ? last.charAt(0).toUpperCase() + last.slice(1) : undefined,
          email: fbUser.email || "",
          phone: fbUser.phoneNumber || undefined,
          photoURL: fbUser.photoURL || undefined,
          since: creationYear,
        };
        setUser(formattedUser);
      }
    });
    return () => unsub();
  }, []);

  const flash = (m: string) => {
    setToast(m);
    clearTimeout((window as any).__st);
    (window as any).__st = setTimeout(() => setToast(null), 2800);
  };

  const key = (id: string, v?: string) => id + "|" + (v || "");

  const add = (item: any, qty = 1, variant = "Standard", open = true) => {
    setCart(c => {
      const k = key(item.id, variant);
      const ex = c.find(x => x.key === k);
      return ex
        ? c.map(x => (x.key === k ? { ...x, qty: x.qty + qty } : x))
        : [
            ...c,
            {
              key: k,
              id: item.id,
              name: item.name,
              line: item.line,
              price: item.price,
              mrp: item.mrp,
              tone: item.tone,
              variant,
              qty,
            },
          ];
    });
    if (open) setDrawer(true);
    else flash(`${item.name} added to your bag`);
  };

  const setQty = (k: string, q: number) =>
    setCart(c => (q <= 0 ? c.filter(x => x.key !== k) : c.map(x => (x.key === k ? { ...x, qty: q } : x))));

  const remove = (k: string) => setCart(c => c.filter(x => x.key !== k));

  const toggleWish = (item: any) =>
    setWish(w => {
      const has = w.some(x => x.id === item.id);
      flash(has ? "Removed from wishlist" : "Saved to your wishlist");
      return has
        ? w.filter(x => x.id !== item.id)
        : [
            ...w,
            {
              id: item.id,
              name: item.name,
              price: item.price,
              tone: item.tone,
              line: item.line,
              mrp: item.mrp,
              cat: item.cat,
            },
          ];
    });

  const inWish = (id: string) => wish.some(x => x.id === id);
  const count = cart.reduce((a, b) => a + b.qty, 0);
  const subtotal = cart.reduce((a, b) => a + b.qty * b.price, 0);

  const requireAuth = (then: () => void) => {
    if (user) then();
    else {
      setAfterAuth(() => then);
      setAuth("signin");
    }
  };

  const signIn = (u: User) => {
    setUser(u);
    setAuth(null);
    flash(`Khammā ghaṇī, ${u.first}`);
    if (afterAuth) {
      const f = afterAuth;
      setAfterAuth(null);
      setTimeout(f, 50);
    }
  };

  const signOut = async () => {
    try {
      await firebaseLogout();
    } catch {
      // ignore
    }
    setUser(null);
    localStorage.removeItem("hoj-user");
    flash("You have been signed out");
  };

  const placeOrder = (o: any): Order => {
    const id = "HOJ-" + (26500 + orders.length + Math.floor(Math.random() * 40));
    const order: Order = {
      ...o,
      id,
      date: new Date().toISOString().slice(0, 10),
      status: "Confirmed",
    };
    setOrders(os => [order, ...os]);
    setCart([]);
    return order;
  };

  const v: StoreContextType = {
    cart,
    wish,
    user,
    orders,
    count,
    subtotal,
    add,
    setQty,
    remove,
    toggleWish,
    inWish,
    drawer,
    setDrawer,
    auth,
    setAuth,
    requireAuth,
    signIn,
    signOut,
    placeOrder,
    flash,
  };

  return (
    <StoreCtx.Provider value={v}>
      {children}
      {toast && (
        <div className="st-toast" role="status">
          {toast}
        </div>
      )}
    </StoreCtx.Provider>
  );
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
.st-qty button{width:32px;height:32px;font-size:15px;color:var(--ink);cursor:pointer;background:none;border:none}
.st-qty span{min-width:24px;text-align:center;font-size:13px;font-variant-numeric:tabular-nums}
.st-opt{display:flex;align-items:center;gap:14px;padding:18px 20px;border:1px solid var(--line);cursor:pointer;transition:border-color .3s,background .3s}
.st-opt.on{border-color:var(--midnight);background:var(--sand)}
.st-radio{width:16px;height:16px;border-radius:50%;border:1px solid var(--ink);display:grid;place-items:center;flex:none}
.st-opt.on .st-radio::after{content:"";width:8px;height:8px;border-radius:50%;background:var(--midnight)}
.st-google-btn{width:100%;display:flex;align-items:center;justify-content:center;gap:12px;background:var(--ivory);border:1px solid var(--line-strong);padding:12px 18px;font-family:'Jost',sans-serif;font-size:13px;letter-spacing:.08em;text-transform:uppercase;font-weight:500;color:var(--ink);cursor:pointer;transition:all .25s ease;border-radius:2px}
.st-google-btn:hover{border-color:var(--midnight);background:#FFFFFF;box-shadow:0 4px 14px rgba(6,23,63,.08)}
.st-google-btn:disabled{opacity:.6;cursor:not-allowed}
.st-alert-box{padding:12px 16px;border-radius:2px;font-size:13px;line-height:1.45;margin-bottom:20px;display:flex;align-items:flex-start;gap:10px}
.st-alert-box.error{background:#FFF5F5;border:1px solid #FEB2B2;color:#9B2C2C}
.st-alert-box.success{background:#F0FFF4;border:1px solid #9AE6B4;color:#22543D}
.st-alert-box.info{background:var(--sand);border:1px solid var(--line-strong);color:var(--ink)}
@keyframes stFade{from{opacity:0}}@keyframes stSlide{from{transform:translateX(60px);opacity:0}}@keyframes stPop{from{opacity:0;transform:translateY(24px) scale(.98)}}
`;

/* Bag drawer — converted to Mantine Drawer */
export function CartDrawer({ setRoute }: { setRoute: (r: string) => void }) {
  const s = useStore();
  const free = 2000,
    left = Math.max(0, free - s.subtotal);
  const close = () => s.setDrawer(false);
  return (
    <Drawer
      opened={Boolean(s.drawer)}
      onClose={close}
      position="right"
      size={440}
      padding={0}
      withCloseButton={false}
      overlayProps={{ backgroundOpacity: 0.65, blur: 4, color: "var(--midnight)" }}
      styles={{
        content: { background: "var(--ivory)", color: "var(--ink)", display: "flex", flexDirection: "column" },
        body: { padding: 0, height: "100%", display: "flex", flexDirection: "column" },
      }}
      aria-label="Your bag"
    >
      <div
        style={{
          padding: "26px 28px",
          borderBottom: "1px solid var(--line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div className="uc" style={{ fontSize: 9.5, letterSpacing: ".36em", color: "var(--ink-soft)" }}>
            Your bag
          </div>
          <div className="serif" style={{ fontSize: 28, marginTop: 4 }}>
            {s.count} {s.count === 1 ? "piece" : "pieces"}
          </div>
        </div>
        <CloseButton onClick={close} aria-label="Close" size="lg" style={{ color: "var(--ink)" }} />
      </div>
      {s.cart.length > 0 && (
        <div style={{ padding: "16px 28px", borderBottom: "1px solid var(--line)", fontSize: 13 }}>
          {left > 0 ? (
            <>
              Add <b style={{ fontWeight: 500 }}>{rupee(left)}</b> more for free shipping across India
            </>
          ) : (
            <>
              Your order ships <b style={{ fontWeight: 500 }}>free</b> across India
            </>
          )}
          <div style={{ height: 2, background: "var(--line)", marginTop: 10 }}>
            <div
              style={{
                height: 2,
                width: `${Math.min(100, (s.subtotal / free) * 100)}%`,
                background: "var(--royal)",
                transition: "width .6s",
              }}
            />
          </div>
        </div>
      )}
      <ScrollArea style={{ flex: 1 }} offsetScrollbars scrollbarSize={6}>
        <div style={{ padding: "8px 28px" }}>
          {s.cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "70px 0" }}>
              <Emblem variant="blue" size={60} style={{ margin: "0 auto 20px", opacity: 0.5 }} />
              <div className="serif" style={{ fontSize: 24, marginBottom: 10 }}>
                Your bag is empty
              </div>
              <p style={{ color: "var(--ink-soft)", fontSize: 14, margin: "0 0 28px" }}>
                Begin with a chowki for your altar.
              </p>
              <button
                className="btn"
                onClick={() => {
                  close();
                  setRoute("catalog");
                }}
              >
                Explore the collection
              </button>
            </div>
          ) : (
            s.cart.map(it => (
              <div
                key={it.key}
                style={{
                  display: "grid",
                  gridTemplateColumns: "84px 1fr",
                  gap: 18,
                  padding: "20px 0",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <div className={`ph ${it.tone}`} style={{ height: 104 }}>
                  <Slot
                    id={`pc-${it.id}`}
                    placeholder=""
                    shape="rounded"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <span className="serif" style={{ fontSize: 18, lineHeight: 1.2 }}>
                      {it.name}
                    </span>
                    <span style={{ fontSize: 14, whiteSpace: "nowrap" }}>{rupee(it.price * it.qty)}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{it.variant}</span>
                  <div
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}
                  >
                    <div className="st-qty">
                      <button onClick={() => s.setQty(it.key, it.qty - 1)} aria-label="Decrease">
                        −
                      </button>
                      <span>{it.qty}</span>
                      <button onClick={() => s.setQty(it.key, it.qty + 1)} aria-label="Increase">
                        +
                      </button>
                    </div>
                    <button
                      className="uc"
                      style={{ fontSize: 9, color: "var(--ink-soft)", borderBottom: "1px solid currentColor" }}
                      onClick={() => s.remove(it.key)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      {s.cart.length > 0 && (
        <div style={{ padding: "22px 28px 28px", borderTop: "1px solid var(--line)", background: "var(--sand)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span className="uc" style={{ fontSize: 10 }}>
              Subtotal
            </span>
            <span className="serif" style={{ fontSize: 24 }}>
              {rupee(s.subtotal)}
            </span>
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 18 }}>
            GST included. Shipping calculated at checkout.
          </div>
          <button
            className="btn solid"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={() => {
              close();
              setRoute("checkout");
            }}
          >
            Checkout <span className="arrow">→</span>
          </button>
          <button
            className="link"
            style={{ display: "block", margin: "16px auto 0", background: "none" }}
            onClick={() => {
              close();
              setRoute("cart");
            }}
          >
            View full bag
          </button>
        </div>
      )}
    </Drawer>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z"
        fill="#4285F4"
      />
      <path
        d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* Customer Sign In / Sign Up Modal */
export function AuthModal() {
  const s = useStore();
  const mode = s.auth;
  if (!mode) return null;
  return <AuthInner key={mode} mode={mode} s={s} />;
}

export function AuthInner({ mode, s }: { mode: "signin" | "signup" | "forgot"; s: StoreContextType }) {
  const [f, setF] = useS({ first: "", last: "", email: "", pw: "" });
  const [err, setErr] = useS<Record<string, string>>({});
  const [generalErr, setGeneralErr] = useS<string | null>(null);
  const [successMsg, setSuccessMsg] = useS<string | null>(null);
  const [busy, setBusy] = useS(false);

  const set = (k: string, v: string) => {
    setF(x => ({ ...x, [k]: v }));
    if (err[k]) setErr(x => ({ ...x, [k]: "" }));
    if (generalErr) setGeneralErr(null);
  };

  const close = () => s.setAuth(null);

  const handleGoogleSignIn = async () => {
    setGeneralErr(null);
    setSuccessMsg(null);
    setBusy(true);

    try {
      if (!isFirebaseConfigured()) {
        // Friendly offline simulation if keys not yet added
        s.signIn({
          uid: "demo-google-user",
          first: "Pooja",
          last: "Rathore",
          email: "pooja.rathore@gmail.com",
          since: new Date().getFullYear(),
        });
        return;
      }

      const fbUser = await signInWithGoogle();
      const parts = (fbUser.displayName || "").trim().split(/\s+/);
      const first = parts[0] || (fbUser.email ? fbUser.email.split("@")[0] : "Customer");
      const last = parts.slice(1).join(" ") || undefined;
      const creationYear = fbUser.metadata?.creationTime
        ? new Date(fbUser.metadata.creationTime).getFullYear()
        : new Date().getFullYear();

      s.signIn({
        uid: fbUser.uid,
        first: first.charAt(0).toUpperCase() + first.slice(1),
        last: last ? last.charAt(0).toUpperCase() + last.slice(1) : undefined,
        email: fbUser.email || "",
        phone: fbUser.phoneNumber || undefined,
        photoURL: fbUser.photoURL || undefined,
        since: creationYear,
      });
    } catch (e: any) {
      setGeneralErr(formatAuthError(e));
    } finally {
      setBusy(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralErr(null);
    setSuccessMsg(null);

    const er: Record<string, string> = {};
    if (mode === "signup" && !f.first.trim()) {
      er.first = "Please enter your first name";
    }
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) {
      er.email = "Please enter a valid email address";
    }
    if (mode !== "forgot") {
      if (!f.pw || f.pw.length < 6) {
        er.pw = "Password must be at least 6 characters";
      }
    }

    setErr(er);
    if (Object.keys(er).length > 0) return;

    setBusy(true);

    try {
      if (!isFirebaseConfigured()) {
        // Offline demo fallback if user hasn't input Firebase keys yet
        if (mode === "forgot") {
          setSuccessMsg(`Password reset link sent to ${f.email.trim()} (Demo Mode).`);
          setBusy(false);
          return;
        }

        const first = f.first.trim() || f.email.split("@")[0];
        s.signIn({
          uid: "demo-user-123",
          first: first.charAt(0).toUpperCase() + first.slice(1),
          last: f.last.trim() || undefined,
          email: f.email.trim().toLowerCase(),
          since: new Date().getFullYear(),
        });
        return;
      }

      if (mode === "forgot") {
        await resetPassword(f.email.trim());
        setSuccessMsg(`We have emailed a password reset link to ${f.email.trim()}.`);
        setBusy(false);
        return;
      }

      if (mode === "signup") {
        const displayName = `${f.first.trim()} ${f.last.trim()}`.trim();
        const fbUser = await signUpWithEmail(f.email.trim(), f.pw, displayName);
        s.signIn({
          uid: fbUser.uid,
          first: f.first.trim(),
          last: f.last.trim() || undefined,
          email: fbUser.email || f.email.trim().toLowerCase(),
          since: new Date().getFullYear(),
        });
      } else if (mode === "signin") {
        const fbUser = await signInWithEmail(f.email.trim(), f.pw);
        const parts = (fbUser.displayName || "").trim().split(/\s+/);
        const first = parts[0] || f.email.split("@")[0];
        const last = parts.slice(1).join(" ") || undefined;
        const creationYear = fbUser.metadata?.creationTime
          ? new Date(fbUser.metadata.creationTime).getFullYear()
          : new Date().getFullYear();

        s.signIn({
          uid: fbUser.uid,
          first: first.charAt(0).toUpperCase() + first.slice(1),
          last,
          email: fbUser.email || f.email.trim().toLowerCase(),
          since: creationYear,
        });
      }
    } catch (e: any) {
      setGeneralErr(formatAuthError(e));
    } finally {
      setBusy(false);
    }
  };

  const title = { signin: "Welcome back", signup: "Join the House", forgot: "Reset password" }[mode];

  return (
    <Modal
      opened={Boolean(mode)}
      onClose={close}
      size={880}
      padding={0}
      withCloseButton={false}
      centered
      overlayProps={{ backgroundOpacity: 0.7, blur: 4, color: "var(--midnight)" }}
      styles={{
        content: { background: "var(--ivory)", color: "var(--ink)", overflow: "hidden", borderRadius: 4 },
        body: { padding: 0 },
      }}
      aria-label={title}
    >
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.1fr)", minHeight: 560 }}>
        {/* Left Heritage Brand Panel */}
        <div
          className="st-art kamal-dark"
          style={{
            color: "var(--ivory)",
            padding: "48px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Emblem variant="white" size={70} />
          <div>
            <div className="hindi" style={{ fontSize: 32, marginBottom: 14, color: "rgba(251,247,239,.9)" }}>
              पधारो म्हारे देस
            </div>
            <p className="serif" style={{ fontSize: 24, fontStyle: "italic", lineHeight: 1.4, margin: "0 0 28px" }}>
              Members receive early access to festive edits, saved altars, and order tracking from our Jodhpur
              workshop.
            </p>
            <div style={{ display: "grid", gap: 12, fontSize: 13, color: "rgba(251,247,239,.75)" }}>
              {[
                "Track every order from haveli to doorstep",
                "Save pieces to your curated wishlist",
                "Faster checkout with saved haveli addresses",
              ].map(x => (
                <div key={x} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--gilt)" }} />
                  {x}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <form onSubmit={submit} style={{ padding: "48px 44px", position: "relative" }} noValidate>
          <CloseButton
            onClick={close}
            aria-label="Close"
            size="lg"
            style={{ position: "absolute", top: 18, right: 18, color: "var(--ink)" }}
          />

          <div
            className="uc"
            style={{ fontSize: 9.5, letterSpacing: ".36em", color: "var(--ink-soft)", marginBottom: 10 }}
          >
            House of Jodhana
          </div>
          <h2 className="blk-h" style={{ fontSize: 38, fontWeight: 400, margin: "0 0 8px" }}>
            {title}
          </h2>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: "0 0 24px" }}>
            {mode === "signin"
              ? "Sign in to access your orders and wishlist."
              : mode === "signup"
              ? "Create your account in under a minute."
              : "We will email you a secure link to reset your password."}
          </p>

          {/* Feedback Banners */}
          {generalErr && (
            <div className="st-alert-box error" role="alert">
              <span>⚠️</span>
              <span>{generalErr}</span>
            </div>
          )}

          {successMsg && (
            <div className="st-alert-box success" role="status">
              <span>✓</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Firebase Setup Notice (if creds not yet supplied) */}
          {!isFirebaseConfigured() && (
            <div className="st-alert-box info" style={{ fontSize: 11 }}>
              <span>ℹ️</span>
              <span>
                <strong>Firebase Setup:</strong> Add your Firebase API keys to <span className="mono">.env</span> to
                activate live Google & Email authentication.
              </span>
            </div>
          )}

          {/* Google Sign In Button */}
          {mode !== "forgot" && (
            <>
              <button
                type="button"
                className="st-google-btn"
                onClick={handleGoogleSignIn}
                disabled={busy}
                aria-label="Continue with Google"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  margin: "20px 0",
                  fontSize: 10,
                  letterSpacing: ".3em",
                  color: "var(--ink-soft)",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
                <span>or with email</span>
                <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
              </div>
            </>
          )}

          {/* Form Fields */}
          <div style={{ display: "grid", gap: 18 }}>
            {mode === "signup" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <label>
                  <span className="st-lbl">First name</span>
                  <input
                    className="st-in"
                    value={f.first}
                    onChange={e => set("first", e.target.value)}
                    autoComplete="given-name"
                    required
                  />
                  {err.first && <div className="st-err">{err.first}</div>}
                </label>
                <label>
                  <span className="st-lbl">Last name</span>
                  <input
                    className="st-in"
                    value={f.last}
                    onChange={e => set("last", e.target.value)}
                    autoComplete="family-name"
                  />
                </label>
              </div>
            )}

            <label>
              <span className="st-lbl">Email address</span>
              <input
                className="st-in"
                type="email"
                value={f.email}
                onChange={e => set("email", e.target.value)}
                autoComplete="email"
                required
              />
              {err.email && <div className="st-err">{err.email}</div>}
            </label>

            {mode !== "forgot" && (
              <label>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="st-lbl">Password</span>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => {
                        setGeneralErr(null);
                        setSuccessMsg(null);
                        s.setAuth("forgot");
                      }}
                      style={{
                        fontSize: 11,
                        color: "var(--royal)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  className="st-in"
                  type="password"
                  value={f.pw}
                  onChange={e => set("pw", e.target.value)}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  required
                />
                {err.pw && <div className="st-err">{err.pw}</div>}
              </label>
            )}

            {mode === "signup" && (
              <label
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  fontSize: 12.5,
                  color: "var(--ink-soft)",
                  marginTop: 4,
                }}
              >
                <input type="checkbox" defaultChecked style={{ accentColor: "var(--royal)", marginTop: 3 }} />
                <span>Send me festive collections and letters from Jodhpur</span>
              </label>
            )}
          </div>

          <button
            className="btn solid"
            type="submit"
            style={{ width: "100%", justifyContent: "center", marginTop: 24, gap: 10 }}
            disabled={busy}
          >
            {busy && <Loader size={14} color="var(--ivory)" />}
            <span>
              {busy
                ? "Please wait…"
                : mode === "signin"
                ? "Sign in"
                : mode === "signup"
                ? "Create Account"
                : "Send Reset Link"}
            </span>
          </button>

          <div style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "var(--ink-soft)" }}>
            {mode === "signin" ? (
              <>
                New to the House?{" "}
                <button
                  type="button"
                  className="link"
                  style={{ fontSize: 11, color: "var(--royal)" }}
                  onClick={() => {
                    setGeneralErr(null);
                    setSuccessMsg(null);
                    s.setAuth("signup");
                  }}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already a member?{" "}
                <button
                  type="button"
                  className="link"
                  style={{ fontSize: 11, color: "var(--royal)" }}
                  onClick={() => {
                    setGeneralErr(null);
                    setSuccessMsg(null);
                    s.setAuth("signin");
                  }}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
}
