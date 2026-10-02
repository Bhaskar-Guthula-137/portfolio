import type { MotionValue } from "framer-motion"

import type { Project } from "~/data/projects"
import { useIsDesktop } from "~/lib/motion"
import { ProjectMeta, ProjectTitle, Scene } from "./shared"
import { CloudMap } from "./visuals/CloudMap"

/** 06 — the infrastructure underneath: a living architecture that connects as you scroll. */
export function CloudSystems({ project, progress }: { project: Project; progress?: MotionValue<number> }) {
  return (
    <Scene progress={progress} height="260svh" className="bg-ink text-warm" label={project.title}>
      {(p) => <Stage p={p} project={project} />}
    </Scene>
  )
}

function Stage({ p, project }: { p: MotionValue<number>; project: Project }) {
  const desktop = useIsDesktop()
  return (
    <div className="gutter grid h-full grid-rows-[auto_1fr] gap-4 pt-20 pb-6 lg:grid-cols-[0.55fr_1.45fr] lg:grid-rows-1 lg:gap-10 lg:py-16">
      <div className="flex flex-col justify-center">
        <ProjectTitle project={project} size="text-[15vw] lg:text-[6.6vw]" />
        <ProjectMeta project={project} className="mt-6 hidden lg:block [&>p]:text-base" />
      </div>
      <div className="relative min-h-0">
        <CloudMap progress={p} wide={desktop} />
      </div>
    </div>
  )
}
