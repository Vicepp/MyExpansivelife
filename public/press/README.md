# Press logos

The "As featured in" strip on every public page reads its logos from here.
Drop the files in with **exactly** these names and they appear on reload — no
code change, no rebuild.

| File | Publication | Article |
| --- | --- | --- |
| `usa-news.png` | USA News | [How Pheenyx Capital Redefines Wealth for High Achievers](https://usanews.com/newsroom/how-pheenyx-capital-redefines-wealth-for-high-achievers) |
| `somedocs.png` | SoMeDocs | [Finances, Investing, Real Estate](https://doctorsonsocialmedia.com/finances-investing-real-estate/) |
| `ceo-times.png` | CEO Times | [How Pheenyx Capital Helps High Achievers Build Wealth](https://ceotimes.com/how-pheenyx-capital-helps-high-achievers-build-wealth-that-works-for-them/) |

Until a file is present, that publication renders as a styled wordmark instead,
so the row never shows a broken image.

## Preparing the files

- **PNG with a transparent background** is ideal — the strip sits on white, and
  a white rectangle behind a logo is obvious.
- Around **400–600px wide** is plenty; they display at 28–36px tall.
- Keep them trimmed, with no large empty margin baked in, or the logo will look
  smaller than the others.

Clicks are counted as `press_usa-news`, `press_somedocs` and `press_ceo-times`
under **Page analytics → Button clicks**.

## Changing the list

Edit `PRESS` at the top of `src/components/TrustedBy.jsx` to add, remove or
reorder publications. Each entry needs an `id`, `name`, `logo` path and `href`.
