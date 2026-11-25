# Pankajxvisuals — Freelance Video Editor Portfolio

Frontend-only portfolio website for **Pankaj Singh Adhikari (`@pankajxvisuals`)**, built with React, Vite, TypeScript, Tailwind CSS, GSAP (ScrollTrigger), and Lenis smooth scrolling.

## Run Locally

```bash
npm install
npm run dev
```

## Build for Vercel

```bash
npm run build
```

Deploy the `dist/` folder directly to Vercel (no backend or environment variables required).

---

## Quick Customization Guide

### 1. Activate the Contact Form (Web3Forms)
1. Visit [https://web3forms.com](https://web3forms.com).
2. Enter **`pankajadhikari820@gmail.com`** and click **Create your Access Key**.
3. Open the email from Web3Forms and copy the access key.
4. Open `src/data.ts` and paste your key into line 12:
   ```ts
   export const WEB3FORMS_ACCESS_KEY = "YOUR_ACTUAL_KEY_HERE";
   ```
Until a key is pasted, the form gracefully prompts visitors to send their prefilled details directly to your WhatsApp instead.

### 2. Update Selected Work Videos
Open `src/data.ts` and edit the `SELECTED_WORK` array:
- Paste any **YouTube video or Shorts URL** (`youtube.com/watch?v=...`, `youtu.be/...`, `youtube.com/shorts/...`) to embed it inside the cinema modal player.
- Paste a **Google Drive, Instagram, or channel link** to open it in a new tab.
- Leave `url: ""` to show the **Coming soon** card state.
- Set `aspect` to `"16:9"` or `"9:16"`.

### 3. Add Your Portrait Photo
1. Place your photo inside the `public/` folder (for example, `public/pankaj.jpg`).
2. In `src/data.ts`, confirm `ABOUT.photoUrl` matches the filename (`"/pankaj.jpg"`).

### 4. Add Real Client Testimonials
Open `src/data.ts` and add items to the `TESTIMONIALS` array (`name`, `handle`, `text`, and optional `screenshot` image path in `public/`). The Testimonials section is hidden automatically while `TESTIMONIALS` is empty and appears as soon as you add an entry.

### 5. Edit Contact Info, Stats, Clients & Services
All editable text, links, client rosters, stats, services, and process steps live in **`src/data.ts`**.

### 6. Change Theme Colors & Fonts
Open **`src/index.css`** and edit the CSS custom properties in `@theme` and `:root` (`--bg-primary`, `--accent-start`, `--accent-end`, `--font-display`, `--font-sans`).
