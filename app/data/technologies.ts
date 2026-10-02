// The technologies shown in "Technologies".
// Each entry links back to a project slug in projects.ts.

export type Tool = {
  name: string
  detail: string
  project: { title: string; slug: string }
}

export const tools: Tool[] = [
  {
    name: "React",
    detail: "Component systems · Remix · Zustand · Redux Toolkit",
    project: { title: "Live Cricket", slug: "live-cricket" },
  },
  {
    name: "TypeScript",
    detail: "Typed contracts between every layer",
    project: { title: "Epaper Builder", slug: "epaper-builder" },
  },
  {
    name: "Python",
    detail: "Services · pipelines · automation",
    project: { title: "Video Editing Agent", slug: "video-editing-agent" },
  },
  {
    name: "FastAPI",
    detail: "Async APIs · GraphQL · background jobs",
    project: { title: "ShortNews CMS", slug: "shortnews-cms" },
  },
  {
    name: "Cloudflare",
    detail: "Workers · R2 · KV · Durable Objects",
    project: { title: "Live Cricket", slug: "live-cricket" },
  },
  {
    name: "GCP",
    detail: "Cloud Run · Pub/Sub · containers",
    project: { title: "Cloud Systems", slug: "cloud-systems" },
  },
  {
    name: "OpenAI",
    detail: "Generation · summarisation · embeddings",
    project: { title: "ShortNews CMS", slug: "shortnews-cms" },
  },
  {
    name: "LangChain",
    detail: "Retrieval · prompt assembly · RAG",
    project: { title: "AI Content Assistant", slug: "ai-content-assistant" },
  },
  {
    name: "AI Agents",
    detail: "Deep agents · Evals · Harness · Loop engineering",
    project: { title: "Video Editing Agent", slug: "video-editing-agent" },
  },
]
