import { AnimatePresence, motion } from "framer-motion"

import { cx, EASE } from "~/lib/motion"

export const CMS_STAGES = ["Reporter", "Content", "Review", "AI", "Schedule", "Publish"]

/** A newsroom CMS: one story travels the workflow while the detail panel changes with it. */
export function CmsBoard({ stage }: { stage: number }) {
  return (
    <div className="flex h-full border border-warm/12 bg-char text-warm">
      <aside className="hidden w-44 shrink-0 flex-col gap-1 border-r border-warm/10 p-3 md:flex">
        <span className="label mb-3 text-[0.6rem] text-mute">shortnews / desk</span>
        {["Assignments", "Drafts", "Review", "AI assist", "Schedule", "Published"].map((item, i) => (
          <span
            key={item}
            className={cx(
              "px-2 py-1.5 font-mono text-[0.7rem] transition-colors duration-500",
              i === stage ? "bg-warm/10 text-warm" : "text-mute",
            )}
          >
            {item}
          </span>
        ))}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Workflow track */}
        <div className="grid grid-cols-6 border-b border-warm/10">
          {CMS_STAGES.map((s, i) => (
            <div
              key={s}
              className={cx(
                "relative h-24 border-r border-warm/10 p-2 last:border-r-0 sm:h-28",
                i < stage && "bg-warm/[0.02]",
              )}
            >
              <span
                className={cx(
                  "label block truncate text-[0.55rem] transition-colors",
                  i === stage ? "text-accent" : "text-mute",
                )}
              >
                {String(i + 1).padStart(2, "0")} <span className="hidden sm:inline">{s}</span>
              </span>
              {i === stage && (
                <motion.div
                  layoutId="cms-story"
                  className="absolute inset-x-1.5 bottom-2 border border-accent/60 bg-ink p-1.5 sm:inset-x-2 sm:p-2"
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  <span className="block truncate font-mono text-[0.55rem] text-warm sm:text-[0.65rem]">
                    Story #1042
                  </span>
                  <span className="mt-1 block h-1 w-3/4 bg-warm/20" />
                  <span className="mt-1 hidden h-1 w-1/2 bg-warm/20 sm:block" />
                </motion.div>
              )}
              {i < stage && <span className="absolute right-2 bottom-2 font-mono text-[0.6rem] text-accent">✓</span>}
            </div>
          ))}
        </div>

        {/* Detail */}
        <div className="relative flex min-h-0 flex-1">
          <div className="relative min-w-0 flex-1 p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="h-full"
              >
                <Detail stage={stage} />
              </motion.div>
            </AnimatePresence>
          </div>
          <History stage={stage} />
        </div>
      </div>
    </div>
  )
}

const HISTORY = ["assigned", "drafting", "in_review", "ai_draft", "scheduled", "published"]

/** Every transition is recorded, so the log grows as the story moves. */
function History({ stage }: { stage: number }) {
  return (
    <div className="hidden w-64 shrink-0 border-l border-warm/10 p-4 lg:block">
      <p className="label text-[0.6rem] text-mute">Workflow history</p>
      <ol className="mt-3 flex flex-col gap-2 font-mono text-[0.68rem]">
        <AnimatePresence initial={false}>
          {HISTORY.slice(0, stage + 1).map((state, i) => (
            <motion.li
              key={state}
              className="flex gap-2 text-warm/75"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <span className="text-mute">
                {String(9 + i).padStart(2, "0")}:{i % 2 ? "40" : "05"}
              </span>
              <span className={i === stage ? "text-accent" : undefined}>→ {state}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
    </div>
  )
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex justify-between border-b border-warm/5 py-2 font-mono text-xs">
      <span className="text-mute">{k}</span>
      <span className={accent ? "text-accent" : "text-warm"}>{v}</span>
    </div>
  )
}

function Bars({ n, grow }: { n: number; grow?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: n }, (_, i) => (
        <motion.span
          key={i}
          className="h-1.5 bg-warm/15"
          initial={grow ? { width: "0%" } : false}
          animate={{ width: i % 4 === 3 ? "55%" : "100%" }}
          transition={{ duration: 0.6, delay: grow ? i * 0.15 : 0, ease: EASE }}
        />
      ))}
    </div>
  )
}

function Detail({ stage }: { stage: number }) {
  switch (stage) {
    case 0:
      return (
        <div className="max-w-md">
          <p className="label text-[0.6rem] text-mute">Assignment</p>
          <p className="mt-2 text-xl font-semibold tracking-tight">City council approves new transit route</p>
          <div className="mt-4">
            <Row k="Assigned to" v="Reporter · City desk" />
            <Row k="Due" v="Today · 18:00" />
            <Row k="Status" v="assigned → drafting" accent />
          </div>
        </div>
      )
    case 1:
      return (
        <div className="max-w-xl">
          <div className="flex justify-between">
            <p className="label text-[0.6rem] text-mute">Draft · autosaving</p>
            <p className="font-mono text-[0.65rem] text-mute">412 words</p>
          </div>
          <p className="mt-2 text-xl font-semibold tracking-tight">City council approves new transit route</p>
          <div className="mt-4">
            <Bars n={7} grow />
          </div>
        </div>
      )
    case 2:
      return (
        <div className="grid max-w-2xl gap-4 sm:grid-cols-[1fr_14rem]">
          <Bars n={8} />
          <div className="flex flex-col gap-2">
            <p className="label text-[0.6rem] text-mute">Desk review</p>
            <p className="border-l-2 border-accent bg-warm/5 p-2 font-mono text-[0.68rem]">
              Tighten para 2 — lead with the route.
            </p>
            <p className="bg-warm/5 p-2 font-mono text-[0.68rem] text-mute line-through">Add council vote count.</p>
          </div>
        </div>
      )
    case 3:
      return (
        <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
          <div>
            <p className="label text-[0.6rem] text-mute">Source · 412 words</p>
            <div className="mt-3 opacity-50">
              <Bars n={8} />
            </div>
          </div>
          <div className="border border-accent/40 p-3">
            <p className="label flex justify-between text-[0.6rem] text-accent">
              <span>AI summary · 60 words</span>
              <span>draft</span>
            </p>
            <div className="mt-3">
              <Bars n={3} grow />
            </div>
            <p className="label mt-4 text-[0.55rem] text-mute">Headline options</p>
            {["Council clears new transit route", "New route wins council vote"].map((h) => (
              <p key={h} className="mt-1 font-mono text-[0.65rem] text-warm/80">
                ○ {h}
              </p>
            ))}
            <p className="label mt-4 inline-block bg-warm px-2 py-1 text-[0.55rem] text-ink">Needs editor approval</p>
          </div>
        </div>
      )
    case 4:
      return (
        <div className="max-w-md">
          <p className="label text-[0.6rem] text-mute">Schedule · local time</p>
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {["06:00", "07:30", "09:00", "12:00", "15:00", "18:00", "20:30", "22:00"].map((t) => (
              <span
                key={t}
                className={cx(
                  "border py-2 text-center font-mono text-xs",
                  t === "07:30" ? "border-accent bg-accent text-ink" : "border-warm/10 text-mute",
                )}
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-3">
            <Row k="Queue" v="release at 07:30" accent />
          </div>
        </div>
      )
    default:
      return (
        <div className="max-w-md">
          <p className="label flex items-center gap-2 text-[0.6rem] text-accent">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-accent" /> Published
          </p>
          <p className="mt-2 text-xl font-semibold tracking-tight">Council clears new transit route</p>
          <div className="mt-4">
            <Row k="Channels" v="App · Web" />
            <Row k="History" v="6 transitions recorded" />
            <Row k="Status" v="published" accent />
          </div>
        </div>
      )
  }
}
