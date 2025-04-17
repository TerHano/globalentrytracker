import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  layout("routes/layout/protected-layout.tsx", [
    route("dashboard", "routes/dashboard.tsx"),
    route("create-tracker", "routes/create-tracker.tsx"),
    route("edit-tracker/:trackerId", "routes/edit-tracker.tsx"),
  ]),
] satisfies RouteConfig;
