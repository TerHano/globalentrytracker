import {
  ActionIcon,
  Badge,
  Card,
  Flex,
  Menu,
  Stack,
  Text,
} from "@mantine/core";
import { EllipsisVerticalIcon, PencilLine } from "lucide-react";
import { Link } from "react-router";
import type { TrackedLocation } from "~/api/tracked-locations-api";

export const TrackerCard = ({ tracker }: { tracker: TrackedLocation }) => {
  const { id, enabled, location } = tracker;
  return (
    <Card withBorder p="sm">
      <Stack gap={3}>
        <Flex justify="space-between" align="center">
          <Badge
            size="xs"
            radius="xs"
            color={enabled ? "green" : "red"}
            variant="light"
          >
            {enabled ? "Enabled" : "Disabled"}
          </Badge>

          <Menu>
            <Menu.Target>
              <ActionIcon variant="subtle" size="sm">
                <EllipsisVerticalIcon size={12} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                component={Link}
                to={`/edit-tracker/${id}`}
                leftSection={<PencilLine size={14} />}
              >
                Edit Tracker
              </Menu.Item>

              {/* Other items ... */}
            </Menu.Dropdown>
          </Menu>
        </Flex>
        <Stack>
          <Text fw="bold" fz={{ base: "md", sm: "lg" }}>
            {location.name}
          </Text>
          <Text size="sm" c="dimmed"></Text>
        </Stack>
      </Stack>
    </Card>
  );
};
