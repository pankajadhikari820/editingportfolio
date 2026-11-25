# Client Logos Folder (`/public/logos/`)

Drop square PNG, WebP, or SVG logos for Instagram-only or non-YouTube clients here.
YouTube clients automatically fetch their channel avatar via `/api/creator`.

Example in `src/data.ts`:
```ts
{
  name: "Foodie Kashif",
  initials: "FK",
  handle: "@foodiekashif",
  logoUrl: "/logos/foodie-kashif.webp",
  links: [{ label: "Visit page", url: "https://www.instagram.com/foodiekashif", platform: "instagram" }],
}
```
If `logoUrl` is omitted or missing, the site automatically shows the client's initials inside a styled circular film-frame ring.
