# The AI assistant

A floating chat bubble in the bottom-right corner of every public page. It asks
for a name and email, answers questions about the site, and keeps the next
webinar pinned above the conversation.

It does **not** appear anywhere under `/admin` — the widget is mounted in
`components/Layout.jsx`, which only wraps the public routes.

## How it fits together

| File | What it does |
| --- | --- |
| `src/components/ChatWidget.jsx` | The bubble, the panel, the name/email gate, the pinned webinar |
| `netlify/functions/chat.js` | The `/api/chat` endpoint on the deployed site |
| `netlify/lib/chat.js` | Talks to OpenRouter, walks the model fallback chain |
| `netlify/lib/knowledge.js` | **Everything the assistant knows about the business** |
| `vite.config.js` | Serves the same `/api/chat` during `npm run dev` |

The browser never talks to OpenRouter. It posts to `/api/chat`, and the server
adds the API key. Dev and production run the identical `handleChat()`, so there
is no "works locally, breaks live" gap.

## ⚠️ Never put the key in a `VITE_` variable

`OPENROUTER_API_KEY` has **no `VITE_` prefix**, and that is load-bearing. Vite
inlines every `VITE_`-prefixed value into the public JavaScript bundle. A key
named `VITE_OPENROUTER_API_KEY` would be readable by anyone who opens the site
and could be used to spend the account's credit.

To check a build is clean:

```sh
npm run build
grep -r "sk-or-v1" dist/     # must find nothing
```

## Setting it up on Netlify

Site configuration → Environment variables. Add as **plain** variables:

| Variable | Required | Notes |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | yes | From openrouter.ai/keys |
| `OPENROUTER_MODEL` | no | Tried first. Blank uses the built-in free chain. |
| `OPENROUTER_FALLBACK_MODELS` | no | Comma separated. Blank uses the built-in list. |

Then **redeploy** — Netlify only picks up new environment variables on a fresh
build.

## The model fallback chain

`netlify/lib/chat.js` tries each model in order and uses the first one that
answers. A model that is rate-limited, out of credit or retired just moves the
request to the next one.

The defaults are all free models, so the assistant works on an OpenRouter
account with no credit at all. Free models are aggressively rate-limited
upstream, so a 429 on any one of them is routine — that is precisely why there
is a chain rather than a single model.

**When you add credit**, set `OPENROUTER_MODEL` to a paid model
(`anthropic/claude-3.5-haiku` and `google/gemini-2.5-flash-lite` are both cheap
and noticeably better). The free chain then becomes its automatic fallback:
better answers while there is credit, still working when it runs out.

Model IDs change. If every model in the chain starts failing, check the current
list:

```sh
curl -s https://openrouter.ai/api/v1/models | grep -o '"id":"[^"]*:free"'
```

## Teaching it about the business

Everything the assistant knows lives in `SITE_KNOWLEDGE` in
`netlify/lib/knowledge.js`. It is plain prose — edit it like a briefing
document. If a fact is not in that file, the assistant does not know it.

It is deliberately told **not** to know prices, refund terms, cohort dates,
payment plans or affiliate payout schedules. It says so and offers a follow-up
instead of guessing. Add them to the knowledge file when they are settled, and
keep them current — a stale price in there is worse than no price.

## Leads

The name and email are written to the Firestore `messages` collection the
moment the visitor submits the gate, so every conversation shows up in **Admin →
Inbox** tagged `AI chat`. Two counters also land in analytics: `chat_opened` and
`chat_lead_captured`.

Without Firebase configured the chat still works — the lead is simply not saved.

## Limits

- `/api/chat` is public and unauthenticated. Per-request cost is capped (1,200
  characters in, 16 messages of history, 700 tokens out) but there is no
  per-visitor rate limit. If it is ever abused, the quickest fix is to remove
  `OPENROUTER_API_KEY` from Netlify, which disables the chat cleanly with a
  "not configured" message rather than an error.
- Answers are not streamed — the reply appears once it is complete. A typing
  indicator covers the wait, which is usually two to three seconds.
