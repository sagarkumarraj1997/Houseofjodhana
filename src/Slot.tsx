/* Production replacement for the prototype's <image-slot> drag-and-drop editor.
   Renders the photo registered for `id` in images.ts; an empty slot renders
   nothing, so the tinted .ph placeholder behind it shows through. */
import React from "react";
import { IMAGES, ImageEntry } from "./images";

function resolve(id: string): ImageEntry | undefined {
  if (IMAGES[id]) return IMAGES[id];
  if (id.endsWith("-thumb")) return resolve(id.slice(0, -6));
  const ring = id.match(/^ring-(.+)-[ab]$/);
  if (ring && IMAGES[`ring-${ring[1]}`]) return IMAGES[`ring-${ring[1]}`];
  const m = id.match(/^pdp-(.+)-1$/);
  return m ? IMAGES[`pc-${m[1]}`] : undefined;
}

const RADIUS: Record<string, string | number> = { rect: 0, rounded: 12, circle: "50%", pill: 9999 };

export interface SlotProps {
  id: string;
  placeholder?: string;
  shape?: "rect" | "rounded" | "circle" | "pill" | string;
  radius?: number | string;
  style?: React.CSSProperties;
  className?: string;
}

export function Slot({ id, placeholder, shape = "rounded", radius, style = {}, className = "" }: SlotProps) {
  const entry = resolve(id);
  if (!entry) return null;
  const { src, alt, position = "50% 50%" } = typeof entry === "string" ? { src: entry, alt: undefined, position: undefined } : entry;
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
