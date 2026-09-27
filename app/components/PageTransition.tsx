import { motion } from "framer-motion"
import { useRef, type ReactNode } from "react"
import { useLocation } from "react-router"

import { EASE } from "~/lib/motion"

/**
 * Wraps each page. On client-side navigation a curtain lifts off the new page
 * while its content settles in; the very first load is left to the page's own
 * intro animation.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const firstPath = useRef(pathname)
  const navigated = useRef(false)
  // Idempotent: once the path differs from the landing path, it stays true.
  if (pathname !== firstPath.current) navigated.current = true
  const animateIn = navigated.current

  return (
    <div key={pathname}>
      {animateIn && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[60] origin-top bg-ink"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <span className="absolute inset-x-0 bottom-0 h-px bg-accent" />
          <motion.span
            className="label absolute bottom-8 left-1/2 -translate-x-1/2 text-mute"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {pathname === "/" ? "Index" : pathname.split("/").filter(Boolean).join(" / ")}
          </motion.span>
        </motion.div>
      )}
      <motion.div
        initial={animateIn ? { opacity: 0, y: 40 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: animateIn ? 0.25 : 0 }}
      >
        {children}
      </motion.div>
    </div>
  )
}
