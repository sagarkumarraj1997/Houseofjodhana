import { useEffect, useRef } from "react";
import { Slot } from "./Slot.jsx";
import { useStore } from "./store.jsx";
/* Shared primitives — House of Jodhana */

export const GLOBAL_CSS = `
.blk-h{font-family:'Cormorant Garamond',serif;font-weight:500;text-transform:uppercase;letter-spacing:.07em;line-height:.95}
.blk-h em{text-transform:none;font-weight:400;font-style:italic;letter-spacing:0;color:var(--royal)}
.blk-chip{display:inline;color:var(--royal);background:none}
.blk-chip.gold,.blk-chip.turq{color:inherit;font-style:italic;text-transform:none;font-weight:400;letter-spacing:0}
.blk-chip.out{color:transparent;-webkit-text-stroke:1px currentColor}
.tape{position:relative;white-space:nowrap;overflow:hidden;padding:20px 0;border-top:1px solid var(--hair);border-bottom:1px solid var(--hair)}
.tape-track{display:inline-flex;gap:64px;align-items:center;will-change:transform}
.tape-item{display:inline-flex;align-items:center;gap:64px;font-family:'Jost',sans-serif;font-weight:400;text-transform:uppercase;letter-spacing:.42em;font-size:12px}
.tape-item .hi{font-family:'Tiro Devanagari Hindi',serif;text-transform:none;letter-spacing:.02em;font-size:17px}
.pich-frame{position:relative;padding:14px;background:var(--ivory);border:1px solid var(--hair)}
.pich-frame>.pf-2{padding:1px;background:var(--royal)}
.pich-frame>.pf-2>.pf-3{padding:10px;background:var(--ivory)}
.tilt{transform-style:preserve-3d;transition:transform .6s cubic-bezier(.16,1,.3,1);will-change:transform}
.gilt{color:var(--gilt)}
.nav-top span{white-space:nowrap}
.brand-tag{white-space:nowrap}
@media (max-width:1280px){.nav-link{padding:8px 7px;letter-spacing:.14em;font-size:10px}.nav-inner{gap:18px;padding:12px 24px}.brand .wm{width:160px!important}.nav-actions .btn{display:none}}
@media (max-width:1100px){.nav-top .nt-r{display:none}.nav-inner{flex-wrap:wrap;justify-content:center}.nav-links{order:3;width:100%;justify-content:center;flex-wrap:nowrap;overflow-x:auto}.hero-grid{grid-template-columns:minmax(0,1fr)!important}.hero-h1{font-size:clamp(48px,10vw,120px)!important}}
@media (max-width:1000px){.g4,.g5{grid-template-columns:repeat(2,minmax(0,1fr))!important}.g4>*,.g5>*{margin-top:0!important;border-right:none!important}.footer-top{grid-template-columns:1fr 1fr!important}}
.pich-frame>.pf-2{padding:10px;background:var(--royal)}
.pich-frame>.pf-2>.pf-3{padding:6px;background:var(--ivory)}
`;
export function GlobalStyles(){ return <style>{GLOBAL_CSS}</style>; }

/* Brand emblem (from brand kit) */
export function Emblem({ variant="color", size=48, style={} }){
  return <img src={`/assets/emblem-${variant}.png`} alt="House of Jodhana emblem" style={{width:size,height:"auto",...style}}/>;
}
export function Wordmark({ variant="blue", width=260, style={} }){
  return <img src={`/assets/wordmark-${variant}.png`} alt="House of Jodhana" style={{width,height:"auto",...style}}/>;
}
/* legacy name used across pages */
export function BrandMark({ size=38, color }){
  const light = color && /E8|D4|FFF|fff|C9|D9/.test(color);
  return <Emblem variant={light?"white":"color"} size={size}/>;
}

/* Pichwai lotus — simple petals */
export function Lotus({ size=40, color="var(--gold)", fill="none", stroke=1 }){
  return (
    <svg width={size} height={size*0.8} viewBox="0 0 50 40" aria-hidden>
      <g fill={fill} stroke={color} strokeWidth={stroke} strokeLinejoin="round">
        <path d="M25 4c-5 8-5 18 0 26 5-8 5-18 0-26z"/>
        <path d="M25 30c-8-1-14-8-15-17 8 2 13 8 15 17z"/>
        <path d="M25 30c8-1 14-8 15-17-8 2-13 8-15 17z"/>
        <path d="M25 31c-10 1-18-4-22-11 9-1 17 4 22 11z"/>
        <path d="M25 31c10 1 18-4 22-11-9-1-17 4-22 11z"/>
        <path d="M14 34h22"/>
      </g>
    </svg>
  );
}

/* Pichwai lotus-pond band: water with a row of lotuses */
export function LotusPond({ count=18, dark=false }){
  return (
    <div aria-hidden style={{background:dark?"var(--midnight)":"var(--royal)",padding:"12px 0 6px",overflow:"hidden",position:"relative"}}>
      <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(180deg,transparent 0 7px,rgba(251,247,239,.08) 7px 8px)",opacity:1}}/>
      <div style={{position:"relative",display:"flex",justifyContent:"space-around",alignItems:"flex-end"}}>
        {Array.from({length:count}).map((_,i)=>(
          <div key={i} style={{transform:`translateY(${i%2?4:0}px)`}}><Lotus size={i%3===0?34:26} color="var(--gold-soft)" fill={i%2?"rgba(251,247,239,.12)":"none"}/></div>
        ))}
      </div>
    </div>
  );
}
export const LotusRow = ({dark}) => <LotusPond count={22} dark={dark}/>;

export function Ornament({ width=120 }){
  return <img src="/assets/rule-gold.png" alt="" aria-hidden style={{width,height:"auto",maxWidth:"100%",margin:"0 auto"}}/>;
}
export function CornerFlourish({ size=64, color="var(--gold)" }){
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden style={{opacity:.7}}>
      <path d="M0 0H26M0 0V26" stroke={color} strokeWidth="1"/><path d="M5 5H20M5 5V20" stroke={color} strokeWidth=".6"/>
      <circle cx="24" cy="24" r="2" fill={color}/><path d="M10 10l10 10" stroke={color} strokeWidth=".6"/>
    </svg>
  );
}
export function DiamondStrip({ color="var(--gold)", count=16 }){
  return <div style={{display:"flex",justifyContent:"center",gap:12}} aria-hidden>{Array.from({length:count}).map((_,i)=><div key={i} style={{width:6,height:6,background:color,transform:"rotate(45deg)",opacity:i===0||i===count-1?.4:.9}}/>)}</div>;
}
export const TempleStrip = DiamondStrip;
export function SacredDivider({ mark="॥ खम्मा घणी ॥", color="var(--gold)" }){
  return (
    <div style={{display:"flex",alignItems:"center",gap:20,color}}>
      <div style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${color})`}}/>
      <span className="hindi" style={{fontSize:20,whiteSpace:"nowrap"}}>{mark}</span>
      <div style={{flex:1,height:1,background:`linear-gradient(90deg,${color},transparent)`}}/>
    </div>
  );
}

export function PH({ label, code, tone="ivory", height=320, style={}, children }){
  return <div className={`ph ${tone==="ivory"?"":tone}`} style={{height,...style}}>{children}{label&&<div className="ph-label">{label}</div>}{code&&<div className="ph-corner">{code}</div>}</div>;
}

/* Jharokha arch (cusped top like the emblem) with image slot */
export const ARCH = "50% 50% 4px 4px / 34% 34% 4px 4px";
export function ArchPH({ label, tone="ivory", height=360, slotId=null, placeholder=null }){
  return (
    <div style={{position:"relative"}}>
      <div className={`ph ${tone==="ivory"?"":tone}`} style={{height,borderRadius:ARCH}}>
        {slotId ? <Slot id={slotId} placeholder={placeholder||label||"Drop image"} shape="rounded" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/> : (label&&<div className="ph-label">{label}</div>)}
        <div style={{position:"absolute",inset:12,borderRadius:ARCH,border:"1px solid var(--gold-soft)",opacity:.7,pointerEvents:"none"}}/>
      </div>
      <div style={{position:"absolute",inset:-6,borderRadius:ARCH,border:"1px solid var(--gold)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:-16,left:"50%",transform:"translateX(-50%)",pointerEvents:"none"}}><Lotus size={30} color="var(--gold)" fill="var(--ivory)"/></div>
    </div>
  );
}
export function TripleArch({ tones=["maroon","peacock","emerald"], height=280 }){
  return <div style={{display:"grid",gridTemplateColumns:"1fr 1.2fr 1fr",gap:14,alignItems:"end"}}>{tones.map((t,i)=><ArchPH key={i} tone={t} height={i===1?height:height*.86}/>)}</div>;
}

/* Pichwai-style nested border frame */
export function PichwaiFrame({ children, style={} }){
  return (
    <div className="pich-frame" style={style}>
      <div className="pf-2"><div className="pf-3">{children}</div></div>
      <div aria-hidden style={{position:"absolute",top:0,left:"50%",transform:"translate(-50%,-55%)"}}><Lotus size={40} color="var(--gold)" fill="var(--ivory)"/></div>
    </div>
  );
}

/* Made in Jodhpur — rotating circular stamp */
export function JodhpurStamp({ size=150, dark=false }){
  const c = dark ? "rgba(251,247,239,.75)" : "#0A3A8E";
  const id = "st"+size+(dark?"d":"l");
  return (
    <div style={{position:"relative",width:size,height:size}}>
      <svg className="spin" width={size} height={size} viewBox="0 0 200 200" style={{position:"absolute",inset:0}} aria-hidden>
        <defs><path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"/></defs>
        <circle cx="100" cy="100" r="96" fill="none" stroke={c} strokeWidth=".6"/>
        <circle cx="100" cy="100" r="60" fill="none" stroke={c} strokeWidth=".8" strokeDasharray="2 4"/>
        <text fill={c} style={{fontFamily:"Jost",fontSize:12,fontWeight:400,letterSpacing:"7px"}}><textPath href={`#${id}`}>MADE IN JODHPUR ✦ HANDCRAFTED IN RAJASTHAN ✦ </textPath></text>
      </svg>
      <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center"}}><Emblem variant={dark?"white":"blue"} size={size*.34}/></div>
    </div>
  );
}

/* Postmark-style badge */
export function Postmark({ dark=false }){
  const c = dark ? "var(--gold-soft)" : "var(--royal)";
  return (
    <div style={{display:"inline-flex",flexDirection:"column",alignItems:"center",padding:"10px 16px",border:`1px solid ${c}`,color:c,transform:"rotate(-3deg)",borderRadius:2}}>
      <span className="uc" style={{fontSize:9}}>Sardarpura · Jodhpur</span>
      <span className="blk-h" style={{fontSize:22}}>342003</span>
      <span className="hindi" style={{fontSize:13}}>जोधाणा री शान</span>
    </div>
  );
}

/* Scroll tape — marquee strip that also drifts with scroll */
export function Tape({ items, tone="royal", rotate=0, reverse=false, speed=40 }){
  const ref = useRef(null);
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    let raf; const onS=()=>{ cancelAnimationFrame(raf); raf=requestAnimationFrame(()=>{ const r=el.getBoundingClientRect(); const p=(r.top - window.innerHeight)/window.innerHeight; el.style.transform=`translateX(${(reverse?-1:1)*p*120}px)`; }); };
    onS(); window.addEventListener("scroll",onS,{passive:true}); return ()=>window.removeEventListener("scroll",onS);
  },[]);
  const bg = {royal:"var(--royal)",gold:"var(--sand)",midnight:"var(--midnight)",ivory:"var(--ivory)",turq:"var(--royal)"}[tone];
  const fg = tone==="gold"||tone==="ivory" ? "var(--midnight)" : "var(--ivory)";
  const list = [...items,...items,...items,...items];
  return (
    <div className="tape" style={{background:bg,color:fg,transform:`rotate(${rotate}deg)`,margin:rotate?"0 -40px":0}}>
      <div ref={ref}><div className="tape-track" style={{animation:`${reverse?"tapeR":"tape"} ${speed}s linear infinite`}}>
        {list.map((t,i)=>(<span key={i} className="tape-item"><span className={/[\u0900-\u097F]/.test(t)?"hi":""}>{t}</span><span style={{width:4,height:4,borderRadius:"50%",background:(tone==="gold"||tone==="ivory")?"var(--gilt)":"rgba(251,247,239,.5)"}}/></span>))}
      </div></div>
    </div>
  );
}
/* two crossing tapes */
export function TapeCross({ a, b }){
  return (
    <div style={{position:"relative",height:180,overflow:"hidden",display:"grid",alignItems:"center"}}>
      <div style={{position:"absolute",left:0,right:0,top:40}}><Tape items={a} tone="royal" rotate={-3}/></div>
      <div style={{position:"absolute",left:0,right:0,top:70}}><Tape items={b} tone="gold" rotate={2.5} reverse speed={50}/></div>
    </div>
  );
}
export const Marquee = ({items}) => <Tape items={items} tone="midnight"/>;

export function NavStoreIcons({ setRoute }){
  const s = useStore(); if(!s) return null;
  const I=({t,onClick,children,badge})=><button className="nav-icon" title={t} aria-label={t} onClick={onClick}>{children}{badge>0&&<span style={{position:"absolute",top:2,right:0,minWidth:16,height:16,padding:"0 4px",background:"var(--royal)",color:"var(--ivory)",fontSize:9,borderRadius:8,display:"grid",placeItems:"center",fontWeight:600}}>{badge}</span>}</button>;
  return <>
    <I t={s.user?`Account · ${s.user.first}`:"Sign in"} onClick={()=>s.user?setRoute("account"):s.setAuth("signin")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>{s.user&&<span style={{position:"absolute",bottom:4,right:4,width:6,height:6,borderRadius:"50%",background:"var(--royal)"}}/>}</I>
    <I t="Wishlist" badge={s.wish.length} onClick={()=>s.user?setRoute("account"):s.setAuth("signin")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 6-8 11-8 11z"/></svg></I>
    <I t="Bag" badge={s.count} onClick={()=>s.setDrawer(true)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg></I>
  </>;
}
/* NAV */
export function Nav({ route, setRoute, cartCount=2 }){
  const links=[{id:"home",label:"Home"},{id:"catalog",label:"Catalog"},{id:"gifts",label:"Gifting"},{id:"gallery",label:"Gallery"},{id:"blog",label:"Journal"},{id:"about",label:"About Us"},{id:"logistics",label:"Shipping"},{id:"contact",label:"Contact"}];
  return (
    <header className="nav">
      <div className="nav-top">
        <span><span className="hindi" style={{fontSize:13,letterSpacing:0,textTransform:"none",marginRight:10}}>खम्मा घणी</span>Free shipping across India over ₹2,000</span>
        <span className="nt-r">Made in Jodhpur · Shipped worldwide</span>
      </div>
      <div className="nav-inner">
        <div className="brand" onClick={()=>setRoute("home")}>
          <Emblem size={44}/>
          <div><img className="wm" src="/assets/wordmark-blue.png" alt="House of Jodhana" style={{width:200,height:"auto"}}/><div className="uc brand-tag" style={{fontSize:8,color:"var(--ink-soft)",marginTop:6,letterSpacing:".42em"}}>Handcrafted in Rajasthan</div></div>
        </div>
        <nav className="nav-links">{links.map(l=><div key={l.id} className={`nav-link ${route===l.id?"active":""}`} onClick={()=>setRoute(l.id)}>{l.label}</div>)}</nav>
        <div className="nav-actions">
          <div className="nav-icon" title="Search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></div>
          <NavStoreIcons setRoute={setRoute}/>
          <button className="btn solid" style={{padding:"11px 18px"}} onClick={()=>setRoute("catalog")}>Shop <span className="arrow">→</span></button>
        </div>
      </div>
    </header>
  );
}

/* FOOTER */
export function Footer({ setRoute=()=>{} }){
  return (
    <footer>
      <Tape items={["पधारो म्हारे देस","Padhāro Mhāre Des","Made in Jodhpur","खम्मा घणी","Handcrafted in Rajasthan"]} tone="ivory"/>
      <div className="footer kamal-dark">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:22}}><Emblem variant="white" size={64}/><Wordmark variant="white" width={230}/></div>
              <p className="serif" style={{fontSize:26,lineHeight:1.35,color:"var(--ivory)",fontStyle:"italic",fontWeight:400,maxWidth:380,margin:0}}>The royal craft of Marwar, kept by hand.</p>
              <div className="hindi" style={{color:"rgba(251,247,239,.55)",fontSize:16,marginTop:12}}>जोधाणा की विरासत, हाथों से गढ़ी</div>
              <div style={{marginTop:28}}><JodhpurStamp size={120} dark/></div>
            </div>
            <div><h4>Collections</h4><ul>{["Wooden Chowki","Pooja Thali","Kamdhenu Idols","Gift Sets & Boxes","The Jharokha Edit"].map(x=><li key={x} onClick={()=>setRoute("catalog")}>{x}</li>)}</ul></div>
            <div><h4>The House</h4><ul>{[["About Us","about"],["Journal","blog"],["Gallery","gallery"],["Shipping","logistics"],["Contact","contact"]].map(([x,r])=><li key={x} onClick={()=>setRoute(r)}>{x}</li>)}</ul></div>
            <div><h4>Visit the Haveli</h4><ul><li>Sardarpura, Jodhpur 342003</li><li>hello@houseofjodhana.com</li><li>+91 00000 00000</li><li>Mon–Sat · 10:00–19:00 IST</li></ul>
              <div style={{marginTop:24}}><h4>Letters from Jodhpur</h4><div style={{display:"flex",borderBottom:"1px solid var(--hair-light)",paddingBottom:6}}><input placeholder="your@email" style={{flex:1,background:"transparent",border:"none",color:"var(--ivory)",fontFamily:"inherit",fontSize:14,outline:"none"}}/><span style={{color:"var(--ivory)",fontSize:18}}>→</span></div></div>
            </div>
          </div>
          <div className="footer-bottom"><div>© 2026 House of Jodhana</div><div style={{display:"flex",gap:24,flexWrap:"wrap"}}><span>Privacy</span><span>Terms</span><span>Shipping</span><span>Returns</span></div><div className="hindi" style={{fontSize:14,letterSpacing:0,textTransform:"none"}}>हस्तनिर्मित · जोधपुर</div></div>
        </div>
      </div>
    </footer>
  );
}

/* Section header — block typography */
export function SectionHeader({ eyebrow, title, sub, dark=false, hindi }){
  return (
    <div className="rv" style={{maxWidth:980,margin:"0 auto",textAlign:"center",color:dark?"var(--ivory)":"var(--ink)"}}>
      <div className="uc" style={{color:dark?"rgba(251,247,239,.6)":"var(--ink-soft)",marginBottom:22,fontSize:10,letterSpacing:".4em"}}>{eyebrow}</div>
      {hindi&&<div className="hindi" style={{fontSize:20,color:dark?"rgba(251,247,239,.7)":"var(--royal)",marginBottom:14}}>{hindi}</div>}
      <h2 className="blk-h" style={{fontSize:"clamp(38px,5vw,78px)",margin:"0 0 26px",fontWeight:400}}>{title}</h2>
      <div style={{margin:"0 auto 24px",width:1,height:46,background:dark?"rgba(251,247,239,.35)":"var(--hair)"}}/>
      {sub&&<p style={{fontSize:16,color:dark?"rgba(251,247,239,.7)":"var(--ink-soft)",lineHeight:1.8,margin:"0 auto",maxWidth:560,textWrap:"pretty"}}>{sub}</p>}
    </div>
  );
}

/* Global scroll reveal + progress */
export function useScrollFX(dep){
  useEffect(()=>{
    const prog=document.getElementById("progress");
    const onS=()=>{ const h=document.documentElement; const p=h.scrollTop/((h.scrollHeight-h.clientHeight)||1); if(prog) prog.style.width=(p*100)+"%"; };
    window.addEventListener("scroll",onS,{passive:true}); onS();
    const t=setTimeout(()=>{
      document.querySelectorAll("main section > div").forEach(el=>{ if(!el.closest(".no-rv")&&!el.classList.contains("rv")) el.classList.add("rv"); });
      const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target);} }),{threshold:.08,rootMargin:"0px 0px -6% 0px"});
      document.querySelectorAll(".rv,.rv-mask").forEach(el=>io.observe(el));
      window.__rvio=io;
    },60);
    const fb=setTimeout(()=>document.querySelectorAll(".rv,.rv-mask").forEach(el=>{ const r=el.getBoundingClientRect(); if(r.top<window.innerHeight) el.classList.add("in"); }),1200);
    return ()=>{ clearTimeout(t); clearTimeout(fb); window.removeEventListener("scroll",onS); window.__rvio&&window.__rvio.disconnect(); };
  },[dep]);
}

export function Tilt({ children, max=8, style={}, className="" }){
  const ref=useRef(null);
  const move=e=>{ const el=ref.current; const r=el.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5; el.style.transform=`perspective(1000px) rotateY(${x*max}deg) rotateX(${-y*max}deg) translateZ(0)`; };
  const leave=()=>{ ref.current.style.transform="perspective(1000px) rotateY(0) rotateX(0)"; };
  return <div ref={ref} className={"tilt "+className} onMouseMove={move} onMouseLeave={leave} style={style}>{children}</div>;
}
