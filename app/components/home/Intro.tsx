import { motion, type MotionValue, useTransform } from "framer-motion"

import { SystemLine } from "~/components/ui/SystemLine"

const FIRST = "I don't just build interfaces."
const SECOND = "I build the systems behind them."
const SUPPORT =
  "From React applications and real-time platforms to cloud infrastructure and AI workflows, I enjoy working across the entire product stack."

/** Colours for the night → paper shift at the end of the intro. */
export function useIntroColors(p: MotionValue<number>) {
  return {
    bg: useTransform(p, [0.78, 0.98], ["#0a0a09", "#ece9e1"]),
    fg: useTransform(p, [0.78, 0.98], ["#f6f4ee", "#0a0a09"]),
  }
}

/**
 * INTRODUCE → THINK. The first sentence gives way to the second, which grows
 * word by word. Driven by `p` (0 → 1) so it can live inside another scene.
 */
export function IntroLayer({ p, rule = true }: { p: MotionValue<number>; rule?: boolean }) {
  const firstY = useTransform(p, [0.22, 0.45], ["0%", "-60%"])
  const firstOpacity = useTransform(p, [0.25, 0.42], [1, 0])
  const firstBlur = useTransform(p, [0.25, 0.42], ["blur(0px)", "blur(10px)"])
  const secondScale = useTransform(p, [0.35, 0.7], [0.72, 1])
  const secondY = useTransform(p, [0.35, 0.7], ["30%", "0%"])
  const secondOpacity = useTransform(p, [0.32, 0.4], [0, 1])
  const supportOpacity = useTransform(p, [0.66, 0.78], [0, 1])
  const supportY = useTransform(p, [0.66, 0.78], [24, 0])
  const line = useTransform(p, [0, 0.2], [0, 1])

  return (
    <div className="gutter absolute inset-0 flex flex-col justify-center">
      {rule && (
        <div className="gutter absolute inset-x-0 top-[18%] flex items-center gap-4">
          <span className="label opacity-50">01 / Think</span>
          <SystemLine nodes={3} progress={line} className="flex-1" active={[2]} />
        </div>
      )}

      <div className="relative">
        <motion.p
          className="display absolute inset-x-0 top-1/2 -translate-y-1/2 text-[12vw] lg:text-[8.6vw]"
          style={{ y: firstY, opacity: firstOpacity, filter: firstBlur }}
        >
          <ScrollWords text={FIRST} progress={p} from={0.02} to={0.2} />
        </motion.p>

        <motion.h2
          id="intro-title"
          className="display origin-left text-[12vw] lg:text-[8.6vw]"
          style={{ scale: secondScale, y: secondY, opacity: secondOpacity }}
        >
          <ScrollWords text={SECOND} progress={p} from={0.4} to={0.66} accent="systems" />
        </motion.h2>
      </div>

      <motion.p
        className="mt-10 max-w-xl self-end text-lg leading-snug opacity-80 lg:mt-14 lg:text-xl"
        style={{ opacity: supportOpacity, y: supportY }}
      >
        {SUPPORT}
      </motion.p>
    </div>
  )
}

export function IntroStatic() {
  return (
    <section aria-labelledby="intro-title" className="gutter bg-ink py-32 text-warm">
      <p className="display text-[9vw] text-warm/40">{FIRST}</p>
      <h2 id="intro-title" className="display mt-8 text-[9vw]">
        {SECOND}
      </h2>
      <p className="mt-10 max-w-xl text-lg text-warm/70">{SUPPORT}</p>
    </section>
  )
}

/** Words light up one after another as scroll passes from `from` to `to`. */
function ScrollWords({
  text,
  progress,
  from,
  to,
  accent,
}: {
  text: string
  progress: MotionValue<number>
  from: number
  to: number
  accent?: string
}) {
  const words = text.split(" ")
  const step = (to - from) / words.length
  return (
    <span aria-label={text}>
      {words.map((word, i) => (
        <Word key={i} progress={progress} range={[from + i * step, from + (i + 1) * step]} accent={word === accent}>
          {word}
        </Word>
      ))}
    </span>
  )
}

function Word({
  children,
  progress,
  range,
  accent,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
  accent: boolean
}) {
  const opacity = useTransform(progress, range, [0.12, 1])
  const y = useTransform(progress, range, ["18%", "0%"])
  return (
    <>
      <motion.span aria-hidden className="inline-block" style={{ opacity, y }}>
        {accent ? (
          <span className="relative">
            {children}
            <AccentUnderline progress={progress} at={range[1]} />
          </span>
        ) : (
          children
        )}
      </motion.span>{" "}
    </>
  )
}

function AccentUnderline({ progress, at }: { progress: MotionValue<number>; at: number }) {
  const scaleX = useTransform(progress, [at, at + 0.08], [0, 1])
  return (
    <motion.span
      aria-hidden
      className="absolute bottom-[0.1em] left-0 h-[0.06em] w-full origin-left bg-accent"
      style={{ scaleX }}
    />
  )
}
