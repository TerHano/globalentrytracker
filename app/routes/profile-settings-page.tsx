import type { Route } from "./+types/profile-settings-page";
import { redirect } from "react-router";
import { createSupabaseServerClient } from "~/utils/supabase/createSupabaseServerClient";
import { meApi } from "~/api/me-api";
import { ProfileSettings } from "~/components/settings/profile-settings";

export function meta() {
  return [
    { title: "Settings" },
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
  const me = await meApi(session.access_token);
  return { me };
}

export default function ProfileSettingsPage({
  loaderData,
}: Route.ComponentProps) {
  const { me } = loaderData;
  return <ProfileSettings me={me} />;
}
