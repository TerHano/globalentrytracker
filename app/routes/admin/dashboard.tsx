import type { Route } from "./+types/dashboard";
import { notificationCheckQuery } from "~/api/notification-check-api";
import { trackedLocationsQuery } from "~/api/tracked-locations-api";
import { meQuery } from "~/api/me-api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { permissionQuery } from "~/api/permissions-api";
import { AdminConsolePage } from "~/pages/admin/admin-console-page";

export function meta() {
  return [
    { title: "Admin Dashboard" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader({ request }: Route.LoaderArgs) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(notificationCheckQuery(request));
  await queryClient.prefetchQuery(trackedLocationsQuery(request));
  await queryClient.prefetchQuery(meQuery(request));
  await queryClient.prefetchQuery(permissionQuery(request));

  return { dehydratedState: dehydrate(queryClient) };
}

export default function AdminDashboard({ loaderData }: Route.ComponentProps) {
  const { dehydratedState } = loaderData;
  return (
    <HydrationBoundary state={dehydratedState}>
      <AdminConsolePage />
    </HydrationBoundary>
  );
}
