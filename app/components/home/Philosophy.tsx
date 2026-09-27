import { AnimatePresence, motion, type MotionValue, useMotionValueEvent, useTransform } from "framer-motion"
import { useRef, useState } from "react"

import { SystemLine } from "~/components/ui/SystemLine"
import { cx, EASE, useScenes, useSectionProgress } from "~/lib/motion"

const WORDS = ["Complex", "Simple", "System", "Experience"] as const
const CAPTIONS = [
  "What the problem looks like at first.",
  "What it should feel like to use.",
  "Where the complexity actually lives.",
  "What people remember.",
]
const SUPPORT =
  "The complexity belongs inside the system. The experience should remain fast, clear, reliable, and intuitive."

// Fixed pseudo-random scatter per letter of COMPLEX.
const SCATTER = [
  [-38, -24, -14],
  [22, 30, 9],
  [-12, -40, 22],
  [30, 18, -18],
  [-26, 34, 12],
  [14, -30, -24],
  [36, 8, 16],
]

/** GOOD ENGINEERING SHOULD FEEL SIMPLE — and scrolling literally simplifies the word. */
export function Philosophy() {
  const scenes = useScenes()
  const ref = useRef<HTMLElement>(null)
  const p = useSectionProgress(ref, ["start start", "end end"])
  const [stage, setStage] = useState(0)
  useMotionValueEvent(p, "change", (v) => setStage(v < 0.42 ? 0 : v < 0.6 ? 1 : v < 0.78 ? 2 : 3))

  const headScale = useTransform(p, [0.12, 0.26], [1, 0.32])
  const headY = useTransform(p, [0.12, 0.26], ["0vh", "-30vh"])
  const bigOpacity = useTransform(p, [0.2, 0.28], [0, 1])
  const scatter = useTransform(p, [0.26, 0.42], [1, 0])
  const bg = useTransform(p, [0.8, 0.9], ["#ece9e1", "#0a0a09"])
  const fg = useTransform(p, [0.8, 0.9], ["#0a0a09", "#f6f4ee"])
  const supportOpacity = useTransform(p, [0.26, 0.34], [0, 1])

  if (!scenes)
    return (
      <section aria-labelledby="philosophy-title" className="gutter bg-paper py-32 text-ink">
        <h2 id="philosophy-title" className="display text-[11vw] lg:text-[8vw]">
          Good engineering should feel simple.
        </h2>
        <p className="mt-10 max-w-xl text-xl">{SUPPORT}</p>
        <p className="label mt-10 text-ink/60">{WORDS.join(" → ")}</p>
      </section>
    )

  return (
    <motion.section
      ref={ref}
      aria-labelledby="philosophy-title"
      className="relative h-[420svh]"
      style={{ backgroundColor: bg, color: fg }}
    >
      <div className="gutter sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden">
        <motion.h2
          id="philosophy-title"
          className="display absolute inset-x-0 top-1/2 gutter -translate-y-1/2 text-center text-[11vw] lg:text-[8.2vw]"
          style={{ scale: headScale, y: headY }}
        >
          Good engineering should feel{" "}
          <span className="relative inline-block">
            simple.
            <span className="absolute bottom-[0.1em] left-0 h-[0.07em] w-full bg-accent" />
          </span>
        </motion.h2>

        <motion.div className="relative flex flex-col items-center" style={{ opacity: bigOpacity }} aria-hidden>
          <div className="relative flex h-[30vw] items-center justify-center lg:h-[22vw]">
            <AnimatePresence mode="popLayout">
              {stage === 0 && <ComplexWord key="complex" scatter={scatter} />}
              {stage === 1 && <PlainWord key="simple" text={WORDS[1]} />}
              {stage === 2 && <SystemWord key="system" />}
              {stage === 3 && <PlainWord key="experience" text={WORDS[3]} accent />}
            </AnimatePresence>
          </div>
          <div className="mt-6 flex items-center gap-4">
            {WORDS.map((w, i) => (
              <span
                key={w}
                className={cx("label transition-opacity duration-500", i === stage ? "opacity-100" : "opacity-30")}
              >
                {i === stage && <span className="mr-2 inline-block size-1.5 rounded-full bg-accent align-middle" />}
                {w}
              </span>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={stage}
              className="mt-3 text-base opacity-70"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.7, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {CAPTIONS[stage]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <motion.p
          className="absolute right-0 bottom-10 left-0 gutter mx-auto max-w-2xl text-center text-lg leading-snug lg:text-xl"
          style={{ opacity: supportOpacity }}
        >
          {SUPPORT}
        </motion.p>
      </div>
    </motion.section>
  )
}

const BIG = "display text-[19vw] lg:text-[15vw] leading-none"

function ComplexWord({ scatter }: { scatter: MotionValue<number> }) {
  return (
    <motion.span className={cx(BIG, "flex")} exit={{ opacity: 0, filter: "blur(10px)" }} transition={{ duration: 0.4 }}>
      {[..."COMPLEX"].map((char, i) => (
        <ScatterLetter key={i} char={char} seed={SCATTER[i]} scatter={scatter} />
      ))}
    </motion.span>
  )
}

function ScatterLetter({ char, seed, scatter }: { char: string; seed: number[]; scatter: MotionValue<number> }) {
  const x = useTransform(scatter, (s) => `${seed[0] * s * 0.022}em`)
  const y = useTransform(scatter, (s) => `${seed[1] * s * 0.018}em`)
  const rotate = useTransform(scatter, (s) => seed[2] * s)
  const weight = useTransform(scatter, [0, 1], [700, 300])
  return (
    <motion.span className="inline-block" style={{ x, y, rotate, fontWeight: weight }}>
      {char}
    </motion.span>
  )
}

function PlainWord({ text, accent }: { text: string; accent?: boolean }) {
  return (
    <motion.span className={cx(BIG, "flex overflow-hidden pb-[0.05em]")}>
      {[...text.toUpperCase()].map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.6, ease: EASE, delay: i * 0.025 }}
        >
          {char}
        </motion.span>
      ))}
      {accent && (
        <motion.span
          className="text-accent"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 15 }}
        >
          .
        </motion.span>
      )}
    </motion.span>
  )
}

function SystemWord() {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4 }}
    >
      <span className={cx(BIG, "flex items-center gap-[0.12em]")}>
        {[..."SYSTEM"].map((char, i) => (
          <motion.span
            key={i}
            className="inline-block border border-current/20 px-[0.04em]"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }}
          >
            {char}
          </motion.span>
        ))}
      </span>
      <SystemLine nodes={6} tone="dark" className="mt-4 w-full" active={[0, 5]} delay={0.2} />
    </motion.div>
  )
}
