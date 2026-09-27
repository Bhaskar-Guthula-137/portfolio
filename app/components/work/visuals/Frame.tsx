import type { ReactNode } from "react"

import { cx } from "~/lib/motion"

type Props = {
  title: string
  status?: ReactNode
  children: ReactNode
  className?: string
}

/** A minimal product window: a mono title bar and a content well. */
export function Frame({ title, status, children, className }: Props) {
  return (
    <div className={cx("flex h-full flex-col border border-warm/10 bg-char text-warm", className)}>
      <div className="label flex h-9 shrink-0 items-center justify-between border-b border-warm/10 px-3.5 text-[0.625rem] text-mute">
        <span>{title}</span>
        {status}
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  )
}

export function LiveDot({ label = "Live" }: { label?: string }) {
  return (
    <span className="flex items-center gap-1.5 text-accent">
      <span className="relative flex size-1.5">
        <span className="absolute inset-0 animate-ping rounded-full bg-accent/70" />
        <span className="relative size-1.5 rounded-full bg-accent" />
      </span>
      {label}
    </span>
  )
}
