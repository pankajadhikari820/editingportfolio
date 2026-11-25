/* ============================================================================
   PANKAJXVISUALS — CENTRAL EDITABLE DATA FILE
   Update your Web3Forms key, contact links, photo, uploaded videos, YouTube
   creators, logos, before/after breakdowns, and testimonials right here.
   ============================================================================ */

/**
 * 1. WEB3FORMS CONTACT FORM ACCESS KEY
 * Get your free key at https://web3forms.com using pankajadhikari820@gmail.com
 * and paste it below between the quotes.
 */
export const WEB3FORMS_ACCESS_KEY: string = "89ea194a-54f6-4384-a4f0-768472586c5e";

export const SITE_INFO = {
  name: "Pankaj Singh Adhikari",
  brand: "Pankajxvisuals",
  brandLogo: "PANKAJ X VISUALS",
  handle: "@pankajxvisuals",
  role: "Freelance Video Editor",
  location: "Haldwani, Uttarakhand, India",
  shortLocation: "Haldwani, Uttarakhand",
  availability: "Available for freelance & retainer projects worldwide",
  tagline: "I make videos people finish.",
  heroSubtitle:
    "Freelance video editor crafting retention-first YouTube videos, reels, brand ads, and podcasts for creators and brands across India and abroad.",
  siteUrl: "https://pankajxvisuals.vercel.app",
  copyrightYear: 2026,
} as const;

/**
 * HERO SHOWREEL SLOT
 * Uses your uploaded 16:9 showcase cut by default, or paste a YouTube URL in `url`.
 */
export const HERO_SHOWREEL = {
  title: "Pankajxvisuals — Featured Showcase Cut",
  url: "",
  localVideoUrl: "/videos/01-afterparty-cinema.mp4",
  posterUrl: "/videos/posters/01-afterparty-cinema.jpg",
  duration: "00:26",
  aspect: "16:9" as const,
  specs: "4K MASTER · PREMIERE PRO · AFTER EFFECTS",
};

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
    "Brand Ad / Commercial Promo",
    "After Effects Motion Graphics",
    "Podcast / Interview Edit",
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
 * Drop your portrait image into /public/pankaj.jpg.
 * While no photo is placed there (or if it fails to load), a clean
 * cinematic film-frame darkroom fallback renders automatically.
 */
export const ABOUT = {
  photoUrl: "/pankaj.jpg",
  photoAlt: "Pankaj Singh Adhikari — Freelance Video Editor based in Haldwani, Uttarakhand",
  headline: "Built for watch time, cut with taste.",
  bio: "I'm Pankaj Singh Adhikari — a Haldwani-based freelance video editor with 3+ years of experience crafting long-form and short-form videos for creators, agencies, and brands across India and abroad. From 1M+ follower YouTube channels to growing businesses, I focus on sharp pacing, clean audio, After Effects motion polish, and storytelling that keeps viewers watching until the final frame.",
  highlights: [
    { label: "Base", value: "Haldwani, Uttarakhand (Remote Worldwide)" },
    { label: "Formats", value: "YouTube, Vlogs, Reels, Shorts, Podcasts & Ads" },
    { label: "Suite", value: "Premiere Pro, After Effects & CapCut" },
  ],
} as const;

/**
 * 3. SELECTED WORK — UPLOADED PORTFOLIO VIDEOS
 * Powered by your local /public/videos/*.mp4 cuts (and also supports YouTube/Instagram links).
 */
export type VideoCategory =
  | "YouTube & Long-form"
  | "Brand & Ads"
  | "Reels & Shorts"
  | "Travel & Events"
  | "Podcast & Talking";

export type VideoAspect = "16:9" | "9:16";

export interface VideoWorkItem {
  id: string;
  title: string;
  category: VideoCategory;
  url: string;
  videoUrl?: string;
  posterUrl?: string;
  aspect: VideoAspect;
  client?: string;
  duration?: string;
  tags?: string[];
  featured?: boolean;
}

export const SELECTED_WORK: VideoWorkItem[] = [
  {
    id: "daniele-family-tent",
    title: "24 Hours in a Tent with My Kids… We Didn’t Last 💀",
    category: "YouTube & Long-form",
    url: "https://youtu.be/27PYRRVYJkM",
    posterUrl: "https://i.ytimg.com/vi/27PYRRVYJkM/maxresdefault.jpg",
    aspect: "16:9",
    client: "The Daniele Family",
    duration: "YouTube",
    tags: ["Long-form Story", "Retention Pacing", "Sound Mix"],
    featured: true,
  },
  {
    id: "planmyfamtrip-dubai-yacht",
    title: "Dubai Private Yacht Tour — Is It Worth ₹₹₹? | Travel Vlog",
    category: "YouTube & Long-form",
    url: "https://youtu.be/m6fPp3fhHMo",
    posterUrl: "https://i.ytimg.com/vi/m6fPp3fhHMo/maxresdefault.jpg",
    aspect: "16:9",
    client: "PlanMyFamTrip",
    duration: "YouTube",
    tags: ["Travel Vlog", "B-Roll Polish", "Color Grade"],
    featured: true,
  },
  {
    id: "afterparty-cinema",
    title: "Afterhours Celebration — Widescreen Highlight",
    category: "Travel & Events",
    url: "",
    videoUrl: "/videos/01-afterparty-cinema.mp4",
    posterUrl: "/videos/posters/01-afterparty-cinema.jpg",
    aspect: "16:9",
    client: "Private Event Film",
    duration: "00:26",
    tags: ["16:9 Cinema", "Speed Ramps", "Mood Grade"],
    featured: true,
  },
  {
    id: "sunnah-treks-kilimanjaro",
    title: "Sunnah Treks — Mount Kilimanjaro Summit",
    category: "Travel & Events",
    url: "https://www.instagram.com/sunnah_treks",
    videoUrl: "/videos/02-sunnah-treks-kilimanjaro.mp4",
    posterUrl: "/videos/posters/02-sunnah-treks-kilimanjaro.jpg",
    aspect: "9:16",
    client: "Sunnah Treks",
    duration: "00:46",
    tags: ["Expedition Reel", "Sound Design", "Captions"],
    featured: true,
  },
  {
    id: "kaaj-jewellery-ad",
    title: "Kaaj Bridal Jewellery — Luxury Campaign",
    category: "Brand & Ads",
    url: "",
    videoUrl: "/videos/03-kaaj-jewellery-ad.mp4",
    posterUrl: "/videos/posters/03-kaaj-jewellery-ad.jpg",
    aspect: "9:16",
    client: "Kaaj Jewellery",
    duration: "00:26",
    tags: ["Luxury Ad", "Color Polish", "Rhythmic Cut"],
    featured: true,
  },
  {
    id: "foodie-kashif-mediterranean",
    title: "Foodie Kashif — Mediterranean Dining Reel",
    category: "Reels & Shorts",
    url: "https://www.instagram.com/foodiekashif",
    videoUrl: "/videos/04-foodie-kashif-mediterranean.mp4",
    posterUrl: "/videos/posters/04-foodie-kashif-mediterranean.jpg",
    aspect: "9:16",
    client: "Foodie Kashif",
    duration: "01:09",
    tags: ["Food Reel", "Retention Pacing", "SFX"],
  },
  {
    id: "luxury-resort-drone",
    title: "Luxury Resort Stay — Aerial Split-Screen Reel",
    category: "Travel & Events",
    url: "",
    videoUrl: "/videos/05-luxury-resort-drone.mp4",
    posterUrl: "/videos/posters/05-luxury-resort-drone.jpg",
    aspect: "9:16",
    client: "Hospitality Showcase",
    duration: "00:38",
    tags: ["Split Screen", "Drone Cut", "Captions"],
  },
  {
    id: "bikaner-pizza-commercial",
    title: "Bikaner Kitchen — Fast-Cut Pizza Promo",
    category: "Brand & Ads",
    url: "",
    videoUrl: "/videos/06-bikaner-pizza-commercial.mp4",
    posterUrl: "/videos/posters/06-bikaner-pizza-commercial.jpg",
    aspect: "9:16",
    client: "Bikaner Kitchen",
    duration: "00:22",
    tags: ["Food Promo", "Whip Cuts", "Beat Sync"],
  },
  {
    id: "ritik-megha-wedding",
    title: "Ritik & Megha — Beginning of Forever",
    category: "Travel & Events",
    url: "",
    videoUrl: "/videos/07-ritik-megha-wedding.mp4",
    posterUrl: "/videos/posters/07-ritik-megha-wedding.jpg",
    aspect: "9:16",
    client: "Wedding Film",
    duration: "01:11",
    tags: ["Wedding Teaser", "Warm Grade", "Story Arc"],
  },
  {
    id: "jai-maa-real-estate",
    title: "Jai Maa Associates — Construction Promo",
    category: "Brand & Ads",
    url: "",
    videoUrl: "/videos/08-jai-maa-real-estate.mp4",
    posterUrl: "/videos/posters/08-jai-maa-real-estate.jpg",
    aspect: "9:16",
    client: "Jai Maa Associates",
    duration: "00:31",
    tags: ["Real Estate", "Motion Text", "Local Brand"],
  },
  {
    id: "street-voxpop-captions",
    title: "Street Vox-Pop — High-Energy Social Edit",
    category: "Reels & Shorts",
    url: "",
    videoUrl: "/videos/09-street-voxpop-captions.mp4",
    posterUrl: "/videos/posters/09-street-voxpop-captions.jpg",
    aspect: "9:16",
    client: "Creator Reel",
    duration: "00:30",
    tags: ["Dynamic Captions", "Punch-Ins", "Audio Mix"],
  },
  {
    id: "podcast-highlight-cut",
    title: "Podcast Hook — Kinetic Caption Clip",
    category: "Podcast & Talking",
    url: "",
    videoUrl: "/videos/10-podcast-highlight-cut.mp4",
    posterUrl: "/videos/posters/10-podcast-highlight-cut.jpg",
    aspect: "9:16",
    client: "Podcast Highlight",
    duration: "00:23",
    tags: ["Talking Head", "After Effects Type", "Clean Audio"],
  },
  {
    id: "gehu-grafest-cultural",
    title: "GEHU Grafest — Cultural Stage Aftermovie",
    category: "Travel & Events",
    url: "https://www.instagram.com/pratyay_gehu",
    videoUrl: "/videos/11-gehu-grafest-cultural.mp4",
    posterUrl: "/videos/posters/11-gehu-grafest-cultural.jpg",
    aspect: "9:16",
    client: "Pratyay GEHU",
    duration: "00:32",
    tags: ["Campus Fest", "Energy Cut", "Sound Sync"],
  },
  {
    id: "tech-geeks-induction",
    title: "Tech Geeks GEHU — Induction 2025 Recap",
    category: "Reels & Shorts",
    url: "https://www.instagram.com/techgeeksgehu",
    videoUrl: "/videos/12-tech-geeks-induction.mp4",
    posterUrl: "/videos/posters/12-tech-geeks-induction.jpg",
    aspect: "9:16",
    client: "Tech Geeks GEHU",
    duration: "00:18",
    tags: ["Club Recap", "Event Reel", "Fast Pacing"],
  },
];

/**
 * 4. CLIENTS & COLLABORATIONS + AUTO YOUTUBE CREATOR SHOWCASE
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
  youtubeHandle?: string;
  youtubeChannelId?: string;
  logoUrl?: string;
  featuredVideoIds?: string[];
  spotlightRole?: string;
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
        name: "The Daniele Family",
        initials: "DF",
        handle: "@thedanielefamily",
        youtubeHandle: "@thedanielefamily",
        featuredVideoIds: ["27PYRRVYJkM"],
        spotlightRole: "International Family & Lifestyle YouTube Channel",
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
    ],
  },
  {
    id: "india",
    title: "Top Clients in India",
    subtitle: "Creators, music artists, hospitality, and retail brands across India",
    clients: [
      {
        name: "PlanMyFamTrip",
        initials: "PF",
        handle: "@planmyfamtrip",
        youtubeHandle: "@PlanMyFamTrip",
        featuredVideoIds: ["m6fPp3fhHMo"],
        spotlightRole: "Travel & Family Adventure Channel",
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

export const ALL_CLIENTS: ClientItem[] = CLIENT_GROUPS.flatMap((group) => group.clients);

export const FEATURED_YOUTUBE_CREATORS: ClientItem[] = ALL_CLIENTS.filter(
  (client) => Boolean(client.youtubeHandle || client.youtubeChannelId)
);

/**
 * 5. BEFORE / AFTER COMPARISON LAB (REAL VIDEOS + INTERACTIVE COLOR SLIDER)
 */
export interface BeforeAfterVideoItem {
  id: string;
  title: string;
  subtitle: string;
  videoUrl: string;
  posterUrl: string;
  duration: string;
  specs: string;
}

export const BEFORE_AFTER_VIDEOS: BeforeAfterVideoItem[] = [
  {
    id: "talking-head-breakdown",
    title: "Talking-Head Motion & Kinetic Type Breakdown",
    subtitle: "Raw static camera A-roll transformed with After Effects 3D text, motion blur & lighting depth.",
    videoUrl: "/videos/ba-01-talking-head-breakdown.mp4",
    posterUrl: "/videos/posters/ba-01-talking-head-breakdown.jpg",
    duration: "00:28",
    specs: "After Effects · 3D Typography · Optical Polish",
  },
  {
    id: "burger-farm-breakdown",
    title: "Burger Farm Commercial Timeline Breakdown",
    subtitle: "Side-by-side raw interior footage vs. graded commercial edit with layered multi-track timeline.",
    videoUrl: "/videos/ba-02-burger-farm-breakdown.mp4",
    posterUrl: "/videos/posters/ba-02-burger-farm-breakdown.jpg",
    duration: "00:28",
    specs: "Premiere Pro · Multi-Track Layering · Color Grade",
  },
];

export interface CompareItem {
  id: string;
  tabLabel: string;
  title: string;
  description: string;
  beforeLabel: string;
  afterLabel: string;
  beforeImage: string;
  afterImage: string;
  specs: string;
}

export const COMPARE_ITEMS: CompareItem[] = [
  {
    id: "color-grade",
    tabLabel: "Color Grading",
    title: "Flat Log → Cinema Grade",
    description:
      "Interactive before/after still comparison — drag the handle or use arrow keys to inspect log-to-LUT color grading.",
    beforeLabel: "RAW / LOG",
    afterLabel: "GRADED LUT",
    beforeImage: "/compare/raw-grade.jpg",
    afterImage: "/compare/final-grade.jpg",
    specs: "Lumetri · Halation · Skin Tone Isolation",
  },
  {
    id: "timeline-edit",
    tabLabel: "Timeline Architecture",
    title: "Raw A-Roll → Retention Cut",
    description:
      "How raw single-track clips become layered V1/V3/FX sequences with paced J-cuts and sound beds.",
    beforeLabel: "RAW FOOTAGE",
    afterLabel: "FINAL EDIT",
    beforeImage: "/compare/raw-cut.svg",
    afterImage: "/compare/final-cut.svg",
    specs: "J-Cuts · SFX Risers · Dynamic Captions",
  },
];

/**
 * 6. CASE STUDIES (PROBLEM → WHAT I DID → RESULT)
 */
export interface CaseStudyItem {
  id: string;
  client: string;
  format: string;
  isPlaceholderMetric: boolean;
  problem: string;
  action: string;
  result: string;
  deliverables: string[];
}

export const CASE_STUDIES: CaseStudyItem[] = [
  {
    id: "family-vlog-retention",
    client: "The Daniele Family",
    format: "Long-form YouTube Storytelling",
    isPlaceholderMetric: true,
    problem:
      "Multi-camera family footage had slow opening moments and long dead-air stretches that risked early viewer drop-off.",
    action:
      "Built a cold-open hook in the first 25 seconds, tightened conversational pacing with J/L cuts, and layered warm music swells.",
    result:
      "[Add verified retention % or view milestone from YouTube Studio here]",
    deliverables: ["16:9 Master Cut", "Audio Sweetening", "Color Match"],
  },
  {
    id: "food-reel-hook",
    client: "Foodie Kashif",
    format: "9:16 High-Retention Reel",
    isPlaceholderMetric: true,
    problem:
      "Food & street-review clips needed faster visual rhythm and readable on-screen hooks for muted mobile scrollers.",
    action:
      "Cut to beat transients every 1.5–2 seconds, synced crisp crunch/sizzle SFX, and styled punchy animated captions.",
    result:
      "[Add verified reel reach, saves, or completion rate here]",
    deliverables: ["9:16 Vertical Cut", "Beat-Synced SFX", "Styled Captions"],
  },
  {
    id: "travel-doc-arc",
    client: "Sunnah Treks",
    format: "Expedition Reel & Storytelling",
    isPlaceholderMetric: true,
    problem:
      "Summit trekking footage needed emotional pacing, brand integration, and crisp storytelling inside a sub-minute reel.",
    action:
      "Structured a climax-first summit reveal with clean motion titles, wind/dialogue cleanup, and atmospheric sound design.",
    result:
      "[Add verified campaign reach or engagement milestone here]",
    deliverables: ["9:16 Vertical Cut", "Motion Titles", "Sound Design"],
  },
];

/**
 * 7. SERVICES & EDITING TOOLS (Premiere Pro, After Effects & CapCut)
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
    title: "Motion Graphics & VFX",
    description:
      "Custom After Effects kinetic typography, 3D text tracking, sleek UI callouts, speed ramps, and visual polish that elevate creator retention.",
    deliverables: "After Effects · Kinetic Type · Visual Polish",
  },
  {
    number: "04",
    title: "Brand Ads & Promos",
    description:
      "Clean, conversion-focused commercial edits for jewellery labels, salons, restaurants, real estate, and travel brands.",
    deliverables: "Product Promos · Launch Cuts · Paid Social",
  },
  {
    number: "05",
    title: "Podcasts & Social Handling",
    description:
      "Multi-camera switching, dialogue cleanup, viral highlight clipping, and consistent weekly page curation for creators and clubs.",
    deliverables: "Multi-Cam · Clip Packs · Page Growth",
  },
];

export const TOOLS = [
  {
    name: "Adobe Premiere Pro",
    shortCode: "Pr",
    accent: "#9999FF",
    role: "Primary timeline, pacing, audio mix & color suite",
  },
  {
    name: "Adobe After Effects",
    shortCode: "Ae",
    accent: "#CF96FD",
    role: "Motion graphics, 3D kinetic typography & VFX compositing",
  },
  {
    name: "CapCut",
    shortCode: "CC",
    accent: "#00F5D4",
    role: "Fast-turnaround vertical reels & styled captions",
  },
] as const;

/**
 * 8. WORKFLOW PROCESS (4 STEPS — NLE TIMELINE)
 */
export interface ProcessStep {
  step: string;
  track: string;
  title: string;
  description: string;
  timecode: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    track: "INGEST · BIN",
    title: "Share your footage",
    description:
      "Send your raw clips via Google Drive, Frame.io, or WeTransfer along with your references, vibe, and target platform.",
    timecode: "00:01:00:00",
  },
  {
    step: "02",
    track: "V1 · A1 CUT",
    title: "Rough cut",
    description:
      "I assemble the narrative spine — trimming dead air, locking in the hook, setting the music rhythm, and shaping the story arc.",
    timecode: "00:02:12:08",
  },
  {
    step: "03",
    track: "AE · COLOR",
    title: "Motion & Revisions",
    description:
      "You review the cut and drop timestamped notes. I layer After Effects motion graphics, captions, color balance, and audio.",
    timecode: "00:03:18:16",
  },
  {
    step: "04",
    track: "MASTER OUT",
    title: "Final delivery",
    description:
      "Exported in crisp platform-ready specs (4K / 1080p, 16:9 or 9:16) and delivered on schedule — ready to upload.",
    timecode: "00:04:24:00",
  },
];

/**
 * 9. TESTIMONIALS (HIDDEN AUTOMATICALLY WHILE EMPTY)
 */
export interface TestimonialItem {
  name: string;
  handle: string;
  platform?: "whatsapp" | "instagram" | "youtube";
  text: string;
  screenshot?: string;
}

export const TESTIMONIALS: TestimonialItem[] = [];
