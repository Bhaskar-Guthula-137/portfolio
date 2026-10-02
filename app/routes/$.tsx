import { Link } from "react-router"

import { SplitText } from "~/components/ui/SplitText"
import { SystemLine } from "~/components/ui/SystemLine"
import { infoData } from "~/data/info"

export function meta() {
  return [{ title: `Not found — ${infoData.name}` }, { name: "robots", content: "noindex" }]
}

export default function NotFound() {
  return (
    <section className="gutter relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink text-warm">
      <p className="label text-accent">404 · route not found</p>
      <SplitText
        as="h1"
        text="Nothing is deployed here."
        by="words"
        onMount
        className="display mt-6 block max-w-5xl text-[14vw] lg:text-[9vw]"
      />
      <div className="mt-12 flex items-center gap-4">
        <span className="size-2.5 rounded-full border border-warm/60" />
        <SystemLine nodes={2} className="w-40" active={[1]} />
        <span className="label text-warm/50">connection dropped</span>
      </div>
      <Link to="/" className="label link-underline mt-12 self-start">
        ← Back to index
      </Link>
    </section>
  )
}
