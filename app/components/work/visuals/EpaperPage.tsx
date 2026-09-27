import { motion } from "framer-motion"

import { cx, EASE } from "~/lib/motion"

type Box = { x: number; y: number; w: number; h: number }
type Kind = "masthead" | "headline" | "image" | "story" | "quote" | "brief"
type Block = { id: string; kind: Kind; label: string; print: Box; edit: Box }

const BLOCKS: Block[] = [
  {
    id: "mast",
    kind: "masthead",
    label: "Masthead",
    print: { x: 4, y: 3, w: 92, h: 9 },
    edit: { x: 4, y: 3, w: 92, h: 9 },
  },
  {
    id: "head",
    kind: "headline",
    label: "Headline",
    print: { x: 4, y: 15, w: 60, h: 14 },
    edit: { x: 4, y: 15, w: 92, h: 12 },
  },
  {
    id: "img",
    kind: "image",
    label: "Image",
    print: { x: 66, y: 15, w: 30, h: 30 },
    edit: { x: 4, y: 30, w: 44, h: 30 },
  },
  {
    id: "s1",
    kind: "story",
    label: "Story",
    print: { x: 4, y: 32, w: 29, h: 40 },
    edit: { x: 50, y: 30, w: 22, h: 42 },
  },
  {
    id: "s2",
    kind: "story",
    label: "Story",
    print: { x: 35, y: 32, w: 29, h: 40 },
    edit: { x: 74, y: 30, w: 22, h: 42 },
  },
  {
    id: "quote",
    kind: "quote",
    label: "Pull quote",
    print: { x: 66, y: 48, w: 30, h: 24 },
    edit: { x: 4, y: 63, w: 44, h: 9 },
  },
  {
    id: "s3",
    kind: "story",
    label: "Story",
    print: { x: 4, y: 75, w: 60, h: 21 },
    edit: { x: 4, y: 75, w: 44, h: 21 },
  },
  {
    id: "brief",
    kind: "brief",
    label: "Briefs",
    print: { x: 66, y: 75, w: 30, h: 21 },
    edit: { x: 50, y: 75, w: 46, h: 21 },
  },
]

export const EPAPER_STAGES = ["Newspaper", "Page", "Blocks", "Editor"]

const pct = (b: Box) => ({ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` })

/** A newspaper page that becomes structured data, then an editor. */
export function EpaperPage({ stage }: { stage: number }) {
  const blocks = stage >= 2
  const editor = stage >= 3

  return (
    <div className="relative flex h-full w-full items-center justify-center [perspective:1600px]">
      {/* Editor chrome */}
      <motion.div
        aria-hidden
        className="absolute inset-0 border border-ink/15 bg-warm"
        initial={false}
        animate={{ opacity: editor ? 1 : 0, scale: editor ? 1 : 0.96 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="label flex h-9 items-center gap-4 border-b border-ink/10 px-3 text-[0.6rem] text-ink/60">
          <span className="text-ink">edition-214.page-1</span>
          <span className="hidden sm:inline">B</span>
          <span className="hidden italic sm:inline">I</span>
          <span className="hidden sm:inline">Cols 6</span>
          <span className="ml-auto">Autosaved</span>
        </div>
        <div className="absolute top-9 bottom-0 left-0 hidden w-[18%] flex-col gap-1.5 border-r border-ink/10 p-2.5 sm:flex">
          <span className="label mb-1 text-[0.55rem] text-ink/50">Blocks</span>
          {["Headline", "Story", "Image", "Pull quote", "Briefs"].map((b) => (
            <span key={b} className="border border-ink/15 px-2 py-1.5 font-mono text-[0.6rem] text-ink/70">
              ⋮⋮ {b}
            </span>
          ))}
        </div>
      </motion.div>

      {/* The page */}
      <motion.div
        className="relative aspect-[3/4] h-[88%] max-w-full bg-[#f9f7f1] shadow-[0_30px_80px_-30px_rgb(10_10_9/0.45)]"
        initial={false}
        animate={
          stage === 0
            ? { rotateX: 28, rotateZ: -9, scale: 0.84, x: "0%" }
            : editor
              ? { rotateX: 0, rotateZ: 0, scale: 0.86, x: "9%" }
              : { rotateX: 0, rotateZ: 0, scale: 1, x: "0%" }
        }
        transition={{ duration: 1, ease: EASE }}
      >
        {/* Column grid */}
        <motion.div
          aria-hidden
          className="absolute inset-[4%] grid grid-cols-6 gap-[2%]"
          initial={false}
          animate={{ opacity: stage >= 1 ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="border-x border-dashed border-accent-ink/25 bg-accent/[0.07]" />
          ))}
        </motion.div>

        {BLOCKS.map((b, i) => {
          const dragged = editor && b.id === "quote"
          return (
            <motion.div
              key={b.id}
              className={cx(
                "absolute overflow-hidden transition-[border-color,background-color] duration-500",
                blocks ? "border border-ink/40 bg-white/70" : "border border-transparent",
                dragged && "z-10 border-accent-ink shadow-lg",
              )}
              initial={false}
              animate={{
                ...pct(blocks ? b.edit : b.print),
                ...(dragged
                  ? { x: ["0%", "8%", "0%"], y: ["0%", "-30%", "0%"], rotate: [0, -2, 0] }
                  : { x: "0%", y: "0%", rotate: 0 }),
              }}
              transition={{
                duration: dragged ? 1.6 : 0.9,
                ease: EASE,
                delay: blocks ? i * 0.04 : 0,
                ...(dragged ? { times: [0, 0.5, 1] } : {}),
              }}
            >
              <BlockContent kind={b.kind} />
              <motion.span
                className="label absolute top-0 left-0 bg-ink px-1 py-px text-[0.5rem] text-paper"
                initial={false}
                animate={{ opacity: blocks ? 1 : 0, y: blocks ? 0 : -8 }}
                transition={{ duration: 0.4, delay: blocks ? 0.3 + i * 0.05 : 0 }}
              >
                {b.label}
              </motion.span>
              {dragged && (
                <>
                  {["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((pos) => (
                    <span key={pos} className={cx("absolute size-2 border border-accent-ink bg-accent", pos)} />
                  ))}
                  <motion.svg
                    viewBox="0 0 16 16"
                    className="absolute right-[18%] bottom-[10%] size-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    aria-hidden
                  >
                    <path
                      d="M2 1 L2 13 L5.5 10 L8 15 L10 14 L7.5 9 L12 9 Z"
                      fill="#0a0a09"
                      stroke="#fff"
                      strokeWidth="1"
                    />
                  </motion.svg>
                </>
              )}
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

function Lines({ count, className }: { count: number; className?: string }) {
  return (
    <div className={cx("flex flex-col gap-[5px] p-[6%]", className)}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="h-[3px] bg-ink/25" style={{ width: i % 5 === 4 ? "62%" : "100%" }} />
      ))}
    </div>
  )
}

function BlockContent({ kind }: { kind: Kind }) {
  switch (kind) {
    case "masthead":
      return (
        <div className="flex h-full items-center justify-between border-b-2 border-ink px-[3%]">
          <span className="font-display text-[clamp(0.9rem,2.4vw,2rem)] font-extrabold tracking-[-0.05em] text-ink">
            THE DAILY EDITION
          </span>
          <span className="hidden font-mono text-[0.5rem] text-ink/50 sm:block">No. 214 · Page 1</span>
        </div>
      )
    case "headline":
      return (
        <div className="p-[3%]">
          <span className="block font-display text-[clamp(0.8rem,1.9vw,1.6rem)] leading-[0.95] font-bold tracking-[-0.04em] text-ink">
            Layouts that are data, not documents
          </span>
        </div>
      )
    case "image":
      return (
        <div className="relative m-[5%] h-[90%] bg-[repeating-linear-gradient(135deg,rgb(10_10_9/0.1)_0_2px,transparent_2px_9px)]">
          <span className="absolute inset-0 grid place-items-center font-mono text-[0.5rem] text-ink/50">
            IMAGE SLOT
          </span>
        </div>
      )
    case "quote":
      return (
        <div className="flex h-full items-center gap-2 p-[5%]">
          <span className="font-display text-3xl leading-none font-bold text-ink">“</span>
          <Lines count={2} className="flex-1 p-0" />
        </div>
      )
    case "brief":
      return <Lines count={6} />
    default:
      return <Lines count={14} />
  }
}
