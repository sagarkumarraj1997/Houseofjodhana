import { useState as useStateH2, useEffect as useEffectH2, useRef as useRefH2 } from "react";
import { Slot } from "./Slot.jsx";
import { Emblem, ArchPH, PichwaiFrame, Tilt } from "./shared.jsx";
import { PRODUCTS, ProductCard } from "./catalog.jsx";
import { useScrollProgress } from "./home.jsx";
/* Home sections — premium */

export function Counter({ to, suffix="" }){
  const ref=useRefH2(null); const [v,setV]=useStateH2(0);
  useEffectH2(()=>{ const io=new IntersectionObserver(([e])=>{ if(e.isIntersecting){ const t0=performance.now(); const step=t=>{ const p=Math.min(1,(t-t0)/1800); setV(Math.round(to*(1-Math.pow(1-p,3)))); if(p<1) requestAnimationFrame(step); }; requestAnimationFrame(step); io.disconnect(); } }); io.observe(ref.current); return ()=>io.disconnect(); },[]);
  return <span ref={ref}>{v}{suffix}</span>;
}

export function PichwaiStory(){
  const ref=useRefH2(null); const p=useScrollProgress(ref);
  return (
    <section ref={ref} className="no-rv" style={{height:"180vh",position:"relative",background:"var(--ivory)"}}>
      <div style={{position:"sticky",top:0,height:"100vh",overflow:"hidden",display:"flex",alignItems:"center",padding:"40px 48px"}}>
        <div style={{maxWidth:1400,margin:"0 auto",width:"100%",display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)",gap:"clamp(32px,6vw,100px)",alignItems:"center"}}>
          <div style={{perspective:1400}}>
            <div style={{transform:`rotateY(${(1-p)*-28}deg) rotateX(${(1-p)*8}deg) scale(${.86+p*.14})`,transformOrigin:"left center",transition:"transform .15s linear"}}>
              <PichwaiFrame><div className="ph dark" style={{height:"min(620px,calc(100vh - 160px))",position:"relative"}}><Slot id="pichwai-portrait" placeholder="Pichwai painting · 600×800" shape="rounded" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/></div></PichwaiFrame>
            </div>
          </div>
          <div style={{opacity:Math.min(1,p*2.2),transform:`translateY(${(1-Math.min(1,p*2))*40}px)`}}>
            <div className="uc" style={{fontSize:10,letterSpacing:".42em",color:"var(--ink-soft)",marginBottom:22}}>The Art Form</div>
            <div className="hindi" style={{fontSize:20,color:"var(--royal)",marginBottom:16}}>पिछवाई</div>
            <h2 className="blk-h" style={{fontSize:"clamp(30px,4.4vw,76px)",margin:"0 0 clamp(16px,3vh,34px)",fontWeight:400}}>Pichwai,<br/><em>that which hangs behind</em></h2>
            <p style={{fontSize:"clamp(14px,1.1vw,16px)",lineHeight:1.8,color:"var(--ink-soft)",margin:"0 0 14px",maxWidth:500}}>Painted cloths once hung behind Shrinathji in the temples of Nathdwara — lotus ponds, grazing cows, kadamba trees and gopis bearing lamps. We carry those motifs onto wood, brass and box.</p>
            <p style={{fontSize:16,lineHeight:1.9,color:"var(--ink-soft)",margin:0,maxWidth:500}}>Mewar's devotional art, rendered in Marwar's blue.</p>
            <div style={{display:"flex",gap:"clamp(20px,3vw,48px)",flexWrap:"wrap",marginTop:"clamp(18px,4vh,46px)",paddingTop:"clamp(14px,3vh,30px)",borderTop:"1px solid var(--hair)"}}>
              {[["Kamal","the lotus"],["Gau","the sacred cow"],["Kadamb","Krishna's tree"]].map(([n,l])=>(
                <div key={n}><div className="serif" style={{fontSize:26,fontStyle:"italic",color:"var(--royal)"}}>{n}</div><div className="uc" style={{fontSize:9,color:"var(--ink-soft)",marginTop:6}}>{l}</div></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductGrid({ openProduct, setRoute }){
  const featured=PRODUCTS.filter(p=>p.cat!=="gifts").slice(0,8);
  return (
    <section style={{padding:"160px 48px"}}>
      <div style={{maxWidth:1480,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",gap:30,flexWrap:"wrap",marginBottom:70}}>
          <div>
            <div className="uc" style={{fontSize:10,letterSpacing:".42em",color:"var(--ink-soft)",marginBottom:18}}>The Season's Pieces</div>
            <h2 className="blk-h" style={{fontSize:"clamp(38px,4.6vw,72px)",margin:0,fontWeight:400}}>Selected <em>for the altar</em></h2>
          </div>
          <span className="link" onClick={()=>setRoute("catalog")}>View all pieces</span>
        </div>
        <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:"60px 32px"}}>
          {featured.map(p=><ProductCard key={p.id} item={p} onOpen={()=>openProduct(p)}/>)}
        </div>
      </div>
    </section>
  );
}

/* Stacking 3D cards */
export function Process(){
  const steps=[["Design","Motif and colourway drawn with our Pichwai master.","maroon"],["Carve","Seasoned wood turned and embossed in low relief.","dark"],["Paint","Lotus, cow and kadamba painted by hand over four to seven days.","saffron"],["Finish","Beeswax wash, brass fittings, a final hand-polish.","peacock"],["Bless & Box","A tilak at the workshop shrine. Wrapped in muslin, sealed with our emblem.","emerald"]];
  const ref=useRefH2(null); const p=useScrollProgress(ref);
  const n=steps.length;
  return (
    <section ref={ref} className="no-rv" style={{height:`${n*90+40}vh`,position:"relative",background:"var(--midnight)",color:"var(--ivory)"}}>
      <div style={{position:"sticky",top:0,height:"100vh",overflow:"hidden",display:"grid",gridTemplateColumns:"minmax(0,.75fr) minmax(0,1.25fr)",alignItems:"center",gap:"clamp(24px,5vw,60px)",padding:"0 clamp(24px,4vw,48px)",maxWidth:1480,margin:"0 auto"}}>
        <div>
          <div className="uc" style={{fontSize:10,letterSpacing:".42em",color:"rgba(251,247,239,.55)",marginBottom:20}}>From log to altar</div>
          <h2 className="blk-h" style={{fontSize:"clamp(30px,4.4vw,78px)",margin:"0 0 24px",fontWeight:400}}>Five hands.<br/><em style={{color:"var(--ivory)"}}>One piece.</em></h2>
          <div className="hindi" style={{fontSize:18,color:"rgba(251,247,239,.6)"}}>पाँच हाथ, एक कृति</div>
          <div style={{display:"flex",gap:10,marginTop:40}}>{steps.map((_,i)=><span key={i} style={{width:28,height:1,background:p*n>i?"var(--ivory)":"rgba(251,247,239,.2)",transition:"background .4s"}}/>)}</div>
        </div>
        <div style={{position:"relative",height:"min(62vh,520px)",perspective:1600}}>
          {steps.map(([t,d,tone],i)=>{
            const local=p*n-i; // <0 not yet, 0..1 entering, >1 passed
            const enter=Math.min(1,Math.max(0,local+1));
            const past=Math.max(0,local);
            const y=(1-enter)*110, rx=(1-enter)*-35, sc=1-Math.min(past,4)*0.06, z=-Math.min(past,4)*80;
            return (
              <div key={i} style={{position:"absolute",inset:0,transform:`translate3d(0,${y}%,${z}px) rotateX(${rx}deg) scale(${sc})`,transformOrigin:"50% 0%",opacity:enter<0.02?0:1,zIndex:i,background:"var(--ivory)",color:"var(--ink)",display:"grid",gridTemplateColumns:"1fr 1fr",boxShadow:"0 40px 80px rgba(0,0,0,.35)"}}>
                <div className={`ph ${tone}`} style={{position:"relative"}}><Slot id={`proc-${i}`} placeholder={`Drop · ${t}`} shape="rounded" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/></div>
                <div style={{padding:"clamp(20px,3vw,44px) clamp(18px,2.6vw,40px)",display:"flex",flexDirection:"column",justifyContent:"space-between",gap:12}}>
                  <span className="serif" style={{fontSize:16,color:"var(--ink-soft)"}}>0{i+1} / 0{n}</span>
                  <div><div className="blk-h" style={{fontSize:"clamp(30px,2.8vw,44px)",fontWeight:400,marginBottom:16}}>{t}</div><p style={{fontSize:"clamp(13px,1vw,15px)",lineHeight:1.7,color:"var(--ink-soft)",margin:0}}>{d}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FestiveBanner({ setRoute }){
  return (
    <section style={{padding:"160px 48px",background:"var(--sand)",position:"relative",overflow:"hidden"}}>
      <div className="g4" style={{position:"relative",maxWidth:1400,margin:"0 auto",display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1.3fr) minmax(0,1fr)",gap:56,alignItems:"center"}}>
        <Tilt max={10}><ArchPH slotId="festive-left" placeholder="Diya · brass" tone="dark" height={400}/></Tilt>
        <div style={{textAlign:"center"}}>
          <div className="uc" style={{fontSize:10,letterSpacing:".42em",color:"var(--ink-soft)",marginBottom:18}}>Festive Edit · 2026</div>
          <div className="hindi" style={{fontSize:24,color:"var(--royal)",marginBottom:14}}>दीपावली</div>
          <h2 className="blk-h" style={{fontSize:"clamp(40px,4.8vw,78px)",margin:"0 0 26px",fontWeight:400}}>The festival<br/><em>of lights</em></h2>
          <p style={{fontSize:16,maxWidth:420,margin:"0 auto 40px",color:"var(--ink-soft)",lineHeight:1.85}}>Lakshmi-Ganesh chowkis, lotus thalis and lamp-lit gift boxes — dispatched from Jodhpur in time for Diwali.</p>
          <button className="btn" onClick={()=>setRoute("gifts")}>Shop the edit <span className="arrow">→</span></button>
        </div>
        <Tilt max={10}><ArchPH slotId="festive-right" placeholder="Lotus thali" tone="maroon" height={400}/></Tilt>
      </div>
    </section>
  );
}

export function Atelier(){
  return (
    <section style={{padding:"160px 48px",background:"var(--ivory)"}}>
      <div className="hero-grid" style={{maxWidth:1400,margin:"0 auto",display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)",gap:100,alignItems:"center"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:22}}>
          {[["atelier-1","Pichwai painter","maroon",380,0],["atelier-2","Brass casting","dark",380,80]].map(([id,l,t,h,m])=><Tilt key={id} max={7} style={{marginTop:m}}><div className={`ph ${t}`} style={{height:h,position:"relative"}}><Slot id={id} placeholder={l} shape="rounded" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/></div></Tilt>)}
        </div>
        <div>
          <div className="uc" style={{fontSize:10,letterSpacing:".42em",color:"var(--ink-soft)",marginBottom:22}}>Made in Jodhpur</div>
          <h2 className="blk-h" style={{fontSize:"clamp(40px,4.8vw,76px)",margin:"0 0 32px",fontWeight:400}}>Many hands,<br/><em>one haveli</em></h2>
          <p style={{fontSize:16,lineHeight:1.9,color:"var(--ink-soft)",maxWidth:480,margin:"0 0 50px"}}>Our Sardarpura workshop is a working haveli — painters in the courtyard, casters at the back, box-makers on the roof. No factory lines. Every piece is checked twice and blessed before it leaves.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,auto)",gap:50,justifyContent:"start",paddingTop:34,borderTop:"1px solid var(--hair)"}}>
            {[[62,"","Craftsmen"],[14,"","Apprentices"],[100,"%","By hand"]].map(([n,s,l])=>(
              <div key={l}><div className="serif" style={{fontSize:52,fontWeight:400,lineHeight:1,color:"var(--royal)"}}><Counter to={n} suffix={s}/></div><div className="uc" style={{fontSize:9,color:"var(--ink-soft)",marginTop:10}}>{l}</div></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Reviews(){
  const r=[
    { q:"The Pichwai lotuses on our chowki are so fine you can count the petals. It sits in our mandir as though it was always there.", w:"Meera Shah", loc:"Ahmedabad" },
    { q:"It arrived wrapped in muslin with a small card that said Khamma Ghani. My mother kept the card.", w:"Rohan Bhati", loc:"London" },
    { q:"The gift boxes are works of art on their own. Our family's Diwali came from House of Jodhana this year.", w:"Ananya Rao", loc:"Bengaluru" },
  ];
  const [i,setI]=useStateH2(0);
  useEffectH2(()=>{ const t=setInterval(()=>setI(x=>(x+1)%r.length),6000); return ()=>clearInterval(t); },[]);
  return (
    <section style={{padding:"170px 48px",background:"var(--sand)"}}>
      <div style={{maxWidth:1000,margin:"0 auto",textAlign:"center",perspective:1200}}>
        <div className="uc" style={{fontSize:10,letterSpacing:".42em",color:"var(--ink-soft)",marginBottom:50}}>From our patrons</div>
        <div key={i} style={{animation:"flipIn 1.2s cubic-bezier(.16,1,.3,1) both",transformOrigin:"50% 100%"}}>
          <blockquote className="serif" style={{fontSize:"clamp(26px,3vw,44px)",fontStyle:"italic",fontWeight:400,lineHeight:1.4,margin:"0 0 40px"}}>“{r[i].q}”</blockquote>
          <div className="uc" style={{fontSize:10,letterSpacing:".36em"}}>{r[i].w} <span style={{color:"var(--ink-soft)"}}>· {r[i].loc}</span></div>
        </div>
        <div style={{display:"flex",gap:14,justifyContent:"center",marginTop:50}}>{r.map((_,k)=><button key={k} aria-label={`Review ${k+1}`} onClick={()=>setI(k)} style={{width:k===i?48:16,height:1,background:k===i?"var(--ink)":"var(--hair)",transition:"all .6s"}}/>)}</div>
      </div>
    </section>
  );
}

export function CTA({ setRoute }){
  return (
    <section style={{padding:"180px 48px",background:"var(--midnight)",color:"var(--ivory)",textAlign:"center",position:"relative",overflow:"hidden"}} className="kamal-dark">
      <div style={{position:"relative",maxWidth:900,margin:"0 auto"}}>
        <Emblem variant="white" size={80} style={{margin:"0 auto 40px",opacity:.9}}/>
        <div className="hindi" style={{fontSize:24,marginBottom:20,color:"rgba(251,247,239,.7)"}}>पधारो म्हारे देस</div>
        <h2 className="blk-h" style={{fontSize:"clamp(44px,6vw,100px)",margin:"0 0 30px",fontWeight:400}}>Bring Jodhpur<br/><em style={{color:"var(--ivory)"}}>home</em></h2>
        <p style={{fontSize:16,maxWidth:520,margin:"0 auto 50px",color:"rgba(251,247,239,.7)",lineHeight:1.85}}>A single chowki for a home shrine, or a festive box for everyone you love — made by hand and sent wherever you are.</p>
        <div style={{display:"flex",gap:30,justifyContent:"center",alignItems:"center",flexWrap:"wrap"}}>
          <button className="btn gold" onClick={()=>setRoute("catalog")}>Shop the collection <span className="arrow">→</span></button>
          <span className="link" style={{color:"var(--ivory)"}} onClick={()=>setRoute("contact")}>Visit the haveli</span>
        </div>
      </div>
    </section>
  );
}

export const SacredCollections = () => null;
