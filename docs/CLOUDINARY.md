# Image hosting with Cloudinary

Images are uploaded straight from the browser to Cloudinary. No server, no API
secret in the app, and the free tier is generous: **25 GB storage and 25 GB
delivery bandwidth per month**, which a blog will not come close to.

Cloudinary also does the optimisation for you — every image is delivered as
AVIF or WebP at an automatically chosen quality, typically 60–80% smaller than
the original file.

Takes about 5 minutes.

---

## 1. Create the account

1. Sign up at <https://cloudinary.com/users/register_free>. No card required.
2. On the dashboard, note your **Cloud name** (something like `dxy123abc`).
   It is *not* your email or username.

## 2. Create an unsigned upload preset

The browser cannot hold an API secret, so uploads use a preset instead.

1. **Settings** (gear icon) → **Upload** → scroll to **Upload presets**.
2. Click **Add upload preset**.
3. Set **Signing mode** to **Unsigned**. This is the setting that matters.
4. Name it `mxl_unsigned` (any name works — you paste it into `.env`).
5. Save.

## 3. Lock the preset down

An unsigned preset is public: the cloud name and preset name ship in the
JavaScript bundle, so in principle anyone could upload to it. That is normal for
browser uploads, but constrain it while you are in the preset settings:

| Setting | Value | Why |
| --- | --- | --- |
| **Folder** | `mxl/posts` | Keeps uploads together and easy to audit |
| **Allowed formats** | `jpg, png, webp, avif, gif` | Blocks non-image files |
| **Max file size** | `10000000` (10 MB) | Caps abuse |
| **Unique filename** | On | Stops overwrites |
| **Auto-moderation** | Optional | Flags explicit content |

The app enforces the same 10 MB limit and an image-only check before uploading,
but the preset is the boundary that actually counts — client-side checks can be
bypassed.

If the preset ever gets abused, delete it and create a new one. Only the two
`.env` values change.

## 4. Add your credentials

In `.env` (copy from `.env.example` if you have not already):

```env
VITE_CLOUDINARY_CLOUD_NAME=dxy123abc
VITE_CLOUDINARY_UPLOAD_PRESET=mxl_unsigned
VITE_CLOUDINARY_FOLDER=mxl/posts
```

Restart `npm run dev` — Vite reads `.env` only at startup.

For the live site, add the same variables to your host (Netlify → *Site
settings → Environment variables*) and **redeploy**. Vite bakes them in at build
time, so an existing deploy will not pick them up.

## 5. Check it works

1. Open `/admin/posts/new`.
2. Click the 🖼 button in the toolbar and pick an image.
3. The button shows a live percentage, then the image appears in the article.
4. In the Cloudinary console, **Media Library → mxl → posts** shows the file.

The cover image uploader in the right sidebar works the same way.

---

## How delivery is optimised

Uploaded URLs get `f_auto,q_auto` injected before delivery:

```
https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto/mxl/posts/photo.jpg
```

- `f_auto` — serves AVIF or WebP to browsers that support it, JPEG to those that do not
- `q_auto` — picks the lowest quality that still looks clean

`resized(url, width)` in `src/lib/cloudinary.js` adds `w_<width>,c_limit` for
thumbnails, so a card does not download a 4000px original.

## Relationship to Firebase

They do different jobs and both stay:

| | Handles |
| --- | --- |
| **Cloudinary** | Image files |
| **Firebase Firestore** | Post content, views, likes, messages |
| **Firebase Auth** | Admin sign-in |

`uploadImage()` in `src/lib/posts.js` prefers Cloudinary, falls back to Firebase
Storage if only that is configured, and otherwise explains what is missing. You
can therefore skip enabling Firebase Storage entirely — Firestore and Auth are
all that Firebase needs to provide.

## Troubleshooting

**"Upload failed (400)"** — the preset name is wrong, or it is still set to
Signed. Re-check step 2.

**"Upload failed (401)"** — the cloud name is wrong. It is on the dashboard, and
is not your login email.

**Button says no image host is configured** — the `.env` values are missing or
the dev server was not restarted.

**Works locally, fails on the live site** — the variables were not added to the
host, or the site was not redeployed after adding them.
