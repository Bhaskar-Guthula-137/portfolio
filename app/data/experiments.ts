// Smaller builds and prototypes shown in "Lab / Experiments".
export type ExperimentForm = "terminal" | "window" | "sketch" | "diagram" | "browser"

export type Experiment = {
  title: string
  kind: string
  description: string
  stack: string[]
  form: ExperimentForm
  /** Lines rendered inside the preview (terminal output, sketch labels…). */
  lines: string[]
}

export const experiments: Experiment[] = [
  {
    title: "Tool-using agent loop",
    kind: "Agent systems",
    description: "A minimal agent with typed tools, step budgets, and replayable run logs.",
    stack: ["Claude", "TypeScript"],
    form: "terminal",
    lines: ["$ agent run --budget 12", "→ tool: search_repo", "→ tool: read_file", "✓ done in 7 steps"],
  },
  {
    title: "Edge presence rooms",
    kind: "Cloudflare",
    description: "Live cursors and presence with a Durable Object per room and hibernating sockets.",
    stack: ["Workers", "Durable Objects"],
    form: "diagram",
    lines: ["room:a1", "room:b7", "room:c3"],
  },
  {
    title: "Archive Q&A",
    kind: "AI experiment",
    description: "Question answering over a news archive with date filters and cited sources.",
    stack: ["LangChain", "Embeddings"],
    form: "window",
    lines: ["What changed in the 2024 budget?", "3 sources · filtered by date"],
  },
  {
    title: "Queue → Cloud Run bridge",
    kind: "GCP",
    description: "Forwarding edge queue messages to Pub/Sub for container workers.",
    stack: ["Queues", "Pub/Sub", "Cloud Run"],
    form: "sketch",
    lines: ["queue", "pub/sub", "run"],
  },
  {
    title: "Schema-first CLI",
    kind: "Developer tools",
    description: "Generates typed API clients and validators from a single schema file.",
    stack: ["TypeScript", "Zod"],
    form: "terminal",
    lines: ["$ schema gen ./api.yaml", "✓ client.ts", "✓ validators.ts", "✓ 14 routes typed"],
  },
  {
    title: "Kinetic type grid",
    kind: "UI experiment",
    description: "Scroll-linked typography on a variable-font grid, reduced-motion aware.",
    stack: ["Framer Motion", "CSS"],
    form: "browser",
    lines: ["MOVE", "TYPE", "GRID"],
  },
]

// "Currently exploring" — status rows.
export const exploring = [
  { status: "Exploring", topic: "AI Agents" },
  { status: "Building", topic: "RAG Systems" },
  { status: "Building", topic: "Cloud-Native Applications" },
  { status: "Tinkering", topic: "Developer Tools" },
  { status: "Writing", topic: "Agentic Workflows" },
  { status: "Shipping", topic: "Real-Time Systems" },
] as const
