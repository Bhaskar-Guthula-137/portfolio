// Everything personal lives here. Update the URLs before deploying — the
// placeholders below are not real profiles.
export const siteConfig = {
  name: "Bhaskar Guthula",
  firstName: "Bhaskar",
  lastName: "Guthula",
  title: "Software Engineer",
  positioning:
    "Building modern web products, cloud-native systems, real-time applications, and AI-powered experiences.",
  supporting:
    "Software Engineer building web products, real-time systems, cloud infrastructure, and AI-powered experiences.",
  location: { city: "Hyderabad", country: "India", timeZone: "Asia/Kolkata" },
  yearsExperience: "3.5+",
  areas: ["Frontend", "Backend", "Cloud", "AI", "Real-Time Systems"],
  hero: {
    statement: "I build modern web products, AI experiences, and scalable systems.",
  },

  /** Freelance availability. Set `open: false` to hide the status and CTA emphasis. */
  availability: {
    open: true,
    label: "Available for select projects",
  },

  /** A small, recurring personal-brand phrase — used sparingly. */
  brandPhrase: "Building · Writing · Sharing",

  // Canonical origin used for canonical URLs and Open Graph tags.
  url: "https://bhaskarguthula.dev",
  email: "hello@bhaskarguthula.dev",
  links: {
    github: "https://github.com/your-github",
    linkedin: "https://www.linkedin.com/in/your-linkedin",
    blog: "https://your-blog.dev",
  },

  seo: {
    title: "Bhaskar Guthula — Software Engineer | React, Python, AI & Cloud",
    description:
      "Bhaskar Guthula is a Software Engineer building modern web applications, real-time systems, cloud-native infrastructure, and AI-powered products.",
  },
} as const

// `side` places each link either side of the centred name in the navbar.
export const navLinks = [
  { id: "work", label: "Work", href: "/#work", side: "left" },
  { id: "about", label: "About", href: "/#about", side: "left" },
  { id: "lab", label: "Projects", href: "/#lab", side: "left" },
  { id: "writing", label: "Writing", href: "/#writing", side: "right" },
  { id: "contact", label: "Contact", href: "/#contact", side: "right" },
] as const

export const socialLinks = [
  { label: "GitHub", href: siteConfig.links.github },
  { label: "LinkedIn", href: siteConfig.links.linkedin },
  { label: "Blog", href: siteConfig.links.blog },
  { label: "Email", href: `mailto:${siteConfig.email}` },
] as const
