import { createSupabaseServerClient } from "~/utils/supabase/createSupabaseServerClient";
import type { Route } from "./+types/dashboard";
import { redirect } from "react-router";
import { notificationCheckQuery } from "~/api/notification-check-api";
import { trackedLocationsQuery } from "~/api/tracked-locations-api";
import { meQuery } from "~/api/me-api";
import { NotificationSetupAlert } from "~/components/dashboard/notification-setup-alert";
import { ActiveTrackers } from "~/components/dashboard/active-trackers";
import { Stack } from "@mantine/core";
import { Greeting } from "~/components/dashboard/greeting";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

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
  const token = session.access_token;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(notificationCheckQuery(token));
  await queryClient.prefetchQuery(trackedLocationsQuery(token));
  await queryClient.prefetchQuery(meQuery(token));

  return { dehydratedState: dehydrate(queryClient) };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { dehydratedState } = loaderData;
  return (
    <HydrationBoundary state={dehydratedState}>
      <Stack className="fade-in-animation">
        <Greeting />
        <NotificationSetupAlert />
        <ActiveTrackers />
      </Stack>
    </HydrationBoundary>
  );
}
