import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("work/:slug", "routes/work.$slug.tsx"),
  route("writing/:slug", "routes/writing.$slug.tsx"),
  route("*", "routes/$.tsx"),
] satisfies RouteConfig
