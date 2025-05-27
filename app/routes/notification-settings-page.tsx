import { NotificationSettings } from "~/components/settings/notification-settings/notification-settings";

export function meta() {
  return [
    { title: "Settings - Notification" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function NotificationSettingsPage() {
  return <NotificationSettings />;
}
