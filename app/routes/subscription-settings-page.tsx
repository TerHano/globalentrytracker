import { SubscriptionSettings } from "~/components/settings/subscription-settings";

export function meta() {
  return [
    { title: "Settings - Subscription" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function ProfileSettingsPage() {
  return <SubscriptionSettings />;
}
