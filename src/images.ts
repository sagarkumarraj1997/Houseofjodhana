/* Photo registry: slot id -> image (string URL, or { src, alt, position }).
   Files live in /public/images. Add an entry here to fill a slot site-wide.

   Slot ids used across the site:
     --- HOME PAGE ---
     hero-pichwai                               Home landing hero center frame (src/home.tsx)
     hero-side-l, hero-side-r                   Home landing hero 3D backdrop cards (src/home.tsx)
     ring-<cat>-a / ring-<cat>-b                Home 3D collection ring panels:
                                                "ring-chowki-a", "ring-chowki-b", "ring-thali-a", "ring-kamdhenu-a", "ring-gifts-a" (src/home.tsx)
     jdh-01 … jdh-05                            "Walk with us through Jodhpur" 3D coverflow (src/home.tsx)
     pichwai-portrait                           Pichwai art form framed portrait (src/home-rest.tsx)
     proc-0 … proc-4                            5-step making process cards (src/home-rest.tsx)
     festive-left, festive-right                Diwali festive edit arches (src/home-rest.tsx)
     atelier-1, atelier-2                       Atelier workshop craft cards (src/home-rest.tsx)

     --- CATALOG & PRODUCTS ---
     pc-<product id>                            Catalog card & cart/checkout thumbnail, e.g. "pc-CHW·112" (src/catalog.tsx, src/store.tsx, src/checkout.tsx)
     pdp-<product id>-1 … -4                    Product page gallery (-1 falls back to pc-<id>) (src/product.tsx)
     pdp-<product id>-1-thumb … -4-thumb        Product gallery small thumbnails (src/product.tsx)
     artisan-portrait                           Master artisan avatar circle photo (src/product.tsx)

     --- PAGES ---
     gal-0 … gal-N                              Gallery page masonry grid (src/pages.tsx)
     blog-featured                              Journal featured article hero (src/pages.tsx)
     blog-0 … blog-N                            Journal story cards (src/pages.tsx)
     about-a … about-d                          About page atelier photo strip (src/pages.tsx)
     gift-occ-1 … gift-occ-4                    Gifting occasions cards (src/pages.tsx)
     logi-pack-1, logi-pack-2                   Shipping & logistics packaging photos (src/pages.tsx)
*/

export interface ImageDetail {
  src: string;
  alt?: string;
  position?: string;
}

export type ImageEntry = string | ImageDetail;

export const IMAGES: Record<string, ImageEntry> = {
  // Landing hero
  "hero-pichwai": { src: "/images/gal-1.png", alt: "House of Jodhana - Pichwai Chowki Hero" },
  "hero-side-l": { src: "/images/hero-left.jpg", alt: "House of Jodhana gallery" },
  "hero-side-r": { src: "/images/hero-right.jpg", alt: "House of Jodhana gallery" },

  // 3D Collection Ring
  "ring-chowki": { src: "/images/chowki.jpeg", alt: "Handcrafted Wooden Chowki" },

  // Gallery
  "gal-0": { src: "/images/gal-0.webp", alt: "House of Jodhana gallery" },
  "gal-1": { src: "/images/gal-1.png", alt: "Marwari Model" },
  "gal-2": { src: "/images/chowki.jpeg", alt: "Handcrafted Chowki" },
};
