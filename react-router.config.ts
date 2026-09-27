import type { Config } from "@react-router/dev/config"
import { copyFile, cp, rm, writeFile } from "node:fs/promises"
import { join } from "node:path"

import { posts } from "./app/data/articles"
import { projects } from "./app/data/projects"
import { siteConfig } from "./app/data/site-config"

const paths = [
  "/",
  ...projects.map((project) => `/work/${project.slug}`),
  ...posts.map((post) => `/writing/${post.slug}`),
]

const config: Config = {
  // Fully static: every path is rendered to HTML at build time and served
  // from /out (a copy of build/client) with no server.
  ssr: false,
  prerender: paths,
  async buildEnd({ reactRouterConfig }) {
    const client = join(reactRouterConfig.buildDirectory, "client")

    // Cloudflare's `404-page` handling serves /404.html for unknown paths. The
    // SPA fallback hydrates and renders the catch-all route there.
    await copyFile(join(client, "__spa-fallback.html"), join(client, "404.html"))

    const url = (path: string) => new URL(path, siteConfig.url).toString()
    await writeFile(
      join(client, "sitemap.xml"),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
        .map((path) => `  <url><loc>${url(path)}</loc></url>`)
        .join("\n")}\n</urlset>\n`,
    )
    await writeFile(join(client, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${url("/sitemap.xml")}\n`)

    // Publish the finished static site to /out.
    await rm("out", { recursive: true, force: true })
    await cp(client, "out", { recursive: true })
  },
}

export default config
