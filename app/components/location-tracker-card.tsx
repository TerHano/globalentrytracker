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
} from "@mantine/core";
import { EllipsisVerticalIcon } from "lucide-react";
import { Link } from "react-router";
import type { TrackedLocation } from "~/api/tracked-locations-api";
import { NotificationType } from "~/enum/NotificationType";

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
  const getNotificationTypeText = (type: NotificationType) => {
    switch (type) {
      case NotificationType.Soonest:
        return "Soonest";
      case NotificationType.Weekends:
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
                      />
                    );
                  } else
                    return (
                      <Menu.Item
                        key={action.id}
                        onClick={action.button?.onClick}
                        color={action.button?.color}
                        {...action}
                      />
                    );
                })}
              </Menu.Dropdown>
            </Menu>
          )}
        </Flex>
        <Stack>
          <Text fw="bold" fz={{ base: "md", sm: "lg" }}>
            {location.name}
          </Text>

          <InputWrapper label="Notification Type">
            <Text size="xs" c="dimmed">
              {getNotificationTypeText(
                notificationType.type as NotificationType
              )}
            </Text>
          </InputWrapper>
        </Stack>
      </Stack>
    </Card>
  );
};
