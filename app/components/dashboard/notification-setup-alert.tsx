import { Alert, Text } from "@mantine/core";
import { MessageSquare } from "lucide-react";

interface NotificationSetupAlertProps {
  hasNotificationsSetup: boolean;
  hasAnyNotificationsEnabled: boolean;
}

export const NotificationSetupAlert = ({
  hasNotificationsSetup,
  hasAnyNotificationsEnabled,
}: NotificationSetupAlertProps) => {
  if (!hasNotificationsSetup) {
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
  if (!hasAnyNotificationsEnabled) {
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
