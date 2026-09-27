import { AnimatePresence, motion } from "framer-motion"

import { EASE } from "~/lib/motion"
import { LiveDot } from "./Frame"
import { useTicker } from "./useTicker"

// A scripted innings so the demo is deterministic and clearly simulated.
const BALLS = ["1", "4", "0", "2", "W", "6", "1", "0", "4", "1", "2", "6", "0", "1", "1", "4"] as const
const BASE = { runs: 142, wickets: 3, balls: 98 }
const INCOMING = ["Batter E", "Batter F", "Batter G"]
const TARGET = 186

function simulate(n: number) {
  let runs = BASE.runs
  let wickets = BASE.wickets
  let striker = { name: "Batter A", runs: 54, balls: 38 }
  let other = { name: "Batter B", runs: 21, balls: 14 }
  const events: Array<{ id: number; over: string; text: string; kind: "run" | "boundary" | "wicket" | "dot" }> = []
  for (let i = 0; i < n; i++) {
    const b = BALLS[i % BALLS.length]
    const ov = overs(BASE.balls + i + 1)
    if (b === "W") {
      events.push({ id: i, over: ov, text: `WICKET — ${striker.name} out for ${striker.runs}`, kind: "wicket" })
      striker = { name: INCOMING[(wickets - BASE.wickets) % INCOMING.length], runs: 0, balls: 0 }
      wickets = Math.min(wickets + 1, 9)
      continue
    }
    const r = Number(b)
    runs += r
    events.push({
      id: i,
      over: ov,
      text:
        r === 6
          ? `SIX — ${striker.name}`
          : r === 4
            ? `FOUR — ${striker.name}`
            : r === 0
              ? "Dot ball"
              : `${r} run${r > 1 ? "s" : ""}`,
      kind: r >= 4 ? "boundary" : r === 0 ? "dot" : "run",
    })
    striker = { ...striker, runs: striker.runs + r, balls: striker.balls + 1 }
    if (r % 2 === 1) [striker, other] = [other, striker]
  }
  return { runs, wickets, balls: BASE.balls + n, striker, other, events: events.slice(-5).reverse() }
}

const overs = (balls: number) => `${Math.floor(balls / 6)}.${balls % 6}`

/**
 * A simulated live match interface. It reflows with its container: a compact
 * score card when small, a full product view when large.
 */
export function Scoreboard() {
  const { ref, tick } = useTicker<HTMLDivElement>(1600, 6)
  const n = tick % 22
  const s = simulate(n)
  const recent = Array.from({ length: Math.min(n, 6) }, (_, i) => ({
    id: n - i,
    ball: BALLS[(n - 1 - i) % BALLS.length],
  })).reverse()
  const crr = ((s.runs / s.balls) * 6).toFixed(2)
  const need = TARGET - s.runs
  const left = 120 - s.balls
  const rrr = left > 0 ? ((need / left) * 6).toFixed(2) : "—"
  const winPct = Math.max(8, Math.min(92, 52 + (Number(crr) - Number(rrr)) * 9))

  return (
    <div ref={ref} className="@container h-full w-full bg-char text-warm">
      <div className="label flex h-9 items-center justify-between border-b border-warm/10 px-4 text-[0.6rem] text-mute">
        <span>match / team-a-vs-team-b / t20 · simulated</span>
        <LiveDot />
      </div>
      <div className="grid h-[calc(100%-2.25rem)] grid-cols-1 gap-px bg-warm/10 @3xl:grid-cols-[1.4fr_1fr] @3xl:grid-rows-[1fr_auto]">
        {/* Score */}
        <div className="flex flex-col justify-between gap-4 bg-char p-4 @3xl:p-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="label text-[0.6rem] text-mute">Team A · 2nd innings · Target {TARGET}</p>
              <p className="mt-2 flex items-baseline gap-3 font-display font-bold tracking-[-0.05em]">
                <span className="relative inline-block overflow-hidden text-5xl leading-none tabular-nums @3xl:text-[9cqw]">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={`${s.runs}/${s.wickets}`}
                      className="inline-block"
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-100%" }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      {s.runs}/{s.wickets}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="font-mono text-sm font-normal text-mute tabular-nums @3xl:text-lg">
                  {overs(s.balls)} ov
                </span>
              </p>
            </div>
            <div className="text-right font-mono text-[0.68rem] leading-5 text-mute tabular-nums @3xl:text-sm @3xl:leading-7">
              <p>
                CRR <span className="text-warm">{crr}</span>
              </p>
              <p>
                RRR <span className="text-warm">{rrr}</span>
              </p>
              <p className="hidden @xs:block">
                NEED <span className="text-accent">{need}</span> off {left}
              </p>
            </div>
          </div>

          <div className="flex h-8 gap-1.5 @3xl:h-12">
            <AnimatePresence initial={false}>
              {recent.map(({ id, ball }) => (
                <motion.span
                  key={id}
                  layout
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.4 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className={`grid aspect-square h-full place-items-center rounded-full border font-mono text-xs ${
                    ball === "W"
                      ? "border-transparent bg-warm text-ink"
                      : ball === "4" || ball === "6"
                        ? "border-transparent bg-accent text-ink"
                        : "border-warm/20 text-warm/80"
                  }`}
                >
                  {ball}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>

          <div className="hidden @md:block">
            <div className="mb-1.5 flex justify-between font-mono text-[0.62rem] text-mute">
              <span>A {Math.round(winPct)}%</span>
              <span>Win probability · model estimate</span>
              <span>B {100 - Math.round(winPct)}%</span>
            </div>
            <div className="h-1 bg-warm/10">
              <motion.div
                className="h-full bg-accent"
                animate={{ width: `${winPct}%` }}
                transition={{ duration: 0.8, ease: EASE }}
              />
            </div>
          </div>
        </div>

        {/* Live events */}
        <div className="hidden flex-col bg-char p-4 @3xl:row-span-2 @3xl:flex @3xl:p-8">
          <div className="label flex items-center justify-between text-[0.6rem] text-mute">
            <span>Live events</span>
            <span>ws · seq {4800 + n}</span>
          </div>
          <ul className="mt-4 flex flex-col gap-2 font-mono text-xs">
            <AnimatePresence initial={false}>
              {s.events.map((e) => (
                <motion.li
                  key={e.id}
                  layout
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="flex gap-3 border-b border-warm/5 pb-2"
                >
                  <span className="text-mute tabular-nums">{e.over}</span>
                  <span
                    className={
                      e.kind === "boundary"
                        ? "text-accent"
                        : e.kind === "wicket"
                          ? "text-warm underline"
                          : "text-warm/75"
                    }
                  >
                    {e.text}
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <div className="mt-auto flex items-center gap-2 pt-6 font-mono text-[0.65rem] text-mute">
            <span className="size-1.5 rounded-full bg-accent" /> Match status: in progress · 2nd innings
          </div>
        </div>

        {/* Batters */}
        <div className="hidden bg-char p-4 @md:block @3xl:p-8">
          <table className="w-full font-mono text-[0.72rem] tabular-nums @3xl:text-sm">
            <thead className="text-mute">
              <tr className="border-b border-warm/10">
                <th className="py-1.5 text-left font-normal">BATTER</th>
                <th className="py-1.5 text-right font-normal">R</th>
                <th className="py-1.5 text-right font-normal">B</th>
                <th className="py-1.5 text-right font-normal">SR</th>
              </tr>
            </thead>
            <tbody>
              {[s.striker, s.other].map((p, i) => (
                <tr key={i} className="border-b border-warm/5">
                  <td className="py-1.5">
                    {p.name}
                    {i === 0 && <span className="text-accent"> *</span>}
                  </td>
                  <td className="py-1.5 text-right">{p.runs}</td>
                  <td className="py-1.5 text-right text-mute">{p.balls}</td>
                  <td className="py-1.5 text-right text-mute">
                    {p.balls ? ((p.runs / p.balls) * 100).toFixed(0) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
