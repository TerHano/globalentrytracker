import { Anchor, Text } from "@mantine/core";
import { Link, redirect } from "react-router";
import { CreateEditTrackerForm } from "~/components/create-tracker/create-edit-tracker-form";
import { Page } from "~/components/ui/page";
import { createSupabaseServerClient } from "~/utils/supabase/createSupabaseServerClient";
import type { Route } from "./+types/create-tracker";
import { notificationCheckApi } from "~/api/notification-check-api";
import { CreateTrackerNotificationWarning } from "~/components/create-tracker/create-tracker-notification-warning";

export function meta() {
  return [
    { title: "Create Tracker" },
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
  return { notificationCheck };
}

export default function CreateTracker({ loaderData }: Route.ComponentProps) {
  const { notificationCheck } = loaderData;
  return (
    <Page
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
      <CreateTrackerNotificationWarning notificationCheck={notificationCheck} />
      <CreateEditTrackerForm />
    </Page>
  );
}
