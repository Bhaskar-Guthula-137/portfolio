import { useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"

import { useMotionAllowed } from "~/lib/motion"

/**
 * A counter that advances every `ms` while the element is on screen. With
 * reduced motion it holds on `stillFrame` so the visual still reads.
 */
export function useTicker<T extends Element>(ms: number, stillFrame = 3) {
  const ref = useRef<T>(null)
  const inView = useInView(ref, { amount: 0.25 })
  const reduced = !useMotionAllowed()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!inView || reduced) return
    const id = window.setInterval(() => setTick((t) => t + 1), ms)
    return () => window.clearInterval(id)
  }, [inView, reduced, ms])

  return { ref, tick: reduced ? stillFrame : tick, inView }
}
