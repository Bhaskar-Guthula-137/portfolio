import "@fontsource/instrument-serif/400-italic.css"

import { infoData } from "~/data/info"
import { cx } from "~/lib/motion"

/**
 * The blog's stamp: <BTC /> in the centre with a phrase circling it, turning
 * slowly. Links to the blog. Same mark as the blog's own footer.
 */
export function BlogStamp({ className }: { className?: string }) {
  const { monogram, ring } = infoData.blogStamp
  return (
    <a
      href={infoData.socials.blog}
      target="_blank"
      rel="noreferrer"
      aria-label={`${monogram} — visit the blog`}
      className={cx("group relative grid size-[136px] shrink-0 place-items-center md:size-[160px]", className)}
    >
      <svg
        viewBox="0 0 120 120"
        aria-hidden
        className="h-full w-full animate-stamp group-hover:[animation-duration:9s]"
      >
        <defs>
          <path id="blog-stamp-circle" d="M 60 60 m -46 0 a 46 46 0 1 1 92 0 a 46 46 0 1 1 -92 0" />
        </defs>
        <text className="fill-ink font-mono text-[7.5px] tracking-[0.05em] uppercase md:text-[8px]">
          <textPath href="#blog-stamp-circle" startOffset="0%" textLength="289" lengthAdjust="spacingAndGlyphs">
            {ring}
          </textPath>
        </text>
      </svg>
      <span className="absolute inline-flex -translate-y-px items-baseline justify-center leading-none text-ink">
        <span aria-hidden className="font-mono text-[14px] text-ink/55 md:text-[17px]">
          &lt;
        </span>
        <span className="font-['Instrument_Serif',ui-serif,Georgia,serif] text-[26px] tracking-[-0.02em] italic md:text-[32px]">
          {monogram}
        </span>
        <span aria-hidden className="font-mono text-[14px] text-ink/55 md:text-[17px]">
          {" />"}
        </span>
      </span>
    </a>
  )
}
