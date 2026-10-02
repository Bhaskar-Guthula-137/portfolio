import { motion, type MotionValue, useTransform } from "framer-motion"
import { useRef } from "react"

import { SplitText } from "~/components/ui/SplitText"
import { cx, useSectionProgress } from "~/lib/motion"
import { ProfileCard } from "./ProfileCard"

const LAYERS = ["Frontend", "Backend", "Cloud", "AI", "System Design", "Web3"]

/** THE PERSON BEHIND THE CODE — the headline, the profile card, and what I work across. */
export function About() {
  const ref = useRef<HTMLDivElement>(null)
  const scrollYProgress = useSectionProgress(ref, ["start 85%", "end 40%"])

  return (
    <section id="about" aria-labelledby="about-title" className="gutter relative bg-paper py-28 text-ink lg:py-40">
      <span className="label text-ink/50">06 / About</span>
      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <h2 id="about-title" className="display text-[14vw] lg:text-[8vw]">
          <SplitText text="The person" by="words" className="block" />
          <SplitText text="behind" by="words" delay={0.08} className="block pl-[12%]" />
          <SplitText text="the code." by="words" delay={0.16} className="block" />
        </h2>
        {/* On desktop the card takes the heading's height; it never sets the row height itself. */}
        <div className="relative flex justify-center lg:block">
          <div className="w-full max-w-[640px] lg:absolute lg:inset-y-0 lg:right-0 lg:w-auto lg:max-w-none">
            <ProfileCard />
          </div>
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
      <span className="label shrink-0 text-ink/40">0{index + 1}</span>
      <motion.span
        className={cx(
          "display text-[9vw] leading-[0.9] whitespace-nowrap lg:text-[9vw]",
          index % 2 ? "mr-auto ml-[6vw]" : "ml-auto",
        )}
        style={{ x, opacity }}
      >
        {text}
      </motion.span>
    </div>
  )
}
