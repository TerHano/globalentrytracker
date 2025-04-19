import { Stack, Text } from "@mantine/core";
import type { TrackedLocation } from "~/api/tracked-locations-api";
import { LocationTrackerCard } from "../location-tracker-card";
import trashCanIcon from "~/assets/icons/trash-can.png";

export interface ConfirmDeleteTrackerProps {
  tracker: TrackedLocation;
}

export const ConfirmDeleteTrackerBody = ({
  tracker,
}: ConfirmDeleteTrackerProps) => {
  return (
    <Stack>
      <Text size="sm" c="dimmed" fw={500}>
        This action cannot be undone. All data associated with this tracker will
        be permanently deleted.
      </Text>
      <Stack align="center" gap={0}>
        <div
          style={{ transform: "translateY(20px) scale(0.7)", width: "100%" }}
        >
          <LocationTrackerCard locationTracker={tracker} />
        </div>
        <img src={trashCanIcon} alt="Trash Can" width={100} height={100} />
        {/* <Group justify="center" align="center">
          <CornerDownRight />
          <Trash2 />
        </Group> */}
      </Stack>
    </Stack>
  );
};
