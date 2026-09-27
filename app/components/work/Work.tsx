import { motion, useMotionValueEvent, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { Link } from "react-router"

import { SplitText } from "~/components/ui/SplitText"
import { SystemLine } from "~/components/ui/SystemLine"
import { projects } from "~/data/projects"
import { cx, useScenes, useSectionProgress } from "~/lib/motion"
import { CloudSystems } from "./CloudSystems"
import { ContentAssistant } from "./ContentAssistant"
import { EpaperBuilder } from "./EpaperBuilder"
import { LiveCricket } from "./LiveCricket"
import { RushCut } from "./RushCut"
import { Bridge, type Shape } from "./shared"
import { ShortNewsCms } from "./ShortNewsCms"

const range = (n: number) => Array.from({ length: n }, (_, i) => i)

// The shapes each project hands to the next.
const ROWS: Shape[] = range(6).map((i) => ({ x: 0, y: 4 + i * 16, w: 100, h: 9 }))
const COLUMNS: Shape[] = range(6).map((i) => ({ x: 1 + i * 16.6, y: 0, w: 14.6, h: 100 }))
const CARDS: Shape[] = range(6).map((i) => ({ x: 1 + i * 16.6, y: 34, w: 14.6, h: 32, r: 6 }))
const NODES: Shape[] = range(6).map((i) => ({ x: i * 19.4, y: 47, w: 3, h: 5.4, r: 40 }))
const PASSAGES: Shape[] = range(6).map((i) => ({ x: 18, y: 6 + i * 15, w: 64, h: 10, r: 2 }))
const SERVICES: Shape[] = [
  { x: 0, y: 46, w: 10, h: 8, r: 40 },
  { x: 22, y: 46, w: 12, h: 8, r: 40 },
  { x: 44, y: 14, w: 10, h: 8, r: 40 },
  { x: 44, y: 46, w: 16, h: 8, r: 40 },
  { x: 70, y: 62, w: 12, h: 8, r: 40 },
  { x: 88, y: 40, w: 12, h: 8, r: 40 },
]

const label = (i: number) => `${projects[i].index} · ${projects[i].title}`

export function Work() {
  const [cricket, epaper, cms, rush, assistant, cloud] = projects
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div id="work" ref={ref} className="relative">
      <WorkHeader />
      <WorkRail target={ref} />
      <LiveCricket project={cricket} />
      <Bridge
        from={ROWS}
        to={COLUMNS}
        fromLabel={label(0)}
        toLabel={label(1)}
        caption="data rows become page columns"
        toTone="dark"
      />
      <EpaperBuilder project={epaper} />
      <Bridge
        from={COLUMNS}
        to={CARDS}
        fromLabel={label(1)}
        toLabel={label(2)}
        caption="columns become content blocks"
        tone="dark"
        toTone="light"
      />
      <ShortNewsCms project={cms} />
      <Bridge from={CARDS} to={NODES} fromLabel={label(2)} toLabel={label(3)} caption="blocks become pipeline stages" />
      <RushCut project={rush} />
      <Bridge
        from={NODES}
        to={PASSAGES}
        fromLabel={label(3)}
        toLabel={label(4)}
        caption="stages become retrieved context"
        toTone="dark"
      />
      <ContentAssistant project={assistant} />
      <Bridge
        from={PASSAGES}
        to={SERVICES}
        fromLabel={label(4)}
        toLabel={label(5)}
        caption="context becomes infrastructure"
        tone="dark"
        toTone="light"
      />
      <CloudSystems project={cloud} />
    </div>
  )
}

function WorkHeader() {
  return (
    <header className="gutter relative bg-ink pt-32 pb-24 text-warm lg:pt-44 lg:pb-32">
      <div className="flex items-center gap-4">
        <span className="label text-warm/50">03 / Build</span>
        <SystemLine nodes={7} className="flex-1" active={[0, 6]} />
      </div>
      <h2 className="display mt-12 text-[17vw] lg:text-[13.5vw]" aria-label="Things I've built.">
        <SplitText text="Things" className="block" />
        <span className="flex items-end justify-between gap-6">
          <SplitText text="I've built" delay={0.15} />
          <span aria-hidden className="mb-[0.12em] inline-block size-[0.16em] shrink-0 rounded-full bg-accent" />
        </span>
      </h2>
      <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
        <p className="max-w-md text-lg leading-snug text-warm/70 lg:text-xl">
          Products, systems, experiments, and ideas turned into working software.
        </p>
        <p className="label text-warm/40">06 projects · scroll to walk through them</p>
      </div>
    </header>
  )
}

/** Fixed index on the right edge while the work section is on screen. */
function WorkRail({ target }: { target: React.RefObject<HTMLDivElement | null> }) {
  const scenes = useScenes()
  const scrollYProgress = useSectionProgress(target, ["start start", "end end"])
  const [on, setOn] = useState(false)
  const [current, setCurrent] = useState(0)
  const fill = useTransform(scrollYProgress, [0.04, 1], [0, 1])

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setOn(v > 0.03 && v < 0.995)
    // Map the scroll position to the project currently on screen.
    const sections = target.current?.querySelectorAll<HTMLElement>(":scope > section[aria-label]") ?? []
    const mid = window.innerHeight / 2
    sections.forEach((s) => {
      const r = s.getBoundingClientRect()
      const idx = projects.findIndex((p) => p.title === s.getAttribute("aria-label"))
      if (idx >= 0 && r.top < mid && r.bottom > mid) setCurrent(idx)
    })
  })

  if (!scenes) return null
  return (
    <motion.nav
      aria-label="Projects"
      className="fixed top-1/2 right-3 z-40 hidden -translate-y-1/2 mix-blend-difference lg:block"
      initial={false}
      animate={{ opacity: on ? 1 : 0, x: on ? 0 : 20 }}
      style={{ pointerEvents: on ? "auto" : "none" }}
    >
      <div className="relative flex flex-col items-end gap-5 py-1 pr-3">
        <span className="absolute top-0 right-0 h-full w-px bg-warm/25" />
        <motion.span className="absolute top-0 right-0 h-full w-px origin-top bg-warm" style={{ scaleY: fill }} />
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            to={`/work/${p.slug}`}
            className="group relative flex items-center gap-2 text-warm"
            aria-current={i === current ? "true" : undefined}
          >
            <span className={cx("label transition-all duration-300", "opacity-0 group-hover:opacity-100")}>
              {p.title}
            </span>
            <span className={cx("label transition-opacity", i === current ? "opacity-100" : "opacity-50")}>
              {p.index}
            </span>
            <span
              className={cx(
                "absolute -right-[16.5px] size-2 rounded-full border border-warm transition-colors",
                i === current ? "bg-warm" : "bg-ink",
              )}
            />
          </Link>
        ))}
      </div>
    </motion.nav>
  )
}
