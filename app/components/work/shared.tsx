import { motion, type MotionValue, useMotionValueEvent, useTransform } from "framer-motion"
import { type ReactNode, useRef, useState } from "react"

import { ArrowLink } from "~/components/ui/ArrowLink"
import type { Project } from "~/data/projects"
import { cx, EASE, useScenes, useSectionProgress } from "~/lib/motion"

/**
 * A pinned scroll scene. Children receive the scene's 0 → 1 progress. With
 * reduced motion the scene is not pinned and progress rests at 1.
 */
export function Scene({
  height,
  className,
  stickyClassName,
  children,
  id,
  label,
  staticClassName = "relative h-svh min-h-[720px]",
}: {
  staticClassName?: string
  height: string
  className?: string
  stickyClassName?: string
  children: (progress: MotionValue<number>, pinned: boolean) => ReactNode
  id?: string
  label?: string
}) {
  const scenes = useScenes()
  const ref = useRef<HTMLElement>(null)
  const scrollYProgress = useSectionProgress(ref, ["start start", "end end"])
  const done = useTransform(scrollYProgress, () => 1)

  return (
    <section
      ref={ref}
      id={id}
      aria-label={label}
      className={cx("relative", className)}
      style={scenes ? { height } : undefined}
    >
      <div className={cx(scenes ? "sticky top-0 h-svh overflow-hidden" : staticClassName, stickyClassName)}>
        {children(scenes ? scrollYProgress : done, scenes)}
      </div>
    </section>
  )
}

/** Discrete stage index derived from progress: 0 … count-1. */
export function useStage(progress: MotionValue<number>, count: number, start = 0, end = 1) {
  const toStage = (v: number) => Math.min(count - 1, Math.max(0, Math.floor(((v - start) / (end - start)) * count)))
  const [stage, setStage] = useState(() => toStage(progress.get()))
  useMotionValueEvent(progress, "change", (v) => setStage(toStage(v)))
  return stage
}

export function ProjectMeta({
  project,
  className,
  tone = "light",
}: {
  project: Project
  className?: string
  tone?: "light" | "dark"
}) {
  const muted = tone === "light" ? "text-warm/55" : "text-ink/55"
  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <span className="label rounded-full bg-accent px-2 py-0.5 text-ink">{project.tag}</span>
        <span className={cx("label", muted)}>{project.category}</span>
      </div>
      <p
        className={cx(
          "mt-4 max-w-md text-base leading-snug lg:text-lg",
          tone === "light" ? "text-warm/80" : "text-ink/80",
        )}
      >
        {project.description}
      </p>
      <ul className={cx("label mt-4 flex max-w-md flex-wrap gap-x-2 gap-y-1", muted)} aria-label="Technologies">
        {project.tech.map((t, i) => (
          <li key={t}>
            {t}
            {i < project.tech.length - 1 && <span className="ml-2 opacity-50">·</span>}
          </li>
        ))}
      </ul>
      <div className="label mt-6">
        <ArrowLink href={`/work/${project.slug}`} className={tone === "light" ? "text-warm" : "text-ink"}>
          Read the case study
        </ArrowLink>
      </div>
    </div>
  )
}

export function ProjectTitle({
  project,
  className,
  size = "text-[16vw] lg:text-[9vw]",
}: {
  project: Project
  className?: string
  size?: string
}) {
  return (
    <div className={className}>
      <span className="label opacity-60">{project.index} / 06</span>
      <motion.h3
        className={cx("display mt-2", size)}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.3 }}
      >
        {project.title.split(" ").map((word, i) => (
          <span key={i} className="block overflow-hidden pb-[0.05em]">
            <motion.span
              className="block"
              variants={{ hidden: { y: "100%" }, shown: { y: "0%" } }}
              transition={{ duration: 1, ease: EASE, delay: i * 0.08 }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.h3>
    </div>
  )
}

/** Vertical list of stages; the current one is lit. */
export function StageList({
  stages,
  stage,
  tone = "light",
}: {
  stages: string[]
  stage: number
  tone?: "light" | "dark"
}) {
  return (
    <ol className="label flex flex-col gap-1.5" aria-label="Stages">
      {stages.map((s, i) => (
        <li
          key={s}
          aria-current={i === stage ? "step" : undefined}
          className={cx(
            "flex items-center gap-3 transition-colors duration-500",
            i === stage ? (tone === "light" ? "text-warm" : "text-ink") : i < stage ? "opacity-60" : "opacity-25",
          )}
        >
          <span className={cx("h-px transition-all duration-500", i === stage ? "w-8 bg-accent" : "w-3 bg-current")} />
          {s}
        </li>
      ))}
    </ol>
  )
}

export type Shape = { x: number; y: number; w: number; h: number; r?: number }

/**
 * A bridge between two projects: the shapes that ended one scene re-form into
 * the shapes that begin the next.
 */
export function Bridge({
  from,
  to,
  fromLabel,
  toLabel,
  caption,
  tone = "light",
  toTone,
}: {
  from: Shape[]
  to: Shape[]
  fromLabel: string
  toLabel: string
  caption: string
  tone?: "light" | "dark"
  toTone?: "light" | "dark"
}) {
  return (
    <Scene
      height="170svh"
      label={`${fromLabel} to ${toLabel}`}
      className={tone === "light" ? "bg-ink text-warm" : "bg-paper text-ink"}
    >
      {(p, pinned) =>
        pinned ? (
          <BridgeStage
            p={p}
            from={from}
            to={to}
            fromLabel={fromLabel}
            toLabel={toLabel}
            caption={caption}
            tone={tone}
            toTone={toTone ?? tone}
          />
        ) : null
      }
    </Scene>
  )
}

function BridgeStage({
  p,
  from,
  to,
  fromLabel,
  toLabel,
  caption,
  tone,
  toTone,
}: {
  p: MotionValue<number>
  from: Shape[]
  to: Shape[]
  fromLabel: string
  toLabel: string
  caption: string
  tone: "light" | "dark"
  toTone: "light" | "dark"
}) {
  const m = useTransform(p, [0.15, 0.8], [0, 1], {
    ease: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  })
  const bg = useTransform(p, [0.7, 1], tone === toTone ? [0, 0] : [0, 1])
  const fromOpacity = useTransform(p, [0.1, 0.35], [1, 0.25])
  const toOpacity = useTransform(p, [0.55, 0.8], [0.25, 1])
  const line = useTransform(p, [0, 1], [0, 1])
  const target = toTone === "light" ? "var(--color-ink)" : "var(--color-paper)"
  const ink = (t: "light" | "dark") => (t === "light" ? "#f6f4ee" : "#0a0a09")
  const color = useTransform(bg, [0, 1], [ink(tone), ink(toTone)])
  return (
    <>
      <motion.div aria-hidden className="absolute inset-0" style={{ opacity: bg, backgroundColor: target }} />
      <motion.div aria-hidden className="absolute inset-0" style={{ color }}>
        <div className="gutter absolute inset-x-0 top-24 flex items-center justify-between">
          <motion.span className="label" style={{ opacity: fromOpacity }}>
            {fromLabel}
          </motion.span>
          <span className="label opacity-50">{caption}</span>
          <motion.span className="label" style={{ opacity: toOpacity }}>
            {toLabel}
          </motion.span>
        </div>
        <div className="absolute inset-x-[8vw] top-[22%] bottom-[18%] lg:inset-x-[16vw]">
          {from.map((f, i) => (
            <MorphRect key={i} from={f} to={to[i] ?? f} m={m} accent={i === 0} />
          ))}
        </div>
        <div className="gutter absolute inset-x-0 bottom-12">
          <motion.div className="h-px origin-left bg-current opacity-30" style={{ scaleX: line }} />
        </div>
      </motion.div>
    </>
  )
}

function MorphRect({ from, to, m, accent }: { from: Shape; to: Shape; m: MotionValue<number>; accent: boolean }) {
  const left = useTransform(m, (v) => `${from.x + (to.x - from.x) * v}%`)
  const top = useTransform(m, (v) => `${from.y + (to.y - from.y) * v}%`)
  const width = useTransform(m, (v) => `${from.w + (to.w - from.w) * v}%`)
  const height = useTransform(m, (v) => `${from.h + (to.h - from.h) * v}%`)
  const radius = useTransform(m, (v) => `${(from.r ?? 0) + ((to.r ?? 0) - (from.r ?? 0)) * v}px`)
  return (
    <motion.span
      className={cx("absolute border", accent ? "border-accent bg-accent/20" : "border-current/40 bg-current/[0.04]")}
      style={{ left, top, width, height, borderRadius: radius }}
    />
  )
}
