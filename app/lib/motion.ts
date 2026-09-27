import { useScroll, useTransform } from "framer-motion"
import { type RefObject, useEffect, useState, useSyncExternalStore } from "react"

export const EASE = [0.16, 1, 0.3, 1] as const
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const

/** Seconds into the first-load boot sequence at which each beat happens. */
export const BOOT = { line: 0.05, first: 0.3, last: 0.45, role: 0.8, frame: 0.95, statement: 1.25, actions: 1.35, meta: 1.4, nav: 1.45 }

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

const REDUCED = "(prefers-reduced-motion: reduce)"
const subscribeReduced = (onChange: () => void) => {
  const mql = window.matchMedia(REDUCED)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

/**
 * True when decorative motion (parallax, loops, pinned scenes) should run.
 * Hydration-safe: matches the pre-rendered HTML first, then the preference.
 */
export function useMotionAllowed() {
  return useSyncExternalStore(
    subscribeReduced,
    () => !window.matchMedia(REDUCED).matches,
    () => true,
  )
}

/** Matches a media query on the client; `false` during pre-render. */
export function useMedia(query: string) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const update = () => setMatches(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [query])
  return matches
}

export const useIsDesktop = () => useMedia("(min-width: 1024px)")

/**
 * Pinned, scroll-linked scenes run when motion is allowed. With reduced motion
 * they render their final, static state instead.
 */
export function useScenes() {
  return useMotionAllowed()
}

type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>["offset"]

/**
 * Scroll progress (0 → 1) of `target` through the viewport. The identity
 * transform keeps values on the JS path: Framer's native ViewTimeline
 * acceleration maps custom offsets incorrectly for opacity and colour.
 */
export function useSectionProgress(
  target: RefObject<HTMLElement | null>,
  offset: ScrollOffset = ["start start", "end end"],
) {
  const { scrollYProgress } = useScroll({ target, offset })
  return useTransform(scrollYProgress, (v) => v)
}
