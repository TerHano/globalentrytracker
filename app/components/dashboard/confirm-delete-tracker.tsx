import { Card, Stack, Text } from "@mantine/core";
import type { TrackedLocation } from "~/api/tracked-locations-api";

export interface ConfirmDeleteTrackerProps {
  tracker: TrackedLocation;
}

export const ConfirmDeleteTracker = ({
  tracker,
}: ConfirmDeleteTrackerProps) => {
  return (
    <Stack>
      <Text>You cannot undo this action</Text>
      <Card withBorder p="sm">
        <Stack gap={3}>
          <Stack>
            <Text fw="bold" fz={{ base: "md", sm: "lg" }}>
              {tracker.location.name}
            </Text>
            <Text size="sm" c="dimmed"></Text>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
};
