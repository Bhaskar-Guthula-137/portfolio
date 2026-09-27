import { motion, type MotionValue, useTransform } from "framer-motion"
import { useRef } from "react"

import { SplitText } from "~/components/ui/SplitText"
import { siteConfig } from "~/data/site-config"
import { cx, useSectionProgress } from "~/lib/motion"

const LAYERS = ["Frontend", "Backend", "Cloud", "AI", "Architecture", "Product"]

/** THE PERSON BEHIND THE CODE — type instead of a profile card. */
export function About() {
  const ref = useRef<HTMLDivElement>(null)
  const scrollYProgress = useSectionProgress(ref, ["start 85%", "end 40%"])

  return (
    <section id="about" aria-labelledby="about-title" className="gutter relative bg-paper py-28 text-ink lg:py-40">
      <span className="label text-ink/50">08 / About</span>
      <div className="mt-10 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <h2 id="about-title" className="display text-[14vw] lg:text-[8vw]">
          <SplitText text="The person" by="words" className="block" />
          <SplitText text="behind" by="words" delay={0.08} className="block pl-[12%]" />
          <SplitText text="the code." by="words" delay={0.16} className="block" />
        </h2>
        <div className="flex flex-col justify-end">
          <SplitText
            as="p"
            text="I'm a Software Engineer who enjoys turning ideas into products and difficult engineering problems into simple experiences."
            by="words"
            variant="blur"
            stagger={0.03}
            className="text-2xl leading-tight font-medium tracking-tight lg:text-[2.1rem]"
          />
          <p className="label mt-8 flex flex-wrap gap-x-6 gap-y-2 text-ink/60">
            <span>
              {siteConfig.location.city} · {siteConfig.location.country}
            </span>
            <span>{siteConfig.yearsExperience} years</span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-accent-ink" />
              {siteConfig.availability.label}
            </span>
          </p>
        </div>
      </div>

      <div ref={ref} className="mt-20 border-t border-ink/20 lg:mt-28">
        {LAYERS.map((layer, i) => (
          <Layer key={layer} text={layer} index={i} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  )
}

function Layer({ text, index, progress }: { text: string; index: number; progress: MotionValue<number> }) {
  const start = index / LAYERS.length
  const range = [start * 0.8, start * 0.8 + 0.3]
  const x = useTransform(progress, range, [index % 2 ? "-12%" : "12%", "0%"])
  const opacity = useTransform(progress, range, [0.1, 1])
  return (
    <div className="flex items-baseline justify-between gap-4 overflow-hidden border-b border-ink/20 py-2">
      <span className="label text-ink/40">0{index + 1}</span>
      <motion.span
        className={cx("display text-[11vw] leading-[0.9] lg:text-[9vw]", index % 2 ? "mr-auto ml-[6vw]" : "ml-auto")}
        style={{ x, opacity }}
      >
        {text}
      </motion.span>
    </div>
  )
}
