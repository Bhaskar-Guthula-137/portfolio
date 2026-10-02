import { motion, useScroll } from "framer-motion"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { Link } from "react-router"

import { SplitText } from "~/components/ui/SplitText"
import { formatPostDate, getPost, posts } from "~/data/articles"
import { EASE } from "~/lib/motion"
import { buildMeta } from "~/lib/seo"
import type { Route } from "./+types/blogs.$slug"
import NotFound from "./$"
import { infoData } from "~/data/info"

export function meta({ params }: Route.MetaArgs) {
  const post = getPost(params.slug)
  if (!post) return [{ title: `Not found — ${infoData.name}` }]
  return buildMeta({
    title: `${post.title} | ${infoData.name}`,
    description: post.description,
    path: `/blogs/${post.slug}`,
    type: "article",
  })
}

export default function WritingPage({ params }: Route.ComponentProps) {
  const post = getPost(params.slug)
  const { scrollYProgress } = useScroll()
  if (!post) return <NotFound />
  const next = posts[(posts.indexOf(post) + 1) % posts.length]

  return (
    <article className="bg-paper text-ink">
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[55] h-0.5 origin-left bg-accent-ink"
        style={{ scaleX: scrollYProgress }}
      />

      <header className="gutter pt-32 pb-14 md:pt-40 md:pb-20">
        <div className="label flex items-center justify-between border-y-2 border-ink py-2 text-ink/70">
          <Link to="/#blogs" className="group inline-flex items-center gap-2 hover:text-ink">
            <ArrowLeft
              className="size-3.5 transition-transform duration-500 group-hover:-translate-x-1"
              strokeWidth={1.5}
            />
            All blogs
          </Link>
          <span>{post.category}</span>
        </div>
        <motion.p
          className="label mt-12 flex flex-wrap gap-x-5 gap-y-1 text-ink/55"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span>{post.readingTime}</span>
        </motion.p>
        <SplitText
          as="h1"
          text={post.title}
          by="words"
          onMount
          delay={0.15}
          className="mt-6 block max-w-6xl text-[11vw] leading-[0.92] font-bold tracking-[-0.055em] md:text-[6.2vw]"
        />
        <motion.p
          className="mt-10 max-w-2xl text-2xl leading-snug tracking-tight text-ink/75 md:text-3xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.6 }}
        >
          {post.description}
        </motion.p>
      </header>

      <div className="gutter border-t border-ink/15 pt-16 pb-24 md:grid md:grid-cols-12 md:gap-10">
        <aside className="hidden md:col-span-3 md:block">
          <nav aria-label="Sections" className="sticky top-24 space-y-2">
            {post.sections.map((s, i) => (
              <a key={s.heading} href={`#s-${i}`} className="label block text-ink/50 hover:text-ink">
                {String(i + 1).padStart(2, "0")} — {s.heading}
              </a>
            ))}
          </nav>
        </aside>
        <div className="max-w-2xl md:col-span-7">
          {post.sections.map((section, i) => (
            <motion.section
              key={section.heading}
              className="mb-14"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <h2 id={`s-${i}`} className="scroll-mt-24 text-3xl leading-tight font-semibold tracking-[-0.03em]">
                {section.heading}
              </h2>
              {section.paragraphs.map((p, j) => (
                <p key={j} className="mt-5 text-lg leading-[1.7] text-ink/80">
                  {p}
                </p>
              ))}
            </motion.section>
          ))}
        </div>
      </div>

      <Link
        to={`/blogs/${next.slug}`}
        data-cursor="view"
        className="gutter group block border-t border-ink/15 py-20 md:py-28"
      >
        <p className="label text-ink/55">Next · {next.category}</p>
        <p className="mt-5 flex items-end justify-between gap-6">
          <span className="max-w-4xl text-[9vw] leading-[0.95] font-bold tracking-[-0.05em] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3 md:text-[4.6vw]">
            {next.title}
          </span>
          <ArrowUpRight
            className="mb-2 size-8 shrink-0 transition-transform duration-500 group-hover:rotate-45"
            strokeWidth={1.25}
          />
        </p>
      </Link>
    </article>
  )
}
