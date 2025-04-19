import {
  Avatar,
  Group,
  Loader,
  Menu,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Cog, DoorOpen, LogOut, TowerControl } from "lucide-react";
import { useCallback, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { meQuery } from "~/api/me-api";
import { useShowNotification } from "~/hooks/useShowNotification";
import { createSupabaseBrowserClient } from "~/utils/supabase/createSupbaseBrowerClient";

export const AppHeader = () => {
  const { showNotification } = useShowNotification();
  const navigate = useNavigate();
  const { data: meData } = useQuery(meQuery());
  const queryClient = useQueryClient();

  const [isSigningOut, setIsSigningOut] = useState(false);

  const onSettingsClick = useCallback(() => {
    // Handle settings click
    navigate("/settings/profile");
  }, [navigate]);

  const handleSignOut = useCallback(() => {
    // Clear the query cache
    setIsSigningOut(true);
    queryClient.clear();
    const supabase = createSupabaseBrowserClient();
    supabase.auth
      .signOut()
      .then(({ error }) => {
        if (error) {
          console.error("Error signing out:", error.message);
        } else {
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
      //mx="md"
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
  );
};
