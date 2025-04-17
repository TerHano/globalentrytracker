"use client";
import { Alert, Text } from "@mantine/core";
import { MailWarning } from "lucide-react";
import { useState } from "react";
import type { NotificationCheck } from "~/api/notification-check-api";

export const CreateTrackerNotificationWarning = ({
  notificationCheck,
}: {
  notificationCheck: NotificationCheck;
}) => {
  const [hideAlert, setHideAlert] = useState(false);
  const showAlert = !hideAlert && !notificationCheck.isAnyNotificationsEnabled;
  return showAlert ? (
    <Alert
      withCloseButton
      onClose={() => setHideAlert(true)}
      color="yellow"
      icon={<MailWarning size={16} />}
    >
      <Text fz="sm" fw="bold">
        No Enabled Notifications
      </Text>
      <Text fz="xs">
        None of your notifications are enabled. Please remember to enable at
        least one notification setting to receive updates for this tracker.
      </Text>
    </Alert>
  ) : null;
};
