import { AnimatePresence, motion, type MotionValue, useTransform } from "framer-motion"

import type { Project } from "~/data/projects"
import { EASE, useIsDesktop } from "~/lib/motion"
import { ProjectMeta, Scene, useStage } from "./shared"
import { Filmstrip, Pipeline, PIPELINE_LEVELS } from "./visuals/Pipeline"

/** 04 — the pipeline grows more complex the further you scroll. */
export function RushCut({ project }: { project: Project }) {
  return (
    <Scene height="460svh" className="bg-ink text-warm" label={project.title}>
      {(p) => <Stage p={p} project={project} />}
    </Scene>
  )
}

function Stage({ p, project }: { p: MotionValue<number>; project: Project }) {
  const desktop = useIsDesktop()
  const level = useStage(p, PIPELINE_LEVELS.length, 0.04, 0.94)
  const titleX = useTransform(p, [0, 1], ["4%", "-18%"])

  return (
    <div className="relative flex h-full flex-col">
      {/* Outline title behind everything */}
      <motion.p
        aria-hidden
        className="display pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-[34vw] whitespace-nowrap text-transparent [-webkit-text-stroke:1px_rgb(246_244_238/0.09)] lg:text-[26vw]"
        style={{ x: titleX }}
      >
        Rush Cut
      </motion.p>

      <div className="gutter relative z-10 flex items-start justify-between gap-6 pt-20 lg:pt-24">
        <div>
          <span className="label opacity-60">{project.index} / 06</span>
          <h3 className="display mt-2 text-[14vw] lg:text-[6vw]">{project.title}</h3>
        </div>
        <div className="text-right">
          <p className="label text-mute">
            Level {level + 1} / {PIPELINE_LEVELS.length}
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={level}
              className="mt-1 text-lg font-semibold tracking-tight lg:text-2xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {PIPELINE_LEVELS[level]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="gutter relative z-10 min-h-0 flex-1 py-2" data-cursor="view">
        <Pipeline level={level} vertical={!desktop} />
      </div>

      <div className="gutter relative z-10 grid gap-6 pb-6 lg:grid-cols-[1fr_1.4fr] lg:items-end lg:pb-10">
        <ProjectMeta project={project} className="hidden lg:block [&>p]:text-base" />
        <Filmstrip cut={level >= 4} />
      </div>
    </div>
  )
}
