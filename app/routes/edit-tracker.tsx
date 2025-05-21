import { Anchor, Text } from "@mantine/core";
import { Link, redirect } from "react-router";
import { notificationCheckQuery } from "~/api/notification-check-api";
import { CreateEditTrackerForm } from "~/components/create-tracker/create-edit-tracker-form";
import { Page } from "~/components/ui/page";
import { createSupabaseServerClient } from "~/utils/supabase/createSupabaseServerClient";
import type { Route } from "../routes/+types/edit-tracker";
import { trackedLocationApi } from "~/api/tracked-location-api";
import { locationStatesQuery } from "~/api/location-states-api";
import { locationQuery } from "~/api/location-api";
import { notificationTypesQuery } from "~/api/notification-types-api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export function meta() {
  return [
    { title: "Edit Tracker" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    // If the user is already logged in, redirect to the home page
    return redirect("/login", { headers });
  }
  const { trackerId } = params;
  if (!trackerId) {
    throw new Error("Tracker ID is required");
  }
  const token = session.access_token;
  const trackerIdNumber = parseInt(trackerId);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(notificationCheckQuery(token));
  await queryClient.prefetchQuery(locationQuery(token));
  await queryClient.prefetchQuery(notificationTypesQuery(token));
  await queryClient.prefetchQuery(locationStatesQuery(token));
  // await queryClient.prefetchQuery(
  //   trackedLocationQuery({ trackedLocationId: trackerIdNumber })
  // );

  const trackedLocation = await trackedLocationApi(
    session.access_token,
    trackerIdNumber
  );

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
