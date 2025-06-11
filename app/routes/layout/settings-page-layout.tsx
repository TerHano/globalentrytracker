import { SegmentedControl, Group, Text, Button, Stack } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Bell, CreditCard, User } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { Page } from "~/components/ui/layout/page";
import type { Route } from "./+types/settings-page-layout";
import { useField } from "@mantine/form";

interface PageTab {
  name: string;
  icon: React.ReactNode;
  path: string;
}

type SettingsTab = "Profile" | "Notifications" | "Subscription";

export async function loader({ request }: Route.LoaderArgs) {
  const path = request.url;
  let tab: SettingsTab = "Profile";
  if (path.endsWith("notifications")) {
    tab = "Notifications";
  } else if (path.endsWith("subscription")) {
    tab = "Subscription";
  }
  return { tab };
}

export default function SettingsPageLayout({
  loaderData,
}: Route.ComponentProps) {
  const { tab } = loaderData;
  const [activeTab, setActiveTab] = useState<SettingsTab>(tab);
  const navigate = useNavigate();

  const handleTabChange = useCallback(
    (value: string | null) => {
      switch (value) {
        case "Notifications":
          setActiveTab("Notifications");

          navigate("/settings/notifications", {
            preventScrollReset: true,
          });
          break;
        case "Subscription":
          setActiveTab("Subscription");
          navigate("/settings/subscription", {
            preventScrollReset: true,
          });
          break;
        default:
          setActiveTab("Profile");
          navigate("/settings/profile", {
            preventScrollReset: true,
          });
          break;
      }
    },
    [navigate]
  );

  const pageTabs: PageTab[] = useMemo(
    () => [
      { name: "Profile", icon: <User size={14} />, path: "profile" },
      {
        name: "Subscription",
        icon: <CreditCard size={14} />,
        path: "subscription",
      },
      {
        name: "Notifications",
        icon: <Bell size={14} />,
        path: "notifications",
      },
    ],
    []
  );

  const tabs = useMemo(
    () =>
      pageTabs.map((tab) => ({
        value: tab.name,
        label: <TabLabel icon={tab.icon} label={tab.name} />,
      })),
    [pageTabs]
  );

  const segmentedControlField = useField({
    initialValue: activeTab,
  });

  useEffect(() => {
    segmentedControlField.setValue(activeTab);
  }, [activeTab, segmentedControlField]);

  const settingsTabs = useMemo(
    () => (
      <SegmentedControl
        {...segmentedControlField.getInputProps()}
        data={tabs}
        onChange={handleTabChange}
      />
    ),
    [segmentedControlField, tabs, handleTabChange]
  );

  return (
    <Stack gap="xs">
      <NavLink to="/dashboard">
        {({ isPending }) => (
          <Button
            variant="subtle"
            color="gray"
            size="sm"
            leftSection={<ArrowLeft size={14} />}
            loading={isPending}
          >
            Dashboard
          </Button>
        )}
      </NavLink>
      <Page
        className="fade-in-up-animation"
        header="Settings"
        description="You can change your settings here"
      >
        {settingsTabs}
        <Outlet />
      </Page>
    </Stack>
  );
}

const TabLabel = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => {
  return (
    <Group
      fz={{ base: "xs", xs: "sm" }}
      gap={5}
      align="center"
      justify="center"
    >
      {icon}
      <Text visibleFrom="xs" fw="bold" fz={{ base: "xs", xs: "sm" }}>
        {label}
      </Text>
    </Group>
  );
};
