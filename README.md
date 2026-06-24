# The Aesthetic Protocol

Landing / sales site for a three‑ebook bundle — **The Aesthetic Dominion**, **The Cardinal Mind**, and **The Wealth Architecture**. Dark, tactical "operator's manual" theme with an accent colour that tunes per book (cyan / crimson / gold).

It's a plain static site — no build step needed to run it.

## Run locally

Open `index.html` directly in a browser, or serve the folder:

```bash
npx serve .
```

Then visit http://localhost:3000 (or the port shown).

## Structure

| File | Purpose |
|------|---------|
| `index.html` | The page |
| `styles.css` | All styling (responsive, mobile‑first touches) |
| `script.js` | Nav menu, scroll reveals, cover animations, countdown |
| `assets/` | Ebook cover images |
| `build-standalone.mjs` | Bundles everything into one portable `aesthetic-protocol-mobile.html` |

Regenerate the single‑file build any time with:

```bash
node build-standalone.mjs
```

## Pricing

- **Bundle:** ₹399 (was ₹599)
- **Individual books:** ₹999 → ₹199 each

## Deploy

Any static host works. Drag this folder onto [Netlify Drop](https://app.netlify.com/drop), or push to GitHub and enable **GitHub Pages**.
