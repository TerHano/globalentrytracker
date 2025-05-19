import {
  Avatar,
  Button,
  Group,
  Loader,
  Menu,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Cog, DoorOpen, LogOut, Star, TowerControl } from "lucide-react";
import { useCallback, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { meQuery } from "~/api/me-api";
import { RoleEnum } from "~/enum/RoleEnum";
import { useShowNotification } from "~/hooks/useShowNotification";
import { createSupabaseBrowserClient } from "~/utils/supabase/createSupbaseBrowerClient";

import { useShowUpgradeModalContext } from "~/hooks/useShowUpgradeModal";

export const AppHeader = () => {
  const { showNotification } = useShowNotification();
  const navigate = useNavigate();
  const { data: meData } = useQuery(meQuery());
  const queryClient = useQueryClient();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const { showUpgradeModal } = useShowUpgradeModalContext();

  const isProUser = meData ? meData.role != RoleEnum.Free : false;

  const onSettingsClick = useCallback(() => {
    navigate("/settings/profile");
  }, [navigate]);

  const handleSignOut = useCallback(() => {
    // Clear the query cache
    setIsSigningOut(true);
    const supabase = createSupabaseBrowserClient();
    supabase.auth
      .signOut()
      .then(({ error }) => {
        if (error) {
          console.error("Error signing out:", error.message);
        } else {
          queryClient.clear();
          navigate("/login");
        }
      })
      .finally(() => {
        setIsSigningOut(false);

        showNotification({
          icon: <DoorOpen size={16} />,
          title: "Signed out",
          message: "You have been signed out successfully.",
          status: "success",
        });
        // Optionally, you can show a notification or perform any other action after sign out
      });
  }, [navigate, queryClient, showNotification]);
  return (
    <Group
      className="container"
      px="xs"
      h="100%"
      justify="space-between"
      align="center"
    >
      <Group align="baseline" gap={4}>
        <TowerControl size={24} />
        <Text component={NavLink} to="/dashboard" fz="xl" fw="bold">
          Global
        </Text>
      </Group>
      <Group>
        {!isProUser ? (
          <Button onClick={showUpgradeModal} size="compact-sm">
            Upgrade To Pro
          </Button>
        ) : null}
        <Menu transitionProps={{ transition: "rotate-right", duration: 150 }}>
          <Menu.Target>
            <UnstyledButton>
              <Avatar color="cyan" size="md" radius="xl">
                {meData?.firstName.charAt(0)}
              </Avatar>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>
              <Text size="xs">{`${meData?.firstName} ${meData?.lastName}`}</Text>
            </Menu.Label>
            {!isProUser ? (
              <Menu.Item
                onClick={showUpgradeModal}
                leftSection={<Star size={14} />}
              >
                Upgrade
              </Menu.Item>
            ) : null}
            <Menu.Item
              // component={Link}
              // to="/settings/profile"
              leftSection={<Cog size={14} />}
              onClick={onSettingsClick}
            >
              Settings
            </Menu.Item>
            <Menu.Item
              color="red"
              onClick={handleSignOut}
              leftSection={
                isSigningOut ? (
                  <Loader size="xs" color="red" />
                ) : (
                  <LogOut size={14} />
                )
              }
            >
              Sign Out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
};
