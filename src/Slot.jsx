/* Production replacement for the prototype's <image-slot> drag-and-drop editor.
   Renders the photo registered for `id` in images.js; an empty slot renders
   nothing, so the tinted .ph placeholder behind it shows through. */
import { IMAGES } from "./images.js";

/* thumbnails reuse their main image; a product's first gallery shot falls back
   to its catalog photo (pc-<id>) so one upload covers card + product page */
function resolve(id){
  if (IMAGES[id]) return IMAGES[id];
  if (id.endsWith("-thumb")) return resolve(id.slice(0, -6));
  const m = id.match(/^pdp-(.+)-1$/);
  return m ? IMAGES[`pc-${m[1]}`] : undefined;
}

const RADIUS = { rect: 0, rounded: 12, circle: "50%", pill: 9999 };

export function Slot({ id, placeholder, shape = "rounded", radius, style = {}, className = "" }){
  const entry = resolve(id);
  if (!entry) return null;
  const { src, alt, position = "50% 50%" } = typeof entry === "string" ? { src: entry } : entry;
  const r = shape === "rounded" && radius != null ? radius : RADIUS[shape] ?? 12;
  return (
    <div className={className} style={{ overflow: "hidden", borderRadius: r, ...style }}>
      <img
        src={src}
        alt={alt ?? placeholder ?? ""}
        loading="lazy"
        decoding="async"
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: position, maxWidth: "none" }}
      />
    </div>
  );
}
