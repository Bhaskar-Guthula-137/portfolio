import type { MotionValue } from "framer-motion"

import type { Project } from "~/data/projects"
import { ProjectMeta, ProjectTitle, Scene, StageList, useStage } from "./shared"
import { CMS_STAGES, CmsBoard } from "./visuals/CmsBoard"

/** 03 — REPORTER → CONTENT → REVIEW → AI → SCHEDULE → PUBLISH. */
export function ShortNewsCms({ project }: { project: Project }) {
  return (
    <Scene height="400svh" className="bg-ink text-warm" label={project.title}>
      {(p) => <Stage p={p} project={project} />}
    </Scene>
  )
}

function Stage({ p, project }: { p: MotionValue<number>; project: Project }) {
  const stage = useStage(p, CMS_STAGES.length, 0.04, 0.94)
  return (
    <div className="gutter flex h-full flex-col gap-5 pt-20 pb-6 lg:pt-24 lg:pb-10">
      <div className="flex items-end justify-between gap-10">
        <ProjectTitle
          project={project}
          size="text-[13vw] lg:text-[7.5vw]"
          className="lg:[&_h3]:flex lg:[&_h3]:gap-[0.25em]"
        />
        <div className="hidden shrink-0 lg:block">
          <StageList stages={CMS_STAGES} stage={stage} />
        </div>
        <ProjectMeta project={project} className="hidden max-w-sm xl:block [&_ul]:hidden" />
      </div>
      <div className="min-h-0 flex-1" data-cursor="view">
        <CmsBoard stage={stage} />
      </div>
    </div>
  )
}
