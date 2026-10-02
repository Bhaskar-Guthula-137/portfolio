import { motion } from "framer-motion"
import { Link } from "react-router"

import { ArrowLink } from "~/components/ui/ArrowLink"
import { BlogStamp } from "./BlogStamp"
import { SplitText } from "~/components/ui/SplitText"
import { formatPostDate, type Post, posts } from "~/data/articles"
import { cx, EASE } from "~/lib/motion"
import { infoData } from "~/data/info"

/** NOTES FROM THE BUILD — set like the front page of a small publication. */
export function Writing() {
  const [feature, ...rest] = posts
  return (
    <section id="blogs" aria-labelledby="blogs-title" className="gutter relative bg-paper py-24 text-ink lg:py-36">
      {/* Masthead */}
      <div className="label flex items-center justify-between border-y-2 border-ink py-2 text-ink/70">
        <span>05 / Blogs</span>
        <span>{posts.length} articles</span>
      </div>
      <SplitText
        as="h2"
        id="blogs-title"
        text="Notes from the build"
        by="words"
        className="display mt-6 block text-center text-[12.5vw] [text-wrap:balance] lg:text-[10.4vw]"
      />
      <div className="h-px bg-ink" />

      {/* Feature */}
      <ArticleLink
        post={feature}
        className="border-b border-ink/20 py-10 lg:py-14"
        inner="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:gap-12"
      >
        <h3 className="text-[9vw] leading-[0.92] font-bold tracking-[-0.05em] transition-colors group-hover:text-accent-ink lg:text-[5.2vw]">
          {feature.title}
        </h3>
        <div className="flex flex-col justify-end gap-4 lg:border-l lg:border-ink/20 lg:pl-8">
          <Meta post={feature} />
          <p className="text-lg leading-snug text-ink/75">{feature.description}</p>
          <Read />
        </div>
      </ArticleLink>

      {/* The rest, set asymmetrically */}
      <div className="grid lg:grid-cols-12">
        {rest.map((post, i) => (
          <ArticleLink
            key={post.slug}
            post={post}
            className={cx(
              "border-b border-ink/20 py-8 lg:py-10",
              i === 0 && "lg:col-span-5 lg:border-r lg:pr-8",
              i === 1 && "lg:col-span-7 lg:pl-8",
              i === 2 && "lg:col-span-8 lg:col-start-5 lg:row-start-2 lg:border-l lg:pl-8",
            )}
            inner="flex flex-col gap-4"
          >
            <Meta post={post} />
            <h3
              className={cx(
                "leading-[0.95] font-bold tracking-[-0.045em] transition-colors group-hover:text-accent-ink",
                i === 2 ? "text-[8vw] lg:text-[3.8vw]" : "text-[7vw] lg:text-[2.8vw]",
              )}
            >
              {post.title}
            </h3>
            <p className="max-w-lg text-ink/70">{post.description}</p>
            <Read />
          </ArticleLink>
        ))}
        {/* The blog's rotating stamp fills the space under the second article */}
        <div className="flex items-center justify-center py-12 lg:col-span-4 lg:col-start-1 lg:row-start-2 lg:py-10">
          <BlogStamp />
        </div>
      </div>

      <div className="label mt-10 flex justify-end">
        <ArrowLink href={infoData.socials.blog}>More on the blog</ArrowLink>
      </div>
    </section>
  )
}

function ArticleLink({
  post,
  className,
  inner,
  children,
}: {
  post: Post
  className?: string
  inner: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: EASE }}
      className={className}
    >
      <Link to={`/blogs/${post.slug}`} prefetch="intent" data-cursor="view" className={cx("group", inner)}>
        {children}
      </Link>
    </motion.div>
  )
}

function Meta({ post }: { post: Post }) {
  return (
    <p className="label flex flex-wrap gap-x-3 gap-y-1 text-ink/55">
      <span className="text-ink">{post.category}</span>
      <span>·</span>
      <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      <span>·</span>
      <span>{post.readingTime}</span>
    </p>
  )
}

function Read() {
  return (
    <span className="label inline-flex items-center gap-2 text-ink">
      Read
      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
        ↗
      </span>
    </span>
  )
}
