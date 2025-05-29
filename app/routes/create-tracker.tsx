import { Anchor, Text } from "@mantine/core";
import { Link } from "react-router";
import { CreateEditTrackerForm } from "~/components/create-tracker/create-edit-tracker-form";
import { Page } from "~/components/ui/layout/page";
import type { Route } from "./+types/create-tracker";
import { notificationCheckQuery } from "~/api/notification-check-api";
import { CreateTrackerNotificationWarning } from "~/components/create-tracker/create-tracker-notification-warning";
import { locationStatesQuery } from "~/api/location-states-api";
import { notificationTypesQuery } from "~/api/notification-types-api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { locationsQuery } from "~/api/location-api";

export function meta() {
  return [
    { title: "Create Tracker" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(notificationCheckQuery(request));
  await queryClient.prefetchQuery(locationsQuery(request));
  await queryClient.prefetchQuery(notificationTypesQuery(request));
  await queryClient.prefetchQuery(locationStatesQuery(request));
  return { dehydratedState: dehydrate(queryClient) };
}

export default function CreateTracker({ loaderData }: Route.ComponentProps) {
  const { dehydratedState } = loaderData;
  return (
    <HydrationBoundary state={dehydratedState}>
      <Page
        className="fade-in-up-animation"
        breadcrumbs={[
          <Anchor
            key="dashboard"
            viewTransition
            fz="xs"
            component={Link}
            to="/dashboard"
          >
            Dashboard
          </Anchor>,
          <Text key="create-tracker" aria-current fw="bold" fz="xs">
            Create Tracker
          </Text>,
        ]}
        header="Create Tracker"
        description="This form allows you to create a new tracker for a specific Global Entry appointment location."
      >
        <CreateTrackerNotificationWarning />
        <CreateEditTrackerForm />
      </Page>
    </HydrationBoundary>
  );
}
