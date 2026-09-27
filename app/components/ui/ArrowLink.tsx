import type { ReactNode } from "react"
import { Link } from "react-router"

import { cx } from "~/lib/motion"

type Props = {
  href: string
  children: ReactNode
  arrow?: "↗" | "↓" | "→" | "←"
  className?: string
}

/**
 * Text link whose label rolls up on hover and whose arrow nudges in its
 * direction. Internal paths use client-side routing.
 */
export function ArrowLink({ href, children, arrow = "↗", className }: Props) {
  const external = /^(https?:|mailto:)/.test(href)
  const nudge = {
    "↗": "group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
    "↓": "group-hover:translate-y-1",
    "→": "group-hover:translate-x-1",
    "←": "group-hover:-translate-x-1",
  }[arrow]
  const content = (
    <>
      <span className="relative inline-block overflow-hidden align-bottom">
        <span className="block transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 block translate-y-full text-accent transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
      <span aria-hidden className={cx("inline-block transition-transform duration-300", nudge)}>
        {arrow}
      </span>
    </>
  )
  const cls = cx("group inline-flex items-baseline gap-2", className)

  if (external)
    return (
      <a href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
        {content}
      </a>
    )
  return (
    <Link to={href} className={cls} prefetch="intent">
      {content}
    </Link>
  )
}
