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
| `src/components/ChatText.jsx` | Turns links in a reply into things you can press |
| `src/lib/chats.js` | Saves and reads transcripts (`chats` collection) |
| `src/admin/Inbox.jsx` | Reads transcripts alongside form messages |
| `netlify/functions/chat.js` | The `/api/chat` endpoint on the deployed site |
| `netlify/lib/chat.js` | Talks to OpenRouter, walks the model fallback chain |
| `netlify/lib/knowledge.js` | **Everything the assistant knows, and every link it may give** |
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
| `CHAT_BOOKING_URL` | no | A Calendly-style booking link, if you have one. |

Then **redeploy** — Netlify only picks up new environment variables on a fresh
build.

Also publish `firestore.rules` in the Firebase console — the `chats` collection
needs its rules before transcripts can be saved.

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

## Where the conversations go

Every chat is saved to the Firestore `chats` collection — one document per
conversation, holding the whole back-and-forth:

```
chats/{id} = {
  name, email, page, source,
  messages: [{ role, content, at }],
  messageCount, unread, startedAt, lastMessageAt
}
```

They appear in **Admin → Inbox**, in the same list as affiliate applications,
tagged `Chat` and filterable. Opening one shows the full transcript laid out as
it happened, with **Copy transcript** for pasting into an email or a CRM. The
search box looks inside conversations, not just names — you can find everyone
who asked about pricing.

Opening the transcript *is* the lead capture; there is no separate lead row, so
one person never appears twice.

**The notification.** The admin header shows a count on the chat icon, and a
banner across the top of every admin page names who is waiting — "Amara Obi and
2 others started chats with the assistant" — linking straight to the
conversation. A chat is unread until someone opens it.

Two counters also land in analytics: `chat_opened` and `chat_lead_captured`.

Without Firebase configured the chat still works; it simply is not saved, and
the Inbox shows sample conversations instead.

## Coming back to a conversation

A visitor's own copy of the conversation lives in `localStorage`, so closing the
tab, changing page or coming back tomorrow resumes exactly where they stopped —
they are not asked for their name again either. **New chat** in the panel header
starts a fresh transcript; the old one stays in the database, so nothing an
admin has already read disappears.

Reading a transcript is admin-only in the security rules, which is why the
visitor resumes from their own copy rather than re-reading the database.

## Links the assistant can give

It hands out links as markdown — `[the course page](/courses/linkedin-unlocked)`
— and `ChatText.jsx` renders them as pressable links: internal paths through the
router, external ones in a new tab.

Two rules keep this honest:

- It may only use destinations listed in `LINK_DIRECTORY` in
  `netlify/lib/knowledge.js`. An invented URL in a chat window looks exactly as
  authoritative as a real one. **Add new pages there when you add them.**
- Only `http`, `https` and site-relative paths are ever rendered as links. A
  model cannot be trusted never to produce a `javascript:` URL, and a chat
  bubble is not where you want to find out. Anything else stays as plain text.

### Registration links

Events register through the **Register** button, which opens the booking widget.
`registerUrl` falls back to `/community` as an internal placeholder for those
events — and passing that placeholder to the assistant made it tell people to
"register on the Community page", which was not true.

So the assistant is given a registration URL **only** when the event is set to
`registerMode: 'link'` *and* that link is a real off-site address. Otherwise it
is told to point at the Register button. If you add a genuine registration page
in Admin → Events, the assistant will start linking to it automatically.

### Booking a call

There is no Calendly link in the site. Set `CHAT_BOOKING_URL` in Netlify if you
get one and the assistant will share it; without it, it offers an email
follow-up instead of inventing a booking page.

## Limits

- `/api/chat` is public and unauthenticated. Per-request cost is capped (1,200
  characters in, 16 messages of history, 700 tokens out) but there is no
  per-visitor rate limit. If it is ever abused, the quickest fix is to remove
  `OPENROUTER_API_KEY` from Netlify, which disables the chat cleanly with a
  "not configured" message rather than an error.
- Answers are not streamed — the reply appears once it is complete. A typing
  indicator covers the wait, which is usually two to three seconds.
