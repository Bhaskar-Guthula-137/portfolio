import type { Project } from "~/data/projects"
import { ProjectMeta } from "./shared"
import { RagConsole } from "./visuals/RagConsole"
import { SplitText } from "~/components/ui/SplitText"

/** 05 — a still, hands-on moment: try the assistant. */
export function ContentAssistant({ project }: { project: Project }) {
  return (
    <section aria-label={project.title} className="gutter relative bg-paper py-24 text-ink lg:py-36">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
        <div className="flex flex-col">
          <span className="label opacity-60">{project.index} / 06</span>
          <h3 className="display mt-2 text-[16vw] lg:text-[7.6vw]">
            <SplitText text="AI Content" by="words" className="block" />
            <SplitText text="Assistant" by="words" delay={0.1} className="block" />
          </h3>
          <ProjectMeta project={project} tone="dark" className="mt-8" />
          <p className="label mt-auto hidden max-w-xs pt-10 text-ink/50 lg:block">
            Pick a query. The interface shows the system's stages, not a model's private reasoning.
          </p>
        </div>
        <div className="min-h-[560px] lg:mt-16">
          <RagConsole />
        </div>
      </div>
    </section>
  )
}
