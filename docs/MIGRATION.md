# Firebase project migration

The site moved from `myexpansivelife-a8bec` to `mxl-website` in September 2026.

This is the record of what happened and what was deliberately left behind. For
the tooling itself see [`scripts/migrate-firebase.mjs`](../scripts/migrate-firebase.mjs).

## Status

| | |
| --- | --- |
| New project | `mxl-website` |
| Firestore | created, real rules from `firestore.rules` deployed |
| Auth | Email/Password enabled; `info@` and `grace@phcinvest.com` can sign in |
| Content | 13 published posts, 4 events |
| Old project | still live, still serving the deployed site until Netlify is switched |

## What moved

**Posts.** The twelve seed articles were written straight into the new project
with `scripts/seed-posts.mjs --to-new`. The one pre-existing published post came
across with the migration.

**Events.** All four.

## What did not move, and why

Chat transcripts, inbox messages, analytics counters and any drafts stayed in
the old project.

Neither admin account could sign in to `myexpansivelife-a8bec` — its passwords
differ from both. Without a source login the migration falls back to what the
security rules expose publicly, which is published posts, events and settings.

This was judged acceptable: the old project was set up during development rather
than run as a production database, so what remains there is test data. If any of
it is ever wanted, reset a password in the old project's Authentication tab, set
it locally with `node scripts/set-password.mjs`, and re-run
`node scripts/migrate-firebase.mjs` — it skips documents that already exist.

## The bug this exposed

`getPostBySlug` queried on `slug` alone. The rules allow a read only when the
query itself proves every document it returns is published, and a slug filter
proves nothing about status — so Firestore rejected the whole query and every
article rendered as "not found".

It had always been wrong. The old project was running permissive test-mode
rules, so the query was never refused there. Publishing the real rules on the
new project surfaced it within minutes.

Worth remembering when adding any new query: **the rules constrain the shape of
the query, not just the result.** Filtering client-side after a
status-constrained read is the pattern this codebase uses, because the
alternative is composite indexes.

## Remaining step

The deployed site reads its Firebase config from **Netlify**, not from `.env`.
Until these are updated and the site redeployed, visitors are still on the old
database:

```
VITE_FIREBASE_API_KEY              AIzaSyCqNUvjn6tnGXkct6PqMkeOKWb7oOocwg0
VITE_FIREBASE_AUTH_DOMAIN          mxl-website.firebaseapp.com
VITE_FIREBASE_PROJECT_ID           mxl-website
VITE_FIREBASE_STORAGE_BUCKET       mxl-website.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID  1053266479094
VITE_FIREBASE_APP_ID               1:1053266479094:web:81d38dc0d6bfc5fd3ea9d7
VITE_MEASUREMENT_ID                G-Q6S9SDQE2P
```

Site configuration → Environment variables → redeploy.

`.env` locally already points at the new project. The old values are kept
alongside as `# OLD_VITE_FIREBASE_*`, so rolling back is uncommenting seven
lines.

## Afterwards

- Verify on the live site: an article page opens, the events bar shows four
  events, `/sitemap.xml` lists 18 URLs, `/admin` accepts a login.
- Keep the old project a few days as a rollback, then delete it. It holds a
  public API key and permissive rules, so it is not worth leaving around.
- Rotate any admin password that has been shared in plain text.
  `node scripts/set-password.mjs` takes it with hidden input and verifies it
  against both projects.
