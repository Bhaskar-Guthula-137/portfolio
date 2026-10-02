import { CaseStudy } from "~/components/case/CaseStudy"
import { getNextProject, getProject } from "~/data/projects"
import { buildMeta } from "~/lib/seo"
import type { Route } from "./+types/projects.$slug"
import NotFound from "./$"
import { infoData } from "~/data/info"

export function meta({ params }: Route.MetaArgs) {
  const project = getProject(params.slug)
  if (!project) return [{ title: `Not found — ${infoData.name}` }]
  return buildMeta({
    title: `${project.title} — ${project.category} | ${infoData.name}`,
    description: project.description,
    path: `/projects/${project.slug}`,
    type: "article",
  })
}

export default function WorkPage({ params }: Route.ComponentProps) {
  const project = getProject(params.slug)
  if (!project) return <NotFound />
  return <CaseStudy key={project.slug} project={project} next={getNextProject(project.slug)} />
}
