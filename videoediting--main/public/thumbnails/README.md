# Custom Timeline Thumbnails (`/public/thumbnails/`)

Optional folder for custom frame grabs (e.g. for Instagram Reels or upcoming edits where Instagram has no public profile API).

Example in `src/data.ts` (`SELECTED_WORK`):
```ts
{
  title: "Foodie Kashif — High-Retention Food Reel",
  category: "Short-form",
  url: "https://www.instagram.com/reel/YOUR_REEL_CODE/",
  thumbnailUrl: "/thumbnails/foodie-kashif-reel.jpg",
  aspect: "9:16",
  client: "Foodie Kashif",
  duration: "00:48",
}
```
YouTube links and YouTube `@channel` URLs automatically fetch their thumbnails from YouTube.
