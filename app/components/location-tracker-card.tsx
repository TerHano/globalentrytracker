import {
  Card,
  Stack,
  Flex,
  ActionIcon,
  InputWrapper,
  Badge,
  Menu,
  Text,
  type MenuItemProps,
  SimpleGrid,
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
          {actions && (
            <Menu>
              <Menu.Target>
                <ActionIcon variant="subtle" size="sm">
                  <EllipsisVerticalIcon size={12} />
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
        <Stack>
          <Stack gap={0}>
            <Text fw="bold" fz={{ base: "md", sm: "lg" }}>
              {location.name}
            </Text>
            <Text fz={{ base: "sm", sm: "md" }} c="dimmed">
              {location.city}, {location.state}
            </Text>
          </Stack>
          <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="xs">
            <InputWrapper label="Notification Type">
              <Text size="xs" c="dimmed">
                {getNotificationTypeText(
                  notificationType.type as NotificationTypeEnum
                )}
              </Text>
            </InputWrapper>
            <InputWrapper label="Cutoff Date">
              <Text size="xs" c="dimmed">
                {dayjs(locationTracker.cutOffDate).format("MMM DD , YYYY")}
              </Text>
            </InputWrapper>
          </SimpleGrid>
        </Stack>
      </Stack>
    </Card>
  );
};
