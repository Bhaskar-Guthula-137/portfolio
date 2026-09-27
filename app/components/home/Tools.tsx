import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"

import { SplitText } from "~/components/ui/SplitText"
import { SystemLine } from "~/components/ui/SystemLine"
import { tools } from "~/data/technologies"
import { cx, EASE } from "~/lib/motion"

// Editorial arrangement: which words share a row, and how each row is set.
const ROWS: Array<{ items: number[]; className: string }> = [
  { items: [0, 1], className: "justify-start" },
  { items: [2, 3], className: "justify-end" },
  { items: [4, 5], className: "justify-start lg:pl-[8vw]" },
  { items: [6, 7], className: "justify-between" },
]

/**
 * THE TOOLS — technologies set as type. Hovering (or tapping) a word widens
 * it, pushes its neighbours aside, and draws a line to the project it built.
 */
export function Tools() {
  const [active, setActive] = useState<number | null>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const words = useRef<Array<HTMLElement | null>>([])
  const target = useRef<HTMLAnchorElement>(null)
  const [path, setPath] = useState<string | null>(null)

  // Keep the connector attached while the words re-flow.
  useEffect(() => {
    if (active === null) return setPath(null)
    let frame = 0
    const started = performance.now()
    const measure = () => {
      const box = wrap.current?.getBoundingClientRect()
      const a = words.current[active]?.getBoundingClientRect()
      const b = target.current?.getBoundingClientRect()
      if (box && a && b) {
        const x1 = a.left + a.width / 2 - box.left
        const y1 = a.bottom - box.top
        const x2 = b.left - box.left - 8
        const y2 = b.top + b.height / 2 - box.top
        setPath(`M ${x1} ${y1} C ${x1} ${y2}, ${x1} ${y2}, ${x2} ${y2}`)
      }
      if (performance.now() - started < 900) frame = requestAnimationFrame(measure)
    }
    measure()
    return () => cancelAnimationFrame(frame)
  }, [active])

  const tool = active === null ? null : tools[active]

  return (
    <section aria-labelledby="tools-title" className="relative bg-paper pt-24 pb-32 text-ink lg:pt-32 lg:pb-44">
      <div className="gutter flex items-center gap-4">
        <span className="label text-ink/50">02 / The Tools</span>
        <SystemLine nodes={2} tone="dark" className="flex-1" active={[1]} />
      </div>
      <div className="gutter mt-10 flex flex-wrap items-end justify-between gap-6">
        <SplitText as="h2" text="The Tools" className="display text-[14vw] lg:text-[10vw]" id="tools-title" />
        <p className="label max-w-[16rem] text-ink/60">
          No percentages. Hover a tool to see what it does and what it built.
        </p>
      </div>

      <div
        ref={wrap}
        className="gutter relative mt-14 lg:mt-20"
        onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
      >
        {ROWS.map((row, r) => (
          <div key={r} className={cx("flex flex-wrap items-baseline gap-x-[4vw]", row.className)}>
            {row.items.map((i) => {
              const isActive = active === i
              const dimmed = active !== null && !isActive
              return (
                <button
                  key={tools[i].name}
                  ref={(el) => {
                    words.current[i] = el
                  }}
                  type="button"
                  aria-pressed={isActive}
                  aria-describedby={isActive ? "tool-detail" : undefined}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive((a) => (a === i ? null : i))}
                  className="group relative text-left"
                >
                  <motion.span
                    className="display block text-[11.5vw] leading-[0.95] lg:text-[8.4vw]"
                    animate={{
                      letterSpacing: isActive ? "-0.01em" : "-0.065em",
                      opacity: dimmed ? 0.16 : 1,
                      x: dimmed && ROWS[r].items.includes(active ?? -1) ? (i < (active ?? 0) ? -24 : 24) : 0,
                    }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    {tools[i].name}
                  </motion.span>
                  <span
                    className={cx(
                      "label absolute top-[0.6em] -left-2 hidden -translate-x-full text-[0.6rem] transition-colors lg:block",
                      isActive ? "text-accent-ink" : "text-ink/40",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        id="tool-detail"
                        className="label absolute top-full left-0 mt-1 whitespace-nowrap text-ink"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                      >
                        <span className="mr-2 inline-block size-1.5 rounded-full bg-ink align-middle" />
                        {tools[i].detail}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              )
            })}
          </div>
        ))}

        {/* Connector to the related project */}
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          <AnimatePresence>
            {path && (
              <motion.path
                key={active}
                d={path}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 1 }}
                animate={{ pathLength: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
              />
            )}
          </AnimatePresence>
        </svg>

        <div className="mt-16 flex justify-end lg:mt-10">
          <Link
            ref={target}
            to={tool ? `/work/${tool.project.slug}` : "/#work"}
            data-cursor="view"
            className={cx(
              "flex min-w-[15rem] items-center gap-4 border-l-2 py-2 pl-4 transition-colors duration-500",
              tool ? "border-accent-ink" : "border-ink/15",
            )}
          >
            <span className="label text-ink/50">Related</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={tool?.project.title ?? "none"}
                className="text-lg font-semibold tracking-tight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {tool ? `${tool.project.title} ↗` : "Pick a tool"}
              </motion.span>
            </AnimatePresence>
          </Link>
        </div>
      </div>
    </section>
  )
}
