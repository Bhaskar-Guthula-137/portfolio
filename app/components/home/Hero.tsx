import { motion, type MotionValue, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion"
import { type ReactNode, useEffect, useRef } from "react"
import { Link } from "react-router"

import { siteConfig } from "~/data/site-config"
import { LOGO_FONT_PX, navLogoOpacity } from "~/lib/brand"
import { BOOT, EASE, useScenes, useSectionProgress } from "~/lib/motion"
import { DeveloperScene, SceneNotes } from "./DeveloperScene"
import { IntroLayer, IntroStatic, useIntroColors } from "./Intro"

// The entrance plays in full once per page load; returning later replays it quickly.
let booted = false
function useBootSpeed() {
  const speed = useRef(booted ? 0.35 : 1).current
  useEffect(() => {
    booted = true
  }, [])
  return (beat: number) => beat * speed
}

/**
 * The hero: a name, a profession, a small developer scene, one sentence, two
 * links. On scroll the developer rolls across the frame, the hero recedes,
 * and the intro statement enters in its place.
 */
export function Hero() {
  const scenes = useScenes()
  const t = useBootSpeed()
  const ref = useRef<HTMLElement>(null)
  const p = useSectionProgress(ref)

  // The name shrinks and travels up into the navbar, where it becomes the logo.
  const nameRef = useRef<HTMLHeadingElement>(null)
  const morph = { dx: useMotionValue(0), dy: useMotionValue(0), scale: useMotionValue(1) }
  useEffect(() => {
    const measure = () => {
      const el = nameRef.current
      if (!el) return
      // Offsets ignore transforms, so this works even mid-scroll.
      const cx = el.offsetLeft + el.offsetWidth / 2
      const cy = el.offsetTop + el.offsetHeight / 2
      morph.dx.set(window.innerWidth / 2 - cx)
      morph.dy.set(28 - cy)
      morph.scale.set(LOGO_FONT_PX / parseFloat(getComputedStyle(el).fontSize))
    }
    measure()
    document.fonts?.ready.then(measure)
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [scenes]) // eslint-disable-line react-hooks/exhaustive-deps
  const MORPH_END = 0.12
  const eased = useTransform(p, [0, MORPH_END], [0, 1], { ease: (v) => 1 - Math.pow(1 - v, 3) })
  const nameX = useTransform(() => morph.dx.get() * eased.get())
  const nameY = useTransform(() => morph.dy.get() * eased.get())
  const nameScale = useTransform(() => 1 + (morph.scale.get() - 1) * eased.get())
  const nameOpacity = useTransform(p, [MORPH_END - 0.005, MORPH_END + 0.005], [1, 0])

  // Hand the name over to the navbar logo, and give it back on the way out.
  useEffect(() => {
    if (!scenes) return
    navLogoOpacity.set(p.get() >= MORPH_END ? 1 : 0)
    return () => navLogoOpacity.set(1)
  }, [scenes, p])
  useMotionValueEvent(p, "change", (v) => {
    if (scenes) navLogoOpacity.set(Math.min(1, Math.max(0, (v - (MORPH_END - 0.005)) / 0.01)))
  })

  // Profession after the name, the scene last and slowest.
  const roleY = useTransform(p, [0, 0.24], ["0vh", "-10vh"])
  const roleOpacity = useTransform(p, [0.02, 0.14], [1, 0])
  const sceneY = useTransform(p, [0, 0.28], ["0vh", "-6vh"])
  const sceneScale = useTransform(p, [0, 0.28], [1, 1.06])
  const sceneOpacity = useTransform(p, [0.2, 0.3], [1, 0])
  const sceneRoll = useTransform(p, [0.01, 0.27], [0, 1])
  const textY = useTransform(p, [0, 0.2], ["0vh", "-4vh"])
  const textOpacity = useTransform(p, [0.02, 0.1], [1, 0])
  const cueOpacity = useTransform(p, [0, 0.04], [1, 0])
  const introP = useTransform(p, [0.28, 1], [0, 1])
  const introOpacity = useTransform(p, [0.27, 0.33], [0, 1])
  const { bg, fg } = useIntroColors(introP)

  if (!scenes)
    return (
      <>
        <section
          aria-labelledby="hero-title"
          className="relative flex min-h-svh items-center justify-center bg-ink text-warm"
        >
          <HeroContent t={t} />
        </section>
        <IntroStatic />
      </>
    )

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative h-[430svh]">
      <motion.div className="sticky top-0 h-svh overflow-hidden" style={{ backgroundColor: bg, color: fg }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <HeroContent
            t={t}
            nameRef={nameRef}
            motion={{
              nameX,
              nameY,
              nameScale,
              nameOpacity,
              roleY,
              roleOpacity,
              sceneY,
              sceneScale,
              sceneOpacity,
              sceneRoll,
              textY,
              textOpacity,
            }}
          />
        </div>

        <motion.div
          className="gutter label pointer-events-none absolute inset-x-0 bottom-7 flex justify-between text-warm/40"
          style={{ opacity: cueOpacity }}
        >
          <Fade delay={t(BOOT.meta)}>
            {siteConfig.location.city} · {siteConfig.location.country}
          </Fade>
          <Fade delay={t(BOOT.meta) + 0.05}>Scroll ↓</Fade>
        </motion.div>

        <motion.div className="absolute inset-0" style={{ opacity: introOpacity }}>
          <IntroLayer p={introP} />
        </motion.div>
      </motion.div>
    </section>
  )
}

type HeroMotion = {
  nameX: MotionValue<number>
  nameY: MotionValue<number>
  nameScale: MotionValue<number>
  nameOpacity: MotionValue<number>
  roleY: MotionValue<string>
  roleOpacity: MotionValue<number>
  sceneY: MotionValue<string>
  sceneScale: MotionValue<number>
  sceneOpacity: MotionValue<number>
  sceneRoll: MotionValue<number>
  textY: MotionValue<string>
  textOpacity: MotionValue<number>
}

function HeroContent({
  t,
  motion: m,
  nameRef,
}: {
  t: (beat: number) => number
  motion?: HeroMotion
  nameRef?: React.RefObject<HTMLHeadingElement | null>
}) {
  return (
    <div className="gutter flex w-full flex-col items-center text-center">
      <HairLine delay={t(BOOT.line)} />

      {/* The name, small — the same mark that becomes the navbar logo */}
      <motion.h1
        ref={nameRef}
        id="hero-title"
        aria-label={siteConfig.name}
        className="display text-[26px] leading-[0.84] lg:text-[2.2vw]"
        style={m && { x: m.nameX, y: m.nameY, scale: m.nameScale, opacity: m.nameOpacity }}
      >
        <Word text={siteConfig.firstName} delay={t(BOOT.first)} className="-translate-x-[0.45em]" />
        <Word text={siteConfig.lastName} delay={t(BOOT.first) + 0.08} className="translate-x-[0.45em]" />
      </motion.h1>

      {/* The profession, in the regular typeface */}
      <motion.div style={m && { y: m.roleY, opacity: m.roleOpacity }}>
        <p
          className="mt-6 text-[10vw] leading-none font-medium tracking-[-0.035em] text-warm lg:mt-7 lg:text-[4.4vw]"
          aria-label={siteConfig.title}
        >
          <span aria-hidden>
            {siteConfig.title.split(" ").map((word, i, all) => (
              <span key={word}>
                <Word text={word} delay={t(BOOT.last) + i * 0.14} inline />
                {i < all.length - 1 && " "}
              </span>
            ))}
          </span>
          <motion.span
            aria-hidden
            className="inline-block text-accent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: t(BOOT.role) + 0.2 }}
          >
            .
          </motion.span>
        </p>
      </motion.div>

      <motion.div
        className="relative mt-10 lg:mt-12"
        style={m && { y: m.sceneY, scale: m.sceneScale, opacity: m.sceneOpacity }}
      >
        <SceneNotes delay={t(BOOT.frame) + 1.2} />
        <DeveloperScene delay={t(BOOT.frame)} scroll={m?.sceneRoll} />
      </motion.div>

      <motion.div style={m && { y: m.textY, opacity: m.textOpacity }}>
        <Fade delay={t(BOOT.statement)}>
          <p className="mx-auto mt-10 max-w-[22rem] text-lg leading-snug text-warm/65 lg:max-w-[30rem] lg:text-xl">
            {siteConfig.hero.statement}
          </p>
        </Fade>
        <Fade
          delay={t(BOOT.actions)}
          className="label mt-9 flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-8"
        >
          <TextLink to="/#contact" arrow="↗" primary>
            Start a project
          </TextLink>
          <span aria-hidden className="hidden text-warm/25 sm:inline">
            ·
          </span>
          <TextLink to="/#work" arrow="↓">
            View work
          </TextLink>
        </Fade>
      </motion.div>
    </div>
  )
}

/** Step two of the entrance: a hairline that draws, then gives way to the name. */
function HairLine({ delay }: { delay: number }) {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute top-1/2 left-1/2 h-px w-[40vw] -translate-x-1/2 bg-warm/40"
      initial={{ scaleX: 0, opacity: 1 }}
      animate={{ scaleX: [0, 1, 1], opacity: [1, 1, 0] }}
      transition={{ duration: 0.9, times: [0, 0.5, 1], ease: EASE, delay }}
    />
  )
}

/** A word revealed letter by letter through a mask. */
function Word({
  text,
  delay,
  className,
  inline,
}: {
  text: string
  delay: number
  className?: string
  inline?: boolean
}) {
  return (
    <span aria-hidden className={`${inline ? "inline-block whitespace-nowrap" : "block"} ${className ?? ""}`}>
      {[...text].map((char, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.04em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "70%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE, delay: delay + i * 0.03 }}
          >
            {char}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/** Text-only link: the underline extends, the label and arrow shift on hover. */
function TextLink({
  to,
  arrow,
  primary,
  children,
}: {
  to: string
  arrow: string
  primary?: boolean
  children: ReactNode
}) {
  return (
    <Link
      to={to}
      className={`group relative inline-flex items-center gap-2.5 pb-2 ${primary ? "text-warm" : "text-warm/55 hover:text-warm"}`}
    >
      <span className="transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-0.5">
        {children}
      </span>
      <span
        aria-hidden
        className={`transition-transform duration-500 ease-[var(--ease-expo)] ${arrow === "↓" ? "group-hover:translate-y-0.5" : "group-hover:translate-x-1 group-hover:-translate-y-0.5"}`}
      >
        {arrow}
      </span>
      <span
        aria-hidden
        className={`absolute bottom-0 left-0 h-px origin-left transition-transform duration-500 ease-[var(--ease-expo)] ${
          primary
            ? "w-full scale-x-[0.35] bg-accent group-hover:scale-x-100"
            : "w-full scale-x-0 bg-warm/60 group-hover:scale-x-100"
        }`}
      />
    </Link>
  )
}

function Fade({ children, delay, className }: { children: ReactNode; delay: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}
