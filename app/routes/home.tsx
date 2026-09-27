import { About } from "~/components/home/About"
import { ArchitectureLab } from "~/components/home/ArchitectureLab"
import { Contact } from "~/components/home/Contact"
import { Experience } from "~/components/home/Experience"
import { Experiments } from "~/components/home/Experiments"
import { Exploring } from "~/components/home/Exploring"
import { Hero } from "~/components/home/Hero"
import { Philosophy } from "~/components/home/Philosophy"
import { Tools } from "~/components/home/Tools"
import { Writing } from "~/components/home/Writing"
import { Work } from "~/components/work/Work"
import { siteConfig } from "~/data/site-config"
import { buildMeta, personJsonLd } from "~/lib/seo"

export function meta() {
  return buildMeta({ title: siteConfig.seo.title, description: siteConfig.seo.description, path: "/" })
}

// INTRODUCE → THINK → BUILD → ARCHITECT → EXPERIMENT → SHIP
export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }} />
      <Hero />
      <Tools />
      <Work />
      <ArchitectureLab />
      <Philosophy />
      <Experience />
      <Exploring />
      <Writing />
      <Experiments />
      <About />
      <Contact />
    </>
  )
}
