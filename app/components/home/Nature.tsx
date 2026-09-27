import type { ReactNode } from "react"

// Nature in the site's palette: dark olive leaves lit with lime.
export function NatureDefs() {
  return (
    <>
      <linearGradient id="n-leaf" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#7c8f25" />
        <stop offset="55%" stopColor="#4b5a17" />
        <stop offset="100%" stopColor="#27300d" />
      </linearGradient>
      <linearGradient id="n-leaf-dark" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#56661b" />
        <stop offset="100%" stopColor="#1f260a" />
      </linearGradient>
      <linearGradient id="n-pot" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#bdb9ae" />
        <stop offset="40%" stopColor="#efece5" />
        <stop offset="100%" stopColor="#9d998f" />
      </linearGradient>
      <filter id="n-shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.55" />
      </filter>
    </>
  )
}

/* ------------------------------------------------------------------ shapes */

/** A tall rounded leaf pointing up (−y) from its base at (0, 0). */
const BROAD = "M 0 0 C -15 -10 -18 -42 0 -62 C 18 -42 15 -10 0 0 Z"
const BROAD_RIB = "M 0 -3 L 0 -54 M 0 -18 L -7 -26 M 0 -18 L 7 -26 M 0 -34 L -6 -42 M 0 -34 L 6 -42"

type Sway = { deg: number; dur: number; begin?: number }

/**
 * Wraps a piece of foliage placed at (x, y) and pointing along `angle`: it
 * unfurls from its base on load and then sways. Positioned with plain SVG
 * transforms and animated with SMIL, so the pivot is always the base.
 */
function Sprout({
  x,
  y,
  angle = 0,
  delay,
  sway,
  allowed,
  children,
}: {
  x: number
  y: number
  angle?: number
  delay: number
  sway: Sway
  allowed: boolean
  children: ReactNode
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <g>
        {allowed && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            values={`0; ${sway.deg}; 0; ${-sway.deg * 0.6}; 0`}
            dur={`${sway.dur}s`}
            begin={`${sway.begin ?? 0}s`}
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.45 0 0.55 1; 0.45 0 0.55 1; 0.45 0 0.55 1; 0.45 0 0.55 1"
          />
        )}
        <g transform={allowed ? "scale(0)" : undefined}>
          {allowed && (
            <animateTransform
              attributeName="transform"
              type="scale"
              values="0; 1.06; 1"
              keyTimes="0; 0.7; 1"
              calcMode="spline"
              keySplines="0.16 1 0.3 1; 0.45 0 0.55 1"
              dur="1s"
              begin={`${delay}s`}
              fill="freeze"
            />
          )}
          {children}
        </g>
      </g>
    </g>
  )
}

function BroadLeaf({ size = 1, dark }: { size?: number; dark?: boolean }) {
  return (
    <g transform={`scale(${size})`} filter="url(#n-shadow)">
      <path d={BROAD} fill={dark ? "url(#n-leaf-dark)" : "url(#n-leaf)"} />
      <path d={BROAD_RIB} stroke="#c8f23d" strokeOpacity="0.35" strokeWidth="0.7" fill="none" strokeLinecap="round" />
    </g>
  )
}

/* ------------------------------------------------------------------ potted plant */

const PLANT_LEAVES: Array<{ sx: number; sy: number; a: number; s: number; stem: string; dark?: boolean }> = [
  { sx: -30, sy: -112, a: -48, s: 0.9, stem: "M 0 -30 C -6 -60 -22 -90 -30 -112" },
  { sx: 24, sy: -126, a: 30, s: 0.95, stem: "M 2 -30 C 8 -70 20 -100 24 -126", dark: true },
  { sx: -40, sy: -160, a: -62, s: 1, stem: "M -2 -30 C -10 -80 -30 -130 -40 -160" },
  { sx: -8, sy: -188, a: -14, s: 1.2, stem: "M 0 -30 C -2 -90 -6 -150 -8 -188" },
  { sx: 22, sy: -196, a: 26, s: 1.1, stem: "M 2 -30 C 6 -100 16 -160 22 -196", dark: true },
  { sx: 6, sy: -96, a: 58, s: 0.75, stem: "M 1 -30 C 3 -50 5 -76 6 -96" },
]

/** A tall potted plant at the right end; its upper leaves grow out past the frame. */
export function Plant({ x, floor, delay, allowed }: { x: number; floor: number; delay: number; allowed: boolean }) {
  return (
    <g transform={`translate(${x} ${floor})`}>
      <g>
        {allowed && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 0 -30; 1.2 0 -30; 0 0 -30; -0.8 0 -30; 0 0 -30"
            dur="7s"
            repeatCount="indefinite"
          />
        )}
        {PLANT_LEAVES.map((l) => (
          <Stem key={l.stem} d={l.stem} delay={delay} allowed={allowed} />
        ))}
        {PLANT_LEAVES.map((l, i) => (
          <Sprout
            key={i}
            x={l.sx}
            y={l.sy}
            angle={l.a}
            delay={delay + 0.8 + i * 0.12}
            sway={{ deg: 4, dur: 4 + (i % 3) * 0.9, begin: -i * 1.1 }}
            allowed={allowed}
          >
            <BroadLeaf size={l.s} dark={l.dark} />
          </Sprout>
        ))}
      </g>
      <path d="M -17 -31 L 17 -31 L 13 0 L -13 0 Z" fill="url(#n-pot)" />
      <rect x="-19" y="-35" width="38" height="6" rx="2" fill="#e4e0d7" />
      <ellipse cx="0" cy="-33" rx="16" ry="2" fill="#2a2418" />
    </g>
  )
}

function Stem({ d, delay, allowed, width = 2 }: { d: string; delay: number; allowed: boolean; width?: number }) {
  return (
    <path
      d={d}
      fill="none"
      stroke="#3d4813"
      strokeWidth={width}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray="1"
      strokeDashoffset={allowed ? 1 : 0}
    >
      {allowed && (
        <animate
          attributeName="stroke-dashoffset"
          from="1"
          to="0"
          dur="1.1s"
          begin={`${delay}s`}
          fill="freeze"
          calcMode="spline"
          keyTimes="0; 1"
          keySplines="0.45 0 0.2 1"
        />
      )}
    </path>
  )
}

/* ------------------------------------------------------------------ butterflies */

/**
 * A small butterfly flapping along a looping path that drifts in and out of
 * the frame. Pure SMIL: no JavaScript per frame.
 */
export function Butterfly({
  path,
  dur,
  begin,
  scale = 1,
  tint = "#e9f5b8",
}: {
  path: string
  dur: number
  begin: number
  scale?: number
  tint?: string
}) {
  return (
    <g opacity="0">
      <animate
        attributeName="opacity"
        values="0;1;1;0"
        keyTimes="0;0.05;0.95;1"
        dur={`${dur}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
      />
      <animateMotion
        dur={`${dur}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
        path={path}
        rotate="auto"
        calcMode="spline"
        keyPoints="0;1"
        keyTimes="0;1"
        keySplines="0.4 0 0.6 1"
      />
      <g transform={`rotate(90) scale(${scale})`}>
        {/* Wings flap by squashing on the body axis */}
        <g>
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1 1; 0.25 1; 1 1"
            dur="0.28s"
            repeatCount="indefinite"
          />
          <path d="M 0 0 C -9 -9 -12 -2 -8 3 C -5 6 -2 4 0 0 Z" fill={tint} opacity="0.95" />
          <path d="M 0 0 C 9 -9 12 -2 8 3 C 5 6 2 4 0 0 Z" fill={tint} opacity="0.95" />
          <path d="M 0 0 C -6 4 -7 9 -3 9 C -1 8 0 4 0 0 Z" fill="#c8f23d" opacity="0.8" />
          <path d="M 0 0 C 6 4 7 9 3 9 C 1 8 0 4 0 0 Z" fill="#c8f23d" opacity="0.8" />
        </g>
        <ellipse cx="0" cy="1.5" rx="0.9" ry="4" fill="#1a1a18" />
      </g>
    </g>
  )
}

/** Now and then a leaf lets go from the potted plant and drifts to the floor. */
export function FallingLeaf({ from, delay }: { from: [number, number]; delay: number }) {
  const [x, y] = from
  const path = `M ${x} ${y} C ${x - 40} ${y + 30} ${x - 10} ${y + 70} ${x - 70} ${y + 100} S ${x - 120} ${y + 150} ${x - 160} 196`
  return (
    <g opacity="0">
      <animate
        attributeName="opacity"
        values="0; 1; 1; 0; 0"
        keyTimes="0; 0.05; 0.45; 0.55; 1"
        dur="14s"
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
      <g>
        <animateMotion
          dur="14s"
          begin={`${delay}s`}
          repeatCount="indefinite"
          rotate="auto"
          keyPoints="0; 1; 1"
          keyTimes="0; 0.55; 1"
          calcMode="linear"
          path={path}
        />
        <g transform="rotate(90) scale(0.32)">
          <BroadLeaf />
        </g>
      </g>
    </g>
  )
}
