// Case-study copy describes the shape of each system. Swap in your own
// numbers, screenshots, and specifics — nothing here quotes real metrics.

export type ProjectVisual = "scoreboard" | "epaper" | "cms" | "pipeline" | "rag" | "cloud"

export type Challenge = { title: string; body: string }

export type Project = {
  slug: string
  index: string
  title: string
  category: string
  /** Short status label shown on the work index. */
  tag: string
  tech: string[]
  description: string
  highlight: string
  visual: ProjectVisual
  overview: string
  problem: string
  approach: string
  architecture: {
    summary: string
    flow: string[]
  }
  implementation: string[]
  challenges: Challenge[]
  result: string
  code: { file: string; language: string; source: string }
}

export const projects: Project[] = [
  {
    slug: "live-cricket",
    index: "01",
    title: "Live Cricket",
    category: "Real-Time Web Application",
    tag: "REAL-TIME",
    tech: ["React", "Remix", "Cloudflare Workers", "WebSockets", "Durable Objects", "Zustand"],
    description: "A real-time cricket experience built for live scores and continuously updating match information.",
    highlight: "Real-time state synchronization",
    visual: "scoreboard",
    overview:
      "A live match experience that pushes every ball, wicket, and score change to connected fans the moment it is recorded — no refresh, no polling.",
    problem:
      "Polling-based score pages feel late during the moments that matter most. Traffic arrives in bursts around big events, and every client needs to agree on the same match state at the same time.",
    approach:
      "Treat each match as a single ordered stream of ball events. Keep one authoritative owner per match at the edge, push small diffs instead of full pages, and let the client apply them to a store that only re-renders what changed.",
    architecture: {
      summary:
        "Each match is owned by a single Durable Object. Scorers write ball events to it; it validates, applies them to the canonical match state, and fans the resulting diff out over WebSockets to every connected viewer.",
      flow: [
        "Scorer console",
        "Worker router",
        "Match Durable Object",
        "WebSocket fan-out",
        "Zustand store",
        "Scoreboard UI",
      ],
    },
    implementation: [
      "Remix renders the first paint on the edge with the current match snapshot, so the page is useful before the socket connects.",
      "The client subscribes to a per-match WebSocket hosted by the Durable Object, using the hibernation API so idle connections cost nothing.",
      "Incoming events are applied as small patches to a Zustand store; components subscribe to narrow slices so a single ball only re-renders what changed.",
    ],
    challenges: [
      {
        title: "One source of truth",
        body: "Routing every write for a match through one Durable Object gives a single serialised timeline, which removes race conditions between scorers without distributed locks.",
      },
      {
        title: "Reconnects without gaps",
        body: "Events carry a sequence number. A reconnecting client sends the last one it saw and receives only the missed events, or a fresh snapshot if it fell too far behind.",
      },
      {
        title: "Burst traffic",
        body: "Big moments bring sudden spikes of viewers. Snapshots are cached at the edge, and sockets only carry deltas, keeping per-event payloads tiny.",
      },
    ],
    result:
      "Fans see the same ball at the same moment on every device, and the system scales per match rather than per server.",
    code: {
      file: "match-room.ts",
      language: "ts",
      source: `export class MatchRoom extends DurableObject {
  async applyBall(event: BallEvent) {
    const state = await this.state()
    const next = reduceBall(state, event)
    await this.ctx.storage.put("match", next)

    const patch = { seq: next.seq, ball: event, score: next.score }
    for (const socket of this.ctx.getWebSockets()) {
      socket.send(JSON.stringify(patch))
    }
  }
}`,
    },
  },
  {
    slug: "epaper-builder",
    index: "02",
    title: "Epaper Builder",
    category: "Publishing Platform",
    tag: "PUBLISHING",
    tech: ["React", "TypeScript", "BlockNote", "Cloudflare"],
    description: "A visual newspaper builder for creating structured digital editions and publication layouts.",
    highlight: "Print layouts, built like software",
    visual: "epaper",
    overview:
      "A layout tool that lets an editorial team compose a newspaper page from structured blocks and publish it as both a print-ready PDF and an interactive digital edition.",
    problem:
      "Traditional page layout lives in desktop publishing tools that don't talk to the newsroom's content. Every edition meant re-keying stories and hand-exporting pages.",
    approach:
      "Model a newspaper page as data — a column grid of typed blocks that reference stories — so the same page can be edited like a document, rendered as a web edition, and archived without losing structure.",
    architecture: {
      summary:
        "Pages are stored as a grid of typed blocks referencing stories from the CMS. The same document renders to an interactive web edition and, through a PDF pipeline, to print.",
      flow: ["Story library", "Block editor", "Page grid model", "Web edition", "PDF renderer", "R2 archive"],
    },
    implementation: [
      "BlockNote powers rich story editing inside each block, extended with custom blocks for headlines, bylines, pull quotes, and image slots.",
      "The page itself is a column grid; blocks snap to column spans and rows, which keeps layouts consistent across editions.",
      "Finished editions render to PDF and are stored in Cloudflare R2 alongside the page model, so any edition can be reopened and edited.",
    ],
    challenges: [
      {
        title: "Text that fits",
        body: "Stories rarely fit their slot. The editor measures overflow live and flags blocks that need trimming or a continuation jump.",
      },
      {
        title: "One model, two outputs",
        body: "The web edition and the print PDF are generated from the same page model, so a correction made once appears in both.",
      },
    ],
    result:
      "Editions are assembled from live newsroom content instead of copied into a separate tool, and every page is archived in an editable form.",
    code: {
      file: "page-model.ts",
      language: "ts",
      source: `type Block =
  | { kind: "headline"; storyId: string; span: Span }
  | { kind: "story"; storyId: string; span: Span; jumpTo?: PageRef }
  | { kind: "image"; assetKey: string; span: Span; caption?: string }

type Page = { edition: string; number: number; columns: 6; blocks: Block[] }`,
    },
  },
  {
    slug: "shortnews-cms",
    index: "03",
    title: "ShortNews CMS",
    category: "Content Management Platform",
    tag: "WORKFLOW",
    tech: ["React", "Ant Design", "Redux Toolkit", "FastAPI", "MongoDB", "GraphQL", "OpenAI"],
    description:
      "A CMS supporting reporter workflows, task assignment, scheduling, publishing, and AI-assisted content generation.",
    highlight: "Newsroom workflow + AI assistance",
    visual: "cms",
    overview:
      "The operational core of a short-news newsroom: assignments go out to reporters, stories move through review, and approved pieces are scheduled and published — with AI helping at the writing and summarising steps.",
    problem:
      "Assignments, drafts, and approvals were spread across chat threads and spreadsheets. Editors couldn't see where a story was, and summarising long reports into short-news format was slow manual work.",
    approach:
      "Make the story a state machine with an owner at every step. Put AI at the slowest step — condensing long copy — and keep it as a draft that an editor explicitly accepts.",
    architecture: {
      summary:
        "A React admin talks to a FastAPI service over GraphQL. MongoDB stores stories and their workflow history; an AI service handles summarisation and rewriting on request.",
      flow: ["Editor assigns", "Reporter drafts", "AI summarise", "Desk review", "Schedule", "Publish"],
    },
    implementation: [
      "Ant Design and Redux Toolkit give the admin dense, keyboard-friendly tables for queues, assignments, and review.",
      "Each story is a state machine — assigned, drafting, in review, scheduled, published — with every transition recorded for accountability.",
      "OpenAI-backed endpoints turn long copy into short-news summaries and headline options; editors always accept or edit before anything ships.",
    ],
    challenges: [
      {
        title: "AI as a draft, never the final word",
        body: "Generated text is stored separately from the story and only merged on explicit editor action, so there's always a human decision in the record.",
      },
      {
        title: "Scheduling across time zones",
        body: "Publish times are stored in UTC and rendered in the editor's zone, with a queue that releases stories exactly on schedule.",
      },
    ],
    result:
      "Every story has a visible status and owner, and the slowest editorial step — condensing reports — became a review task instead of a writing task.",
    code: {
      file: "workflow.py",
      language: "python",
      source: `TRANSITIONS = {
    "assigned": {"drafting"},
    "drafting": {"in_review"},
    "in_review": {"drafting", "scheduled"},
    "scheduled": {"published", "in_review"},
}

async def move(story: Story, to: str, actor: User) -> Story:
    if to not in TRANSITIONS[story.status]:
        raise InvalidTransition(story.status, to)
    story.history.append(Event(actor=actor.id, frm=story.status, to=to))
    story.status = to
    return await stories.save(story)`,
    },
  },
  {
    slug: "rush-cut",
    index: "04",
    title: "Rush Cut",
    category: "AI Video Automation",
    tag: "AI PIPELINE",
    tech: ["FastAPI", "Claude", "ElevenLabs", "FFmpeg", "Celery", "Redis", "Docker"],
    description:
      "An automated video editing workflow combining transcription, AI planning, media processing, and asynchronous background jobs.",
    highlight: "From raw footage to a cut, automatically",
    visual: "pipeline",
    overview:
      "Upload raw footage and get back an edited video. Rush Cut transcribes the footage, asks a language model to plan the edit, and renders the result with FFmpeg — all as background jobs.",
    problem:
      "Turning long raw recordings into short, watchable edits is repetitive and slow. Most of the decisions — trim silences, keep the strongest takes, add voice-over — follow patterns a model can plan.",
    approach:
      "Split the problem into stages that can fail and retry independently. The model plans, deterministic code executes: a language model writes a structured edit plan and FFmpeg carries it out.",
    architecture: {
      summary:
        "FastAPI accepts uploads and creates a job. Celery workers backed by Redis run each stage in sequence; the plan is a structured edit decision list that FFmpeg executes deterministically.",
      flow: ["Video", "Transcription", "AI planning", "Edit decisions", "FFmpeg", "Final video"],
    },
    implementation: [
      "Transcripts are word-level timestamped, which gives the planner exact cut points instead of approximate ones.",
      "Claude receives the transcript and returns an edit decision list in a strict schema — segments to keep, their order, and optional narration lines.",
      "ElevenLabs generates narration for those lines; FFmpeg assembles segments, audio, and transitions in a single render pass inside Docker.",
    ],
    challenges: [
      {
        title: "Models plan, code executes",
        body: "The model never touches media. It produces a validated JSON plan, and a deterministic renderer executes it — so a bad plan fails validation instead of producing a broken video.",
      },
      {
        title: "Long-running jobs",
        body: "Each stage is its own Celery task with retries and progress reporting, so a failed render can resume without re-transcribing.",
      },
    ],
    result:
      "Editing becomes review: the system produces a first cut and a readable plan explaining it, and a person refines rather than starts from zero.",
    code: {
      file: "plan.py",
      language: "python",
      source: `class Segment(BaseModel):
    start: float
    end: float
    reason: str

class EditPlan(BaseModel):
    segments: list[Segment]
    narration: list[NarrationLine] = []

@celery.task(bind=True, max_retries=3)
def plan_edit(self, job_id: str):
    transcript = load_transcript(job_id)
    plan = EditPlan.model_validate_json(ask_claude(transcript))
    save_plan(job_id, plan)
    render.delay(job_id)`,
    },
  },
  {
    slug: "ai-content-assistant",
    index: "05",
    title: "AI Content Assistant",
    category: "RAG / Generative AI",
    tag: "RAG",
    tech: ["LangChain", "OpenAI", "Gemini", "RAG"],
    description:
      "An AI assistant designed to help content teams retrieve knowledge, generate content, translate information, and accelerate editorial workflows.",
    highlight: "Answers grounded in the archive",
    visual: "rag",
    overview:
      "An assistant for editorial teams that can draft, rewrite, translate, and answer questions — grounded in the organisation's own published archive rather than the model's memory.",
    problem:
      "General chatbots don't know a newsroom's style, history, or past coverage, and they invent details. Editors needed answers they could trace back to real articles.",
    approach:
      "Ground every answer in the organisation's own archive. Retrieval does the heavy lifting; the model composes an answer from the retrieved passages and shows where each claim came from.",
    architecture: {
      summary:
        "Articles are chunked and embedded into a vector index. Each query retrieves the most relevant passages, which are passed to the model as context with instructions to cite them.",
      flow: ["Query", "Retrieval", "Context", "LLM", "Response"],
    },
    implementation: [
      "LangChain orchestrates retrieval, prompt assembly, and model calls, with OpenAI and Gemini behind a common interface.",
      "Every response lists the source passages it used, so editors can check claims in one click.",
      "Task-specific prompts cover rewriting for length, changing tone, and translating between languages while keeping names and facts intact.",
    ],
    challenges: [
      {
        title: "Retrieval quality over model size",
        body: "Most wrong answers came from retrieving the wrong passages. Better chunking and metadata filters (date, section) improved answers more than switching models.",
      },
      {
        title: "Saying “I don't know”",
        body: "When retrieval returns nothing relevant, the assistant says so instead of answering from general knowledge.",
      },
    ],
    result:
      "Content teams get drafts and answers they can verify, with sources attached, in the tone their publication already uses.",
    code: {
      file: "answer.py",
      language: "python",
      source: `def answer(query: str) -> Answer:
    passages = index.similarity_search(query, k=6, filter=recent())
    if not passages:
        return Answer.unknown(query)

    context = "\\n\\n".join(p.page_content for p in passages)
    reply = llm.invoke(PROMPT.format(context=context, question=query))
    return Answer(text=reply.content, sources=[p.metadata for p in passages])`,
    },
  },
  {
    slug: "cloud-systems",
    index: "06",
    title: "Cloud Systems",
    category: "Infrastructure / Distributed Systems",
    tag: "INFRASTRUCTURE",
    tech: ["Cloudflare Workers", "Durable Objects", "KV", "R2", "Cloud Run", "Pub/Sub", "Docker", "CI/CD"],
    description:
      "The infrastructure layer underneath the products: edge compute, real-time coordination, object storage, queues, and containerised services across Cloudflare and Google Cloud.",
    highlight: "Edge where it's fast, containers where it's heavy",
    visual: "cloud",
    overview:
      "A body of infrastructure work spanning two clouds: latency-sensitive work runs at the edge on Cloudflare, while heavy processing runs in containers on Google Cloud Run.",
    problem:
      "Products need fast global reads, real-time coordination, and heavy background processing — no single platform is best at all three.",
    approach:
      "Put latency-sensitive work at the edge and heavy work in containers, connect the two with queues, and ship both from one pipeline.",
    architecture: {
      summary:
        "Workers handle requests at the edge, with KV for fast config reads, R2 for media, and Durable Objects for real-time rooms. Work that needs long CPU time is handed to Cloud Run services through Queues and Pub/Sub.",
      flow: ["Request", "Workers", "KV / R2 / DO", "Queues", "Pub/Sub", "Cloud Run"],
    },
    implementation: [
      "Stateless edge Workers serve reads and route writes; Durable Objects own any state that needs strong consistency.",
      "Queues decouple user-facing requests from slow work, so a request returns immediately and processing happens in the background.",
      "Services are built as Docker images and deployed through GitHub Actions to Cloud Run, with the same pipeline deploying Workers via Wrangler.",
    ],
    challenges: [
      {
        title: "Choosing where code runs",
        body: "The rule of thumb: if it must be fast and close to the user, it goes to the edge; if it needs big memory, native binaries, or minutes of CPU, it goes to a container.",
      },
      {
        title: "One pipeline for two clouds",
        body: "A single CI workflow builds, tests, and deploys both targets, so a release is one reviewed change rather than two manual steps.",
      },
    ],
    result:
      "Products get edge latency for users and container flexibility for heavy jobs, deployed through one repeatable pipeline.",
    code: {
      file: "worker.ts",
      language: "ts",
      source: `export default {
  async fetch(req, env) {
    const job = await req.json<RenderJob>()
    await env.RENDER_QUEUE.send(job)
    return Response.json({ id: job.id, status: "queued" }, { status: 202 })
  },
  async queue(batch, env) {
    for (const msg of batch.messages) {
      await publishToPubSub(env, "render-jobs", msg.body)
      msg.ack()
    }
  },
} satisfies ExportedHandler<Env, RenderJob>`,
    },
  },
]

export function getProject(slug: string | undefined) {
  return projects.find((project) => project.slug === slug)
}

export function getNextProject(slug: string) {
  const i = projects.findIndex((project) => project.slug === slug)
  return projects[(i + 1) % projects.length]
}
