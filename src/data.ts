/* ============================================================================
   PANKAJXVISUALS — CENTRAL EDITABLE DATA FILE
   Update your Web3Forms key, contact links, photo, videos, clients,
   services, process steps, and testimonials right here.
   ============================================================================ */

/**
 * 1. WEB3FORMS CONTACT FORM ACCESS KEY
 * Get your free key at https://web3forms.com using pankajadhikari820@gmail.com
 * and paste it below between the quotes.
 */
export const WEB3FORMS_ACCESS_KEY = "PASTE_YOUR_KEY_HERE";

export const SITE_INFO = {
  name: "Pankaj Singh Adhikari",
  brand: "Pankajxvisuals",
  brandLogo: "PANKAJ X VISUALS",
  handle: "@pankajxvisuals",
  role: "Freelance Video Editor",
  location: "Haldwani, Uttarakhand, India",
  shortLocation: "Haldwani, Uttarakhand",
  availability: "Working remotely with clients worldwide",
  tagline: "I make videos people finish.",
  heroSubtitle:
    "Freelance video editor crafting retention-first YouTube videos, reels, brand ads, and podcasts for creators and brands across India and abroad.",
  copyrightYear: 2026,
} as const;

export const CONTACT = {
  whatsappNumber: "919568598832",
  phoneDisplay: "+91 95685 98832",
  whatsappUrl: "https://wa.me/919568598832",
  callUrl: "tel:+919568598832",
  email: "pankajadhikari820@gmail.com",
  emailUrl: "mailto:pankajadhikari820@gmail.com",
  instagramUrl: "https://www.instagram.com/pankajxvisuals",
  instagramHandle: "@pankajxvisuals",
  projectTypes: [
    "Long-form YouTube Video",
    "Reels & Shorts Package",
    "Brand Ad / Promo",
    "Podcast / Interview Edit",
    "Social Media Handling",
    "Monthly Retainer / Other",
  ],
} as const;

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  detail: string;
}

export const STATS: StatItem[] = [
  {
    value: 80,
    suffix: "+",
    label: "Clients",
    detail: "Creators, brands & agencies",
  },
  {
    value: 10,
    suffix: "+",
    label: "International Clients",
    detail: "Remote collaborations abroad",
  },
  {
    value: 3,
    suffix: "+",
    label: "Years Experience",
    detail: "Long-form & short-form cuts",
  },
  {
    value: 1,
    suffix: "M+",
    label: "Follower Creators",
    detail: "Edited for major & rising voices",
  },
];

/**
 * 2. OWNER PHOTO & ABOUT BIO
 * Drop your portrait image into the /public folder (e.g. /public/pankaj.jpg)
 * and set photoUrl to "/pankaj.jpg". While no image is placed there yet,
 * a clean cinematic film-frame placeholder renders automatically.
 */
export const ABOUT = {
  photoUrl: "/pankaj.jpg",
  photoAlt: "Pankaj Singh Adhikari — Freelance Video Editor based in Haldwani, Uttarakhand",
  headline: "Built for watch time, cut with taste.",
  bio: "I'm Pankaj Singh Adhikari — a Haldwani-based freelance video editor with 3+ years of experience crafting long-form and short-form videos for creators, agencies, and brands across India and abroad. From 1M+ follower YouTube channels to growing businesses, I focus on sharp pacing, clean audio, and storytelling that keeps viewers watching until the final frame.",
  highlights: [
    { label: "Base", value: "Haldwani, Uttarakhand (Remote Worldwide)" },
    { label: "Formats", value: "YouTube, Vlogs, Reels, Shorts, Podcasts & Ads" },
    { label: "Suite", value: "Adobe Premiere Pro & CapCut" },
  ],
} as const;

/**
 * 3. SELECTED WORK — VIDEO PORTFOLIO ARRAY
 * Update every video right here!
 * - title: Project display title
 * - category: "Long-form" | "Short-form" | "Ad"
 * - url: Paste a YouTube link (embeds inside the modal player),
 *        a Google Drive / Instagram link (opens in a new tab),
 *        or leave "" to show the "Coming soon" state.
 * - aspect: "16:9" (landscape) or "9:16" (vertical reel/short)
 * - client / duration / palette: Optional visual metadata for the film card
 */
export type VideoCategory = "Long-form" | "Short-form" | "Ad";
export type VideoAspect = "16:9" | "9:16";

export interface VideoWorkItem {
  title: string;
  category: VideoCategory;
  url: string;
  aspect: VideoAspect;
  client?: string;
  duration?: string;
  palette?: "amber" | "crimson" | "copper" | "gold" | "ember" | "ochre";
}

export const SELECTED_WORK: VideoWorkItem[] = [
  {
    title: "The Daniele Family — YouTube Story Cut",
    category: "Long-form",
    url: "https://youtube.com/@thedanielefamily",
    aspect: "16:9",
    client: "The Daniele Family",
    duration: "14:20",
    palette: "amber",
  },
  {
    title: "Foodie Kashif — High-Retention Food Reel",
    category: "Short-form",
    url: "https://www.instagram.com/foodiekashif",
    aspect: "9:16",
    client: "Foodie Kashif",
    duration: "00:48",
    palette: "ember",
  },
  {
    title: "PlanMyFamTrip — Travel Documentary Episode",
    category: "Long-form",
    url: "https://youtube.com/@PlanMyFamTrip",
    aspect: "16:9",
    client: "PlanMyFamTrip",
    duration: "18:05",
    palette: "copper",
  },
  {
    title: "Looks Salon Rudrapur — Commercial Promo",
    category: "Ad",
    url: "https://www.instagram.com/lookssalonrudrapur",
    aspect: "9:16",
    client: "Looks Salon Rudrapur",
    duration: "00:32",
    palette: "gold",
  },
  {
    title: "Founder Podcast — Multi-Cam Episode Cut",
    category: "Long-form",
    url: "",
    aspect: "16:9",
    client: "Upcoming Release",
    duration: "32:10",
    palette: "crimson",
  },
  {
    title: "Little Lambs Clothing — Brand Launch Reel",
    category: "Ad",
    url: "",
    aspect: "9:16",
    client: "Little Lambs Clothing",
    duration: "00:38",
    palette: "ochre",
  },
];

/**
 * 4. CLIENTS & COLLABORATIONS
 * All real client links grouped into 4 categories.
 */
export interface ClientLink {
  label: string;
  url: string;
  platform: "instagram" | "youtube";
}

export interface ClientItem {
  name: string;
  initials: string;
  handle: string;
  links: ClientLink[];
}

export interface ClientGroup {
  id: string;
  title: string;
  subtitle: string;
  clients: ClientItem[];
}

export const CLIENT_GROUPS: ClientGroup[] = [
  {
    id: "international",
    title: "International Clients",
    subtitle: "Remote collaborations with creators and brands outside India",
    clients: [
      {
        name: "ISW TV",
        initials: "IT",
        handle: "@isw_tv",
        links: [
          {
            label: "Visit page",
            url: "https://www.instagram.com/isw_tv",
            platform: "instagram",
          },
        ],
      },
      {
        name: "Sunnah Treks",
        initials: "ST",
        handle: "@sunnah_treks",
        links: [
          {
            label: "Visit page",
            url: "https://www.instagram.com/sunnah_treks",
            platform: "instagram",
          },
        ],
      },
      {
        name: "Bynarjis",
        initials: "BN",
        handle: "@bynarjis",
        links: [
          {
            label: "Visit page",
            url: "https://www.instagram.com/bynarjis",
            platform: "instagram",
          },
        ],
      },
      {
        name: "The Daniele Family",
        initials: "DF",
        handle: "@thedanielefamily",
        links: [
          {
            label: "Instagram",
            url: "https://www.instagram.com/thedanielefamily",
            platform: "instagram",
          },
          {
            label: "YouTube",
            url: "https://youtube.com/@thedanielefamily",
            platform: "youtube",
          },
        ],
      },
    ],
  },
  {
    id: "india",
    title: "Top Clients in India",
    subtitle: "Creators, music artists, hospitality, and retail brands across India",
    clients: [
      {
        name: "Foodie Kashif",
        initials: "FK",
        handle: "@foodiekashif",
        links: [
          {
            label: "Visit page",
            url: "https://www.instagram.com/foodiekashif",
            platform: "instagram",
          },
        ],
      },
      {
        name: "Aadi Panwar",
        initials: "AP",
        handle: "@iamaadipanwar",
        links: [
          {
            label: "Visit page",
            url: "https://www.instagram.com/iamaadipanwar",
            platform: "instagram",
          },
        ],
      },
      {
        name: "Eddixo Music",
        initials: "EM",
        handle: "@eddixomusic",
        links: [
          {
            label: "Visit page",
            url: "https://www.instagram.com/eddixomusic",
            platform: "instagram",
          },
        ],
      },
      {
        name: "Looks Salon Rudrapur",
        initials: "LS",
        handle: "@lookssalonrudrapur",
        links: [
          {
            label: "Visit page",
            url: "https://www.instagram.com/lookssalonrudrapur",
            platform: "instagram",
          },
        ],
      },
      {
        name: "Little Lambs Clothing",
        initials: "LL",
        handle: "@littlelambs.clothing",
        links: [
          {
            label: "Visit page",
            url: "https://www.instagram.com/littlelambs.clothing",
            platform: "instagram",
          },
        ],
      },
      {
        name: "PlanMyFamTrip",
        initials: "PF",
        handle: "@planmyfamtrip",
        links: [
          {
            label: "Instagram",
            url: "https://www.instagram.com/planmyfamtrip",
            platform: "instagram",
          },
          {
            label: "YouTube",
            url: "https://youtube.com/@PlanMyFamTrip",
            platform: "youtube",
          },
        ],
      },
    ],
  },
  {
    id: "agencies",
    title: "Agencies I Work With",
    subtitle: "Reliable post-production partner for content & marketing teams",
    clients: [
      {
        name: "VK Editorial",
        initials: "VK",
        handle: "@vk.editorial_",
        links: [
          {
            label: "Visit page",
            url: "https://www.instagram.com/vk.editorial_",
            platform: "instagram",
          },
        ],
      },
      {
        name: "Social Ease",
        initials: "SE",
        handle: "@social.ease.official",
        links: [
          {
            label: "Visit page",
            url: "https://www.instagram.com/social.ease.official",
            platform: "instagram",
          },
        ],
      },
      {
        name: "Content Buzz",
        initials: "CB",
        handle: "@contentbuzzzz",
        links: [
          {
            label: "Visit page",
            url: "https://www.instagram.com/contentbuzzzz",
            platform: "instagram",
          },
        ],
      },
    ],
  },
  {
    id: "university",
    title: "University Clubs",
    subtitle: "Social Media Handler — content editing, direction & page growth",
    clients: [
      {
        name: "Tech Geeks GEHU",
        initials: "TG",
        handle: "@techgeeksgehu",
        links: [
          {
            label: "Visit page",
            url: "https://www.instagram.com/techgeeksgehu",
            platform: "instagram",
          },
        ],
      },
      {
        name: "Pratyay GEHU",
        initials: "PG",
        handle: "@pratyay_gehu",
        links: [
          {
            label: "Visit page",
            url: "https://www.instagram.com/pratyay_gehu",
            platform: "instagram",
          },
        ],
      },
    ],
  },
];

export const MARQUEE_CLIENTS: string[] = CLIENT_GROUPS.flatMap((group) =>
  group.clients.map((client) => client.name)
);

/**
 * 5. SERVICES & EDITING TOOLS
 */
export interface ServiceItem {
  number: string;
  title: string;
  description: string;
  deliverables: string;
}

export const SERVICES: ServiceItem[] = [
  {
    number: "01",
    title: "Long-form Videos",
    description:
      "YouTube videos, travel vlogs, and storytelling episodes structured with crisp pacing, clean sound design, and natural retention hooks from intro to outro.",
    deliverables: "YouTube · Vlogs · Documentary Cuts",
  },
  {
    number: "02",
    title: "Reels & Shorts",
    description:
      "Scroll-stopping vertical edits built for Instagram Reels, YouTube Shorts, and TikTok — tight cuts, punchy captions, and rhythmic timing that holds attention.",
    deliverables: "9:16 Vertical · Captions · Sound Sync",
  },
  {
    number: "03",
    title: "Brand Ads & Promos",
    description:
      "Clean, conversion-focused commercial edits for salons, clothing labels, travel brands, and local or international businesses looking to stand out.",
    deliverables: "Product Promos · Launch Cuts · Paid Social",
  },
  {
    number: "04",
    title: "Podcasts & Interviews",
    description:
      "Multi-camera switching, dialogue cleanup, noise reduction, and repurposing full episodes into shareable vertical highlight clips.",
    deliverables: "Full Episodes · Multi-Cam · Clip Packs",
  },
  {
    number: "05",
    title: "Social Media Handling",
    description:
      "End-to-end visual content consistency, reel scheduling, and page curation so creators, brands, and clubs stay active and sharp every week.",
    deliverables: "Content Cadence · Page Curation · Growth",
  },
];

export const TOOLS = [
  {
    name: "Adobe Premiere Pro",
    shortCode: "Pr",
    role: "Primary timeline, color & audio suite",
  },
  {
    name: "CapCut",
    shortCode: "CC",
    role: "Fast-turnaround vertical reels & captions",
  },
] as const;

/**
 * 6. WORKFLOW PROCESS (4 STEPS)
 */
export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  timecode: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "Share your footage",
    description:
      "Send your raw clips via Google Drive, Frame.io, or WeTransfer along with your references, vibe, and target platform.",
    timecode: "00:01:00:00",
  },
  {
    step: "02",
    title: "Rough cut",
    description:
      "I assemble the narrative spine — trimming dead air, locking in the hook, setting the music rhythm, and shaping the story arc.",
    timecode: "00:02:12:08",
  },
  {
    step: "03",
    title: "Revisions",
    description:
      "You review the cut and drop timestamped notes. I refine pacing, captions, color balance, and audio until every second lands.",
    timecode: "00:03:18:16",
  },
  {
    step: "04",
    title: "Final delivery",
    description:
      "Exported in crisp platform-ready specs (4K / 1080p, 16:9 or 9:16) and delivered on schedule — ready to upload.",
    timecode: "00:04:24:00",
  },
];

/**
 * 7. TESTIMONIALS (HIDDEN AUTOMATICALLY WHILE EMPTY)
 * Add real client reviews below whenever you are ready.
 * Example entry:
 * {
 *   name: "Client Name",
 *   handle: "@clienthandle",
 *   text: "Pankaj doubled our average view duration on YouTube within three uploads.",
 *   screenshot: "/testimonials/review-1.png" // optional image in /public
 * }
 */
export interface TestimonialItem {
  name: string;
  handle: string;
  text: string;
  screenshot?: string;
}

export const TESTIMONIALS: TestimonialItem[] = [];
