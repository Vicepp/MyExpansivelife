# My Expansive Life

Marketing site and blog CMS for My Expansive Life, built from the MXL Figma board.

**Stack:** React 19 + Vite 8, React Router 7, Tailwind CSS v4, Firebase (Auth,
Firestore, Storage), TipTap rich text editor.

## Running locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## Public pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/blogs` | Blog index |
| `/blogs/:slug` | Single article |
| `/courses/linkedin-unlocked` | LinkedIn Unlocked course |
| `/community` | The Circle community |
| `/affiliate` | Affiliate programme |

## Admin panel

The CMS lives under `/admin` and is **not linked from any public page**. Sign in
at `/admin/login` with a Firebase Auth account.

| Route | Page |
| --- | --- |
| `/admin` | Dashboard — stats, top articles, schedule |
| `/admin/posts` | All posts: search, filter, edit, delete |
| `/admin/posts/new` | Rich text editor |
| `/admin/posts/:id/edit` | Edit an existing post |
| `/admin/analytics` | Views, likes and engagement |
| `/admin/inbox` | Messages |
| `/admin/post-plan` | Editorial calendar |
| `/admin/earning` | Revenue |
| `/admin/settings` | Profile and site settings |

See [docs/FIREBASE.md](docs/FIREBASE.md) for database setup — it walks through
creating the project, enabling Auth and Firestore, and filling in `.env`.

Without Firebase configured the public site still runs: the blog falls back to
sample posts and the admin panel shows a setup notice instead of failing.

## Deploying

Deploys to Vercel as a Vite app. `vercel.json` carries the SPA rewrite so deep
routes resolve on refresh.

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |

Add the `VITE_FIREBASE_*` variables from `.env.example` to the Vercel project
settings before deploying.

## Assets

`Design PNG/` holds the raw Figma exports and is gitignored — it is source
material, not part of the build. Artwork actually used by the site lives in
`src/assets/design/` and `public/events/`.
