import { motion, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"

import { type Experiment, experiments } from "~/data/experiments"
import { cx, EASE, useScenes, useSectionProgress } from "~/lib/motion"

/** LAB / EXPERIMENTS — a sideways drawer of smaller builds, driven by vertical scroll. */
export function Experiments() {
  const scenes = useScenes()
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    const measure = () => {
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth))
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  const scrollYProgress = useSectionProgress(section, ["start start", "end end"])
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1])

  const cards = (
    <>
      <div className="flex w-[80vw] shrink-0 flex-col justify-end pr-8 lg:w-[34vw]">
        <span className="label text-warm/50">07 / Experiment</span>
        <h2 id="lab-title" className="display mt-6 text-[17vw] lg:text-[8.5vw]">
          Lab /<br />
          Experi&shy;ments
        </h2>
        <p className="mt-6 max-w-sm text-warm/65">
          Smaller builds, prototypes, and sketches. Places to try an idea before it becomes a product.
        </p>
        <p className="label mt-8 text-warm/40">Scroll → </p>
      </div>
      {experiments.map((e, i) => (
        <Card key={e.title} experiment={e} index={i} />
      ))}
    </>
  )

  if (!scenes)
    return (
      <section id="lab" aria-labelledby="lab-title" className="gutter bg-ink py-24 text-warm">
        <div className="flex gap-6 overflow-x-auto pb-6">{cards}</div>
      </section>
    )

  return (
    <section
      id="lab"
      ref={section}
      aria-labelledby="lab-title"
      className="relative bg-ink text-warm"
      style={{ height: `calc(100svh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <motion.div ref={track} className="gutter flex w-max items-stretch gap-6 lg:gap-8" style={{ x }}>
          {cards}
        </motion.div>
        <div className="gutter absolute inset-x-0 bottom-8">
          <div className="h-px bg-warm/10">
            <motion.div className="h-px origin-left bg-accent" style={{ scaleX: bar }} />
          </div>
        </div>
      </div>
    </section>
  )
}

function Card({ experiment, index }: { experiment: Experiment; index: number }) {
  return (
    <motion.article
      className="group flex h-[64svh] min-h-[420px] w-[80vw] shrink-0 flex-col border border-warm/12 bg-char p-5 transition-colors duration-500 hover:border-warm/35 lg:w-[30vw]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: EASE, delay: (index % 3) * 0.08 }}
    >
      <div className="label flex justify-between text-warm/45">
        <span>E.{String(index + 1).padStart(2, "0")}</span>
        <span>{experiment.kind}</span>
      </div>
      <div className="mt-4 min-h-0 flex-1 overflow-hidden">
        <Preview experiment={experiment} />
      </div>
      <h3 className="mt-5 text-2xl font-semibold tracking-tight">{experiment.title}</h3>
      <p className="mt-2 text-sm text-warm/60">{experiment.description}</p>
      <p className="label mt-4 text-warm/40">{experiment.stack.join(" · ")}</p>
    </motion.article>
  )
}

function Preview({ experiment }: { experiment: Experiment }) {
  const { form, lines } = experiment
  switch (form) {
    case "terminal":
      return (
        <div className="h-full bg-ink p-4 font-mono text-xs leading-6 sm:text-sm">
          {lines.map((line, i) => (
            <motion.p
              key={line}
              className={cx(line.startsWith("✓") ? "text-accent" : line.startsWith("$") ? "text-warm" : "text-warm/55")}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.35 }}
            >
              {line}
            </motion.p>
          ))}
          <span className="mt-1 inline-block h-4 w-2 animate-pulse bg-warm/70 align-middle" />
        </div>
      )
    case "window":
      return (
        <div className="flex h-full flex-col bg-paper text-ink">
          <div className="flex gap-1.5 border-b border-ink/10 p-2">
            {[0, 1, 2].map((d) => (
              <span key={d} className="size-2 rounded-full bg-ink/20" />
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-3 p-4">
            <p className="border border-ink/20 px-3 py-2 text-sm">{lines[0]}</p>
            <div className="flex flex-col gap-1.5">
              {[92, 100, 70].map((w, i) => (
                <span key={i} className="h-1.5 bg-ink/15" style={{ width: `${w}%` }} />
              ))}
            </div>
            <p className="label mt-auto text-ink/50">{lines[1]}</p>
          </div>
        </div>
      )
    case "sketch":
      return (
        <svg viewBox="0 0 300 200" className="h-full w-full bg-paper" aria-hidden>
          {lines.map((l, i) => (
            <g key={l} transform={`translate(${30 + i * 95} ${i % 2 ? 110 : 60})`}>
              <rect
                width="70"
                height="40"
                fill="none"
                stroke="#0a0a09"
                strokeWidth="1.4"
                strokeDasharray="220"
                rx="3"
                transform={`rotate(${i % 2 ? 2 : -2})`}
              />
              <text x="35" y="25" textAnchor="middle" className="fill-ink font-mono text-[11px]">
                {l}
              </text>
            </g>
          ))}
          <path
            d="M100 80 C 120 80, 115 128, 125 128"
            fill="none"
            stroke="#3b4d00"
            strokeWidth="1.4"
            markerEnd="url(#arrow)"
          />
          <path
            d="M195 128 C 210 128, 205 80, 220 80"
            fill="none"
            stroke="#3b4d00"
            strokeWidth="1.4"
            markerEnd="url(#arrow)"
          />
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0 L10 5 L0 10 z" fill="#3b4d00" />
            </marker>
          </defs>
          <text x="20" y="185" className="fill-ink/50 font-mono text-[9px]">
            sketch · not to scale
          </text>
        </svg>
      )
    case "diagram":
      return (
        <div className="relative h-full bg-ink">
          {lines.map((room, i) => (
            <div
              key={room}
              className="absolute size-24 rounded-full border border-warm/25"
              style={{ left: `${12 + i * 28}%`, top: `${20 + (i % 2) * 30}%` }}
            >
              <span className="label absolute -top-5 left-0 text-[0.55rem] text-warm/50">{room}</span>
              {[0, 1, 2].map((c) => (
                <motion.span
                  key={c}
                  className={cx("absolute size-2 rounded-full", c === 0 ? "bg-accent" : "bg-warm/60")}
                  animate={{
                    x: [10 + c * 20, 50 - c * 10, 20 + c * 15, 10 + c * 20],
                    y: [20 + c * 10, 40, 60 - c * 10, 20 + c * 10],
                  }}
                  transition={{ duration: 5 + c + i, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </div>
          ))}
        </div>
      )
    default:
      return (
        <div className="flex h-full flex-col border border-warm/10 bg-ink">
          <div className="label border-b border-warm/10 px-3 py-2 text-[0.55rem] text-warm/40">
            localhost:5173/type-grid
          </div>
          <div className="grid flex-1 place-items-center">
            <div className="display text-[3.4rem] leading-[0.8] lg:text-[4.2rem]">
              {lines.map((l, i) => (
                <motion.span
                  key={l}
                  className="block"
                  animate={{ x: [0, i % 2 ? -18 : 18, 0], fontWeight: [700, 300, 700] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }}
                >
                  {l}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      )
  }
}
