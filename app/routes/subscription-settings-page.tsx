import type { Route } from "./+types/profile-settings-page";
import { redirect } from "react-router";
import { SubscriptionSettings } from "~/components/settings/subscription-settings";
import { isAuthenticated } from "~/utils/auth";

export function meta() {
  return [
    { title: "Settings - Subscription" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const isUserAuthenticated = await isAuthenticated(request);
  if (!isUserAuthenticated) {
    // If the user is not authenticated, redirect to the login page
    return redirect("/login");
  }
}

export default function ProfileSettingsPage() {
  return <SubscriptionSettings />;
}
