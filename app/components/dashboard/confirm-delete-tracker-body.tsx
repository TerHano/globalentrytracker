import { Group, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import type { TrackedLocation } from "~/api/tracked-locations-api";
import { LocationTrackerCard } from "../location-tracker-card";
import trashCanIcon from "~/assets/icons/trash-can.png";
import { AlertTriangle } from "lucide-react";

export interface ConfirmDeleteTrackerProps {
  tracker: TrackedLocation;
}

export const ConfirmDeleteTrackerBody = ({
  tracker,
}: ConfirmDeleteTrackerProps) => {
  return (
    <Stack gap="md">
      <Group wrap="nowrap" align="flex-start" gap="xs">
        <ThemeIcon color="red" variant="light" size="sm" mt={2}>
          <AlertTriangle size={14} />
        </ThemeIcon>
        <Text size="sm" c="dimmed" fw={500}>
          This permanently deletes this tracker and its notification settings.
        </Text>
      </Group>

      <Paper withBorder p="sm" radius="md">
        <Stack gap={2}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            Tracker to delete
          </Text>
          <Text fw={600} size="sm">
            {tracker.location.city}, {tracker.location.state}
          </Text>
          <Text size="xs" c="dimmed">
            {tracker.location.name} • {tracker.notificationType.name}
          </Text>
        </Stack>
      </Paper>

      <Stack align="center" gap="xs">
        <img src={trashCanIcon} alt="Trash Can" width={56} height={56} />
      </Stack>

      <Text size="xs" c="dimmed">
        Review the card details below before confirming.
      </Text>
      <LocationTrackerCard locationTracker={tracker} />
    </Stack>
  );
};
