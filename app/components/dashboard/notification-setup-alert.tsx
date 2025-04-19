import { Alert, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";
import { notificationCheckQuery } from "~/api/notification-check-api";

export const NotificationSetupAlert = () => {
  const { data: notificationCheck, isLoading: isNotificationCheckLoading } =
    useQuery(notificationCheckQuery());

  if (isNotificationCheckLoading) {
    return null;
  }
  if (!notificationCheck?.isNotificationsSetUp) {
    return (
      <Alert
        variant="light"
        color="blue"
        title="Hey There!"
        icon={<MessageSquare />}
      >
        You have not set up any notifications yet. Please set up your
        notification settings to receive updates.
      </Alert>
    );
  }
  if (!notificationCheck.isAnyNotificationsEnabled) {
    return (
      <Alert
        variant="light"
        color="yellow"
        title="No Active Notification Settings!"
        icon={<MessageSquare />}
      >
        <Text size="xs">
          None of your notification settings are currently enabled. Please
          enable at least one notification setting to receive updates.
        </Text>
      </Alert>
    );
  }
  return null;
};
