import "@fontsource-variable/inter-tight/wght.css"
import "@fontsource-variable/jetbrains-mono/wght.css"
import "./app.css"

import { MotionConfig } from "framer-motion"
import { isRouteErrorResponse, Link, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"

import type { Route } from "./+types/root"
import { CustomCursor } from "./components/CustomCursor"
import { Footer } from "./components/Footer"

import { Navigation } from "./components/Navigation"
import { PageTransition } from "./components/PageTransition"

export const links: Route.LinksFunction = () => [{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a09" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#content"
        className="label fixed top-3 left-3 z-[70] -translate-y-20 bg-accent px-3 py-2 text-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <Navigation />
      <CustomCursor />
      <main id="content">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </MotionConfig>
  )
}

export function HydrateFallback() {
  return <div className="min-h-screen bg-ink" />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Something broke."
  let details = "An unexpected error occurred."
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "Not found." : `Error ${error.status}`
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="gutter flex min-h-screen flex-col justify-center bg-ink text-warm">
      <p className="label text-accent">Error</p>
      <h1 className="mt-4 font-display text-6xl font-semibold tracking-[-0.05em] md:text-8xl">{message}</h1>
      <p className="mt-4 text-warm/60">{details}</p>
      <Link to="/" className="label link-underline mt-10 self-start">
        ← Back to index
      </Link>
      {stack && (
        <pre className="mt-10 w-full overflow-x-auto border border-warm/10 p-4 font-mono text-xs">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
