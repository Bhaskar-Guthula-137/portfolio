# Bhaskar Guthula — Portfolio

An interactive, scroll-driven portfolio — "building things that move" — built with React Router v8 (fully pre-rendered), Tailwind CSS v4, and Framer Motion. The static site is written to `/out` and deployed to Cloudflare as static assets.

## Develop

```bash
bun install
bun run dev        # http://localhost:5173
bun run typecheck
```

## Build & deploy

```bash
bun run build      # static HTML for every route, copied to /out
bun run preview    # serve the build with wrangler (headers + 404 page)
bun run deploy     # build and deploy to Cloudflare
```

`ssr: false` + `prerender` in `react-router.config.ts` renders every page to HTML at build time. The build also writes `404.html`, `sitemap.xml`, and `robots.txt`. Security headers live in `public/_headers`.

## Customise

All content is local data in `app/data/`:

| File | Contents |
| --- | --- |
| `site-config.ts` | Name, links, email, status line, canonical URL, SEO copy |
| `projects.ts` | Selected work and case-study content |
| `experience.ts` | Role and the capability timeline |
| `articles.ts` | Articles for "Thinking in Public" |
| `technologies.ts` | "The Tools" words and the "How it works" nodes/edges |
| `experiments.ts` | Lab experiments and "Currently exploring" rows |

Motion respects `prefers-reduced-motion`: pinned scroll scenes render their final state, and the custom cursor and loops turn off.

Adding a project or article adds its page to the prerender list automatically.
