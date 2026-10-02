import { motion, type MotionValue, useMotionValueEvent, useTransform } from "framer-motion"
import { type ReactNode, useRef, useState } from "react"
import { Link } from "react-router"

import { SplitText } from "~/components/ui/SplitText"
import { SystemLine } from "~/components/ui/SystemLine"
import { type Project, projects } from "~/data/projects"
import { useScenes, useSectionProgress } from "~/lib/motion"
import { CloudSystems } from "./CloudSystems"
import { ContentAssistant } from "./ContentAssistant"
import { EpaperBuilder } from "./EpaperBuilder"
import { LiveCricket } from "./LiveCricket"
import { ShortNewsCms } from "./ShortNewsCms"
import { VideoEditingAgent } from "./VideoEditingAgent"

// Each project holds for this share of its stretch of scroll (its own scene
// plays), then the track slides on to the next one.
const HOLD = 0.72
// Scroll length per project.
const PER_PROJECT_SVH = 240

type Panel = (props: { project: Project; progress?: MotionValue<number> }) => ReactNode

const PANELS: Panel[] = [
  LiveCricket,
  EpaperBuilder,
  ShortNewsCms,
  VideoEditingAgent,
  ({ project }) => <ContentAssistant project={project} panel />,
  CloudSystems,
]

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/** 03 / Projects — a header, then the projects as one horizontal track. */
export function Work() {
  const scenes = useScenes()
  return (
    <div id="projects" className="relative">
      <WorkHeader />
      {scenes ? (
        <ProjectsTrack />
      ) : (
        // Reduced motion: the projects simply stack, each at its final state.
        projects.map((project, i) => {
          if (i === 4) return <ContentAssistant key={project.slug} project={project} />
          const Panel = PANELS[i]
          return <Panel key={project.slug} project={project} />
        })
      )}
    </div>
  )
}

/** Vertical scroll drives a sideways track of full-screen project panels. */
function ProjectsTrack() {
  const ref = useRef<HTMLElement>(null)
  const p = useSectionProgress(ref)
  const n = projects.length

  const x = useTransform(p, (v) => {
    const seg = Math.min(v * n, n - 0.0001)
    const i = Math.floor(seg)
    const f = seg - i
    const slide = i < n - 1 ? easeInOut(Math.max(0, (f - HOLD) / (1 - HOLD))) : 0
    return `${-(i + slide) * 100}vw`
  })

  const [current, setCurrent] = useState(0)
  useMotionValueEvent(p, "change", (v) => {
    const seg = v * n
    const i = Math.floor(seg)
    const f = seg - i
    setCurrent(Math.min(n - 1, f > HOLD + (1 - HOLD) / 2 ? i + 1 : i))
  })

  return (
    <section ref={ref} aria-label="Projects" className="relative" style={{ height: `${n * PER_PROJECT_SVH}svh` }}>
      <div className="sticky top-0 h-svh overflow-hidden bg-ink">
        <motion.div className="flex h-full" style={{ x, width: `${n * 100}vw` }}>
          {projects.map((project, i) => (
            <PanelSlot key={project.slug} project={project} index={i} total={n} progress={p} />
          ))}
        </motion.div>
        <TrackIndicator current={current} progress={p} />
      </div>
    </section>
  )
}

function PanelSlot({
  project,
  index,
  total,
  progress,
}: {
  project: Project
  index: number
  total: number
  progress: MotionValue<number>
}) {
  // This panel's own 0 → 1, running while it holds the screen.
  const local = useTransform(progress, (v) => Math.min(1, Math.max(0, (v * total - index) / HOLD)))
  const Panel = PANELS[index]
  return (
    <div
      className="relative h-full w-screen shrink-0"
      aria-roledescription="slide"
      aria-label={`${project.index} of 06`}
    >
      <Panel project={project} progress={local} />
    </div>
  )
}

/** Which project is on screen, and how far through the track we are. */
function TrackIndicator({ current, progress }: { current: number; progress: MotionValue<number> }) {
  const project = projects[current]
  const fill = useTransform(progress, [0, 1], [0, 1])
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 mix-blend-difference">
      <div className="gutter flex items-center gap-4 pb-4 text-warm">
        <span className="label tabular-nums">
          {project.index} / {String(projects.length).padStart(2, "0")}
        </span>
        <span className="label hidden text-warm/70 sm:inline">{project.title}</span>
        <div className="relative ml-auto h-px w-[34vw] max-w-sm bg-warm/25">
          <motion.span className="absolute inset-0 origin-left bg-warm" style={{ scaleX: fill }} />
        </div>
        <Link to={`/projects/${project.slug}`} className="label pointer-events-auto hidden text-warm md:inline">
          Case study ↗
        </Link>
      </div>
    </div>
  )
}

function WorkHeader() {
  return (
    <header className="gutter relative bg-ink pt-32 pb-24 text-warm lg:pt-44 lg:pb-32">
      <div className="flex items-center gap-4">
        <span className="label text-warm/50">03 / Projects</span>
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
        <p className="label text-warm/40">06 projects · scroll to move through them →</p>
      </div>
    </header>
  )
}
