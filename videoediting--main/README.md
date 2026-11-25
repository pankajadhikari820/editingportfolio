# Pankajxvisuals — Freelance Video Editor Portfolio

Portfolio website for **Pankaj Singh Adhikari (`@pankajxvisuals`)**, a freelance video editor from Haldwani, Uttarakhand, India crafting retention-first YouTube videos, Instagram Reels, Shorts, brand ads, and podcasts.

Built with React 19, Vite, TypeScript (strict), Tailwind CSS v4, GSAP (ScrollTrigger), Lenis, Motion, and a serverless YouTube Data API v3 proxy (`/api/creator.ts`).

---

## 1. Local Development

```bash
npm install
npm run dev
```

Create a `.env.local` file in the project root (never commit it) if you want live YouTube channel previews locally:

```env
YOUTUBE_API_KEY="YOUR_YOUTUBE_DATA_API_V3_KEY"
```

Run checks anytime:

```bash
npm run lint     # Runs strict TypeScript (tsc --noEmit) + ESLint
npm run build    # Production build into dist/
```

---

## 2. How to Get a `YOUTUBE_API_KEY` (Free Quota)

The **Creator Spotlight** and automatic YouTube channel avatars run through `/api/creator.ts` (never in the browser) using only low-quota endpoints (`channels.list`, `playlistItems.list`, `videos.list` — **no `search.list`**), cached for 6 hours (`s-maxage=21600`).

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g. `pankajxvisuals-portfolio`).
3. Go to **APIs & Services → Library**, search for **YouTube Data API v3**, and click **Enable**.
4. Go to **APIs & Services → Credentials → Create Credentials → API key**.
5. Click **Edit API key** → under **API restrictions**, choose **Restrict key** and select **YouTube Data API v3**.
6. Copy the key and add it as `YOUTUBE_API_KEY` in Vercel environment variables (or `.env.local` locally).

> **Zero-breakage fallback:** If `YOUTUBE_API_KEY` is missing or quota runs out, the site automatically falls back to your manual logos, initials, and links in `src/data.ts`.

---

## 3. Environment Variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `YOUTUBE_API_KEY` | Server only (Vercel / `.env.local`) | Fetches YouTube channel avatars, subscriber counts & top videos |
| `VITE_PLAUSIBLE_DOMAIN` | Optional (client build) | Enables cookie-free Plausible analytics |
| `VITE_GA_ID` | Optional (client build) | Enables cookieless Google Analytics (`client_storage: none`) |

---

## 4. Easy Customization in `src/data.ts`

### Add a YouTube Creator in One Line
Inside `CLIENT_GROUPS` in `src/data.ts`, add `youtubeHandle` (or `youtubeChannelId`):

```ts
{
  name: "The Daniele Family",
  initials: "DF",
  handle: "@thedanielefamily",
  youtubeHandle: "@thedanielefamily", // <-- Auto-loads avatar, subscribers & top videos
  featuredVideoIds: ["VIDEO_ID_HERE"],  // <-- Optional: badges these videos as "Edited by Pankaj"
  links: [
    { label: "YouTube", url: "https://youtube.com/@thedanielefamily", platform: "youtube" },
  ],
}
```

### Add a Logo for an Instagram-Only Client
Instagram does not offer a public profile API. Drop a square image into `public/logos/` and point `logoUrl` to it:

```ts
{
  name: "Foodie Kashif",
  initials: "FK",
  handle: "@foodiekashif",
  logoUrl: "/logos/foodie-kashif.webp",
  links: [{ label: "Visit page", url: "https://www.instagram.com/foodiekashif", platform: "instagram" }],
}
```

### Replace Portrait, Before/After Stills & Showreel
- **Portrait**: Replace `public/pankaj.jpg` with your portrait photo (delete it to show the built-in darkroom frame fallback).
- **Portfolio Videos**: Uploaded cuts live in `public/videos/` with posters in `public/videos/posters/` and are configured in `SELECTED_WORK` and `BEFORE_AFTER_VIDEOS` inside `src/data.ts`.
- **Before / After Lab**: Uses real breakdown videos in `BEFORE_AFTER_VIDEOS` plus interactive still comparisons in `public/compare/` (`COMPARE_ITEMS` in `src/data.ts`).
- **Hero Showreel**: Uses `HERO_SHOWREEL.localVideoUrl` by default, or paste a YouTube showreel link into `HERO_SHOWREEL.url` in `src/data.ts`.
- **Editing Suite & Case Studies**: Update `TOOLS` (Premiere Pro, After Effects, CapCut) and `CASE_STUDIES` in `src/data.ts`.
- **Testimonials**: Add client quotes or WhatsApp/Instagram DM screenshots to `TESTIMONIALS` in `src/data.ts`.

### Activate the Contact Form (Web3Forms)
1. Get a free access key at [web3forms.com](https://web3forms.com) using `pankajadhikari820@gmail.com`.
2. Paste it into `WEB3FORMS_ACCESS_KEY` at the top of `src/data.ts`.

---

## 5. Deploy on Vercel (Recommended)

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Add `YOUTUBE_API_KEY` under **Project Settings → Environment Variables**.
4. Deploy — Vercel automatically builds Vite (`dist/`) and serves `/api/creator.ts` as a serverless function with CDN caching (`vercel.json`).
