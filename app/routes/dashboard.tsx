import type { Route } from "./+types/dashboard";
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
import { permissionQuery } from "~/api/permissions-api";
import { nextNotificationQuery } from "~/api/next-notification-api";

export function meta() {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(notificationCheckQuery(request)),
    queryClient.prefetchQuery(nextNotificationQuery(request)),
    queryClient.prefetchQuery(trackedLocationsQuery(request)),
    queryClient.prefetchQuery(meQuery(request)),
    queryClient.prefetchQuery(permissionQuery(request)),
  ]);

  return { dehydratedState: dehydrate(queryClient) };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { dehydratedState } = loaderData;
  return (
    <HydrationBoundary state={dehydratedState}>
      <Stack className="fade-in-up-animation">
        <Greeting />
        <NotificationSetupAlert />
        <ActiveTrackers />
      </Stack>
    </HydrationBoundary>
  );
}
