import { AnimatePresence, motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"

import { cx, EASE, useMotionAllowed } from "~/lib/motion"

export const RAG_STAGES = ["Query", "Retrieve", "Context", "Model", "Response"]

type Preset = { query: string; sources: string[]; answer: string }

// Illustrative content only: an archive that does not exist, answered by a
// simulated pipeline. It shows the stages, not any model's reasoning.
const PRESETS: Preset[] = [
  {
    query: "Summarise our coverage of the city transit plan",
    sources: [
      "Transit plan: what changes on each route",
      "Council vote on the new corridor",
      "Explainer: funding the extension",
    ],
    answer:
      "The coverage follows the plan from proposal to approval: the new corridor, the council vote that cleared it [2], and how the extension is funded [3]. Route-by-route changes are covered in a separate explainer [1].",
  },
  {
    query: "Rewrite this story as a 60-word brief",
    sources: ["Style guide: briefs", "Original story · 412 words"],
    answer:
      "A 60-word brief following the house style for briefs [1]: lead with the decision, one line of context, one line on what happens next. Names and figures are kept exactly as in the original [2].",
  },
  {
    query: "What did we publish on monsoon preparedness?",
    sources: [],
    answer:
      "I couldn't find archive articles on that topic, so I won't answer from general knowledge. Try a different date range or section.",
  },
]

/** A simulated RAG interface: pick a query and watch it move through each stage. */
export function RagConsole() {
  const allowed = useMotionAllowed()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4, once: true })
  const [preset, setPreset] = useState(0)
  const [stage, setStage] = useState(-1)
  const [runId, setRunId] = useState(0)

  const run = (i: number) => {
    setPreset(i)
    setRunId((r) => r + 1)
  }

  useEffect(() => {
    if (inView && runId === 0) run(0)
  }, [inView, runId])

  useEffect(() => {
    if (runId === 0) return
    if (!allowed) return setStage(RAG_STAGES.length - 1)
    setStage(0)
    const timers = RAG_STAGES.map((_, i) => window.setTimeout(() => setStage(i), i * 750))
    return () => timers.forEach(window.clearTimeout)
  }, [runId, allowed])

  const current = PRESETS[preset]
  const words = current.answer.split(" ")

  return (
    <div ref={ref} className="flex h-full flex-col border border-ink/15 bg-warm text-ink">
      <div className="label flex h-9 items-center justify-between border-b border-ink/10 px-4 text-[0.6rem] text-ink/50">
        <span>content-assistant · simulated</span>
        <span>archive index · grounded answers</span>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2 border-b border-ink/10 p-4" role="group" aria-label="Example queries">
        {PRESETS.map((p, i) => (
          <button
            key={p.query}
            type="button"
            onClick={() => run(i)}
            aria-pressed={preset === i}
            className={cx(
              "border px-3 py-1.5 text-left text-sm transition-colors",
              preset === i ? "border-ink bg-ink text-paper" : "border-ink/20 hover:border-ink",
            )}
          >
            {p.query}
          </button>
        ))}
      </div>

      {/* Stage track */}
      <ol className="grid grid-cols-5 border-b border-ink/10" aria-label="Pipeline stages">
        {RAG_STAGES.map((s, i) => (
          <li
            key={s}
            className="relative border-r border-ink/10 px-3 py-3 last:border-r-0"
            aria-current={i === stage ? "step" : undefined}
          >
            <span
              className={cx(
                "label text-[0.55rem] transition-colors duration-300 sm:text-[0.65rem]",
                i <= stage ? "text-ink" : "text-ink/30",
              )}
            >
              {s}
            </span>
            <motion.span
              className="absolute bottom-0 left-0 h-0.5 bg-accent-ink"
              initial={false}
              animate={{ width: i < stage ? "100%" : i === stage ? "60%" : "0%" }}
              transition={{ duration: 0.6, ease: EASE }}
            />
          </li>
        ))}
      </ol>

      <div className="grid min-h-0 flex-1 gap-px bg-ink/10 md:grid-cols-[0.9fr_1.1fr]">
        {/* Retrieval */}
        <div className="bg-warm p-4">
          <p className="label text-[0.6rem] text-ink/50">Retrieved passages</p>
          <ul className="mt-3 flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {stage >= 1 &&
                current.sources.map((s, i) => (
                  <motion.li
                    key={`${runId}-${s}`}
                    className={cx(
                      "flex items-center gap-3 border p-2.5 text-sm transition-colors",
                      stage >= 2 ? "border-accent-ink/50 bg-accent/25" : "border-ink/15",
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: i * 0.12 }}
                  >
                    <span className="font-mono text-[0.65rem] text-ink/50">[{i + 1}]</span>
                    {s}
                  </motion.li>
                ))}
              {stage >= 1 && current.sources.length === 0 && (
                <motion.li
                  key={`${runId}-none`}
                  className="border border-dashed border-ink/30 p-2.5 font-mono text-xs text-ink/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  0 passages above relevance threshold
                </motion.li>
              )}
            </AnimatePresence>
          </ul>
        </div>

        {/* Response */}
        <div className="bg-warm p-4" aria-live="polite">
          <p className="label flex items-center justify-between text-[0.6rem] text-ink/50">
            <span>Response</span>
            {stage === 3 && <span className="text-accent-ink">composing from context…</span>}
          </p>
          <p className="mt-3 text-base leading-relaxed lg:text-lg">
            {stage >= 4 &&
              words.map((w, i) => (
                <motion.span
                  key={`${runId}-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: allowed ? i * 0.035 : 0 }}
                  className={/^\[\d\]/.test(w) ? "font-mono text-sm text-accent-ink" : undefined}
                >
                  {w}{" "}
                </motion.span>
              ))}
          </p>
        </div>
      </div>
    </div>
  )
}
