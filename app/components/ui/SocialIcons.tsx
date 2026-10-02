import { Mail, PenLine } from "lucide-react"
import type { ReactNode } from "react"

import { socialLinks } from "~/data/info"
import { cx } from "~/lib/motion"

// Lucide ships no brand marks, so GitHub and LinkedIn are drawn inline.
function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  )
}

function LinkedInMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

const ICONS: Record<string, (props: { className?: string }) => ReactNode> = {
  GitHub: GitHubMark,
  LinkedIn: LinkedInMark,
  Email: ({ className }) => <Mail className={className} strokeWidth={1.8} aria-hidden />,
  Blog: ({ className }) => <PenLine className={className} strokeWidth={1.8} aria-hidden />,
}

/** The icon for a social link label (GitHub, LinkedIn, Email, Blog). */
export function SocialIcon({ label, className }: { label: string; className?: string }) {
  const Icon = ICONS[label]
  return Icon ? <Icon className={className} /> : <span className={className}>{label[0]}</span>
}

const ORDER = ["GitHub", "LinkedIn", "Email", "Blog"]

/** Small icon links for GitHub, LinkedIn, Email, and Blog. */
export function SocialIcons({ className, iconClassName = "size-3.5" }: { className?: string; iconClassName?: string }) {
  return (
    <ul className={cx("flex items-center gap-3", className)} aria-label="Social links">
      {[...socialLinks]
        .sort((a, b) => ORDER.indexOf(a.label) - ORDER.indexOf(b.label))
        .map((link) => {
          const Icon = ICONS[link.label]
          return (
            <li key={link.label}>
              <a
                href={link.href}
                aria-label={link.label}
                title={link.label}
                {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                className="grid size-7 place-items-center rounded-full border border-warm/15 text-warm/60 transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                {Icon ? <Icon className={iconClassName} /> : link.label[0]}
              </a>
            </li>
          )
        })}
    </ul>
  )
}
