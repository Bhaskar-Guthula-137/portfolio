import type { Project } from "~/data/projects"
import { ProjectMeta } from "./shared"
import { RagConsole } from "./visuals/RagConsole"
import { SplitText } from "~/components/ui/SplitText"

/** 05 — a still, hands-on moment: try the assistant. */
export function ContentAssistant({ project, panel }: { project: Project; panel?: boolean }) {
  return (
    <section
      aria-label={project.title}
      className={
        panel
          ? "gutter relative flex h-full items-center bg-paper pt-16 pb-14 text-ink lg:pt-20"
          : "gutter relative bg-paper py-24 text-ink lg:py-36"
      }
    >
      <div
        className={
          panel
            ? "grid h-full w-full gap-5 lg:grid-cols-[1fr_1.35fr] lg:gap-16"
            : "grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-16"
        }
      >
        <div className="flex flex-col">
          <span className="label opacity-60">{project.index} / 06</span>
          <h3
            className={panel ? "display mt-2 text-[12vw] lg:text-[6.4vw]" : "display mt-2 text-[16vw] lg:text-[7.6vw]"}
          >
            <SplitText text="AI Content" by="words" className="block" />
            <SplitText text="Assistant" by="words" delay={0.1} className="block" />
          </h3>
          <ProjectMeta project={project} tone="dark" className={panel ? "mt-6 hidden lg:block" : "mt-8"} />
          <p className="label mt-auto hidden max-w-xs pt-10 text-ink/50 lg:block">
            Pick a query. The interface shows the system's stages, not a model's private reasoning.
          </p>
        </div>
        <div className={panel ? "min-h-0 lg:my-10" : "min-h-[560px] lg:mt-16"}>
          <RagConsole />
        </div>
      </div>
    </section>
  )
}
