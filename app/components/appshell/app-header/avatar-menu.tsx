import { Avatar, Menu, UnstyledButton, Text, Loader } from "@mantine/core";
import { Star, LayoutDashboard, Cog, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { RoleEnum } from "~/enum/RoleEnum";
import { useShowUpgradeModalContext } from "~/hooks/useShowUpgradeModal";
import type { useSignOutUser } from "~/hooks/useSignOut";
import type { components } from "~/types/api";

interface AvaterMenuProps {
  meData?: components["schemas"]["UserDto"];
  signOutMutation: ReturnType<typeof useSignOutUser>;
}

export const AvatarMenu = ({ meData, signOutMutation }: AvaterMenuProps) => {
  const { showUpgradeModal } = useShowUpgradeModalContext();
  const navigate = useNavigate();
  const isProUser = meData ? meData.role != RoleEnum.Free : false;

  return (
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
          onClick={() => {
            navigate("/dashboard");
          }}
          leftSection={<LayoutDashboard size={14} />}
        >
          Dashboard
        </Menu.Item>
        <Menu.Item
          component={Link}
          to="/settings/profile"
          leftSection={<Cog size={14} />}
        >
          Settings
        </Menu.Item>
        <Menu.Item
          color="red"
          onClick={() => signOutMutation.mutate()}
          leftSection={
            signOutMutation.isPending ? (
              <Loader color="red" size={14} />
            ) : (
              <LogOut size={14} />
            )
          }
        >
          Sign Out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
