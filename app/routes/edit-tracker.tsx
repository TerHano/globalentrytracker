import { Anchor, Text } from "@mantine/core";
import { Link, redirect } from "react-router";
import { meApi } from "~/api/me-api";
import { notificationCheckApi } from "~/api/notification-check-api";
import { CreateEditTrackerForm } from "~/components/create-tracker/create-edit-tracker-form";
import { Page } from "~/components/ui/page";
import { createSupabaseServerClient } from "~/utils/supabase/createSupabaseServerClient";
import type { Route } from "../routes/+types/edit-tracker";
import { trackedLocationApi } from "~/api/tracked-location-api";

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
  const trackerIdNumber = parseInt(trackerId);
  const notificationCheck = await notificationCheckApi(session.access_token);
  const me = await meApi(session.access_token);
  const trackedLocation = await trackedLocationApi(
    session.access_token,
    trackerIdNumber
  );
  console.log("trackedLocation", trackedLocation);
  return { notificationCheck, me, trackedLocation };
}
export default function EditTracker({ loaderData }: Route.ComponentProps) {
  const { trackedLocation } = loaderData;
  return (
    <Page
      className="fade-in-animation"
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
      <CreateEditTrackerForm trackedLocation={trackedLocation} />
    </Page>
  );
}
