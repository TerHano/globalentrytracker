import { SegmentedControl, Group, Text, Button, Stack } from "@mantine/core";
import { useCallback, useEffect, useMemo } from "react";
import { ArrowLeft, Bell, CreditCard, User } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { Page } from "~/components/ui/page";
import type { Route } from "./+types/settings-page-layout";
import { useField } from "@mantine/form";

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
  // const isFirstRender = useIsFirstRender();
  const navigate = useNavigate();

  const tabs = useMemo(
    () => [
      {
        value: "Profile",
        label: <TabLabel icon={<User size={14} />} label="Profile" />,
      },
      {
        value: "Subscription",
        label: (
          <TabLabel icon={<CreditCard size={14} />} label="Subscription" />
        ),
      },
      {
        value: "Notifications",
        label: <TabLabel icon={<Bell size={14} />} label="Notifications" />,
      },
    ],
    []
  );

  const segmentedControlField = useField({
    initialValue: tab,
  });

  const handleTabChange = useCallback(
    (val: string) => {
      if (val === "Profile") {
        navigate("/settings/profile");
      } else if (val === "Notifications") {
        navigate("/settings/notifications");
      }
      if (val === "Subscription") {
        navigate("/settings/subscription");
      }
    },
    [navigate]
  );

  useEffect(() => {
    segmentedControlField.setValue(tab);
  }, [tab, segmentedControlField]);

  const settingsTabs = useMemo(
    () => (
      <SegmentedControl
        {...segmentedControlField.getInputProps()}
        onChange={(val) => handleTabChange(val)}
        data={tabs}
      />
    ),
    [handleTabChange, segmentedControlField, tabs]
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
      <Text fw="bold" fz={{ base: "xs", xs: "sm" }}>
        {label}
      </Text>
    </Group>
  );
};
