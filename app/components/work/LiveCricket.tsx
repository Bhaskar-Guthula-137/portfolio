import { motion, type MotionValue, useTransform } from "framer-motion"
import { useEffect, useState } from "react"

import type { Project } from "~/data/projects"
import { ProjectMeta, ProjectTitle, Scene } from "./shared"
import { Scoreboard } from "./visuals/Scoreboard"

function useViewport() {
  const [size, setSize] = useState({ w: 1440, h: 900 })
  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])
  return size
}

/** 01 — the scoreboard floats beside the title, then expands into a full-screen product view. */
export function LiveCricket({ project, progress }: { project: Project; progress?: MotionValue<number> }) {
  const vp = useViewport()
  const desktop = vp.w >= 1024
  const small = desktop
    ? { w: 420, h: 300, x: vp.w - 420 - vp.w * 0.05, y: vp.h * 0.3 }
    : { w: vp.w * 0.9, h: 240, x: vp.w * 0.05, y: vp.h - 240 - 32 }

  return (
    <Scene
      progress={progress}
      height="340svh"
      className="bg-ink text-warm"
      label={project.title}
      staticClassName="relative"
    >
      {(p, pinned) => <Stage p={p} pinned={pinned} project={project} vp={vp} small={small} desktop={desktop} />}
    </Scene>
  )
}

function Stage({
  p,
  pinned,
  project,
  vp,
  small,
  desktop,
}: {
  p: MotionValue<number>
  pinned: boolean
  project: Project
  vp: { w: number; h: number }
  small: { w: number; h: number; x: number; y: number }
  desktop: boolean
}) {
  const e = useTransform(p, [0.32, 0.72], [0, 1], { clamp: true })
  const width = useTransform(e, (v) => small.w + (vp.w - small.w) * v)
  const height = useTransform(e, (v) => small.h + (vp.h - small.h) * v)
  const x = useTransform(e, (v) => small.x * (1 - v))
  const y = useTransform(e, (v) => small.y * (1 - v))
  const textOpacity = useTransform(p, [0.3, 0.5], [1, 0])
  const textY = useTransform(p, [0.3, 0.55], [0, -80])
  const rotate = useTransform(e, [0, 1], [-2.5, 0])
  const badgeOpacity = useTransform(p, [0.7, 0.8], [0, 1])

  if (!pinned)
    return (
      <div className="gutter py-24">
        <ProjectTitle project={project} />
        <ProjectMeta project={project} className="mt-8" />
        <div className="mt-10 h-[520px]">
          <Scoreboard />
        </div>
      </div>
    )

  return (
    <>
      <motion.div
        className="gutter relative z-10 flex h-full flex-col pt-24 lg:justify-center lg:pt-0"
        style={{ opacity: textOpacity, y: textY }}
      >
        <ProjectTitle project={project} size="text-[17vw] lg:text-[11vw]" />
        <ProjectMeta project={project} className={desktop ? "mt-8" : "mt-5 [&>p]:text-sm [&>ul]:hidden"} />
      </motion.div>

      <motion.div
        className="absolute top-0 left-0 z-20 overflow-hidden border border-warm/15 shadow-[0_40px_120px_-20px_rgb(0_0_0/0.8)]"
        style={{ width, height, x, y, rotate }}
        data-cursor="view"
      >
        <Scoreboard />
        <motion.span
          className="label absolute right-4 bottom-4 flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-ink"
          style={{ opacity: badgeOpacity }}
        >
          Real-time · WebSockets · Durable Objects
        </motion.span>
      </motion.div>

      <motion.span
        className="label absolute top-[24%] right-[5vw] z-30 hidden rounded-full border border-accent px-2 py-0.5 text-accent lg:block"
        style={{ opacity: textOpacity }}
      >
        ● Real-time
      </motion.span>
    </>
  )
}
