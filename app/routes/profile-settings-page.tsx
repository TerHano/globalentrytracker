import type { Route } from "./+types/profile-settings-page";
import { redirect } from "react-router";
import { ProfileSettings } from "~/components/settings/profile-settings";
import { isAuthenticated } from "~/utils/auth";

export function meta() {
  return [
    { title: "Settings - Profile" },
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
  return <ProfileSettings />;
}
