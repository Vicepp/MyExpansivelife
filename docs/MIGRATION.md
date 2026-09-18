# Migrating to the mxl-website Firebase project

Moving from `myexpansivelife-a8bec` to `mxl-website`, carrying every collection
across: posts, events, settings, inbox messages, chat transcripts and analytics.

Document IDs are preserved, so article slugs, event registration links and chat
threads keep working.

## Before anything else

The target project is empty in the strongest sense — **Cloud Firestore has
never been enabled on it**. Until that changes, nothing can read or write there,
including the migration script.

These four steps need the Firebase Console and cannot be done from the command
line without an authenticated CLI:

1. **Create the Firestore database.**
   [console.firebase.google.com](https://console.firebase.google.com) →
   `mxl-website` → Build → Firestore Database → Create database.
   Pick the same region as the old project to keep latency the same.
   Start in **production mode** — the real rules go on in step 3.

2. **Enable Email/Password authentication.**
   Build → Authentication → Get started → Sign-in method → Email/Password →
   Enable.

3. **Publish the security rules.** Copy [`firestore.rules`](../firestore.rules)
   into Firestore → Rules and publish. Do the same with
   [`storage.rules`](../storage.rules) under Storage → Rules.

   With the CLI instead, from the project root:
   ```bash
   npx firebase-tools login
   npx firebase-tools deploy --only firestore:rules,storage --project mxl-website
   ```

4. **Recreate the admin accounts.** Authentication → Users → Add user, for each
   address in `VITE_ADMIN_EMAILS`. The account you plan to migrate with must
   exist in **both** projects with the **same password**, because the script
   signs in to each one in turn.

## Then run the migration

Put the admin password in `.env.local` (gitignored, never committed):

```
SEED_EMAIL=info@phcinvest.com
SEED_PASSWORD=your-password
```

Dry run first — reads everything, writes a backup, touches nothing:

```bash
node scripts/migrate-firebase.mjs --dry-run
```

Check the counts look right, then run it for real:

```bash
node scripts/migrate-firebase.mjs
```

Every document read is written to `backup/` before a single write happens.
Re-running skips documents that already exist, so it is safe to repeat; add
`--force` to overwrite.

## Point the site at the new project

1. Replace the `VITE_FIREBASE_*` values in `.env` with the
   `MIGRATE_TO_FIREBASE_*` ones, and delete the migration block.
2. **Update the same variables in Netlify** — Site configuration → Environment
   variables. The deployed site reads them from there, not from `.env`. Missing
   this means the local site moves and the live one does not.
3. Redeploy.

## Verify

```bash
node scripts/check-posts.mjs     # the twelve drafts still validate
npm run build                    # sitemap should report the live article count
```

Then load the site and confirm: the blog index lists posts, an article page
opens, the events bar shows the four events, and `/admin` accepts a login.

## Publish the twelve articles

Once the new project is live and verified:

```bash
node scripts/seed-posts.mjs --dry-run
node scripts/seed-posts.mjs
npm run build                    # refresh the sitemap with the new URLs
```

Then remove `VITE_PREVIEW_POSTS` from `.env.local` — the drafts are real posts
at that point and the preview ribbon is no longer telling the truth.

## Afterwards

- Keep the old project until the new one has run for a week. It is the only
  rollback.
- Update `SITE_URL` in [`src/lib/links.js`](../src/lib/links.js) if the domain
  changes with the move.
- Cloudinary is unaffected — image uploads do not touch Firebase.
