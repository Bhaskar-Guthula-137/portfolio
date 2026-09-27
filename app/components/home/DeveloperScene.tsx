import {
  motion,
  type MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion"
import { useEffect, useRef, useState } from "react"

import { siteConfig } from "~/data/site-config"
import { EASE, useMedia, useMotionAllowed } from "~/lib/motion"
import { Butterfly, FallingLeaf, NatureDefs, Plant } from "./Nature"

// Scene space: a W × 220 capsule, floor at y = 200. Phones get a narrower
// capsule so the figure stays a readable size.
const H = 220
const R = H / 2 - 1
const FLOOR = 200
const CASTER_R = 6.5
const SCALE = 0.84
// The trading desk occupies the left of the capsule; the chair stays clear of it.
const DESK = { left: 40, right: 212, top: 124 }

const capsule = (w: number) =>
  `M ${R + 1} 1 H ${w - R - 1} A ${R} ${R} 0 0 1 ${w - R - 1} ${H - 1} H ${R + 1} A ${R} ${R} 0 0 1 ${R + 1} 1 Z`

type Props = {
  /** Seconds before the frame starts drawing. */
  delay: number
  /** Hero scroll progress, 0 → 1 over the hero's part of the scene. */
  scroll?: MotionValue<number>
}

/**
 * A developer leaning back in a rolling chair, hands behind their neck, in
 * front of a trading desk. The chair rolls to follow the cursor (or a finger
 * dragged across the capsule); on scroll it rolls away from the desk.
 */
export function DeveloperScene({ delay, scroll }: Props) {
  const allowed = useMotionAllowed()
  const wide = useMedia("(min-width: 640px)")
  const W = wide ? 760 : 540
  const CAPSULE = capsule(W)
  const minX = DESK.right + 40
  const maxX = W - R - 92
  const home = minX + 18

  const box = useRef<HTMLDivElement>(null)
  const arrived = useRef(false)

  // Where the chair wants to be; a heavily damped spring rolls it there.
  const target = useMotionValue(allowed ? maxX + 60 : home)
  const follow = useSpring(target, { stiffness: 24, damping: 14, mass: 1.4 })

  useEffect(() => {
    if (!allowed) {
      target.set(home)
      follow.jump(home)
      return
    }
    // Roll in from the right to the desk, then start listening to the pointer.
    let inner = 0
    const outer = window.setTimeout(
      () => {
        target.set(home)
        inner = window.setTimeout(() => (arrived.current = true), 1400)
      },
      (delay + 0.4) * 1000,
    )
    return () => {
      window.clearTimeout(outer)
      window.clearTimeout(inner)
    }
  }, [allowed, delay, home, follow, target])

  const toScene = (clientX: number) => {
    const rect = box.current?.getBoundingClientRect()
    if (!rect) return home
    const x = ((clientX - rect.left) / rect.width) * W
    return Math.max(minX, Math.min(maxX, x))
  }

  useEffect(() => {
    if (!allowed) return
    const move = (e: PointerEvent) => e.pointerType === "mouse" && arrived.current && target.set(toScene(e.clientX))
    window.addEventListener("pointermove", move, { passive: true })
    return () => window.removeEventListener("pointermove", move)
  })

  // Scroll rolls the chair away from the desk.
  const still = useMotionValue(0)
  const s = scroll ?? still
  const roll = useTransform(() => follow.get() + (maxX - follow.get()) * s.get())

  // Wheels turn with distance; the body sways a little against acceleration.
  const wheel = useTransform(roll, (x) => -(x / (CASTER_R * SCALE)) * (180 / Math.PI))
  const velocity = useVelocity(roll)
  const leanRaw = useTransform(velocity, (v) => Math.max(-3, Math.min(3, v / 90)))
  const lean = useSpring(leanRaw, { stiffness: 60, damping: 16 })
  const leanRef = useRef<SVGGElement>(null)
  useMotionValueEvent(lean, "change", (v) =>
    leanRef.current?.setAttribute("transform", `rotate(${v.toFixed(2)} -6 -80)`),
  )

  return (
    <div
      ref={box}
      className="relative w-[min(820px,88vw)] touch-pan-y"
      style={{ aspectRatio: `${W} / ${H}` }}
      onPointerDown={(e) => e.pointerType !== "mouse" && allowed && target.set(toScene(e.clientX))}
      onPointerMove={(e) => e.pointerType !== "mouse" && allowed && e.buttons && target.set(toScene(e.clientX))}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 h-full w-full overflow-visible"
        role="img"
        aria-label="Illustration: a developer leaning back in an office chair with hands behind their neck, beside a desk with three trading monitors."
      >
        <defs>
          <clipPath id="dev-capsule">
            <path d={CAPSULE} />
          </clipPath>
          <radialGradient id="dev-light" cx="50%" cy="85%" r="60%">
            <stop offset="0%" stopColor="#f6f4ee" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#f6f4ee" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="dev-floor" x1="0" x2="1">
            <stop offset="0%" stopColor="#f6f4ee" stopOpacity="0" />
            <stop offset="50%" stopColor="#f6f4ee" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#f6f4ee" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="dev-rim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6f4ee" stopOpacity="0.28" />
            <stop offset="45%" stopColor="#f6f4ee" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#f6f4ee" stopOpacity="0.16" />
          </linearGradient>
          <linearGradient id="g-seat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a3935" />
            <stop offset="100%" stopColor="#121211" />
          </linearGradient>
          <linearGradient id="g-chrome" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5d5b55" />
            <stop offset="45%" stopColor="#c9c5bc" />
            <stop offset="100%" stopColor="#4a4843" />
          </linearGradient>
          <linearGradient id="g-hoodie" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b3a36" />
            <stop offset="60%" stopColor="#262523" />
            <stop offset="100%" stopColor="#181817" />
          </linearGradient>
          <linearGradient id="g-desk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a3935" />
            <stop offset="100%" stopColor="#1f1f1d" />
          </linearGradient>
          <radialGradient id="g-skin" cx="60%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#cfa07e" />
            <stop offset="100%" stopColor="#8e6146" />
          </radialGradient>
          <radialGradient id="g-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c8f23d" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#c8f23d" stopOpacity="0" />
          </radialGradient>
          <NatureDefs />
          <filter id="dev-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* Studio light and floor line */}
        <g clipPath="url(#dev-capsule)">
          <rect width={W} height={H} fill="url(#dev-light)" />
          <rect x="40" y={FLOOR} width={W - 80} height="1" fill="url(#dev-floor)" />
        </g>

        {/* The frame, drawn in on load, with a dot travelling its edge */}
        <motion.path
          d={CAPSULE}
          fill="none"
          stroke="url(#dev-rim)"
          strokeWidth="1.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay }}
        />
        {allowed && (
          <motion.circle
            r="2.4"
            fill="var(--color-accent)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: delay + 1.4 }}
          >
            <animateMotion dur="16s" repeatCount="indefinite" path={CAPSULE} />
          </motion.circle>
        )}

        <g clipPath="url(#dev-capsule)">
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: delay + 0.3 }}>
            <TradingDesk allowed={allowed} />
          </motion.g>

          <motion.ellipse
            cx="0"
            cy="0"
            rx="58"
            ry="5"
            fill="#000"
            opacity="0.55"
            filter="url(#dev-soft)"
            style={{ x: roll, y: FLOOR }}
          />

          {/* Chair and developer move as one piece. Drawn facing right, mirrored to face the desk. */}
          <motion.g style={{ x: roll, y: FLOOR }}>
            <g transform={`scale(${-SCALE} ${SCALE})`}>
              <Chair wheel={wheel} />
              <g ref={leanRef}>
                <Developer allowed={allowed} />
              </g>
            </g>
          </motion.g>
        </g>

        {/* Nature, drawn over the frame so it grows across the border */}
        <Plant x={W - 84} floor={FLOOR} delay={delay + 0.9} allowed={allowed} />
        {allowed && (
          <>
            <FallingLeaf from={[W - 110, 40]} delay={delay + 5} />
            <Butterfly
              path={`M ${W - 60} 120 C ${W - 10} 60 ${W - 40} -30 ${W - 100} -22 C ${W - 160} -12 ${W - 150} 70 ${W - 112} 88 C ${W - 82} 104 ${W - 90} 150 ${W - 60} 120`}
              dur={11}
              begin={delay + 2.5}
            />
            <Butterfly
              path="M 70 40 C 30 10 70 -34 128 -24 C 186 -14 204 36 156 58 C 116 76 104 92 70 40"
              dur={13}
              begin={delay + 4}
              scale={0.8}
              tint="#f6f4ee"
            />
            {/* Drifts across the whole scene and out the other side */}
            <Butterfly
              path={`M -30 70 C ${W * 0.22} -14 ${W * 0.38} 96 ${W * 0.55} 34 S ${W * 0.8} -34 ${W + 30} 46`}
              dur={16}
              begin={delay + 6}
              scale={0.9}
            />
            {/* Flutters around the developer */}
            <Butterfly
              path={`M ${W * 0.46} 46 C ${W * 0.5} 6 ${W * 0.6} 16 ${W * 0.58} 58 C ${W * 0.56} 96 ${W * 0.47} 84 ${W * 0.46} 46`}
              dur={9}
              begin={delay + 3.2}
              scale={0.65}
              tint="#d9ee8a"
            />
            {/* Wanders just below the frame */}
            <Butterfly
              path={`M ${W * 0.18} 246 C ${W * 0.34} 212 ${W * 0.5} 264 ${W * 0.64} 228 S ${W * 0.84} 252 ${W * 0.92} 214`}
              dur={14}
              begin={delay + 8}
              scale={0.75}
              tint="#f6f4ee"
            />
          </>
        )}
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ chair */

function Chair({ wheel }: { wheel: MotionValue<number> }) {
  return (
    <g>
      <Caster x={-44} r={CASTER_R - 0.8} wheel={wheel} dim />
      <Caster x={44} r={CASTER_R - 0.8} wheel={wheel} dim />
      <path d="M -44 -13 L 0 -17 L 44 -13" stroke="#2a2a27" strokeWidth="5" strokeLinecap="round" fill="none" />
      <rect x="-3.5" y="-62" width="7" height="48" rx="2" fill="url(#g-chrome)" />
      <rect x="-6" y="-24" width="12" height="6" rx="3" fill="#1b1b19" />
      <path d="M -26 -9 L 0 -17 L 26 -9" stroke="#1d1d1b" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <Caster x={-26} r={CASTER_R} wheel={wheel} />
      <Caster x={26} r={CASTER_R} wheel={wheel} />
      {/* Reclined backrest with a headrest */}
      <g transform="rotate(-22 -30 -72)">
        <rect x="-34" y="-86" width="7" height="20" rx="3.5" fill="#242421" />
        <rect x="-46" y="-168" width="22" height="90" rx="11" fill="url(#g-seat)" />
        <rect x="-43" y="-162" width="4" height="76" rx="2" fill="#f6f4ee" opacity="0.06" />
      </g>
      {/* Seat and armrest */}
      <rect x="-36" y="-76" width="72" height="15" rx="7.5" fill="url(#g-seat)" />
      <rect x="-30" y="-75" width="58" height="2.5" rx="1.25" fill="#f6f4ee" opacity="0.12" />
    </g>
  )
}

function Caster({ x, r, wheel, dim }: { x: number; r: number; wheel: MotionValue<number>; dim?: boolean }) {
  const cy = -r
  const spoke = useRef<SVGGElement>(null)
  useMotionValueEvent(wheel, "change", (deg) =>
    spoke.current?.setAttribute("transform", `rotate(${deg.toFixed(1)} ${x} ${cy})`),
  )
  return (
    <g opacity={dim ? 0.7 : 1}>
      <circle cx={x} cy={cy} r={r} fill="#161615" stroke="#45443f" strokeWidth="1" />
      <g ref={spoke}>
        <line x1={x - r + 1.8} y1={cy} x2={x + r - 1.8} y2={cy} stroke="#6a675f" strokeWidth="1.2" />
        <circle cx={x + r - 2.4} cy={cy} r="0.9" fill="#9a968d" />
      </g>
      <circle cx={x} cy={cy} r="1.6" fill="#8a877f" />
    </g>
  )
}

/* ------------------------------------------------------------------ developer */

const PANTS = "#4b4841"
const PANTS_LIGHT = "#645f56"
const SKIN = "#a9765a"

/**
 * Leaning back, hands laced behind the neck, legs stretched out and crossed.
 * One continuous silhouette: every part overlaps the next, so nothing floats.
 * Drawn facing right; the scene mirrors it.
 */
function Developer({ allowed }: { allowed: boolean }) {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      {/* Far leg, a shade darker */}
      <path d="M -4 -82 L 36 -80 L 90 -12" stroke="#3a3833" strokeWidth="17" fill="none" />
      <Shoe x={92} y={-8} far />

      {/* Upper body breathes slowly, pivoting at the hips */}
      <g>
        {allowed && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 -6 -80; -1.6 -6 -80; 0 -6 -80"
            dur="4.4s"
            repeatCount="indefinite"
          />
        )}
        {/* Far arm, behind the body */}
        <path d="M -28 -138 L -50 -186 L -40 -166" stroke="#1b1a19" strokeWidth="11" fill="none" />

        {/* Torso — one hoodie shape from hips to shoulders */}
        <path
          d="M -26 -74 C -33 -96 -40 -118 -42 -136 C -43 -147 -34 -152 -24 -150 C -12 -146 -2 -132 4 -116 C 10 -100 14 -86 14 -76 Q -6 -69 -26 -74 Z"
          fill="url(#g-hoodie)"
        />
        <path
          d="M -36 -130 C -34 -112 -29 -96 -24 -82"
          stroke="#f6f4ee"
          strokeOpacity="0.07"
          strokeWidth="3"
          fill="none"
        />
        {/* Drawstrings */}
        <path
          d="M -12 -141 L -8 -128 M -8 -143 L -3 -131"
          stroke="#bdb9ae"
          strokeOpacity="0.5"
          strokeWidth="1.2"
          fill="none"
        />
        {/* Hood bunched behind the neck */}
        <path d="M -42 -140 Q -48 -156 -36 -160 Q -28 -158 -28 -150 Z" fill="#1c1b1a" />

        {/* Neck, overlapping both torso and head */}
        <path d="M -30 -148 L -27 -162 L -17 -160 L -19 -146 Z" fill="#946247" />
        {/* Headphones resting around the neck */}
        <path d="M -34 -152 Q -24 -144 -14 -153" stroke="#0e0e0d" strokeWidth="3.4" fill="none" />
        <ellipse cx="-15" cy="-153" rx="3.6" ry="5.2" fill="#0e0e0d" />

        {/* Head, tilted back a touch — eyes closed, relaxed */}
        <g transform="rotate(-10 -24 -170)">
          <circle cx="-24" cy="-170" r="14" fill="url(#g-skin)" />
          <path d="M -10 -171 q 3 2 1 5" stroke="#8e6146" strokeWidth="1.6" fill="none" />
          <path d="M -17 -174 q 2.5 1.6 5 0" stroke="#2a1d15" strokeWidth="1.2" fill="none" />
          <path d="M -16 -164 q 2.5 2 5 0.5" stroke="#6b4331" strokeWidth="1.2" fill="none" />
          <ellipse cx="-27" cy="-169" rx="3" ry="4" fill="#946247" />
          <path
            d="M -10 -178 C -12 -190 -30 -192 -38 -182 C -42 -175 -41 -165 -36 -160 L -32 -164 C -34 -172 -28 -178 -20 -179 C -16 -179 -12 -177 -10 -178 Z"
            fill="#161513"
          />
        </g>

        {/* Near arm: elbow up and back, hand laced behind the neck */}
        <path d="M -26 -138 L -44 -190 L -36 -164" stroke="#2c2b28" strokeWidth="12" fill="none" />
        <path d="M -28 -142 L -42 -182" stroke="#f6f4ee" strokeOpacity="0.08" strokeWidth="3" fill="none" />
        <ellipse cx="-35" cy="-160" rx="5" ry="4.2" fill={SKIN} />
      </g>

      {/* Hips join the torso to the legs */}
      <ellipse cx="-6" cy="-80" rx="22" ry="12" fill={PANTS} />

      {/* Near leg, stretched out */}
      <path d="M -4 -80 L 38 -76 L 84 -14" stroke={PANTS} strokeWidth="19" fill="none" />
      <path d="M 0 -86 L 38 -83" stroke={PANTS_LIGHT} strokeWidth="4" fill="none" />
      <g>
        {allowed && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 82 -8; -7 82 -8; 0 82 -8; 0 82 -8"
            keyTimes="0; 0.25; 0.5; 1"
            dur="3.2s"
            repeatCount="indefinite"
          />
        )}
        <Shoe x={86} y={-10} />
      </g>
    </g>
  )
}

/** A sneaker whose ankle point (x, y) sits inside the shoe, so it never detaches. */
function Shoe({ x, y, far }: { x: number; y: number; far?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M -8 -8 Q -6 -15 3 -13 L 16 -7 Q 22 -4 20 3 L 19 6 L -6 6 Q -10 -1 -8 -8 Z"
        fill={far ? "#bdb9ae" : "#efece5"}
      />
      <rect x="-7" y="4" width="27" height="2.6" rx="1.3" fill={far ? "#7d7a72" : "#a9a59b"} />
    </g>
  )
}

/* ------------------------------------------------------------------ trading desk */

// Deterministic price walk for the charts.
function series(seed: number, n: number) {
  const out: number[] = []
  let v = 50
  for (let i = 0; i < n; i++) {
    const r = Math.sin((i + seed) * 12.9898) * 43758.5453
    v += (r - Math.floor(r) - 0.47) * 16
    v = Math.max(12, Math.min(88, v))
    out.push(v)
  }
  return out
}

/** Three monitors on a desk: candles, a price line, and an order book. They tick while visible. */
function TradingDesk({ allowed }: { allowed: boolean }) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (!allowed) return
    const id = window.setInterval(() => setTick((t) => t + 1), 1300)
    return () => window.clearInterval(id)
  }, [allowed])

  const { left, right, top } = DESK
  return (
    <g>
      {/* Screen light spilling onto the floor */}
      <ellipse cx="126" cy="150" rx="110" ry="60" fill="url(#g-glow)" />

      {/* Monitor arm pole */}
      <rect x="124" y="40" width="4" height={top - 40} fill="#2a2a27" />
      <Monitor x={90} y={22} w={72} h={42}>
        <Candles tick={tick} />
      </Monitor>
      <Monitor x={52} y={70} w={70} h={42}>
        <PriceLine tick={tick} />
      </Monitor>
      <Monitor x={130} y={70} w={70} h={42}>
        <OrderBook tick={tick} />
      </Monitor>

      {/* Desk */}
      <rect x={left} y={top} width={right - left} height="6" rx="2" fill="url(#g-desk)" />
      <rect x={left + 2} y={top} width={right - left - 4} height="1" fill="#f6f4ee" opacity="0.14" />
      <rect x={left + 8} y={top + 6} width="3" height={FLOOR - top - 6} fill="#232321" />
      <rect x={right - 12} y={top + 6} width="3" height={FLOOR - top - 6} fill="#232321" />
      {/* Keyboard and a mug */}
      <rect x="150" y={top - 3} width="38" height="3" rx="1" fill="#1a1a18" stroke="#3a3935" strokeWidth="0.6" />
      <g transform={`translate(62 ${top - 12})`}>
        <rect width="8" height="12" rx="1.5" fill="#d8d4ca" />
        <path d="M 8 3 q 4 0 4 3 q 0 3 -4 3" stroke="#d8d4ca" strokeWidth="1.4" fill="none" />
      </g>
    </g>
  )
}

function Monitor({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children: React.ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* Stand */}
      <rect x={w / 2 - 2} y={h} width="4" height={DESK.top - y - h} fill="#2a2a27" />
      <rect x={w / 2 - 10} y={DESK.top - y - 2} width="20" height="2" rx="1" fill="#2a2a27" />
      {/* Bezel and screen */}
      <rect width={w} height={h} rx="2.5" fill="#121211" stroke="#3a3935" strokeWidth="0.8" />
      <rect x="2.5" y="2.5" width={w - 5} height={h - 5} rx="1" fill="#0b0c0a" />
      <svg x="2.5" y="2.5" width={w - 5} height={h - 5} viewBox="0 0 100 60" preserveAspectRatio="none">
        {children}
      </svg>
    </g>
  )
}

function Candles({ tick }: { tick: number }) {
  const data = series(tick, 16)
  return (
    <g>
      {[15, 30, 45].map((y) => (
        <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="#f6f4ee" strokeOpacity="0.06" />
      ))}
      {data.map((v, i) => {
        const prev = i ? data[i - 1] : v - 3
        const up = v >= prev
        const hi = Math.max(v, prev) + 4
        const lo = Math.min(v, prev) - 4
        const cx = 4 + i * 6
        return (
          <g key={i}>
            <line
              x1={cx}
              x2={cx}
              y1={60 - hi * 0.6}
              y2={60 - lo * 0.6}
              stroke={up ? "#c8f23d" : "#8b887f"}
              strokeWidth="0.8"
            />
            <rect
              x={cx - 1.8}
              y={60 - Math.max(v, prev) * 0.6}
              width="3.6"
              height={Math.max(1, Math.abs(v - prev) * 0.6)}
              fill={up ? "#c8f23d" : "#8b887f"}
            />
          </g>
        )
      })}
      <rect x="78" y="3" width="19" height="7" rx="1" fill="#c8f23d" />
      <text x="87.5" y="8.6" textAnchor="middle" fontSize="5" fontFamily="monospace" fill="#0a0a09">
        {(data[data.length - 1] * 1.37).toFixed(1)}
      </text>
    </g>
  )
}

function PriceLine({ tick }: { tick: number }) {
  const data = series(tick * 3 + 7, 24)
  const pts = data.map((v, i) => `${(i / 23) * 100},${60 - v * 0.6}`).join(" ")
  return (
    <g>
      <polygon points={`0,60 ${pts} 100,60`} fill="#c8f23d" opacity="0.1" />
      <polyline points={pts} fill="none" stroke="#c8f23d" strokeWidth="1.2" />
      <text x="4" y="9" fontSize="5.5" fontFamily="monospace" fill="#f6f4ee" opacity="0.5">
        1m
      </text>
    </g>
  )
}

function OrderBook({ tick }: { tick: number }) {
  const rows = series(tick + 31, 10)
  return (
    <g>
      {rows.map((v, i) => {
        const bid = i >= 5
        return (
          <g key={i}>
            <rect
              x={bid ? 0 : 100 - v}
              y={3 + i * 5.6}
              width={v}
              height="4"
              fill={bid ? "#c8f23d" : "#8b887f"}
              opacity="0.35"
            />
            <rect
              x={bid ? 0 : 100 - v * 0.3}
              y={3 + i * 5.6}
              width={v * 0.3}
              height="4"
              fill={bid ? "#c8f23d" : "#8b887f"}
              opacity="0.5"
            />
          </g>
        )
      })}
      <line x1="0" x2="100" y1="30.8" y2="30.8" stroke="#f6f4ee" strokeOpacity="0.3" strokeWidth="0.6" />
    </g>
  )
}

/** Two or three tiny annotations around the scene. */
export function SceneNotes({ delay }: { delay: number }) {
  const time = useTime()
  return (
    <motion.div
      aria-hidden
      className="label pointer-events-none absolute inset-x-[8%] -bottom-7 flex justify-between text-[0.6rem] text-warm/35"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay }}
    >
      <span className="flex items-center gap-2">
        <span className="size-1 rounded-full bg-accent" /> Markets open
      </span>
      <span className="hidden sm:inline">Build · Ship · Repeat</span>
      <span className="tabular-nums">{time ? `${time} IST` : " "}</span>
    </motion.div>
  )
}

function useTime() {
  const [time, setTime] = useState<string | null>(null)
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: siteConfig.location.timeZone,
      })
    setTime(fmt())
    const id = window.setInterval(() => setTime(fmt()), 30_000)
    return () => window.clearInterval(id)
  }, [])
  return time
}
