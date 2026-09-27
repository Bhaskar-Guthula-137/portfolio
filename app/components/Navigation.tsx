import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router"

import { navLinks, siteConfig, socialLinks } from "~/data/site-config"
import { LOGO_FONT_PX, navLogoOpacity } from "~/lib/brand"
import { BOOT, cx, EASE, EASE_IN_OUT } from "~/lib/motion"

/** Tracks which home-page section is in the middle of the viewport. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    if (!enabled) return setActive(null)
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => Boolean(el))
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: "-50% 0px -50% 0px" },
    )
    sections.forEach((el) => observer.observe(el))
    const onScroll = () => window.scrollY < window.innerHeight * 0.8 && setActive(null)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
    }
  }, [enabled])
  return active
}

export function Navigation() {
  const [compact, setCompact] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()
  const location = useLocation()
  const isHome = location.pathname === "/"
  // Only the very first load of the home page waits for the boot sequence.
  const bootDelay = useRef(location.pathname === "/" ? BOOT.nav : 0.2).current
  const active = useActiveSection(isHome)

  const [scrolled, setScrolled] = useState(false)
  const [logoShown, setLogoShown] = useState(true)
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 60))
  // On the home page the bar stays clear until the hero's name has become the logo.
  useMotionValueEvent(navLogoOpacity, "change", (v) => setLogoShown(v > 0.5))
  useEffect(() => setCompact(scrolled && logoShown), [scrolled, logoShown])
  useEffect(() => setOpen(false), [location.pathname, location.hash])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: bootDelay }}
        className={cx(
          "gutter fixed inset-x-0 top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center transition-[height,background-color,border-color] duration-500 ease-[var(--ease-expo)]",
          compact ? "h-14 border-b border-warm/10 bg-ink/80 backdrop-blur-md" : "h-20 border-b border-transparent",
          open && "border-transparent bg-transparent backdrop-blur-none",
        )}
      >
        <NavGroup side="left" active={active} />

        {/* The hero's name, small: the logo */}
        <Link to="/" aria-label={`${siteConfig.name} — home`} className="relative z-10 col-start-2 justify-self-center">
          <motion.span
            aria-hidden
            className="display block text-center leading-[0.84] text-warm"
            style={{ fontSize: LOGO_FONT_PX, opacity: navLogoOpacity }}
          >
            <span className="block lg:-translate-x-[0.45em]">{siteConfig.firstName}</span>
            <span className="block lg:translate-x-[0.45em]">{siteConfig.lastName}</span>
          </motion.span>
        </Link>

        <div className="flex items-center justify-self-end">
          <NavGroup side="right" active={active} />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="label relative z-10 flex items-center gap-3 text-warm md:hidden"
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span aria-hidden className="relative block h-3 w-6">
              <span
                className={cx(
                  "absolute left-0 h-px w-full bg-current transition-transform duration-500",
                  open ? "top-1/2 rotate-45" : "top-0",
                )}
              />
              <span
                className={cx(
                  "absolute left-0 h-px w-full bg-current transition-transform duration-500",
                  open ? "top-1/2 -rotate-45" : "top-full",
                )}
              />
            </span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>{open && <MobileMenu onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  )
}

/** One side of the split navigation. */
function NavGroup({ side, active }: { side: "left" | "right"; active: string | null }) {
  return (
    <nav
      aria-label={side === "left" ? "Primary" : "Secondary"}
      className={cx("hidden items-center gap-7 md:flex", side === "left" ? "justify-self-start" : "")}
    >
      {navLinks
        .filter((link) => link.side === side)
        .map((link) => (
          <Link
            key={link.id}
            to={link.href}
            aria-current={active === link.id ? "true" : undefined}
            className={cx(
              "label relative py-1 transition-colors hover:text-warm",
              active === link.id ? "text-warm" : "text-warm/55",
            )}
          >
            {link.label}
            {active === link.id && (
              <motion.span
                layoutId="nav-active"
                className="absolute -bottom-0.5 left-0 h-px w-full bg-accent"
                transition={{ duration: 0.5, ease: EASE }}
              />
            )}
          </Link>
        ))}
    </nav>
  )
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="gutter fixed inset-0 z-40 flex flex-col bg-ink pt-24 pb-8"
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.8, ease: EASE_IN_OUT }}
    >
      <motion.span
        aria-hidden
        className="block h-px origin-left bg-warm/20"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.3 }}
      />
      <nav aria-label="Mobile" className="mt-6 flex flex-1 flex-col justify-center gap-1">
        {navLinks.map((link, i) => (
          <div key={link.id} className="overflow-hidden">
            <motion.a
              href={link.href}
              onClick={onClose}
              className="display flex items-baseline gap-4 text-[13.5vw] text-warm active:text-accent"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.06 }}
            >
              <span className="label text-accent" style={{ letterSpacing: "0.12em" }}>
                0{i + 1}
              </span>
              {link.label}
            </motion.a>
          </div>
        ))}
      </nav>
      <motion.div
        className="flex flex-wrap items-center justify-between gap-4 border-t border-warm/15 pt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.6 }}
      >
        <span className="label flex items-center gap-2 text-warm/60">
          {siteConfig.availability.open && <span className="size-1.5 animate-pulse-dot rounded-full bg-accent" />}
          {siteConfig.availability.open ? siteConfig.availability.label : siteConfig.brandPhrase}
        </span>
        <div className="flex gap-5">
          {socialLinks.slice(0, 3).map((link) => (
            <a key={link.label} href={link.href} className="label text-warm/70" target="_blank" rel="noreferrer">
              {link.label} ↗
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
