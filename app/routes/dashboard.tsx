import { createSupabaseServerClient } from "~/utils/supabase/createSupabaseServerClient";
import type { Route } from "./+types/dashboard";
import { redirect } from "react-router";
import { notificationCheckApi } from "~/api/notification-check-api";
import { trackedLocationsApi } from "~/api/tracked-locations-api";
import { meApi } from "~/api/me-api";
import { NotificationSetupAlert } from "~/components/dashboard/notification-setup-alert";
import { ActiveTrackers } from "~/components/dashboard/active-trackers";
import { Stack } from "@mantine/core";
import { Greeting } from "~/components/dashboard/greeting";

export function meta() {
  return [
    { title: "Dashboard" },
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
  const notificationCheck = await notificationCheckApi(session.access_token);
  const me = await meApi(session.access_token);
  const trackedLocations = await trackedLocationsApi(session.access_token);
  console.log(me);
  return { notificationCheck, me, trackedLocations };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { notificationCheck, me, trackedLocations } = loaderData;
  return (
    <Stack>
      <Greeting initialData={{ me, trackedLocations }} />
      <NotificationSetupAlert
        hasAnyNotificationsEnabled={notificationCheck.isAnyNotificationsEnabled}
        hasNotificationsSetup={notificationCheck.isNotificationsSetUp}
      />
      <ActiveTrackers trackedLocations={trackedLocations} />
    </Stack>
  );
}
