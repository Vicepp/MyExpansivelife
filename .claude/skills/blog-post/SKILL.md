---
name: blog-post
description: Write and publish SEO-ready articles for the My Expansive Life blog. Use when asked to add blog posts, write articles, draft content for the journal, or publish to /blogs — whether it is one post or a batch.
---

# Writing blog posts for My Expansive Life

The full pipeline: pick topics, write, preview locally, publish to Firestore,
regenerate the sitemap.

## Before writing anything

1. **Read the source material.** Course content lives in `mXL document for blog/`
   as `.docx`. Extract it with:
   ```bash
   python -c "
   import zipfile,re,sys
   z=zipfile.ZipFile(sys.argv[1]); x=z.read('word/document.xml').decode('utf-8','replace')
   x=re.sub(r'</w:p>','\n',x); print(re.sub(r'<[^>]+>','',x))
   " "mXL document for blog/<file>.docx"
   ```
2. **Check what already exists** in `scripts/content/posts-*.mjs` so topics and
   slugs do not repeat.
3. **Confirm the split.** MXL posts map to the six growth pillars (see
   `src/components/Pillars.jsx`); LinkedIn posts map to the course modules.

## Choosing topics

Write the title as the question someone types into Google, not the way we would
phrase it internally.

- Good: "High Income but No Wealth: Where the Money Actually Goes"
- Bad: "Pillar 4: Wealth & Ownership"

Aim at a real search intent — "how to", "what to", "why does". One topic per
post. If two topics fit in one title, they are two posts.

## Rules that are checked

| Rule | Value |
| --- | --- |
| Word count | **Max 1000.** Target 650–800. |
| `excerpt` | **Max 160 characters** — it is the meta description |
| Internal links | **At least 1**, ideally 3–4 |
| External links | **At least 1**, to an authoritative source |
| Cover image | 1200×675 JPEG in `public/blog/<slug>.jpg` |
| `category` | Must be one of the values in `CATEGORIES` in `src/lib/posts.js` |

Do not invent SEO fields. The admin editor's `shape()` strips anything it does
not know about, so `excerpt` is the meta description and `tags` are the
keywords. That is the whole schema.

## Structure of a post

```
Opening — 2 short paragraphs, primary keyword in the first
<h2> question-style subheads, 4–7 of them
Short paragraphs, one idea each. Lists where the content is genuinely a list.
Closing <h2> with the takeaway, then internal links and a CTA
```

Question-style subheads matter for two reasons: they win featured snippets, and
answer engines quote them directly.

## Voice

Match the site. Plain, direct, specific. Concrete numbers over adjectives.
No hype, no "unlock your potential", no exclamation marks. Say the useful thing
and stop. Read it aloud — if it is hard to say, rewrite it.

## Links

- **Internal:** other posts (`/blogs/<slug>`), `/community`,
  `/courses/linkedin-unlocked`. Link on descriptive anchor text, never "click
  here". Every new post should link to at least one existing post, and it is
  worth adding a link *back* from an older post so the graph stays connected.
- **External:** authoritative and stable only — LinkedIn help, WHO, SEC
  investor.gov, IRS, SBA, HBR. **Verify every URL before shipping:**
  ```bash
  curl -s -o /dev/null -L -w '%{http_code}  %{url_effective}\n' -A "Mozilla/5.0" "<url>"
  ```
  A 403 from a government site usually means bot-blocking, not a dead link —
  check it in a browser before discarding it. Always add
  `target="_blank" rel="noopener noreferrer"`.

## Cover images

Unsplash CDN, downloaded and committed (not hotlinked — hotlinks break and cost
page speed). Verify an id resolves, then:

```js
const url = `https://images.unsplash.com/${id}?w=1600&q=80&fm=jpg&fit=crop`
await sharp(Buffer.from(await (await fetch(url)).arrayBuffer()))
  .resize({ width: 1200, height: 675, fit: 'cover', position: 'attention' })
  .jpeg({ quality: 78, mozjpeg: true })
  .toFile(`public/blog/${slug}.jpg`)
```

Build a contact sheet with `sharp` and **look at the candidates** before
choosing — never assign an image you have not seen.

## The workflow

```bash
# 1. write posts into scripts/content/posts-linkedin.mjs or posts-mxl.mjs

# 2. render the local preview
node scripts/preview-posts.mjs
#    → http://localhost:5173/_preview/posts.html  (dev server must be running)

# 3. ALWAYS show the preview and get explicit approval before step 4

# 4. publish
SEED_EMAIL=... SEED_PASSWORD=... node scripts/seed-posts.mjs
#    --draft     write as drafts instead
#    --dry-run   print the plan, write nothing
#    --force     overwrite existing slugs

# 5. refresh the sitemap so the new URLs are crawlable
npm run build
```

**Never run step 4 without explicit approval.** The default is published and
public. Use `--dry-run` freely; it touches nothing.

Re-running the seed skips slugs that already exist, so it is safe to repeat.

## After publishing

- `npm run build` regenerates `dist/sitemap.xml` from the published posts.
- Ask whether to submit the sitemap in Google Search Console.
- Consider adding a link from an existing post to the new one.

## Files

| Path | What |
| --- | --- |
| `scripts/content/posts-linkedin.mjs` | LinkedIn articles |
| `scripts/content/posts-mxl.mjs` | MXL articles |
| `scripts/content/index.mjs` | Interleaves, dates, counts words |
| `scripts/preview-posts.mjs` | Local review page |
| `scripts/seed-posts.mjs` | Writes to Firestore |
| `scripts/generate-sitemap.mjs` | Runs inside `npm run build` |
| `src/components/Seo.jsx` | Per-page title, meta, canonical, JSON-LD |
| `public/blog/` | Cover images |
