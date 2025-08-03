import { Button, Group, Skeleton } from "@mantine/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Cog, DoorOpen, LayoutDashboard, Star, Terminal } from "lucide-react";
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
import { useSignOutUser } from "~/hooks/api/useSignOut";
import { useMemo } from "react";

export interface MenuOption {
  color?: "red" | "yellow";
  isShown?: boolean;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

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
  const navigate = useNavigate();

  const { showNotification } = useShowNotification();
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

  const isProUser = meData ? meData.role.code != RoleEnum.Free : false;

  const signOutMutation = useSignOutUser({
    onSuccess: () => {
      queryClient.clear();
      navigate("/login");
      showNotification({
        icon: <DoorOpen size={16} />,
        title: "Signed out",
        message: "You have been signed out successfully.",
        status: "success",
      });
    },
    onError: (error) => {
      const firstError = error[0]?.message ?? "An unexpected error occurred.";
      showNotification({
        icon: <DoorOpen size={16} />,
        title: "Sign out failed",
        message: firstError,
        status: "error",
      });
    },
  });

  const menuOptions = useMemo<MenuOption[]>(
    () => [
      {
        label: "Admin Console",
        color: "yellow",
        icon: <Terminal size={14} />,
        onClick: () => navigate("/admin/dashboard"),
        isShown: meData?.role.code === RoleEnum.Admin,
      },
      {
        label: "Dashboard",
        icon: <LayoutDashboard size={14} />,
        onClick: () => navigate("/dashboard"),
      },
      {
        label: "Upgrade",
        icon: <Star size={14} />,
        onClick: showUpgradeModal,
        isShown: !isProUser,
      },
      {
        label: "Settings",
        icon: <Cog size={14} />,
        onClick: () => navigate("/settings/profile"),
      },
      {
        color: "red",
        label: "Sign Out",
        icon: signOutMutation.isPending ? (
          <Skeleton width={14} height={14} />
        ) : (
          <DoorOpen size={14} />
        ),
        onClick: () => signOutMutation.mutate({ body: {} }),
      },
    ],
    [isProUser, meData?.role.code, navigate, showUpgradeModal, signOutMutation]
  );

  if (isMeErrored) {
    return null;
  }

  if (isMeLoading) {
    return <Skeleton circle visible width={100} height={40} radius="sm" />;
  }

  return (
    <Group>
      {meData.role.code === RoleEnum.Admin ? (
        <Button
          variant="light"
          visibleFrom="xs"
          component={NavLink}
          to="/admin/dashboard"
          size="compact-sm"
          leftSection={<Terminal size={14} />}
          color="yellow"
        >
          Admin Console
        </Button>
      ) : null}
      {!isProUser ? (
        <Button onClick={showUpgradeModal} size="compact-sm">
          Upgrade To Pro
        </Button>
      ) : null}

      {matches ? (
        <AvatarMenu menuOptions={menuOptions} meData={meData} />
      ) : (
        <MobileAvatarMenu menuOptions={menuOptions} meData={meData} />
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
