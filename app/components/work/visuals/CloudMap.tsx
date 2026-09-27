import { AnimatePresence, motion, type MotionValue, useTransform } from "framer-motion"
import { useState } from "react"

import { cx, EASE } from "~/lib/motion"

type CloudNode = { id: string; label: string; note: string; d: [number, number]; m: [number, number] }

const NODES: CloudNode[] = [
  {
    id: "client",
    label: "Client",
    note: "Browsers and apps; HTTP for reads, WebSockets for live rooms.",
    d: [70, 280],
    m: [200, 40],
  },
  {
    id: "workers",
    label: "Workers",
    note: "Stateless edge compute: serve reads, route writes, enqueue slow work.",
    d: [270, 280],
    m: [200, 150],
  },
  {
    id: "kv",
    label: "KV",
    note: "Globally replicated, read-heavy config and cached snapshots.",
    d: [500, 110],
    m: [66, 270],
  },
  {
    id: "do",
    label: "Durable Objects",
    note: "One object per room or match: ordered, strongly consistent state.",
    d: [500, 280],
    m: [200, 270],
  },
  {
    id: "r2",
    label: "R2",
    note: "Object storage for media, renders, and archived editions.",
    d: [500, 450],
    m: [334, 270],
  },
  {
    id: "queue",
    label: "Queue",
    note: "Decouples the request from the work; absorbs bursts.",
    d: [660, 370],
    m: [200, 390],
  },
  {
    id: "pubsub",
    label: "Pub/Sub",
    note: "Fans events out to container services on Google Cloud.",
    d: [790, 370],
    m: [200, 500],
  },
  {
    id: "run",
    label: "Cloud Run",
    note: "Containers for heavy work: long CPU, native binaries, big memory.",
    d: [930, 250],
    m: [200, 620],
  },
  { id: "docker", label: "Docker", note: "Reproducible images for every service.", d: [930, 470], m: [334, 720] },
  {
    id: "cicd",
    label: "CI/CD",
    note: "One pipeline builds, tests, and deploys both clouds.",
    d: [790, 100],
    m: [66, 720],
  },
]

const EDGES: Array<[string, string, "data" | "deploy"]> = [
  ["client", "workers", "data"],
  ["workers", "kv", "data"],
  ["workers", "do", "data"],
  ["workers", "r2", "data"],
  ["do", "client", "data"],
  ["workers", "queue", "data"],
  ["queue", "pubsub", "data"],
  ["pubsub", "run", "data"],
  ["run", "r2", "data"],
  ["docker", "run", "deploy"],
  ["cicd", "run", "deploy"],
  ["cicd", "workers", "deploy"],
]

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]))

/** Edge + container architecture. Edges connect with scroll; hover or tap a node to inspect it. */
export function CloudMap({ progress, wide }: { progress: MotionValue<number>; wide: boolean }) {
  const [active, setActive] = useState<string | null>(null)
  const key = wide ? "d" : "m"
  const linked = (id: string) =>
    active !== null &&
    (id === active || EDGES.some(([a, b]) => (a === active && b === id) || (b === active && a === id)))
  const node = active ? byId[active] : null

  return (
    <div className="relative h-full w-full">
      <svg
        viewBox={wide ? "0 0 1000 560" : "0 0 400 780"}
        className="h-full w-full overflow-visible"
        aria-label="Cloud architecture diagram"
      >
        {/* Zones */}
        {wide ? (
          <>
            <Zone x={200} y={50} w={410} h={460} label="Edge · Cloudflare" />
            <Zone x={720} y={190} w={280} h={340} label="Google Cloud" />
          </>
        ) : (
          <>
            <Zone x={10} y={110} w={380} h={220} label="Edge · Cloudflare" />
            <Zone x={130} y={460} w={260} h={300} label="Google Cloud" />
          </>
        )}

        {EDGES.map(([a, b, kind], i) => {
          const hot = active !== null && (a === active || b === active)
          return (
            <EdgePath
              key={`${a}-${b}`}
              from={byId[a][key]}
              to={byId[b][key]}
              progress={progress}
              range={[0.08 + i * 0.045, 0.08 + i * 0.045 + 0.08]}
              kind={kind}
              hot={hot}
              dim={active !== null && !hot}
              curved={a === "do" && b === "client"}
            />
          )
        })}

        {NODES.map((n, i) => {
          const [x, y] = n[key]
          const on = active === n.id
          return (
            <NodeMark
              key={n.id}
              x={x}
              y={y}
              label={n.label}
              progress={progress}
              at={0.05 + i * 0.05}
              on={on}
              lit={linked(n.id)}
              dim={active !== null && !linked(n.id)}
              onEnter={() => setActive(n.id)}
              onLeave={() => setActive(null)}
              onToggle={() => setActive((a) => (a === n.id ? null : n.id))}
            />
          )
        })}
      </svg>

      <div
        className="pointer-events-none absolute right-0 bottom-0 left-0 lg:right-auto lg:max-w-xs"
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          {node ? (
            <motion.div
              key={node.id}
              className="border border-accent/50 bg-ink/90 p-4 backdrop-blur"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <p className="label text-accent">{node.label}</p>
              <p className="mt-2 text-sm text-warm/80">{node.note}</p>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              className="label text-mute"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {wide ? "Hover a node to inspect it" : "Tap a node to inspect it"}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Zone({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: string }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="rgb(246 244 238 / 0.015)"
        stroke="rgb(246 244 238 / 0.12)"
        strokeDasharray="3 5"
      />
      <text x={x + 12} y={y + 22} className="fill-mute font-mono text-[12px] tracking-[0.14em] uppercase">
        {label}
      </text>
    </g>
  )
}

function EdgePath({
  from,
  to,
  progress,
  range,
  kind,
  hot,
  dim,
  curved,
}: {
  from: [number, number]
  to: [number, number]
  progress: MotionValue<number>
  range: [number, number]
  kind: "data" | "deploy"
  hot: boolean
  dim: boolean
  curved: boolean
}) {
  const pathLength = useTransform(progress, range, [0, 1])
  const d = curved
    ? `M ${from[0]} ${from[1]} Q ${(from[0] + to[0]) / 2} ${Math.max(from[1], to[1]) + 140} ${to[0]} ${to[1]}`
    : `M ${from[0]} ${from[1]} L ${to[0]} ${to[1]}`
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={hot ? "var(--color-accent)" : "rgb(246 244 238 / 0.4)"}
      strokeWidth={hot ? 1.8 : 1}
      strokeDasharray={kind === "deploy" ? "4 6" : undefined}
      style={{ pathLength, opacity: dim ? 0.15 : 1 }}
      className="transition-[stroke,opacity] duration-300"
    />
  )
}

function NodeMark({
  x,
  y,
  label,
  progress,
  at,
  on,
  lit,
  dim,
  onEnter,
  onLeave,
  onToggle,
}: {
  x: number
  y: number
  label: string
  progress: MotionValue<number>
  at: number
  on: boolean
  lit: boolean
  dim: boolean
  onEnter: () => void
  onLeave: () => void
  onToggle: () => void
}) {
  const scale = useTransform(progress, [at, at + 0.06], [0, 1])
  const w = Math.max(64, label.length * 11 + 28)
  return (
    <motion.g
      style={{ scale, x, y, opacity: dim ? 0.3 : 1 }}
      className="cursor-pointer outline-none transition-opacity duration-300"
      tabIndex={0}
      role="button"
      aria-pressed={on}
      aria-label={label}
      data-cursor="inspect"
      onPointerEnter={(e) => e.pointerType === "mouse" && onEnter()}
      onPointerLeave={(e) => e.pointerType === "mouse" && onLeave()}
      onFocus={onEnter}
      onBlur={onLeave}
      onClick={onToggle}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onToggle())}
    >
      <motion.rect
        x={-w / 2}
        y={-19}
        width={w}
        height={38}
        rx={19}
        animate={{ scale: on ? 1.12 : 1 }}
        transition={{ duration: 0.3, ease: EASE }}
        className={cx(
          "transition-[fill,stroke] duration-300",
          on ? "fill-accent stroke-accent" : lit ? "fill-ink stroke-accent" : "fill-ink stroke-warm/50",
        )}
      />
      <text
        textAnchor="middle"
        y="5"
        className={cx(
          "pointer-events-none font-mono text-[13px] tracking-[0.08em] uppercase",
          on ? "fill-ink" : "fill-warm",
        )}
      >
        {label}
      </text>
    </motion.g>
  )
}
