import { AnimatePresence, motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"

import { SplitText } from "~/components/ui/SplitText"
import { SystemLine } from "~/components/ui/SystemLine"
import { labEdges, labNodes } from "~/data/technologies"
import { cx, EASE, useIsDesktop, useMotionAllowed } from "~/lib/motion"

const neighbours = (id: string) => new Set(labEdges.flatMap(([a, b]) => (a === id ? [b] : b === id ? [a] : [])))

/**
 * HOW IT WORKS — the full stack as one inspectable system. It walks through
 * the layers on its own until the visitor takes over.
 */
export function ArchitectureLab() {
  const allowed = useMotionAllowed()
  const desktop = useIsDesktop()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.35 })
  const [active, setActive] = useState(labNodes[0].id)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (!inView || touched || !allowed || !desktop) return
    const id = window.setInterval(() => {
      setActive((current) => labNodes[(labNodes.findIndex((n) => n.id === current) + 1) % labNodes.length].id)
    }, 2400)
    return () => window.clearInterval(id)
  }, [inView, touched, allowed, desktop])

  const pick = (id: string) => {
    setTouched(true)
    setActive(id)
  }
  const near = neighbours(active)
  const node = labNodes.find((n) => n.id === active)!

  return (
    <section
      ref={ref}
      id="how"
      aria-labelledby="how-title"
      className="relative overflow-hidden bg-char py-24 text-warm lg:py-32"
    >
      <div
        aria-hidden
        className="hairline-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />
      <div className="gutter relative">
        <div className="flex items-center gap-4">
          <span className="label text-warm/50">04 / Architect</span>
          <SystemLine nodes={8} className="flex-1" active={[labNodes.findIndex((n) => n.id === active)]} />
        </div>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <SplitText as="h2" id="how-title" text="How it works" className="display text-[15vw] lg:text-[10.5vw]" />
          <p className="max-w-sm text-base text-warm/65 lg:text-lg">
            Eight layers I work across, and how they talk to each other.{" "}
            {touched ? "Keep exploring." : "Hover any of them."}
          </p>
        </div>

        {/* Desktop diagram */}
        <div className="relative mt-14 hidden h-[62vh] min-h-[480px] lg:block">
          <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {labEdges.map(([a, b]) => {
              const from = labNodes.find((n) => n.id === a)!
              const to = labNodes.find((n) => n.id === b)!
              const hot = a === active || b === active
              return (
                <g key={`${a}-${b}`}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    vectorEffect="non-scaling-stroke"
                    stroke={hot ? "var(--color-accent)" : "rgb(246 244 238 / 0.14)"}
                    strokeWidth={hot ? 1.5 : 1}
                    className="transition-[stroke] duration-500"
                  />
                  {hot && allowed && (
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      vectorEffect="non-scaling-stroke"
                      stroke="var(--color-accent)"
                      strokeWidth={3}
                      strokeDasharray="1 11"
                      strokeLinecap="round"
                      className="animate-flow"
                    />
                  )}
                </g>
              )
            })}
          </svg>

          {labNodes.map((n, i) => {
            const on = n.id === active
            const lit = near.has(n.id)
            return (
              <button
                key={n.id}
                type="button"
                data-cursor="inspect"
                aria-pressed={on}
                onPointerEnter={(e) => e.pointerType === "mouse" && pick(n.id)}
                onFocus={() => pick(n.id)}
                onClick={() => pick(n.id)}
                className="group absolute -translate-x-1/2 -translate-y-1/2 text-left"
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                <span
                  className={cx(
                    "absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-500",
                    on ? "scale-150 border-accent bg-accent" : lit ? "border-accent bg-char" : "border-warm/40 bg-char",
                  )}
                />
                <motion.span
                  className={cx(
                    "relative mt-9 block bg-char/80 px-1 font-display font-bold tracking-[-0.05em] uppercase transition-colors duration-500",
                    on ? "text-accent" : lit ? "text-warm" : "text-warm/30",
                  )}
                  animate={{ fontSize: on ? "3.4vw" : "1.9vw" }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  {n.label}
                </motion.span>
                <span className="label relative block px-1 text-[0.6rem] text-mute">0{i + 1}</span>
              </button>
            )
          })}

          {/* Inspector */}
          <div className="absolute bottom-0 left-0 w-[26rem]" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="border-l-2 border-accent bg-char/90 py-1 pl-5"
              >
                <p className="label text-accent">Inspecting · {node.label}</p>
                <p className="mt-2 text-lg leading-snug text-warm/85">{node.role}</p>
                <p className="mt-3 font-mono text-sm text-warm">{node.tech.join(" · ")}</p>
                <Link
                  to={`/work/${node.project.slug}`}
                  className="label mt-4 inline-flex gap-2 text-warm/70 hover:text-accent"
                >
                  Related → {node.project.title} ↗
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile: the same system as a tappable stack */}
        <ol className="mt-12 border-t border-warm/10 lg:hidden">
          {labNodes.map((n, i) => {
            const on = n.id === active
            const lit = near.has(n.id)
            return (
              <li key={n.id} className="border-b border-warm/10">
                <button
                  type="button"
                  aria-expanded={on}
                  onClick={() => pick(n.id)}
                  className="flex w-full items-center gap-4 py-4 text-left"
                >
                  <span className="label w-6 text-mute">0{i + 1}</span>
                  <span
                    className={cx(
                      "display text-[10vw] transition-colors",
                      on ? "text-accent" : lit ? "text-warm" : "text-warm/35",
                    )}
                  >
                    {n.label}
                  </span>
                  {lit && !on && <span className="label ml-auto text-accent">linked</span>}
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="pb-5 pl-10">
                        <p className="text-warm/80">{n.role}</p>
                        <p className="mt-2 font-mono text-xs text-warm">{n.tech.join(" · ")}</p>
                        <Link to={`/work/${n.project.slug}`} className="label mt-3 inline-block text-accent">
                          Related → {n.project.title} ↗
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
