import type { Route } from "./+types/profile-settings-page";
import { redirect } from "react-router";
import { createSupabaseServerClient } from "~/utils/supabase/createSupabaseServerClient";
import { ProfileSettings } from "~/components/settings/profile-settings";

export function meta() {
  return [
    { title: "Settings - Profile" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    // If the user is already logged in, redirect to the home page
    return redirect("/login", { headers });
  }
}

export default function ProfileSettingsPage() {
  return <ProfileSettings />;
}
