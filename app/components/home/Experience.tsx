import { motion, useTransform } from "framer-motion"
import { useRef } from "react"

import { experienceNote, positions } from "~/data/experience"
import { cx, EASE, useSectionProgress } from "~/lib/motion"
import { infoData } from "~/data/info"

/** An editorial timeline: total experience on the left, each role on the right, a line that draws itself. */
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
          <span className="label text-warm/50">04 / Experience</span>
          <h2 id="experience-title" className="sr-only">
            Experience
          </h2>
          <p className="mt-8 flex items-start gap-3" aria-label={`${infoData.experience} years of experience`}>
            <motion.span
              aria-hidden
              className="display text-[34vw] leading-[0.8] lg:text-[13vw]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1, ease: EASE }}
            >
              {infoData.experience}
            </motion.span>
            <span aria-hidden className="mt-[0.4em] text-2xl font-medium tracking-tight lg:text-3xl">
              years
              <span className="text-accent">.</span>
            </span>
          </p>
          <p className="label mt-6 text-warm/55">Total experience · {positions.length} companies</p>
          <dl className="mt-10 flex max-w-md flex-col gap-5 border-t border-warm/10 pt-8">
            {experienceNote.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}
              >
                <dt className="label flex items-center gap-2 text-accent">
                  <span className="size-1 rounded-full bg-accent" />
                  {item.label}
                </dt>
                <dd className="mt-2 text-base leading-snug text-warm/70 lg:text-lg">{item.text}</dd>
              </motion.div>
            ))}
          </dl>
        </div>

        <ol ref={list} className="relative">
          <span aria-hidden className="absolute top-0 bottom-0 left-[0.35rem] w-px bg-warm/10" />
          <motion.span
            aria-hidden
            className="absolute top-0 bottom-0 left-[0.35rem] w-px origin-top bg-accent"
            style={{ scaleY: draw }}
          />
          {positions.map((p, i) => (
            <motion.li
              key={p.company}
              className={cx(
                "relative grid grid-cols-[auto_1fr] gap-x-6 border-b border-warm/10 pb-14 pl-10 last:border-b-0 last:pb-0 lg:gap-x-10",
                i > 0 && "pt-14",
              )}
              initial={{ opacity: 0.15 }}
              whileInView={{ opacity: 1 }}
              viewport={{ amount: 0.6, margin: "0px 0px -20% 0px" }}
              transition={{ duration: 0.6 }}
            >
              <motion.span
                aria-hidden
                className={cx(
                  "absolute left-0 size-3 rounded-full border border-accent bg-ink",
                  i > 0 ? "top-[4.6rem]" : "top-3",
                )}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ amount: 1, margin: "0px 0px -20% 0px" }}
                transition={{ duration: 0.4, ease: EASE }}
              />
              <span className="display text-[16vw] leading-[0.8] text-warm/15 lg:text-[6.5vw]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="pt-1">
                <h3 className="text-2xl font-semibold tracking-tight lg:text-4xl">{p.role}</h3>
                <p className="mt-3 text-lg text-warm/75 lg:text-xl">{p.company}</p>
                <p className="label mt-3 text-warm/45">{p.location}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
