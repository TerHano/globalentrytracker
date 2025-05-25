import { Anchor, Text } from "@mantine/core";
import { Link, redirect } from "react-router";
import { CreateEditTrackerForm } from "~/components/create-tracker/create-edit-tracker-form";
import { Page } from "~/components/ui/page";
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
import { isAuthenticated } from "~/utils/auth";

export function meta() {
  return [
    { title: "Create Tracker" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const isUserAuthenticated = await isAuthenticated(request);
  if (!isUserAuthenticated) {
    // If the user is not authenticated, redirect to the login page
    return redirect("/login");
  }
  // const token = session.access_token;
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
