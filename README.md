# My Expansive Life

Marketing site and blog CMS for My Expansive Life, built from the MXL Figma board.

**Stack:** React 19 + Vite 8, React Router 7, Tailwind CSS v4, Firebase (Auth +
Firestore), Cloudinary (images), TipTap rich text editor.

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

### Services

| Service | Handles | Setup |
| --- | --- | --- |
| Firebase Auth | Admin sign-in (email/password, Google, Outlook) | [docs/FIREBASE.md](docs/FIREBASE.md) |
| Firebase Firestore | Posts, views, likes, inbox messages | [docs/FIREBASE.md](docs/FIREBASE.md) |
| Cloudinary | Article and cover images | [docs/CLOUDINARY.md](docs/CLOUDINARY.md) |

Both have free tiers that comfortably cover a new blog, and no card is needed
for either.

Set `VITE_ADMIN_EMAILS` to a comma-separated allowlist — without it, anyone who
finds `/admin/login` can create an account.

Neither service is required to run the project: the blog falls back to sample
posts and the admin panel opens in preview mode instead of failing.

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
