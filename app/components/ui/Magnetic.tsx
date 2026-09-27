import { motion, useMotionValue, useSpring } from "framer-motion"
import type { ReactNode } from "react"

import { useMotionAllowed } from "~/lib/motion"

/** Pulls its child a little toward the pointer while hovered. */
export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const allowed = useMotionAllowed()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.5 })

  return (
    <motion.div
      className={className}
      style={{ x: sx, y: sy, display: "inline-block" }}
      onPointerMove={(e) => {
        if (!allowed || e.pointerType !== "mouse") return
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}
