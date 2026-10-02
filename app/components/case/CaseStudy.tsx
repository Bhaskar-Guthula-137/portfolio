import { motion, useMotionValueEvent, useScroll } from "framer-motion"
import { type ReactNode, useEffect, useState } from "react"
import { Link } from "react-router"

import { ArrowLink } from "~/components/ui/ArrowLink"
import { SplitText } from "~/components/ui/SplitText"
import { SystemLine } from "~/components/ui/SystemLine"
import type { Project } from "~/data/projects"
import { cx, EASE, useMotionAllowed } from "~/lib/motion"
import { ProjectDemo } from "./ProjectDemo"

const SECTIONS = [
  ["overview", "Overview"],
  ["problem", "Problem"],
  ["approach", "Approach"],
  ["architecture", "Architecture"],
  ["challenges", "Engineering challenges"],
  ["implementation", "Implementation"],
  ["result", "Result"],
  ["technology", "Technology"],
] as const

/** A case study told as an engineering story. */
export function CaseStudy({ project, next }: { project: Project; next: Project }) {
  const active = useActiveSection()
  const light = project.visual === "epaper" || project.visual === "rag"

  return (
    <article className="bg-ink text-warm">
      {/* Opening */}
      <header className="gutter relative pt-28 pb-14 lg:pt-36">
        <div className="label flex items-center justify-between text-warm/60">
          <ArrowLink href="/#projects" arrow="←" className="flex-row-reverse">
            All projects
          </ArrowLink>
          <span>Case study · {project.index} / 06</span>
        </div>
        <div className="mt-14 flex items-center gap-3">
          <span className="label rounded-full bg-accent px-2 py-0.5 text-ink">{project.tag}</span>
          <span className="label text-warm/55">{project.category}</span>
        </div>
        <SplitText
          as="h1"
          text={project.title}
          onMount
          delay={0.15}
          className="display mt-6 block text-[17vw] lg:text-[12vw]"
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <motion.p
            className="max-w-2xl text-xl leading-snug text-warm/80 lg:text-2xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
          >
            {project.description}
          </motion.p>
          <motion.dl
            className="label grid grid-cols-[7rem_1fr] gap-y-3 self-end text-warm/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <dt>Type</dt>
            <dd className="text-warm">{project.category}</dd>
            <dt>Focus</dt>
            <dd className="text-warm">{project.highlight}</dd>
            <dt>Stack</dt>
            <dd className="text-warm">{project.tech.slice(0, 4).join(" · ")}</dd>
          </motion.dl>
        </div>
      </header>

      {/* Live preview */}
      <motion.div
        className="gutter"
        initial={{ opacity: 0, clipPath: "inset(12% 6% 12% 6%)" }}
        animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
        transition={{ duration: 1.3, ease: EASE, delay: 0.4 }}
      >
        <figure>
          <div
            className={cx(
              "h-[78svh] min-h-[520px] overflow-hidden border",
              light ? "border-warm/10 bg-paper" : "border-warm/10",
            )}
          >
            <ProjectDemo kind={project.visual} />
          </div>
          <figcaption className="label mt-3 flex justify-between text-warm/40">
            <span>Interactive preview · simulated data</span>
            <span>{project.title}</span>
          </figcaption>
        </figure>
      </motion.div>

      {/* Story */}
      <div className="gutter mt-24 grid gap-12 pb-28 lg:mt-36 lg:grid-cols-[14rem_1fr] lg:gap-20">
        <nav aria-label="Case study sections" className="hidden lg:block">
          <ol className="label sticky top-28 flex flex-col gap-2.5">
            {SECTIONS.map(([id, label], i) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={cx(
                    "flex items-center gap-3 transition-colors",
                    active === id ? "text-warm" : "text-warm/35 hover:text-warm/70",
                  )}
                >
                  <span
                    className={cx(
                      "h-px transition-all duration-500",
                      active === id ? "w-6 bg-accent" : "w-2 bg-current",
                    )}
                  />
                  0{i + 1} {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex max-w-4xl flex-col gap-24 lg:gap-32">
          <Chapter id="overview" n={1} title="Overview">
            <p className="text-2xl leading-snug tracking-tight lg:text-4xl">{project.overview}</p>
          </Chapter>

          <Chapter id="problem" n={2} title="Problem">
            <p className="text-xl leading-relaxed text-warm/80">{project.problem}</p>
          </Chapter>

          <Chapter id="approach" n={3} title="Approach">
            <blockquote className="border-l-2 border-accent pl-6 text-2xl leading-snug tracking-tight lg:text-3xl">
              {project.approach}
            </blockquote>
          </Chapter>

          <Chapter id="architecture" n={4} title="Architecture">
            <p className="text-xl leading-relaxed text-warm/80">{project.architecture.summary}</p>
            <Flow steps={project.architecture.flow} />
          </Chapter>

          <Chapter id="challenges" n={5} title="Engineering challenges">
            <div className="grid gap-px bg-warm/10 sm:grid-cols-2">
              {project.challenges.map((c, i) => (
                <motion.div
                  key={c.title}
                  className="bg-ink p-6 sm:p-8"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
                >
                  <p className="label text-accent">Challenge 0{i + 1}</p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight">{c.title}</h3>
                  <p className="mt-3 text-warm/70">{c.body}</p>
                </motion.div>
              ))}
            </div>
          </Chapter>

          <Chapter id="implementation" n={6} title="Implementation">
            <ol className="flex flex-col gap-6">
              {project.implementation.map((step, i) => (
                <li key={i} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-warm/10 pt-6">
                  <span className="display text-4xl text-warm/20">{i + 1}</span>
                  <p className="text-lg leading-relaxed text-warm/80">{step}</p>
                </li>
              ))}
            </ol>
            <Code file={project.code.file} source={project.code.source} />
          </Chapter>

          <Chapter id="result" n={7} title="Result">
            <p
              className="display text-[8vw] leading-[0.95] normal-case lg:text-[3.6vw]"
              style={{ letterSpacing: "-0.045em" }}
            >
              {project.result}
            </p>
          </Chapter>

          <Chapter id="technology" n={8} title="Technology">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {project.tech.map((t, i) => (
                <motion.li
                  key={t}
                  className="display text-[9vw] text-warm/90 lg:text-[4.5vw]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: EASE, delay: i * 0.05 }}
                >
                  {t}
                  {i < project.tech.length - 1 && <span className="text-accent">·</span>}
                </motion.li>
              ))}
            </ul>
          </Chapter>
        </div>
      </div>

      {/* Next */}
      <Link
        to={`/projects/${next.slug}`}
        data-cursor="view"
        className="group gutter block border-t border-warm/10 bg-char py-20 lg:py-28"
      >
        <span className="label text-warm/50">Next project · {next.index}</span>
        <span className="display mt-6 flex items-end justify-between gap-6 text-[15vw] transition-colors duration-500 group-hover:text-accent lg:text-[10vw]">
          {next.title}
          <span className="mb-[0.1em] text-[0.5em] transition-transform duration-500 group-hover:translate-x-3">→</span>
        </span>
        <span className="mt-6 block max-w-md text-warm/60">{next.description}</span>
      </Link>
    </article>
  )
}

function Chapter({ id, n, title, children }: { id: string; n: number; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28">
      <div className="mb-8 flex items-center gap-4">
        <span className="label text-accent">0{n}</span>
        <h2 id={`${id}-h`} className="label text-warm/70">
          {title}
        </h2>
        <SystemLine nodes={2} className="flex-1" active={[]} />
      </div>
      <div className="flex flex-col gap-10">{children}</div>
    </section>
  )
}

/** The architecture as a line of stages with a packet running through it. */
function Flow({ steps }: { steps: string[] }) {
  const allowed = useMotionAllowed()
  return (
    <div
      className="relative border border-warm/10 bg-char p-6 sm:p-10"
      role="img"
      aria-label={`Architecture flow: ${steps.join(", then ")}`}
    >
      <div className="hairline-grid absolute inset-0 opacity-60" aria-hidden />
      <ol className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
        <span
          aria-hidden
          className="absolute top-[7px] bottom-[7px] left-[7px] w-px bg-warm/20 sm:top-[7px] sm:right-[7px] sm:bottom-auto sm:left-[7px] sm:h-px sm:w-auto"
        />
        {allowed && (
          <motion.span
            aria-hidden
            className="absolute top-[3px] left-[3px] hidden size-2.5 bg-accent sm:block"
            animate={{ left: ["0%", "calc(100% - 10px)"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 }}
          />
        )}
        {steps.map((step, i) => (
          <motion.li
            key={step}
            className="relative flex items-center gap-4 sm:w-0 sm:flex-1 sm:flex-col sm:items-start sm:gap-3 sm:last:items-end sm:last:text-right"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
          >
            <span className="size-3.5 shrink-0 rounded-full border border-warm bg-char" />
            <span>
              <span className="label block text-[0.6rem] text-mute">0{i + 1}</span>
              <span className="text-sm font-semibold tracking-tight lg:text-base">{step}</span>
            </span>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}

function Code({ file, source }: { file: string; source: string }) {
  return (
    <figure className="overflow-hidden border border-warm/10 bg-char">
      <figcaption className="label flex justify-between border-b border-warm/10 px-4 py-2.5 text-warm/50">
        <span>{file}</span>
        <span>excerpt · simplified</span>
      </figcaption>
      <pre className="overflow-x-auto p-5 font-mono text-[0.8rem] leading-6 text-warm/85">
        <code>{source}</code>
      </pre>
    </figure>
  )
}

function useActiveSection() {
  const [active, setActive] = useState<string>("overview")
  const { scrollY } = useScroll()
  const update = () => {
    const mid = window.innerHeight * 0.4
    for (const [id] of SECTIONS) {
      const r = document.getElementById(id)?.getBoundingClientRect()
      if (r && r.top < mid && r.bottom > mid) setActive(id)
    }
  }
  useMotionValueEvent(scrollY, "change", update)
  useEffect(update, [])
  return active
}
