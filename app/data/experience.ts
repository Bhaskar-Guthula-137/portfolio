// The experience timeline: one role, told as the capabilities it spans.
export const role = {
  title: "Software Engineer",
  company: "Aadhan Media",
  location: "Hyderabad",
  years: "3.5+ years",
  summary:
    "Product engineering across a digital news platform — from the tools reporters use every day to the real-time and AI systems readers never see.",
}

export type Capability = { title: string; body: string; tags: string[] }

export const capabilities: Capability[] = [
  {
    title: "Product Engineering",
    body: "Turning editorial problems into shipped software, from first sketch to production.",
    tags: ["Discovery", "Prototyping", "Shipping"],
  },
  {
    title: "Frontend Architecture",
    body: "Dense, keyboard-friendly React applications with clear state boundaries.",
    tags: ["React", "TypeScript", "Redux Toolkit", "Zustand"],
  },
  {
    title: "Backend Systems",
    body: "APIs and data models that encode how stories move from pitch to published.",
    tags: ["FastAPI", "GraphQL", "MongoDB", "Node.js"],
  },
  {
    title: "Cloud Infrastructure",
    body: "Edge compute on Cloudflare and containers on Google Cloud, shipped from one pipeline.",
    tags: ["Workers", "R2", "Cloud Run", "Docker"],
  },
  {
    title: "AI Applications",
    body: "Summarisation, retrieval, and automated video workflows — always with an editor in the loop.",
    tags: ["OpenAI", "Claude", "Gemini", "LangChain"],
  },
  {
    title: "Real-Time Systems",
    body: "Live experiences over WebSockets, with Durable Objects as the single source of truth.",
    tags: ["WebSockets", "Durable Objects", "Zustand"],
  },
]
