import { Button, Group, Skeleton } from "@mantine/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DoorOpen } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { meQuery } from "~/api/me-api";
import { RoleEnum } from "~/enum/RoleEnum";
import { useShowNotification } from "~/hooks/useShowNotification";

import { useShowUpgradeModalContext } from "~/hooks/useShowUpgradeModal";
import { useUserAuthenticated } from "~/hooks/useUserAuthenticated";
import { MobileAvatarMenu } from "./mobile-avatar-menu";
import { useMediaQuery } from "@mantine/hooks";
import { AvatarMenu } from "./avatar-menu";
import { SiteLogo } from "~/components/ui/site-logo";
import { useSignOutUser } from "~/hooks/useSignOut";

export const AppHeader = () => {
  const { isUserAuthenticated, isLoading } = useUserAuthenticated();
  return (
    <Group
      className="container"
      px="xs"
      h="100%"
      justify="space-between"
      align="center"
    >
      <SiteLogo />
      {isLoading ? null : isUserAuthenticated ? (
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
  const {
    data: meData,
    isPending: isMeLoading,
    isError: isMeErrored,
  } = useQuery({
    ...meQuery(),
    throwOnError: false,
  });
  const queryClient = useQueryClient();
  const matches = useMediaQuery("(min-width: 720px)");
  const { showUpgradeModal } = useShowUpgradeModalContext();

  const isProUser = meData ? meData.role != RoleEnum.Free : false;

  const signOutMutation = useSignOutUser({
    onSuccess: () => {
      queryClient.invalidateQueries();
      navigate("/login");
      showNotification({
        icon: <DoorOpen size={16} />,
        title: "Signed out",
        message: "You have been signed out successfully.",
        status: "success",
      });
    },
    onError: (error) => {
      const firstError = error[0];
      if (firstError) {
        console.error("Error signing out:", firstError.message);
      }
    },
  });

  if (isMeErrored) {
    return null;
  }

  if (isMeLoading) {
    return <Skeleton circle visible width={100} height={40} radius="sm" />;
  }

  return (
    <Group>
      {!isProUser ? (
        <Button onClick={showUpgradeModal} size="compact-sm">
          Upgrade To Pro
        </Button>
      ) : null}

      {matches ? (
        <AvatarMenu signOutMutation={signOutMutation} meData={meData} />
      ) : (
        <MobileAvatarMenu signOutMutation={signOutMutation} meData={meData} />
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
