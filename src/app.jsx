/* APP SHELL — House of Jodhana
   The prototype kept the route in React state; here every screen has a real URL
   (History API) so pages can be linked, bookmarked and navigated with Back. */
import { useState, useEffect, useCallback } from "react";
import { useStore, STORE_CSS, CartDrawer, AuthModal } from "./store.jsx";
import { GlobalStyles, Nav, Footer, useScrollFX } from "./shared.jsx";
import { PRODUCTS, Catalog } from "./catalog.jsx";
import { Home } from "./home.jsx";
import { Product } from "./product.jsx";
import { Gallery, Blog, About, Contact, Gifting, Logistics } from "./pages.jsx";
import { CartPage, Checkout, Confirmation, Account } from "./checkout.jsx";

const PATHS = {
  home: "/", catalog: "/catalog", gifts: "/gifting", gallery: "/gallery", blog: "/journal",
  about: "/about", logistics: "/shipping", contact: "/contact", cart: "/bag",
  checkout: "/checkout", confirm: "/order-confirmed", account: "/account",
};
const ROUTE_OF = Object.fromEntries(Object.entries(PATHS).map(([r, p]) => [p, r]));
const CAT_IDS = ["chowki", "thali", "kamdhenu"];

export const productSlug = p => p.id.replace(/·/g, "-").toLowerCase();
const productBySlug = slug => PRODUCTS.find(p => productSlug(p) === slug);

function parse(pathname){
  const path = pathname.replace(/\/+$/, "") || "/";
  const [, a, b] = path.split("/");
  if (a === "catalog" && CAT_IDS.includes(b)) return { route: "catalog", cat: b, product: null };
  if (a === "product" && b) {
    const product = productBySlug(decodeURIComponent(b));
    return product ? { route: "product", cat: "all", product } : { route: "catalog", cat: "all", product: null };
  }
  return { route: ROUTE_OF[path] || "home", cat: "all", product: null };
}

function useLocationState(){
  const [loc, setLoc] = useState(() => parse(window.location.pathname));
  useEffect(() => {
    const onPop = () => setLoc(parse(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const go = useCallback(path => {
    if (path !== window.location.pathname) window.history.pushState(null, "", path);
    setLoc(parse(path));
  }, []);
  return [loc, go];
}

export function App(){
  const [{ route, cat, product }, go] = useLocationState();
  const [lastOrder, setLastOrder] = useState(null);
  const s = useStore();

  useEffect(() => {
    const t = setTimeout(() => { const b = document.getElementById("boot"); if (b) { b.classList.add("hide"); setTimeout(() => b.remove(), 900); } }, 1000);
    return () => clearTimeout(t);
  }, []);
  const pageKey = route + cat + (product ? product.id : "");
  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [pageKey]);
  useScrollFX(pageKey);
  useEffect(() => {
    const titles = { home: "House of Jodhana · जोधाणा — Handcrafted in Jodhpur" };
    document.title = titles[route] || `${product && route === "product" ? product.name : route.charAt(0).toUpperCase() + route.slice(1)} · House of Jodhana`;
  }, [route, product]);

  const openProduct = item => go(`/product/${productSlug(item)}`);
  const handleNav = r => {
    if (CAT_IDS.includes(r)) go(`/catalog/${r}`);
    else go(PATHS[r] || "/");
  };
  const r = route;

  return (
    <div>
      <GlobalStyles/>
      <style>{STORE_CSS}</style>
      <Nav route={r} setRoute={handleNav}/>
      <main key={pageKey} style={{ animation: "pageIn .6s cubic-bezier(.2,.7,.2,1) both" }}>
        {r==="home"      && <Home setRoute={handleNav} openProduct={openProduct}/>}
        {r==="catalog"   && <Catalog openProduct={openProduct} initialCat={cat}/>}
        {r==="product"   && <Product item={product} setRoute={handleNav} openProduct={openProduct}/>}
        {r==="gifts"     && <Gifting setRoute={handleNav} openProduct={openProduct}/>}
        {r==="gallery"   && <Gallery setRoute={handleNav}/>}
        {r==="blog"      && <Blog setRoute={handleNav}/>}
        {r==="about"     && <About setRoute={handleNav}/>}
        {r==="logistics" && <Logistics setRoute={handleNav}/>}
        {r==="contact"   && <Contact setRoute={handleNav}/>}
        {r==="cart"      && <CartPage setRoute={handleNav} openProduct={openProduct}/>}
        {r==="checkout"  && <Checkout setRoute={handleNav} setLastOrder={setLastOrder}/>}
        {r==="confirm"   && <Confirmation order={lastOrder||s.orders[0]} setRoute={handleNav}/>}
        {r==="account"   && <Account setRoute={handleNav} openProduct={openProduct}/>}
      </main>
      {r !== "checkout" && <Footer setRoute={handleNav}/>}
      <CartDrawer setRoute={handleNav}/>
      <AuthModal/>
    </div>
  );
}
