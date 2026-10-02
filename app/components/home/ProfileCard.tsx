import { motion } from "framer-motion"
import { Link } from "react-router"

import { siteConfig } from "~/data/site-config"
import { infoData, socialLinks } from "~/data/info"
import { SocialIcon } from "~/components/ui/SocialIcons"
import { EASE } from "~/lib/motion"

// Card outline in a 640 × 520 box: a notch at the top-right for the arrow
// button, and a deep scoop out of the lower-left for the social links.
const W = 640
const H = 520
const CARD =
  "M 36 0 H 470 A 30 30 0 0 1 500 30 A 40 40 0 0 0 540 70 H 610 A 30 30 0 0 1 640 100 " +
  "V 484 A 36 36 0 0 1 604 520 H 164 A 36 36 0 0 1 128 484 V 290 A 40 40 0 0 0 88 250 " +
  "H 30 A 30 30 0 0 1 0 220 V 36 A 36 36 0 0 1 36 0 Z"

/** Place a child by its box in card units; it scales with the card. */
const box = (x: number, y: number, w: number, h?: number) => ({
  left: `${(x / W) * 100}%`,
  top: `${(y / H) * 100}%`,
  width: `${(w / W) * 100}%`,
  ...(h !== undefined ? { height: `${(h / H) * 100}%` } : {}),
})

/**
 * The About card: statement, location, and availability on a
 * lime card with a photo, a notched corner holding a "let's talk" button, and
 * the social links stacked in the curve cut out of its left side.
 */
export function ProfileCard() {
  const { aboutPhoto, workRegion, availability } = siteConfig

  return (
    <motion.div
      className="@container relative w-full max-w-[640px] lg:h-full lg:w-auto lg:max-w-none"
      style={{ aspectRatio: `${W} / ${H}` }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: EASE }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <defs>
          <filter id="card-shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#0a0a09" floodOpacity="0.16" />
          </filter>
        </defs>
        <path d={CARD} fill="var(--color-accent)" filter="url(#card-shadow)" />
      </svg>

      {/* Statement */}
      <p
        className="absolute text-[max(15px,4.3cqw)] leading-[1.12] font-medium tracking-[-0.03em] text-ink"
        style={box(40, 44, 280)}
      >
        I'm a {infoData.role} who enjoys turning ideas into products and difficult engineering problems into simple
        experiences.
      </p>

      {/* Details */}
      <ul
        className="absolute flex flex-col gap-[1.6cqw] font-mono text-[max(10px,2.1cqw)] tracking-[0.1em] text-ink uppercase"
        style={box(152, 318, 176)}
      >
        <li className="border-b border-ink/20 pb-[1.4cqw]">{workRegion}</li>
        {availability.open && (
          <li className="flex items-start gap-[1.2cqw]">
            <span className="mt-[0.45em] size-[max(6px,1.1cqw)] shrink-0 animate-pulse rounded-full bg-ink" />
            {availability.label}
          </li>
        )}
      </ul>

      {/* Photo */}
      <figure className="absolute overflow-hidden rounded-[4.5cqw] bg-ink/10" style={box(344, 100, 264, 388)}>
        {aboutPhoto.src ? (
          <img src={aboutPhoto.src} alt={aboutPhoto.alt} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-ink/25 text-center">
            <span className="text-[max(13px,3cqw)] font-semibold tracking-tight text-ink/70">Your photo</span>
            <span className="max-w-[80%] font-mono text-[max(9px,1.5cqw)] text-ink/50">siteConfig.aboutPhoto</span>
          </span>
        )}
      </figure>

      {/* Arrow button in the notch */}
      <Link
        to="/#contact"
        aria-label="Get in touch"
        className="group absolute grid aspect-square place-items-center rounded-full bg-ink text-accent transition-transform duration-500 ease-[var(--ease-expo)] hover:scale-105"
        style={box(560, 2, 60)}
      >
        <span className="text-[max(14px,3.4cqw)] transition-transform duration-500 group-hover:rotate-45">↗</span>
      </Link>

      {/* Social links stacked in the left curve */}
      <ul className="absolute flex flex-col gap-[2cqw]" style={box(22, 268, 70)} aria-label="Social links">
        {socialLinks
          .filter((link) => link.label !== "Blog")
          .map((link, i) => (
            <motion.li
              key={link.label}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.3 + i * 0.08 }}
            >
              <a
                href={link.href}
                aria-label={link.label}
                {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                className="grid aspect-square w-full place-items-center rounded-full border border-ink/70 text-ink transition-colors duration-300 hover:bg-ink hover:text-accent"
              >
                <SocialIcon label={link.label} className="size-[42%]" />
              </a>
            </motion.li>
          ))}
      </ul>
    </motion.div>
  )
}
