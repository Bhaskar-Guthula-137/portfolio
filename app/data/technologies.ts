// The tools shown in "The Tools" and the nodes of the "How it works" lab.
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
    project: { title: "Rush Cut", slug: "rush-cut" },
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
]

export type LabNode = {
  id: string
  label: string
  tech: string[]
  role: string
  project: { title: string; slug: string }
  /** Position on the desktop diagram, in percent of the canvas. */
  x: number
  y: number
}

export const labNodes: LabNode[] = [
  {
    id: "client",
    label: "Client",
    tech: ["Browsers", "WebSockets", "Edge cache"],
    role: "Where every request starts and every update lands.",
    project: { title: "Live Cricket", slug: "live-cricket" },
    x: 6,
    y: 50,
  },
  {
    id: "frontend",
    label: "Frontend",
    tech: ["React", "TypeScript", "Remix", "Zustand", "Tailwind CSS"],
    role: "Renders state and turns intent into requests.",
    project: { title: "Epaper Builder", slug: "epaper-builder" },
    x: 22,
    y: 26,
  },
  {
    id: "api",
    label: "API",
    tech: ["FastAPI", "GraphQL", "REST", "Hono"],
    role: "The contract: validation, auth, routing.",
    project: { title: "ShortNews CMS", slug: "shortnews-cms" },
    x: 40,
    y: 50,
  },
  {
    id: "workers",
    label: "Workers",
    tech: ["Cloudflare Workers", "Durable Objects", "Celery"],
    role: "Stateful edge compute and background execution.",
    project: { title: "Live Cricket", slug: "live-cricket" },
    x: 56,
    y: 22,
  },
  {
    id: "database",
    label: "Database",
    tech: ["MongoDB", "PostgreSQL", "KV", "R2"],
    role: "The system of record, consistent where it matters.",
    project: { title: "ShortNews CMS", slug: "shortnews-cms" },
    x: 58,
    y: 78,
  },
  {
    id: "queue",
    label: "Queue",
    tech: ["Redis", "Celery", "Pub/Sub", "Queues"],
    role: "Decouples fast requests from slow work.",
    project: { title: "Rush Cut", slug: "rush-cut" },
    x: 74,
    y: 50,
  },
  {
    id: "ai",
    label: "AI",
    tech: ["OpenAI", "Claude", "Gemini", "LangChain", "RAG"],
    role: "Models as components: planning, generation, retrieval.",
    project: { title: "AI Content Assistant", slug: "ai-content-assistant" },
    x: 90,
    y: 24,
  },
  {
    id: "cloud",
    label: "Cloud",
    tech: ["Cloud Run", "Docker", "CI/CD", "Cloudflare"],
    role: "Where code runs: edge for latency, containers for weight.",
    project: { title: "Cloud Systems", slug: "cloud-systems" },
    x: 90,
    y: 78,
  },
]

export const labEdges: Array<[string, string]> = [
  ["client", "frontend"],
  ["client", "api"],
  ["frontend", "api"],
  ["api", "workers"],
  ["api", "database"],
  ["workers", "database"],
  ["api", "queue"],
  ["workers", "queue"],
  ["queue", "ai"],
  ["queue", "cloud"],
  ["ai", "cloud"],
  ["database", "cloud"],
]
