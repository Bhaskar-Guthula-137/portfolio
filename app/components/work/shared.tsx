import { motion, type MotionValue, useMotionValueEvent, useTransform } from "framer-motion"
import { type ReactNode, useRef, useState } from "react"

import { ArrowLink } from "~/components/ui/ArrowLink"
import type { Project } from "~/data/projects"
import { cx, EASE, useScenes, useSectionProgress } from "~/lib/motion"

/**
 * A project scene. Children receive a 0 → 1 progress. Given `progress`, the
 * scene is a panel inside the horizontal projects track; otherwise it pins
 * itself with its own scroll height. With reduced motion progress rests at 1.
 */
export function Scene({
  height,
  className,
  stickyClassName,
  children,
  id,
  label,
  progress,
  staticClassName = "relative h-svh min-h-[720px]",
}: {
  progress?: MotionValue<number>
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

  if (progress)
    return (
      <section
        id={id}
        aria-label={label}
        className={cx("relative h-full w-full overflow-hidden", className, stickyClassName)}
      >
        {children(progress, true)}
      </section>
    )

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
        <ArrowLink href={`/projects/${project.slug}`} className={tone === "light" ? "text-warm" : "text-ink"}>
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
