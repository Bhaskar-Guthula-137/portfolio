import { motion, type MotionValue, useTransform } from "framer-motion"

import { cx, EASE } from "~/lib/motion"

type Props = {
  /** Number of nodes along the line (minimum 2). */
  nodes?: number
  className?: string
  /** Which node indices glow in the accent colour. */
  active?: number[]
  /** Drive the draw with a scroll value (0 → 1) instead of entering the viewport. */
  progress?: MotionValue<number>
  delay?: number
  tone?: "light" | "dark"
}

/**
 * The SYSTEM LINE — the recurring signature of the site: a hairline with
 * nodes, drawn from left to right. ●────●────●
 */
export function SystemLine({ nodes = 2, className, active = [0], progress, delay = 0, tone = "light" }: Props) {
  const count = Math.max(2, nodes)
  const stops = Array.from({ length: count }, (_, i) => i / (count - 1))
  const lineColor = tone === "light" ? "bg-warm/25" : "bg-ink/25"
  const nodeColor = tone === "light" ? "border-warm/60 bg-ink" : "border-ink/60 bg-paper"

  return (
    <div aria-hidden className={cx("relative h-2.5", className)}>
      <LineFill progress={progress} delay={delay} className={lineColor} />
      {stops.map((stop, i) => (
        <Node
          key={i}
          at={stop}
          progress={progress}
          delay={delay + stop * 0.9}
          className={active.includes(i) ? "border-accent bg-accent" : nodeColor}
        />
      ))}
    </div>
  )
}

function LineFill({
  progress,
  delay,
  className,
}: {
  progress?: MotionValue<number>
  delay: number
  className: string
}) {
  const base = cx("absolute top-1/2 left-0 h-px w-full origin-left -translate-y-1/2", className)
  if (progress) return <motion.span className={base} style={{ scaleX: progress }} />
  return (
    <motion.span
      className={base}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    />
  )
}

function Node({
  at,
  progress,
  delay,
  className,
}: {
  at: number
  progress?: MotionValue<number>
  delay: number
  className: string
}) {
  const base = cx("absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border", className)
  const style = { left: `${at * 100}%` }
  if (progress) return <ScrollNode at={at} progress={progress} className={base} style={style} />
  return (
    <motion.span
      className={base}
      style={style}
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    />
  )
}

function ScrollNode({
  at,
  progress,
  className,
  style,
}: {
  at: number
  progress: MotionValue<number>
  className: string
  style: React.CSSProperties
}) {
  const scale = useTransform(progress, [Math.max(0, at - 0.05), at], [0, 1])
  return <motion.span className={className} style={{ ...style, scale }} />
}
