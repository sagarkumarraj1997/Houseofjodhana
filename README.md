# House of Jodhana — storefront

Production build of the Claude Design prototype in `../project/index.html`
(Vite + React 18, no runtime Babel, no CDN scripts).

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # static output in dist/
npm run preview   # serve the build
```

## What's where

| File | Contents |
| --- | --- |
| `index.html` | Entry page, fonts, boot screen |
| `src/styles/global.css` | Brand tokens (Royal Palette) and global styles, unchanged from the prototype |
| `src/app.jsx` | App shell and URL routing |
| `src/store.jsx` | Bag, wishlist, sign-in, orders (persisted in `localStorage`), bag drawer, auth modal |
| `src/shared.jsx` | Nav, footer, brand primitives (emblem, Pichwai frame, tapes, stamp), scroll effects |
| `src/home.jsx`, `src/home-rest.jsx` | Home page sections |
| `src/catalog.jsx` | Product data (`PRODUCTS`, `CATS`), catalog page, `ProductCard` |
| `src/product.jsx` | Product detail page |
| `src/pages.jsx` | Gifting, Gallery, Journal, About, Shipping, Contact |
| `src/checkout.jsx` | Bag page, checkout, confirmation, account |
| `src/Slot.jsx`, `src/images.js` | Photo slots (see below) |

## URLs

`/` · `/catalog` · `/catalog/chowki|thali|kamdhenu` · `/product/<sku>` (e.g. `/product/chw-112`) ·
`/gifting` · `/gallery` · `/journal` · `/about` · `/shipping` · `/contact` · `/bag` · `/checkout` ·
`/order-confirmed` · `/account`

This is a single-page app, so the host must rewrite unknown paths to `/index.html`
(Netlify: `/* /index.html 200`; Vercel: a rewrite to `/index.html`; nginx: `try_files $uri /index.html`).

## Adding photos

The prototype's drag-and-drop `<image-slot>` editor is replaced by `<Slot id="…">`.
Put the file in `public/images/` and register it in `src/images.js`:

```js
"pc-CHW·112": { src: "/images/chw-112.webp", alt: "Shrinathji Pichwai Chowki" },
```

Empty slots render nothing, so the tinted placeholder shows. A product's catalog photo
(`pc-<id>`) is reused as the first image on its product page. The full list of slot ids is in
`src/images.js`.

## Not real yet (same as the prototype)

Sign-in, OTP, Google sign-in, payment and orders are simulated in the browser — any
credentials are accepted and nothing is charged. Discount codes `DIWALI26` and
`KHAMMAGHANI` are hard-coded in `src/checkout.jsx`. The phone number (+91 00000 00000)
is the brand kit placeholder.
