import { Avatar, Menu, UnstyledButton, Text } from "@mantine/core";
import type { components } from "~/types/api";
import type { MenuOption } from "./app-header";

interface AvaterMenuProps {
  meData?: components["schemas"]["UserDto"];
  menuOptions: MenuOption[];
}

export const AvatarMenu = ({ meData, menuOptions }: AvaterMenuProps) => {
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
        {menuOptions.map((option) => {
          if (option.isShown === false) return null;
          return (
            <Menu.Item
              color={option.color}
              key={option.label}
              onClick={option.onClick}
              leftSection={option.icon}
            >
              {option.label}
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
};

// {!isProUser ? (
//   <Menu.Item
//     onClick={showUpgradeModal}
//     leftSection={<Star size={14} />}
//   >
//     Upgrade
//   </Menu.Item>
// ) : null}
// <Menu.Item
//   onClick={() => {
//     navigate("/dashboard");
//   }}
//   leftSection={<LayoutDashboard size={14} />}
// >
//   Dashboard
// </Menu.Item>
// <Menu.Item
//   component={Link}
//   to="/settings/profile"
//   leftSection={<Cog size={14} />}
// >
//   Settings
// </Menu.Item>
// <Menu.Item
//   color="red"
//   onClick={() => signOutMutation.mutate({})}
//   leftSection={
//     signOutMutation.isPending ? (
//       <Loader color="red" size={14} />
//     ) : (
//       <LogOut size={14} />
//     )
//   }
// >
//   Sign Out
// </Menu.Item>
