import type { Route } from "./+types/notification-settings-page";
import { redirect } from "react-router";
import { createSupabaseServerClient } from "~/utils/supabase/createSupabaseServerClient";
import { allNotificationSettingsApi } from "~/api/all-notification-settings-api";
import { NotificationSettings } from "~/components/settings/notification-settings/notification-settings";

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
  const settings = await allNotificationSettingsApi(session.access_token);
  return { settings };
}

export default function NotificationSettingsPage({
  loaderData,
}: Route.ComponentProps) {
  const { settings } = loaderData;
  return <NotificationSettings settings={settings} />;
}
