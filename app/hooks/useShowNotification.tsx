import { notifications } from "@mantine/notifications";
import { Key, Mails, Plane } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { components } from "~/types/api";

type NotificationStatus = "success" | "error";

type APIError = components["schemas"]["Error"];

type ExceptionCode = components["schemas"]["Error"]["code"];

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
    Record<ExceptionCode, Omit<UseShowNotificationProps, "status">>
  >(() => {
    return {
      ["GenericError"]: {
        title: t("Error"),
        message: t("An error occurred. Please try again."),
        icon: <Plane size={16} />,
      },
      ["TrackerForLocationAndTypeExists"]: {
        title: t("Tracker Exists"),
        message: t("A tracker already exists for this location and type."),
        icon: <Plane size={16} />,
      },
      ["IncorrectLoginInformation"]: {
        title: t("Login Information Incorrect"),
        message: t("The login information provided is incorrect."),
        icon: <Key size={16} />,
      },
      ["ResendVerifyEmail"]: {
        title: t("Email Verification Resend Failed"),
        message: t("Please try resending the email verification link."),
        icon: <Mails size={16} />,
      },
      ["EmailNotConfirmed"]: {
        title: t("Email Not Confirmed"),
        message: t("Your email address has not been confirmed."),
        icon: <Mails size={16} />,
      },
      // ["EmailAlreadyExists"]: {
      //   title: t("Email Already Exists"),
      //   message: t("The email address is already registered."),
      //   icon: <Mails size={16} />,
      // },
      // ["UsernameAlreadyExists"]: {
      //   title: t("Username Already Exists"),
      //   message: t("The username is already taken."),
      //   icon: <Key size={16} />,
      // },
      // ["PasswordTooShort"]: {
      //   title: t("Password Too Short"),
      //   message: t("The password must be at least 8 characters long."),
      //   icon: <Key size={16} />,
      // }
    };
    // Add more error codes as needed
  }, [t]);

  const showErrorCodeNotification = useCallback(
    (errors: APIError[]) => {
      console.log(errors);
      if (!errors || errors.length === 0) {
        return;
      }
      for (const error of errors) {
        let errorCode = error.code;
        if (!errorNotificationMap[errorCode]) {
          errorCode = "GenericError";
        }
        const notificationProps =
          errorNotificationMap[errorCode as ExceptionCode];
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
