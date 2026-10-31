/* Photo registry: slot id -> image (string URL, or { src, alt, position }).
   Files live in /public/images. Add an entry here to fill a slot site-wide.

   Slot ids used across the site:
     hero-pichwai, hero-side-l, hero-side-r     home hero
     ring-<cat>-a / ring-<cat>-b                collection ring (chowki, thali, kamdhenu, gifts)
     jdh-01 … jdh-05                            "Walk with us through Jodhpur"
     pichwai-portrait, proc-0 … proc-4          Pichwai story, making process
     atelier-1, atelier-2, artisan-portrait     atelier / artisan
     pc-<product id>                            product photo (cards, bag, checkout), e.g. "pc-CHW·112"
     pdp-<product id>-1 … -4                    product page gallery (-1 falls back to pc-<id>)
     gift-occ-1 … gift-occ-4                    Gifting occasions
     gal-0 … gal-N                              Gallery page
     blog-featured, blog-0 … blog-N             Journal
     logi-pack-1, logi-pack-2                   Shipping page
*/
export const IMAGES = {
  "gal-0": { src: "/images/gal-0.webp", alt: "House of Jodhana gallery" },
};
