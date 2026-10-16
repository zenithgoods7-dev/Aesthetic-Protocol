# The Aesthetic Protocol

Landing / sales site for a three‑ebook bundle — **The Aesthetic Protocol**, **The Sovereign Mind**, and **The Wealth Architecture**. Dark, tactical "operator's manual" theme with an accent colour that tunes per book (cyan / crimson / gold).

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

- **Bundle:** ₹349 launch price until **31 October 2026**, then ₹599
- **Individual books:** ₹999 → ₹199 each

There is no countdown timer. The only deadline claim is the line under the bundle
button ("Launch price ₹349 until 31 October. Then ₹599.") and the matching FAQ answer.

### Price change on 1 November 2026

The site does **not** change price by itself. On 1 November:

1. **Razorpay first:** edit the bundle payment page (`rzp.io/rzp/ADl161Vz`) amount from ₹349 to ₹599.
   The site only links to it, so customers are charged whatever Razorpay says.
2. In `index.html`, search for `₹349` and update every bundle mention: meta description,
   nav button, hero button + stat, the three "or all three for ₹349 →" notes, bundle sub-copy,
   bundle price block (`bundle__now` / `bundle__was` / `bundle__save`), bundle button,
   contents-section button, sticky mobile bar, both FAQ answers, final CTA.
3. Remove or reword the launch-price copy: `bundle__deadline` line, hero "42% Off, launch pricing"
   stat, `final__sub` ("Launch price ₹349"), the FAQ "Is the ₹349 price permanent?" item,
   and the struck-through `₹599` in the hero button / bundle block (it is no longer a discount).
4. Re-check the "Three books. Less than the price of two." claim — at ₹599 vs ₹199 singles it stops being true.
5. Commit and push (GitHub Pages redeploys from `main`).

## Deploy

Any static host works. Drag this folder onto [Netlify Drop](https://app.netlify.com/drop), or push to GitHub and enable **GitHub Pages**.
