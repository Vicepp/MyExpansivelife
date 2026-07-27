# Fonts

## Poppins — already working

Loaded from Google Fonts in `index.html` (weights 400/500/600/700/800). Nothing to do.

## The Seasons — needs your files

The display serif in the Figma file is **"FONTSPRING DEMO - The Seasons"**. It is not
on Google Fonts, so it has to be self-hosted. Until the files are here, headings fall
back to Playfair Display, which is close in spirit but not the same face.

Drop the files into this folder using **exactly** these names:

| File | Weight | Required |
| --- | --- | --- |
| `the-seasons-bold.woff2` | 700 | yes — all display headings use Bold |
| `the-seasons-regular.woff2` | 400 | optional |

`.otf` and `.ttf` with the same base names also work — `src` in `src/index.css` lists
all three formats and the browser picks the first it can load. No code change needed;
just add the files and reload.

**woff2 is strongly preferred for the web** — typically 40-50% smaller than OTF/TTF.
To convert an OTF/TTF you already have:

```bash
npm install -g ttf2woff2
ttf2woff2 < the-seasons-bold.ttf > the-seasons-bold.woff2
```

Or use https://cloudconvert.com/otf-to-woff2 — no install needed.

## Licensing — read before deploying

The Figma file names the font **"FONTSPRING DEMO"**. Fontspring demo fonts are
evaluation-only: they are **not licensed for use on a public website**, and they are
usually incomplete (limited glyphs, no kerning). Serving one from a live Vercel domain
would breach the demo licence.

Before going live, buy a webfont licence for The Seasons and replace the demo files
with the licensed webfont package. The filenames above stay the same, so it is a
drop-in swap.
