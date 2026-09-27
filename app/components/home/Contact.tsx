import { motion, useTransform } from "framer-motion"
import { useRef } from "react"

import { ArrowLink } from "~/components/ui/ArrowLink"
import { Magnetic } from "~/components/ui/Magnetic"
import { SplitText } from "~/components/ui/SplitText"
import { siteConfig } from "~/data/site-config"
import { useSectionProgress } from "~/lib/motion"

/** SHIP — the closing statement. */
export function Contact() {
  const ref = useRef<HTMLElement>(null)
  const scrollYProgress = useSectionProgress(ref, ["start end", "end end"])
  const scale = useTransform(scrollYProgress, [0, 0.8], [0.86, 1])

  return (
    <section
      ref={ref}
      id="contact"
      aria-labelledby="contact-title"
      className="gutter relative overflow-hidden bg-ink pt-28 pb-20 text-warm lg:pt-40"
    >
      <span className="label text-warm/50">09 / Ship</span>
      <motion.h2
        id="contact-title"
        className="display mt-10 origin-left text-[15vw] lg:text-[11.5vw]"
        style={{ scale }}
      >
        <SplitText text="Have something" className="block" stagger={0.02} />
        <span className="block">
          <SplitText text="worth building" delay={0.2} stagger={0.02} />
          <span className="text-accent">?</span>
        </span>
      </motion.h2>

      <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[1fr_1.2fr] lg:items-end">
        <p className="max-w-md text-lg leading-snug text-warm/70 lg:text-xl">
          I'm interested in ambitious products, difficult engineering problems, AI systems, and ideas that need to
          become real software.
        </p>
        <div className="flex flex-col items-start gap-8 lg:items-end">
          <Magnetic strength={0.2}>
            <a
              href={`mailto:${siteConfig.email}`}
              className="group relative inline-flex items-center gap-5 overflow-hidden rounded-full border border-warm/30 py-5 pr-6 pl-8 text-3xl font-semibold tracking-tight lg:text-5xl"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-y-100" />
              <span className="relative transition-colors duration-300 group-hover:text-ink">Let's talk</span>
              <span className="relative grid size-12 place-items-center rounded-full bg-accent text-2xl text-ink transition-transform duration-500 group-hover:rotate-45 group-hover:bg-ink group-hover:text-accent lg:size-16">
                ↗
              </span>
            </a>
          </Magnetic>
          <p className="font-mono text-sm text-warm/50">{siteConfig.email}</p>
          <div className="label flex flex-wrap gap-8">
            <ArrowLink href={siteConfig.links.github}>View GitHub</ArrowLink>
            <ArrowLink href={siteConfig.links.linkedin}>LinkedIn</ArrowLink>
            <ArrowLink href={siteConfig.links.blog}>Blog</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  )
}
