---
name: blog-post
description: Write and publish SEO-ready articles for the My Expansive Life blog. Use when asked to add blog posts, write articles, draft content for the journal, or publish to /blogs — whether it is one post or a batch.
---

# Writing blog posts for My Expansive Life

The full pipeline: pick topics, write, preview locally, publish to Firestore,
redeploy so the posts become crawlable and search engines are notified.

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

## Choosing topics — reach first

The goal is search reach, so pick the phrase people actually type and build the
post around it. (These rules come from a review of how our posts perform in
Google and AI search: narrative titles read well but match fewer searches.)

**Keyword-first titles.** Start the title with the search phrase, then add the
promise or a number. Keep it **≤ 60 characters**.

- Good: "How to Get Clients on LinkedIn: A Step-by-Step Guide"
- Good: "Passive Income for Doctors: 6 Options Compared"
- Weaker: "High Income but No Wealth: Where the Money Actually Goes" — compelling,
  but people search "how to build wealth on a high salary"
- Bad: "Pillar 4: Wealth & Ownership"

Aim at a real search intent — "how to", "what is", "best", "vs", "for
[audience]". One topic per post. If two topics fit in one title, they are two
posts. Put the exact phrase in the slug, the excerpt and the first paragraph.

**Topic clusters.** Every post belongs to a cluster (today: *LinkedIn
visibility* and *wealth*). Link to 3–5 closely related posts in the same
cluster, on descriptive anchor text — not to whatever happens to exist.

## Rules that are checked

`node scripts/check-posts.mjs` enforces these and exits non-zero on failure.

| Rule | Value |
| --- | --- |
| Title | **≤ 60 characters**, keyword first |
| Word count | Guides **800–1600**; the original seed batch 900–1000 |
| `excerpt` | **Max 160 characters**, contains the keyword — it is the meta description |
| FAQ | An `<h2>Frequently asked questions</h2>` with 3–5 `<h3>` question + `<p>` answer pairs |
| Table | **At least one** `<table>` (comparison, checklist, steps, numbers) |
| Video | **One** relevant My Expansive Life YouTube embed (see below) |
| Internal links | **3–5**, within the post's cluster, plus `/courses/linkedin-unlocked` or `/community` |
| External links | **At least 1**, to an authoritative source |
| Cover image | 1200×675 JPEG in `public/blog/<slug>.jpg` |
| `category` | Must be one of the values in `CATEGORIES` in `src/lib/posts.js` |

Do not invent SEO fields. The admin editor's `shape()` strips anything it does
not know about, so `excerpt` is the meta description and `tags` are the
keywords. That is the whole schema.

## Structure of a post

```
Opening — 2 short paragraphs, exact keyword phrase in the first sentence
<h2> question-style subheads, 4–7 of them ("How do I…", "What is…", "Why…")
Short paragraphs, one idea each. Numbered steps where the content is a process.
A <table> where something can be compared or checked
The video, introduced in one sentence
<h2>Frequently asked questions</h2> — 3–5 <h3> questions, 1–3 sentence answers
Closing <h2> with the next step, then internal links and a CTA
```

Question-style subheads and the FAQ matter because Google pulls them into
"People Also Ask" and featured snippets, and AI answer engines quote them
directly. `src/lib/faq.js` turns the FAQ section into FAQPage structured data
automatically (on the live page and in the prerender) — write it as plain
`<h3>`/`<p>` pairs and do not add schema by hand. Answer each FAQ question
fully in its first sentence.

**Rich media.** Tables and embedded video keep readers on the page longer,
which is one of the strongest signals for both Google and readers.

- Tables: plain `<table><thead><tr><th>…` — the site styles them (`.prose-mxl`).
- Video: use the same markup the admin editor produces so it styles the same:
  ```html
  <div data-youtube-video=""><iframe src="https://www.youtube-nocookie.com/embed/<ID>"
    title="<video title>" width="840" height="472" allowfullscreen="true"
    loading="lazy"></iframe></div>
  ```
  Pick a relevant video from the channel (latest uploads:
  `https://www.youtube.com/feeds/videos.xml?channel_id=UC35-2CmpAGrt7UEGtTi1jBg`)
  and confirm it exists with
  `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<ID>&format=json`.

**Money and health topics (YMYL).** Google holds these to a higher standard.
Name the author's real experience, give ranges and caveats instead of promises,
compute any numbers yourself, and end with "general information, not financial
advice".

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
# 1. write posts into scripts/content/posts-guides.mjs (new keyword-first
#    guides, each with its own publishedAt) — the seed files are history
#    then run the checks:
node scripts/check-posts.mjs

# 2. render the review page (after npm run build, so it uses the site's CSS)
node scripts/preview-posts.mjs --guides preview-posts.html
#    open preview-posts.html from the project root (it is git-ignored)

# 3. ALWAYS show the preview and get explicit approval before step 4

# 4. publish
SEED_EMAIL=... SEED_PASSWORD=... node scripts/seed-posts.mjs
#    --draft     write as drafts instead
#    --dry-run   print the plan, write nothing
#    --force     overwrite existing slugs

# 5. redeploy production and wait until every new post is live and crawlable
node scripts/rebuild-site.mjs <slug> [<slug> …]
```

Step 5 is what makes a post findable. The production build prerenders each
article (own title, description, JSON-LD, full text), rebuilds the sitemap,
pings IndexNow (Bing, DuckDuckGo, Yahoo, Yandex…) and resubmits the sitemap to
Google Search Console. A local `npm run build` changes nothing on the live
site. New cover images in `public/blog/` must be committed and pushed too —
the push deploys on its own, so run step 5 after that deploy if needed.

**Never run step 4 without explicit approval.** The default is published and
public. Use `--dry-run` freely; it touches nothing.

Re-running the seed skips slugs that already exist, so it is safe to repeat.

## After publishing

- Report each post's live URL from step 5's output.
- Run the SEO checks: title ≤ 60 characters (" | My Expansive Life" is only
  added when it fits), description 70–160, one H1, cover image alt text.
- Consider adding a link from an existing post to the new one.
- Publishing from the admin panel triggers the same redeploy automatically
  (`api/rebuild.js`); only scripted publishing needs step 5.

## Files

| Path | What |
| --- | --- |
| `scripts/content/posts-linkedin.mjs` | LinkedIn articles |
| `scripts/content/posts-mxl.mjs` | MXL articles |
| `scripts/content/posts-guides.mjs` | Keyword-first guides (table + video + FAQ), own publish dates |
| `scripts/check-posts.mjs` | SEO checks for every post — run before publishing |
| `src/lib/faq.js` | FAQ section → FAQPage structured data |
| `scripts/content/index.mjs` | Interleaves, dates, counts words |
| `scripts/preview-posts.mjs` | Local review page |
| `scripts/seed-posts.mjs` | Writes to Firestore |
| `scripts/generate-sitemap.mjs` | Runs inside `npm run build` |
| `scripts/prerender-blog.mjs` | Crawler-readable page per post, inside the build |
| `scripts/llms-txt.mjs` | /llms.txt + /llms-full.txt for AI search engines, inside the build |
| `scripts/indexnow.mjs`, `scripts/google-sitemap.mjs` | Search-engine pings, production builds only |
| `scripts/rebuild-site.mjs` | Redeploy via the Vercel Deploy Hook + verify posts are live |
| `src/components/Seo.jsx` | Per-page title, meta, canonical, JSON-LD |
| `public/blog/` | Cover images |
