import { motion } from "framer-motion"
import { useEffect, useState } from "react"

import { exploring } from "~/data/experiments"
import { siteConfig } from "~/data/site-config"
import { EASE, useMotionAllowed } from "~/lib/motion"

function useClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

/** CURRENTLY EXPLORING — a status board, as if the portfolio were a running system. */
export function Exploring() {
  const now = useClock()
  const time = now?.toLocaleTimeString("en-GB", { timeZone: siteConfig.location.timeZone }) ?? "--:--:--"

  return (
    <section aria-labelledby="exploring-title" className="gutter relative bg-ink pb-28 text-warm lg:pb-40">
      <div className="border-t border-warm/15 pt-8">
        <div className="label flex flex-wrap items-center justify-between gap-4 text-warm/50">
          <h2 id="exploring-title" className="text-warm">
            <span className="mr-2 inline-block size-1.5 animate-pulse-dot rounded-full bg-accent align-middle" />
            Currently exploring
          </h2>
          <span className="tabular-nums">
            {siteConfig.location.city} · {time} IST
          </span>
        </div>
        <ul className="mt-8">
          {exploring.map((item, i) => (
            <motion.li
              key={item.topic}
              className="group grid grid-cols-[7rem_1fr] items-center gap-4 border-b border-warm/10 py-4 lg:grid-cols-[12rem_1fr_12rem] lg:py-5"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.06 }}
            >
              <span className="label flex items-center gap-2 text-accent">
                <span
                  className="size-1.5 animate-pulse-dot rounded-full bg-accent"
                  style={{ animationDelay: `${i * 0.35}s` }}
                />
                {item.status}
              </span>
              <span className="display text-[8.5vw] leading-[0.95] transition-transform duration-500 group-hover:translate-x-3 lg:text-[4.2vw]">
                {item.topic}
              </span>
              <Activity seed={i} />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** A tiny, always-moving activity trace. Decorative. */
function Activity({ seed }: { seed: number }) {
  const allowed = useMotionAllowed()
  const [bars, setBars] = useState(() =>
    Array.from({ length: 16 }, (_, i) => 0.3 + (((i + 1) * (seed + 3) * 37) % 70) / 100),
  )
  useEffect(() => {
    if (!allowed) return
    const id = window.setInterval(() => setBars((b) => [...b.slice(1), 0.2 + Math.random() * 0.8]), 900 + seed * 130)
    return () => window.clearInterval(id)
  }, [allowed, seed])
  return (
    <span aria-hidden className="hidden h-8 items-end justify-end gap-[3px] lg:flex">
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-1 bg-warm/25 transition-[height] duration-700 last:bg-accent"
          style={{ height: `${h * 100}%` }}
        />
      ))}
    </span>
  )
}
