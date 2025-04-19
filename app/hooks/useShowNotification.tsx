import { notifications } from "@mantine/notifications";
import { useCallback } from "react";

type NotificationStatus = "success" | "error";

export interface UseShowNotificationProps {
  status: NotificationStatus;
  title: string;
  message: string;
  icon: React.ReactNode;
}
export const useShowNotification = () => {
  const showNotification = useCallback(
    ({ status, title, message, icon }: UseShowNotificationProps) => {
      notifications.show({
        withBorder: true,
        title,
        message,
        color: getColorForStatus(status),
        icon,
        withCloseButton: false,
      });
    },
    []
  );

  return { showNotification };
};
const getColorForStatus = (status: NotificationStatus) => {
  switch (status) {
    case "success":
      return "teal";
    case "error":
      return "red";
    default:
      return "gray";
  }
};
