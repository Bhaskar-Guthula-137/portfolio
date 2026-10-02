import { infoData } from "./info"

// Site-level settings. Personal details (name, role, links, …) live in info.ts.
export const siteConfig = {
  positioning:
    "Building modern web products, cloud-native systems, real-time applications, and AI-powered experiences.",
  supporting: `${infoData.role} building web products, real-time systems, cloud infrastructure, and AI-powered experiences.`,
  areas: ["Frontend", "Backend", "Cloud", "AI", "Real-Time Systems"],
  hero: {
    statement: "I build modern web products, AI experiences, and scalable systems.",
  },

  /**
   * Photo for the About card. Put the image in /public (e.g. /public/about.jpg)
   * and set `src: "/about.jpg"`. While `src` is null the card shows a labelled
   * placeholder.
   */
  aboutPhoto: {
    src: null as string | null,
    alt: infoData.name,
  },

  /** Where you take work from, shown on the About card. */
  workRegion: "International",

  /** Freelance availability. Set `open: false` to hide the status and CTA emphasis. */
  availability: {
    open: true,
    label: "Available for work",
  },

  /** A small, recurring personal-brand phrase — used sparingly. */
  brandPhrase: "Building · Writing · Sharing",

  // Canonical origin used for canonical URLs and Open Graph tags.
  url: "https://bhaskarguthula.dev",

  seo: {
    title: `${infoData.name} — ${infoData.role} | React, Python, AI & Cloud`,
    description: `${infoData.name} is a ${infoData.role} building modern web applications, real-time systems, cloud-native infrastructure, and AI-powered products.`,
  },
} as const

// `side` places each link either side of the centred name in the navbar.
export const navLinks = [
  { id: "experience", label: "Work", href: "/#experience", side: "left" },
  { id: "about", label: "About", href: "/#about", side: "left" },
  { id: "projects", label: "Projects", href: "/#projects", side: "left" },
  { id: "blogs", label: "Blogs", href: "/#blogs", side: "right" },
  { id: "contact", label: "Contact", href: "/#contact", side: "right" },
] as const
