import { motion } from "framer-motion"
import type { ElementType } from "react"

import { cx, EASE } from "~/lib/motion"

type Props = {
  text: string
  as?: ElementType
  className?: string
  /** "chars" staggers each letter; "words" staggers words. */
  by?: "chars" | "words"
  delay?: number
  stagger?: number
  /** Animate on mount instead of when scrolled into view. */
  onMount?: boolean
  /** Motion style of each piece. */
  variant?: "rise" | "drop" | "blur"
  id?: string
}

const VARIANTS = {
  rise: { hidden: { y: "105%" }, shown: { y: "0%" } },
  drop: { hidden: { y: "-105%" }, shown: { y: "0%" } },
  blur: { hidden: { opacity: 0, filter: "blur(12px)" }, shown: { opacity: 1, filter: "blur(0px)" } },
}

/** Masked, staggered text reveal. The full string stays readable to screen readers. */
export function SplitText({
  text,
  as: Tag = "span",
  className,
  by = "chars",
  delay = 0,
  stagger,
  onMount,
  variant = "rise",
  id,
}: Props) {
  const words = text.split(" ")
  const step = stagger ?? (by === "chars" ? 0.028 : 0.07)
  const trigger = onMount
    ? { initial: "hidden", animate: "shown" }
    : { initial: "hidden", whileInView: "shown", viewport: { once: true, amount: 0.4 } }
  const mask = variant === "blur" ? "" : "overflow-hidden"
  let index = 0

  return (
    <Tag id={id} className={className} aria-label={text}>
      <motion.span aria-hidden className="inline" {...trigger}>
        {words.map((word, w) => (
          <span key={w} className="inline-block whitespace-nowrap">
            {by === "words" ? (
              <span className={cx("inline-block pb-[0.08em]", mask)}>
                <motion.span
                  className="inline-block"
                  variants={VARIANTS[variant]}
                  transition={{ duration: 0.9, ease: EASE, delay: delay + index++ * step }}
                >
                  {word}
                </motion.span>
              </span>
            ) : (
              [...word].map((char, c) => (
                <span key={c} className={cx("inline-block pb-[0.08em]", mask)}>
                  <motion.span
                    className="inline-block"
                    variants={VARIANTS[variant]}
                    transition={{ duration: 0.8, ease: EASE, delay: delay + index++ * step }}
                  >
                    {char}
                  </motion.span>
                </span>
              ))
            )}
            {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
