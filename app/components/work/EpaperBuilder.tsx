import type { MotionValue } from "framer-motion"

import type { Project } from "~/data/projects"
import { ProjectMeta, ProjectTitle, Scene, StageList, useStage } from "./shared"
import { EPAPER_STAGES, EpaperPage } from "./visuals/EpaperPage"

/** 02 — NEWSPAPER → PAGE → BLOCKS → EDITOR, one stage per stretch of scroll. */
export function EpaperBuilder({ project }: { project: Project }) {
  return (
    <Scene height="360svh" className="bg-paper text-ink" label={project.title}>
      {(p) => <Stage p={p} project={project} />}
    </Scene>
  )
}

function Stage({ p, project }: { p: MotionValue<number>; project: Project }) {
  const stage = useStage(p, EPAPER_STAGES.length, 0.05, 0.92)
  return (
    <div className="gutter grid h-full grid-rows-[auto_1fr] gap-4 pt-20 pb-6 lg:grid-cols-[0.9fr_1.1fr] lg:grid-rows-1 lg:gap-12 lg:py-0">
      <div className="flex flex-col justify-center">
        <ProjectTitle project={project} size="text-[15vw] lg:text-[8vw]" />
        <div className="mt-6 hidden lg:block">
          <ProjectMeta project={project} tone="dark" />
        </div>
        <div className="mt-4 flex items-center gap-6 lg:mt-10">
          <StageList stages={EPAPER_STAGES} stage={stage} tone="dark" />
          <p className="display text-[12vw] text-ink/10 lg:text-[5vw]" aria-hidden>
            0{stage + 1}
          </p>
        </div>
      </div>
      <div className="relative min-h-0 lg:my-[10vh]" data-cursor="view">
        <EpaperPage stage={stage} />
      </div>
    </div>
  )
}
