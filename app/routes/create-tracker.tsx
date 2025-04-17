import { Anchor, Autocomplete, Select, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { locationQuery } from "~/api/location-api";
import type { TrackedLocation } from "~/api/tracked-locations-api";
import { CreateEditTrackerForm } from "~/components/create-tracker/create-edit-tracker-form";
import { Page } from "~/components/ui/page";
import type { Route } from "../routes/+types/create-tracker";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Create Tracker" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function CreateTracker() {
  return (
    <Page
      breadcrumbs={[
        <Anchor viewTransition fz="xs" component={Link} to="/dashboard">
          Dashboard
        </Anchor>,
        <Text aria-current fw="bold" fz="xs">
          Create Tracker
        </Text>,
      ]}
      header="Create Tracker"
      description="This form allows you to create a new tracker for a specific Global Entry appointment location."
    >
      <CreateEditTrackerForm />
    </Page>
  );
}
