import { motion, useTransform } from "framer-motion"
import { useRef } from "react"

import { SplitText } from "~/components/ui/SplitText"
import { capabilities, role } from "~/data/experience"
import { siteConfig } from "~/data/site-config"
import { EASE, useSectionProgress } from "~/lib/motion"

/** An editorial timeline: one role, six capabilities, a line that draws itself. */
export function Experience() {
  const list = useRef<HTMLOListElement>(null)
  const scrollYProgress = useSectionProgress(list, ["start 75%", "end 60%"])
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="gutter relative bg-ink py-28 text-warm lg:py-40"
    >
      <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="label text-warm/50">05 / Experience</span>
          <h2 id="experience-title" className="display mt-8 text-[13vw] lg:text-[5.6vw]">
            <SplitText text={role.title.split(" ").slice(0, -1).join(" ")} by="chars" className="block" />
            <SplitText text={role.title.split(" ").slice(-1)[0]} by="chars" delay={0.2} className="block" />
          </h2>
          <dl className="label mt-10 grid max-w-sm grid-cols-2 gap-y-3 text-warm/60">
            <dt>Company</dt>
            <dd className="text-warm">{role.company}</dd>
            <dt>Based in</dt>
            <dd className="text-warm">{siteConfig.location.city}</dd>
            <dt>Experience</dt>
            <dd className="text-warm">{role.years}</dd>
          </dl>
          <p className="mt-8 max-w-md text-lg leading-snug text-warm/70">{role.summary}</p>
        </div>

        <ol ref={list} className="relative">
          <span aria-hidden className="absolute top-0 bottom-0 left-[0.35rem] w-px bg-warm/10" />
          <motion.span
            aria-hidden
            className="absolute top-0 bottom-0 left-[0.35rem] w-px origin-top bg-accent"
            style={{ scaleY: draw }}
          />
          {capabilities.map((c, i) => (
            <motion.li
              key={c.title}
              className="relative grid grid-cols-[auto_1fr] gap-x-6 pb-16 pl-10 last:pb-0 lg:gap-x-10"
              initial={{ opacity: 0.15 }}
              whileInView={{ opacity: 1 }}
              viewport={{ amount: 0.6, margin: "0px 0px -20% 0px" }}
              transition={{ duration: 0.6 }}
            >
              <motion.span
                aria-hidden
                className="absolute top-3 left-0 size-3 rounded-full border border-accent bg-ink"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ amount: 1, margin: "0px 0px -20% 0px" }}
                transition={{ duration: 0.4, ease: EASE }}
              />
              <span className="display text-[16vw] leading-[0.8] text-warm/15 lg:text-[6.5vw]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="pt-1">
                <h3 className="text-2xl font-semibold tracking-tight lg:text-4xl">{c.title}</h3>
                <p className="mt-3 max-w-md text-warm/65">{c.body}</p>
                <p className="label mt-4 text-warm/45">{c.tags.join(" · ")}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
