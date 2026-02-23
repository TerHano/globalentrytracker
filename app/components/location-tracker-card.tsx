import {
  Card,
  Stack,
  Flex,
  ActionIcon,
  Badge,
  Menu,
  Text,
  type MenuItemProps,
} from "@mantine/core";
import dayjs from "dayjs";
import { EllipsisVerticalIcon } from "lucide-react";
import { Link } from "react-router";
import type { TrackedLocation } from "~/api/tracked-locations-api";
import { NotificationTypeEnum } from "~/enum/NotificationType";

interface LocationTrackerCardProps {
  locationTracker: TrackedLocation;
  actions?: (MenuItemProps & {
    id: string;
    link?: {
      to: string;
    };
    button?: {
      onClick: () => void;
      color?: string;
    };
  })[];
}

export const LocationTrackerCard = ({
  locationTracker,
  actions,
}: LocationTrackerCardProps) => {
  const getNotificationTypeText = (type: NotificationTypeEnum) => {
    switch (type) {
      case NotificationTypeEnum.Soonest:
        return "Soonest";
      case NotificationTypeEnum.Weekends:
        return "Weekends";
    }
    return "Unknown";
  };

  const { enabled, location, notificationType } = locationTracker;

  return (
    <Card withBorder p="md" radius="md">
      <Stack gap="sm">
        <Flex justify="space-between" align="center">
          <Badge
            size="xs"
            radius="xs"
            color={enabled ? "green" : "red"}
            variant="light"
          >
            {enabled ? "Enabled" : "Disabled"}
          </Badge>
          {actions && (
            <Menu>
              <Menu.Target>
                <ActionIcon variant="subtle" size="md" aria-label="Tracker actions">
                  <EllipsisVerticalIcon size={14} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                {actions.map((action) => {
                  if (action.link) {
                    return (
                      <Menu.Item
                        component={Link}
                        to={action.link.to}
                        key={action.id}
                        {...action}
                      >
                        <Text fz="sm" fw={600}>
                          {action.children}
                        </Text>
                      </Menu.Item>
                    );
                  } else
                    return (
                      <Menu.Item
                        key={action.id}
                        onClick={action.button?.onClick}
                        color={action.button?.color}
                        {...action}
                      >
                        <Text fz="sm" fw={600}>
                          {action.children}
                        </Text>
                      </Menu.Item>
                    );
                })}
              </Menu.Dropdown>
            </Menu>
          )}
        </Flex>
        <Stack gap={4}>
          <Text fw={700} fz={{ base: "md", sm: "lg" }} c={enabled ? undefined : "dimmed"}>
            {location.name}
          </Text>
          <Text fz={{ base: "sm", sm: "md" }} c="dimmed">
            {location.city}, {location.state}
          </Text>
          <Badge size="xs" radius="xs" variant="light" color="blue" w="fit-content">
            {getNotificationTypeText(notificationType.type as NotificationTypeEnum)}
          </Badge>
          <Text size="sm">
            <Text span fw={600}>
              Latest acceptable appointment date:
            </Text>{" "}
            {dayjs(locationTracker.cutOffDate).format("MMM DD, YYYY")}
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
};
