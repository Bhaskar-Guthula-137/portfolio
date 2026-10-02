import { siteConfig } from "~/data/site-config"
import { infoData } from "~/data/info"

type MetaInput = {
  title: string
  description: string
  path: string
  type?: "website" | "article"
}

export function buildMeta({ title, description, path, type = "website" }: MetaInput) {
  const url = new URL(path, siteConfig.url).toString()
  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: type },
    { property: "og:site_name", content: infoData.name },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ]
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: infoData.name,
    jobTitle: infoData.role,
    description: siteConfig.seo.description,
    url: siteConfig.url,
    email: `mailto:${infoData.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: infoData.location.city,
      addressCountry: infoData.location.country,
    },
    knowsAbout: [
      "React",
      "TypeScript",
      "Python",
      "FastAPI",
      "Cloudflare",
      "Google Cloud",
      "AI",
      "RAG",
      "Real-time systems",
    ],
    sameAs: [infoData.socials.github, infoData.socials.linkedin, infoData.socials.blog],
  }
}
