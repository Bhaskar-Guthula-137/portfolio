import { useMotionValue } from "framer-motion"
import { useEffect, useState } from "react"

import type { ProjectVisual } from "~/data/projects"
import { useIsDesktop, useMotionAllowed } from "~/lib/motion"
import { CloudMap } from "../work/visuals/CloudMap"
import { CMS_STAGES, CmsBoard } from "../work/visuals/CmsBoard"
import { EPAPER_STAGES, EpaperPage } from "../work/visuals/EpaperPage"
import { Filmstrip, Pipeline, PIPELINE_LEVELS } from "../work/visuals/Pipeline"
import { RagConsole } from "../work/visuals/RagConsole"
import { Scoreboard } from "../work/visuals/Scoreboard"

/** Steps through `count` stages on a timer; holds the last with reduced motion. */
function useCycle(count: number, ms: number) {
  const allowed = useMotionAllowed()
  const [i, setI] = useState(count - 1)
  useEffect(() => {
    if (!allowed) return setI(count - 1)
    setI(0)
    const id = window.setInterval(() => setI((v) => (v + 1) % count), ms)
    return () => window.clearInterval(id)
  }, [allowed, count, ms])
  return i
}

/** The project's interface, playing on its own. */
export function ProjectDemo({ kind }: { kind: ProjectVisual }) {
  switch (kind) {
    case "scoreboard":
      return <Scoreboard />
    case "epaper":
      return <Epaper />
    case "cms":
      return <Cms />
    case "pipeline":
      return <PipelineDemo />
    case "rag":
      return <RagConsole />
    case "cloud":
      return <Cloud />
  }
}

function Epaper() {
  const stage = useCycle(EPAPER_STAGES.length, 2600)
  return (
    <div className="h-full bg-paper p-6">
      <EpaperPage stage={stage} />
    </div>
  )
}

function Cms() {
  return <CmsBoard stage={useCycle(CMS_STAGES.length, 2200)} />
}

function PipelineDemo() {
  const desktop = useIsDesktop()
  const level = useCycle(PIPELINE_LEVELS.length, 2400)
  return (
    <div className="flex h-full flex-col bg-ink p-4 lg:p-8">
      <p className="label text-mute">
        Level {level + 1} · {PIPELINE_LEVELS[level]}
      </p>
      <div className="min-h-0 flex-1">
        <Pipeline level={level} vertical={!desktop} />
      </div>
      <Filmstrip cut={level >= 4} />
    </div>
  )
}

function Cloud() {
  const desktop = useIsDesktop()
  const full = useMotionValue(1)
  return (
    <div className="h-full bg-ink p-4 lg:p-8">
      <CloudMap progress={full} wide={desktop} />
    </div>
  )
}
