import { motion, type MotionValue, useAnimationFrame, useMotionValue, useTransform } from "framer-motion"

import { cx, EASE, useMotionAllowed } from "~/lib/motion"

export const PIPELINE_LEVELS = [
  "Input → output",
  "Understand the footage",
  "Plan, then execute",
  "The system behind it",
  "The cut",
]

type Node = { id: string; label: string; sub: string; level: number }
const MAIN: Node[] = [
  { id: "video", label: "Video", sub: "upload", level: 0 },
  { id: "transcribe", label: "Transcription", sub: "word timestamps", level: 1 },
  { id: "plan", label: "AI plan", sub: "Claude · JSON", level: 1 },
  { id: "edit", label: "Edit", sub: "decision list", level: 2 },
  { id: "ffmpeg", label: "FFmpeg", sub: "render", level: 2 },
  { id: "output", label: "Output", sub: "final.mp4", level: 0 },
]
const INFRA = [
  { id: "api", label: "FastAPI", sub: "jobs", main: 40, cross: 1 },
  { id: "queue", label: "Queue", sub: "redis", main: 290, cross: 1 },
  { id: "w1", label: "Worker", sub: "transcription", main: 560, cross: 0.8, to: "transcribe" },
  { id: "w2", label: "Worker", sub: "AI", main: 700, cross: 1.1, to: "plan" },
  { id: "w3", label: "Worker", sub: "media processing", main: 840, cross: 1.4, to: "ffmpeg" },
]

/**
 * Rush Cut's pipeline. Each level adds structure: first the stages, then the
 * queue and workers that run them. A packet travels the main line.
 */
export function Pipeline({ level, vertical }: { level: number; vertical: boolean }) {
  const allowed = useMotionAllowed()
  const visible = MAIN.filter((n) => n.level <= level)
  const mainOf = (id: string) => {
    const i = visible.findIndex((n) => n.id === id)
    return i < 0 ? 0 : (i / (visible.length - 1)) * 1000
  }
  const pos = (main: number, cross: number) =>
    vertical ? { x: 110 + cross * 260, y: 50 + main * 0.95 } : { x: 100 + main, y: 150 + cross * 250 }
  const box = vertical ? "0 0 600 1060" : "0 0 1200 560"
  const infra = level >= 3

  // Packet position along the main line, 0 → 1, looping.
  const t = useMotionValue(0.35)
  useAnimationFrame((time) => {
    if (allowed) t.set(((time / 3600) % 1.15) / 1.15)
  })
  const a = pos(0, 0)
  const b = pos(1000, 0)
  const px = useTransform(t, (v) => a.x + (b.x - a.x) * v)
  const py = useTransform(t, (v) => a.y + (b.y - a.y) * v)

  return (
    <svg
      viewBox={box}
      className="h-full w-full"
      role="img"
      aria-label="Rush Cut pipeline: video, transcription, AI plan, edit, FFmpeg, output, run by a queue and background workers."
    >
      {/* Main line */}
      <motion.line
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke="rgb(246 244 238 / 0.3)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: EASE }}
      />
      <line
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        strokeDasharray="3 14"
        className={allowed ? "animate-flow" : undefined}
        opacity={0.6}
      />

      {/* Infrastructure layer */}
      <motion.g initial={false} animate={{ opacity: infra ? 1 : 0 }} transition={{ duration: 0.8 }}>
        {INFRA.slice(1).map((n, i) => {
          const from = i === 0 ? pos(INFRA[0].main, INFRA[0].cross) : pos(INFRA[1].main, INFRA[1].cross)
          const to = pos(n.main, n.cross)
          return <Edge key={n.id} from={from} to={to} show={infra} delay={0.1 + i * 0.12} />
        })}
        {INFRA.filter((n) => n.to).map((n, i) => (
          <Edge
            key={`${n.id}-up`}
            from={pos(n.main, n.cross)}
            to={pos(mainOf(n.to!), 0)}
            show={infra}
            delay={0.5 + i * 0.12}
            dashed
          />
        ))}
        {INFRA.map((n) => {
          const p = pos(n.main, n.cross)
          return (
            <g key={n.id} transform={`translate(${p.x} ${p.y})`}>
              <rect
                x="-7"
                y="-7"
                width="14"
                height="14"
                fill="var(--color-ink)"
                stroke="var(--color-warm)"
                strokeOpacity="0.6"
              />
              <text
                x={vertical ? 16 : 0}
                y={vertical ? 5 : 30}
                textAnchor={vertical ? "start" : "middle"}
                className="fill-warm font-mono text-[15px] tracking-[0.12em] uppercase"
              >
                {n.label}
              </text>
              <text
                x={vertical ? 16 : 0}
                y={vertical ? 23 : 48}
                textAnchor={vertical ? "start" : "middle"}
                className="fill-mute font-mono text-[13px]"
              >
                {n.sub}
              </text>
            </g>
          )
        })}
      </motion.g>

      {/* Stages */}
      {MAIN.map((n) => {
        const shown = n.level <= level
        const p = pos(shown ? mainOf(n.id) : mainOf(n.id === "transcribe" || n.id === "plan" ? "video" : "output"), 0)
        return (
          <StageNode
            key={n.id}
            node={n}
            x={p.x}
            y={p.y}
            shown={shown}
            vertical={vertical}
            t={t}
            main={shown ? mainOf(n.id) : -999}
          />
        )
      })}

      {/* Packet */}
      {allowed && (
        <motion.g style={{ x: px, y: py }}>
          <rect x="-6" y="-6" width="12" height="12" fill="var(--color-accent)" />
          <rect x="-12" y="-12" width="24" height="24" fill="none" stroke="var(--color-accent)" strokeOpacity="0.4" />
        </motion.g>
      )}
    </svg>
  )
}

function Edge({
  from,
  to,
  show,
  delay,
  dashed,
}: {
  from: { x: number; y: number }
  to: { x: number; y: number }
  show: boolean
  delay: number
  dashed?: boolean
}) {
  return (
    <motion.path
      d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
      fill="none"
      stroke={dashed ? "var(--color-accent)" : "rgb(246 244 238 / 0.35)"}
      strokeOpacity={dashed ? 0.55 : 1}
      strokeDasharray={dashed ? "4 6" : undefined}
      initial={false}
      animate={{ pathLength: show ? 1 : 0 }}
      transition={{ duration: 0.8, ease: EASE, delay: show ? delay : 0 }}
    />
  )
}

function StageNode({
  node,
  x,
  y,
  shown,
  vertical,
  t,
  main,
}: {
  node: Node
  x: number
  y: number
  shown: boolean
  vertical: boolean
  t: MotionValue<number>
  main: number
}) {
  const hot = useTransform(t, (v): number => (Math.abs(v * 1000 - main) < 45 ? 1 : 0))
  const ring = useTransform(hot, [0, 1], [1, 1.9])
  const fill = useTransform(hot, (h) => (h ? "var(--color-accent)" : "var(--color-ink)"))
  return (
    <motion.g initial={false} animate={{ x, y, opacity: shown ? 1 : 0 }} transition={{ duration: 0.9, ease: EASE }}>
      <motion.circle r="16" fill="none" stroke="rgb(200 242 61 / 0.5)" style={{ scale: ring, opacity: hot }} />
      <motion.circle r="9" stroke="var(--color-warm)" strokeWidth="1.5" style={{ fill }} />
      <text
        x={vertical ? 26 : 0}
        y={vertical ? 0 : -34}
        textAnchor={vertical ? "start" : "middle"}
        className={cx(
          "fill-warm font-display font-bold tracking-[-0.03em] uppercase",
          vertical ? "text-[26px]" : "text-[22px]",
        )}
      >
        {node.label}
      </text>
      <text
        x={vertical ? 26 : 0}
        y={vertical ? 22 : -58}
        textAnchor={vertical ? "start" : "middle"}
        className="fill-mute font-mono text-[13px]"
      >
        {node.sub}
      </text>
    </motion.g>
  )
}

// Which timeline segments the plan keeps.
const SEGMENTS = [1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1]

/** The raw footage as a strip of segments; at the final level, the plan's cuts close up. */
export function Filmstrip({ cut }: { cut: boolean }) {
  const kept = SEGMENTS.filter(Boolean).length
  return (
    <div>
      <div className="label mb-2 flex justify-between text-[0.6rem] text-mute">
        <span>Timeline · raw footage</span>
        <span className={cut ? "text-accent" : undefined}>
          {cut ? `Edit plan · kept ${kept} of ${SEGMENTS.length} segments` : `${SEGMENTS.length} segments`}
        </span>
      </div>
      <div className="flex h-10 gap-[3px] lg:h-12">
        {SEGMENTS.map((keep, i) => (
          <motion.span
            key={i}
            className={cx(
              "relative overflow-hidden border",
              keep ? "border-warm/25 bg-warm/10" : "border-warm/15 bg-warm/5",
            )}
            initial={false}
            animate={{
              flexGrow: cut && !keep ? 0.0001 : 1,
              opacity: cut && !keep ? 0 : 1,
              borderColor: cut && keep ? "rgb(200 242 61 / 0.6)" : undefined,
            }}
            transition={{ duration: 0.8, ease: EASE, delay: i * 0.03 }}
            style={{ flexBasis: 0 }}
          >
            <span className="absolute inset-y-2 left-1.5 w-px bg-warm/20" />
            <span className="absolute top-1 right-1.5 font-mono text-[0.5rem] text-mute">
              {String(i + 1).padStart(2, "0")}
            </span>
          </motion.span>
        ))}
      </div>
    </div>
  )
}
