import { notifications } from "@mantine/notifications";
import { Key, Plane } from "lucide-react";
import { useCallback, useMemo } from "react";
import { ErrorCode } from "~/enum/ErrorCodes";
import { useTranslation } from "react-i18next";
import type { ApiError } from "~/models/ApiError";

type NotificationStatus = "success" | "error";

export interface UseShowNotificationProps {
  status: NotificationStatus;
  title: string;
  message: string;
  icon: React.ReactNode;
}
export const useShowNotification = () => {
  const { t } = useTranslation();
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

  const errorNotificationMap = useMemo<
    Record<ErrorCode, Omit<UseShowNotificationProps, "status">>
  >(() => {
    return {
      [ErrorCode.GenericError]: {
        title: t("Error"),
        message: t("An error occurred. Please try again."),
        icon: <Plane size={16} />,
      },
      [ErrorCode.TrackerExistsForLocationAndType]: {
        title: t("Tracker Exists"),
        message: t("A tracker already exists for this location and type."),
        icon: <Plane size={16} />,
      },
      [ErrorCode.LoginInformationIncorrect]: {
        title: t("Login Information Incorrect"),
        message: t("The login information provided is incorrect."),
        icon: <Key size={16} />,
      },
    };
    // Add more error codes as needed
  }, [t]);

  const showErrorCodeNotification = useCallback(
    (errors: ApiError[]) => {
      console.log(errors);
      if (!errors || errors.length === 0) {
        return;
      }
      for (const error of errors) {
        let errorCode = error.code as ErrorCode;
        if (!errorNotificationMap[errorCode]) {
          errorCode = ErrorCode.GenericError;
        }
        const notificationProps = errorNotificationMap[errorCode];
        if (notificationProps) {
          notifications.show({
            withBorder: true,
            title: notificationProps.title,
            message: notificationProps.message,
            color: getColorForStatus("error"),
            icon: notificationProps.icon,
            withCloseButton: false,
          });
        }
      }
    },
    [errorNotificationMap]
  );

  return { showNotification, showErrorCodeNotification };
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
