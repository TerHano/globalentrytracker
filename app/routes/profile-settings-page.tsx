import { ProfileSettings } from "~/components/settings/profile-settings";

export function meta() {
  return [
    { title: "Settings - Profile" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function ProfileSettingsPage() {
  return <ProfileSettings />;
}
