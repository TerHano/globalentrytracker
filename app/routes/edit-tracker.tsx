import { Anchor, Text } from "@mantine/core";
import { Link } from "react-router";
import { notificationCheckQuery } from "~/api/notification-check-api";
import { CreateEditTrackerForm } from "~/components/create-tracker/create-edit-tracker-form";
import type { Route } from "../routes/+types/edit-tracker";
import { locationStatesQuery } from "~/api/location-states-api";
import { notificationTypesQuery } from "~/api/notification-types-api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { locationsQuery } from "~/api/location-api";
import { trackedLocationQuery } from "~/api/tracked-location-api";
import { fetchClient } from "~/utils/fetchData";
import { Page } from "~/components/ui/layout/page";

export function meta() {
  return [
    { title: "Edit Tracker" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { trackerId } = params;
  if (!trackerId) {
    throw new Error("Tracker ID is required");
  }
  const trackerIdNumber = parseInt(trackerId);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(notificationCheckQuery(request));
  await queryClient.prefetchQuery(locationsQuery(request));
  await queryClient.prefetchQuery(notificationTypesQuery(request));
  await queryClient.prefetchQuery(locationStatesQuery(request));
  await queryClient.prefetchQuery(
    trackedLocationQuery({ trackedLocationId: trackerIdNumber })
  );

  const trackedLocation = await fetchClient
    .GET(`/api/v1/tracked-locations/{id}`, {
      params: { path: { id: trackerIdNumber } },
      headers: { cookie: request?.headers.get("cookie") || "" },
      credentials: "include",
    })
    .then((response) => response.data?.data);

  return { trackedLocation, dehydratedState: dehydrate(queryClient) };
}
export default function EditTracker({ loaderData }: Route.ComponentProps) {
  const { dehydratedState, trackedLocation } = loaderData;
  return (
    <HydrationBoundary state={dehydratedState}>
      <Page
        className="fade-in-up-animation"
        breadcrumbs={[
          <Anchor
            key="Dashboard"
            viewTransition
            fz="xs"
            component={Link}
            to="/dashboard"
          >
            Dashboard
          </Anchor>,
          <Text key="Edit Tracker" aria-current fw="bold" fz="xs">
            Edit Tracker
          </Text>,
        ]}
        header="Edit Tracker"
        description="This form allows you to create a new tracker for a specific Global Entry appointment location."
      >
        <CreateEditTrackerForm
          // data={{
          //   appointmentLocations,
          //   states,
          //   notificationTypes,
          // }}
          trackedLocation={trackedLocation}
        />
      </Page>
    </HydrationBoundary>
  );
}
