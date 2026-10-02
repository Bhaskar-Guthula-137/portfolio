import { About } from "~/components/home/About"
import { Contact } from "~/components/home/Contact"
import { Experience } from "~/components/home/Experience"
import { Hero } from "~/components/home/Hero"
import { Tools } from "~/components/home/Tools"
import { Writing } from "~/components/home/Writing"
import { Work } from "~/components/work/Work"
import { siteConfig } from "~/data/site-config"
import { buildMeta, personJsonLd } from "~/lib/seo"

export function meta() {
  return buildMeta({ title: siteConfig.seo.title, description: siteConfig.seo.description, path: "/" })
}

// INTRODUCE → THINK → BUILD → SHIP
export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }} />
      <Hero />
      <Tools />
      <Work />
      <Experience />
      <Writing />
      <About />
      <Contact />
    </>
  )
}
