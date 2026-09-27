import { CaseStudy } from "~/components/case/CaseStudy"
import { getNextProject, getProject } from "~/data/projects"
import { siteConfig } from "~/data/site-config"
import { buildMeta } from "~/lib/seo"
import type { Route } from "./+types/work.$slug"
import NotFound from "./$"

export function meta({ params }: Route.MetaArgs) {
  const project = getProject(params.slug)
  if (!project) return [{ title: `Not found — ${siteConfig.name}` }]
  return buildMeta({
    title: `${project.title} — ${project.category} | ${siteConfig.name}`,
    description: project.description,
    path: `/work/${project.slug}`,
    type: "article",
  })
}

export default function WorkPage({ params }: Route.ComponentProps) {
  const project = getProject(params.slug)
  if (!project) return <NotFound />
  return <CaseStudy key={project.slug} project={project} next={getNextProject(project.slug)} />
}
