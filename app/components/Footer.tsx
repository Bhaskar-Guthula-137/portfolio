import { motion } from "framer-motion"

import { SystemLine } from "~/components/ui/SystemLine"
import { navLinks } from "~/data/site-config"
import { EASE } from "~/lib/motion"
import { infoData } from "~/data/info"

const LINKS = [
  ...navLinks.filter((l) => l.id !== "contact").map((l) => ({ label: l.label, href: l.href })),
  { label: "GitHub", href: infoData.socials.github },
  { label: "LinkedIn", href: infoData.socials.linkedin },
  { label: "Email", href: `mailto:${infoData.email}` },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-10 pb-8 text-warm">
      <div className="gutter">
        <SystemLine nodes={2} active={[0, 1]} />
      </div>
      <div className="gutter mt-10 grid gap-8 sm:grid-cols-[1fr_auto]">
        <nav aria-label="Footer" className="label flex flex-wrap gap-x-6 gap-y-3 text-warm/60">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="link-underline hover:text-warm"
              {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <p className="label text-warm/60">
          {infoData.role} · {infoData.location.city} · {infoData.location.country}
        </p>
      </div>

      <motion.p
        className="display mt-16 px-[1.5vw] text-[20vw] leading-[0.78] tracking-[-0.075em]"
        aria-label={infoData.name}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.3 }}
      >
        {[infoData.firstName, infoData.lastName].map((word, w) => (
          <span key={word} aria-hidden className="block overflow-hidden">
            <motion.span
              className={
                w === 1 ? "block text-right text-transparent [-webkit-text-stroke:1.5px_var(--color-warm)]" : "block"
              }
              variants={{ hidden: { y: "100%" }, shown: { y: "0%" } }}
              transition={{ duration: 1.2, ease: EASE, delay: w * 0.12 }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.p>

      <div className="gutter label mt-8 flex flex-wrap justify-between gap-4 text-warm/40">
        <span>
          © {new Date().getFullYear()} {infoData.name}
        </span>
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-accent" /> Built with curiosity.
        </span>
      </div>
    </footer>
  )
}
