import {
  Avatar,
  Group,
  Loader,
  Menu,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Cog, DoorOpen, LogOut } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { meQuery, type me } from "~/api/me-api";
import { createSupabaseBrowserClient } from "~/utils/supabase/createSupbaseBrowerClient";

interface AppHeaderProps {
  me: me;
}

export const AppHeader = ({ me }: AppHeaderProps) => {
  const navigate = useNavigate();
  const { data: meData } = useQuery({ ...meQuery, initialData: me });
  const queryClient = useQueryClient();

  const [isSigningOut, setIsSigningOut] = useState(false);

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
          navigate("/login", { viewTransition: true });
        }
      })
      .finally(() => {
        setIsSigningOut(false);
        // Optionally, you can show a notification or perform any other action after sign out
        notifications.show({
          icon: <DoorOpen size={16} />,
          withBorder: true,
          withCloseButton: false,
          title: "Signed out",
          message: "You have been signed out successfully.",
          color: "teal",
        });
      });
  }, [navigate, queryClient]);
  return (
    <Group
      className="container"
      px="xs"
      h="100%"
      justify="space-between"
      align="center"
    >
      <Text
        component={NavLink}
        viewTransition
        to="/dashboard"
        fz="lg"
        fw="bold"
      >
        Global
      </Text>
      <Menu transitionProps={{ transition: "rotate-right", duration: 150 }}>
        <Menu.Target>
          <UnstyledButton>
            <Avatar color="cyan" size="md" radius="xl">
              {meData.firstName.charAt(0)}
            </Avatar>
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>
            <Text size="xs">{`${meData.firstName} ${meData.lastName}`}</Text>
          </Menu.Label>
          <Menu.Item
            component={Link}
            to={`/settings/profile`}
            leftSection={<Cog size={14} />}
            viewTransition
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
