import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion"
import { useEffect, useState } from "react"

import { useMotionAllowed } from "~/lib/motion"

type Mode = "default" | "link" | "view" | "inspect" | "text"

const LABELS: Partial<Record<Mode, string>> = { link: "Open ↗", view: "View ↗", inspect: "Inspect" }

/**
 * A small dot that follows the pointer. Elements opt into a label with
 * `data-cursor="view" | "inspect"`; other links and buttons show "Open ↗".
 * Fine-pointer devices only, and off entirely with reduced motion.
 */
/** True when the page under (x, y) is light, so the dot should turn dark. */
function isLightAt(x: number, y: number) {
  let el = document.elementFromPoint(x, y)
  while (el) {
    const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g)
    if (m && (m[3] === undefined || Number(m[3]) > 0.5)) {
      const [r, g, b] = m.map(Number)
      return 0.2126 * r + 0.7152 * g + 0.0722 * b > 140
    }
    el = el.parentElement
  }
  return false
}

export function CustomCursor() {
  const reduced = !useMotionAllowed()
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState<Mode>("default")
  const [onLight, setOnLight] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 700, damping: 50, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 700, damping: 50, mass: 0.35 })

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)")
    const update = () => setEnabled(query.matches && !reduced)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [reduced])

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add("has-cursor")

    // Check the background under the pointer at most once per frame — on
    // pointer moves and on scroll, since scrolling changes what is underneath.
    let frame = 0
    const sample = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        setOnLight(isLightAt(x.get(), y.get()))
      })
    }
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      sample()
    }
    const over = (e: PointerEvent) => {
      const target = e.target as Element | null
      const tagged = target?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor
      if (tagged === "view" || tagged === "inspect") return setMode(tagged)
      if (target?.closest("a, button, [role=button], label, summary")) return setMode("link")
      setMode("default")
    }
    const leave = () => setVisible(false)

    window.addEventListener("pointermove", move, { passive: true })
    window.addEventListener("pointerover", over, { passive: true })
    window.addEventListener("scroll", sample, { passive: true })
    document.documentElement.addEventListener("pointerleave", leave)
    return () => {
      document.documentElement.classList.remove("has-cursor")
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerover", over)
      window.removeEventListener("scroll", sample)
      cancelAnimationFrame(frame)
      document.documentElement.removeEventListener("pointerleave", leave)
    }
  }, [enabled, x, y])

  if (!enabled) return null
  const label = LABELS[mode]

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100]"
      style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {label ? (
          <motion.span
            key={mode}
            className="label absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent px-3 py-1.5 whitespace-nowrap text-ink"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {label}
          </motion.span>
        ) : (
          <motion.span
            key="dot"
            className={`absolute top-0 left-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-200 ${onLight ? "bg-ink" : "bg-warm"}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
