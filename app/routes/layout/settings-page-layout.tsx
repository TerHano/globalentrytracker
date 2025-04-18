import { SegmentedControl, Group } from "@mantine/core";
import { useCallback, useMemo } from "react";
import { Bell, User } from "lucide-react";
import { Outlet, useNavigate } from "react-router";
import { Page } from "~/components/ui/page";
import type { Route } from "./+types/settings-page-layout";

type SettingsTab = "Profile" | "Notifications";

export async function loader({ request }: Route.LoaderArgs) {
  const path = request.url;
  let tab: SettingsTab = "Profile";
  if (path.endsWith("notifications")) {
    tab = "Notifications";
  }
  console.log("loaded", tab);
  return { tab };
}

export default function SettingsPageLayout({
  loaderData,
}: Route.ComponentProps) {
  const { tab } = loaderData;
  // const isFirstRender = useIsFirstRender();
  const navigate = useNavigate();

  const handleTabChange = useCallback(
    (val: string) => {
      // setCurrentTab(val as SettingsTab);
      if (val === "Profile") {
        navigate("/settings/profile");
      } else if (val === "Notifications") {
        navigate("/settings/notifications");
      }
    },
    [navigate]
  );

  const settingsTabs = useMemo(
    () => (
      <SegmentedControl
        defaultValue={tab}
        onChange={(val) => handleTabChange(val)}
        data={[
          {
            value: "Profile",
            label: (
              <Group gap="xs" justify="center">
                <User size={16} />
                Profile
              </Group>
            ),
          },
          {
            value: "Notifications",
            label: (
              <Group gap="xs" justify="center">
                <Bell size={16} />
                Notifications
              </Group>
            ),
          },
        ]}
      />
    ),
    [handleTabChange, tab]
  );

  return (
    <Page header="Settings" description="You can change your settings here">
      {settingsTabs}
      <Outlet />
    </Page>
  );
}
