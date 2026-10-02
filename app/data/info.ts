// All personal details in one place. Every component reads from `infoData`,
// so changing a link, email, role, or number here updates it across the site.
export const infoData = {
  name: "Bhaskar Guthula",
  firstName: "Bhaskar",
  lastName: "Guthula",
  role: "Software Engineer",
  /** Total experience, in years. */
  experience: "3.6",
  location: { city: "Hyderabad", country: "India", timeZone: "Asia/Kolkata" },
  email: "bhaskarguthula1674@gmail.com",
  socials: {
    github: "https://github.com/Bhaskar-Guthula-137",
    linkedin: "https://www.linkedin.com/in/bhaskarg-38162519b",
    blog: "http://blog.sabsverse.com",
  },
  /** The blog's rotating stamp: a monogram in the centre, a phrase around it. */
  blogStamp: {
    monogram: "BTC",
    ring: "BROS TRIED CODING · CONTROLLER TO CONSOLE · ",
  },
} as const

/** Social links as a list, for icon rows and link lists. */
export const socialLinks = [
  { label: "GitHub", href: infoData.socials.github },
  { label: "LinkedIn", href: infoData.socials.linkedin },
  { label: "Blog", href: infoData.socials.blog },
  { label: "Email", href: `mailto:${infoData.email}` },
] as const
