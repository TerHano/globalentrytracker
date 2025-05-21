import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout/default-layout.tsx", [index("routes/home.tsx")]),
  route("/login", "routes/login.tsx"),
  route("/signup", "routes/signup.tsx"),
  route("/auth/confirm-email", "routes/auth.confirm.tsx"),
  layout("routes/layout/protected-layout.tsx", [
    route("dashboard", "routes/dashboard.tsx"),
    route("create-tracker", "routes/create-tracker.tsx"),
    route("edit-tracker/:trackerId", "routes/edit-tracker.tsx"),
    route("subscribed", "routes/successful-subscription.tsx"),
    ...prefix("settings/", [
      layout("routes/layout/settings-page-layout.tsx", [
        index("routes/settings-page.tsx"),
        route("profile", "routes/profile-settings-page.tsx"),
        route("notifications", "routes/notification-settings-page.tsx"),
        route("subscription", "routes/subscription-settings-page.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
