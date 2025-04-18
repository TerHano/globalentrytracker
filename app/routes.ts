import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  layout("routes/layout/protected-layout.tsx", [
    route("dashboard", "routes/dashboard.tsx"),
    route("create-tracker", "routes/create-tracker.tsx"),
    route("edit-tracker/:trackerId", "routes/edit-tracker.tsx"),
    ...prefix("settings/", [
      layout("routes/layout/settings-page-layout.tsx", [
        index("routes/settings-page.tsx"),
        route("profile", "routes/profile-settings-page.tsx"),
        route("notifications", "routes/notification-settings-page.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
