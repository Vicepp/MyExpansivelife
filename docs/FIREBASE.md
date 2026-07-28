# Setting up Firebase

The site runs without a database — the blog falls back to sample posts and the
admin panel opens in preview mode. Follow this once and everything becomes real.

Budget about 15 minutes. No billing card is needed; the free Spark plan covers
far more traffic than a new blog will see.

---

## 1. Create the project

1. Go to <https://console.firebase.google.com> and click **Add project**.
2. Name it `my-expansive-life`.
3. Google Analytics is optional — you can skip it.

## 2. Register a web app

1. On the project overview, click the **web icon** (`</>`).
2. Nickname it `MXL Web`. **Do not** tick Firebase Hosting — the site deploys to
   Netlify/Vercel.
3. Firebase shows a `firebaseConfig` object. Keep that tab open for step 5.

## 3. Turn on Authentication

1. **Build → Authentication → Get started**.
2. Enable **Email/Password**. Leave the passwordless option off.
3. Open the **Users** tab → **Add user**, and create your admin account with a
   real email and a strong password. This is what you sign in with at
   `/admin/login`.

There is no public sign-up anywhere in the app — accounts only ever get created
here in the console. That is what keeps the panel private.

## 4. Create the database and storage

1. **Build → Firestore Database → Create database**.
   - Start in **production mode** (the rules in this repo replace the defaults).
   - Pick the region closest to your readers. **This cannot be changed later.**
2. **Build → Storage → Get started**, same region.

## 5. Fill in your credentials

Copy `.env.example` to `.env` in the project root and paste the values from the
`firebaseConfig` object in step 2:

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=AIza…
VITE_FIREBASE_AUTH_DOMAIN=my-expansive-life.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-expansive-life
VITE_FIREBASE_STORAGE_BUCKET=my-expansive-life.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abc123
```

Restart `npm run dev` afterwards — Vite only reads `.env` at startup.

> **These keys are meant to be public.** They ship in the browser bundle of every
> Firebase web app. Security comes from the rules in step 6, not from hiding
> them. `.env` is gitignored anyway, so add the same six variables to your host:
> Netlify → *Site settings → Environment variables*, or Vercel → *Settings →
> Environment variables*. **Redeploy after adding them** — env vars are baked in
> at build time.

## 6. Publish the security rules

This repo ships tested rules. Without them your database is either wide open or
locked shut.

**Firestore** — console → **Firestore Database → Rules**, paste the contents of
[`firestore.rules`](../firestore.rules), **Publish**.

**Storage** — console → **Storage → Rules**, paste
[`storage.rules`](../storage.rules), **Publish**.

What they enforce:

| Who | Can |
| --- | --- |
| Public | Read **published** posts. Bump view/like counters. Submit the affiliate form. |
| Public | **Cannot** read drafts, read the inbox, edit posts, or upload files. |
| Signed-in admin | Everything. |

Drafts genuinely are invisible to visitors — that is enforced by the database,
not by the UI hiding them.

## 7. Check it worked

1. `npm run dev`, go to <http://localhost:5173/admin/login>.
2. The amber "Firebase isn't connected" panel should be **gone**.
3. Sign in with the account from step 3.
4. **Settings** should show a green dot and your project ID.
5. Write a post, hit **Publish**, then open `/blogs` — it appears.

---

## Data model

Collections are created automatically on first write. Nothing to set up by hand.

### `posts`

| Field | Type | Notes |
| --- | --- | --- |
| `title` | string | |
| `slug` | string | URL segment, auto-generated from the title |
| `excerpt` | string | Falls back to the opening lines |
| `content` | string | HTML from the editor |
| `coverImage` | string | Storage URL or any external URL |
| `category` | string | |
| `tags` | array | |
| `status` | string | `draft` \| `scheduled` \| `published` |
| `author` | map | `{ name, uid }` |
| `views` / `likes` | number | Incremented atomically |
| `readMinutes` | number | Calculated on save |
| `createdAt` / `updatedAt` / `publishedAt` | timestamp | |

### `messages`

Affiliate form submissions: `name`, `email`, `phone`, `subject`, `body`,
`source`, `read`, `createdAt`.

---

## Recommended index

Firestore serves single-field queries automatically. The blog index filters by
`status` **and** orders by `createdAt`, which needs a composite index.

The first time that query runs, Firebase logs an error in the browser console
containing a **direct link** — click it and press **Create index**. Takes about a
minute. Or add it up front under **Firestore → Indexes → Composite**:

- Collection: `posts`
- Fields: `status` (Ascending), `createdAt` (Descending)
- Query scope: Collection

## Costs

The free tier gives you 50,000 document reads and 20,000 writes per day, plus
5 GB of storage. A blog serving a few thousand readers a month stays inside it
comfortably. Set a budget alert under **Usage and billing** if you want a
guardrail.

## Troubleshooting

**"Missing or insufficient permissions"** — the rules from step 6 were not
published, or you are signed out.

**"The query requires an index"** — click the link in the console error, as
above.

**Admin still shows preview mode after adding `.env`** — restart the dev server.
On a deployed site, confirm the variables are set on the host and redeploy.

**Images will not upload** — Storage was never enabled (step 4), or its rules
were not published.
