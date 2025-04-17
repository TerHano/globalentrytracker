import { Alert } from "@mantine/core";
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
        You dont have notifications set up
      </Alert>
    );
  }
  if (!hasAnyNotificationsEnabled) {
    return (
      <Alert
        variant="light"
        color="blue"
        title="Hey There!"
        icon={<MessageSquare />}
      >
        You dont have any notifications enabled
      </Alert>
    );
  }
  return null;
};
