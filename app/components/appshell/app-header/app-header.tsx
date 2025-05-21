import { Button, Group, Text } from "@mantine/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DoorOpen, PlaneLanding } from "lucide-react";
import { useCallback } from "react";
import { NavLink, useNavigate } from "react-router";
import { meQuery } from "~/api/me-api";
import { RoleEnum } from "~/enum/RoleEnum";
import { useShowNotification } from "~/hooks/useShowNotification";

import { useShowUpgradeModalContext } from "~/hooks/useShowUpgradeModal";
import { useUserAuthenticated } from "~/hooks/useUserAuthenticated";
import { supabaseBrowserClient } from "~/utils/supabase/createSupbaseBrowerClient";
import { MobileAvatarMenu } from "./mobile-avatar-menu";
import { useMediaQuery } from "@mantine/hooks";
import { AvatarMenu } from "./avatar-menu";

export const AppHeader = () => {
  const isAuthenticated = useUserAuthenticated();
  return (
    <Group
      className="container"
      px="xs"
      h="100%"
      justify="space-between"
      align="center"
    >
      <Group gap={4}>
        <PlaneLanding size={24} />
        <Text component={NavLink} to="/" fz="1.2rem" fw="bold">
          EasyEntry
        </Text>
      </Group>
      {isAuthenticated ? (
        <AppHeaderAuthenticated />
      ) : (
        <AppHeaderUnAuthenticated />
      )}
    </Group>
  );
};

const AppHeaderAuthenticated = () => {
  const { showNotification } = useShowNotification();
  const navigate = useNavigate();
  const { data: meData } = useQuery(meQuery());
  const queryClient = useQueryClient();
  const matches = useMediaQuery("(min-width: 720px)");
  const { showUpgradeModal } = useShowUpgradeModalContext();

  const isProUser = meData ? meData.role != RoleEnum.Free : false;

  const handleSignOut = useCallback(() => {
    // Clear the query cache
    supabaseBrowserClient.auth
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
    <Group>
      {!isProUser ? (
        <Button onClick={showUpgradeModal} size="compact-sm">
          Upgrade To Pro
        </Button>
      ) : null}
      {matches ? (
        <AvatarMenu onSignOut={handleSignOut} meData={meData} />
      ) : (
        <MobileAvatarMenu onSignOut={handleSignOut} meData={meData} />
      )}
    </Group>
  );
};

const AppHeaderUnAuthenticated = () => {
  return (
    <Group>
      <Button variant="light" component={NavLink} to="/login" size="compact-sm">
        Login
      </Button>
      <Button component={NavLink} to="/signup" size="compact-sm">
        Sign Up
      </Button>
    </Group>
  );
};
