import {
  Avatar,
  Button,
  Divider,
  Drawer,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { useNavigation } from "react-router";
import type { components } from "~/types/api";
import type { MenuOption } from "./app-header";

interface MobileAvatarMenuProps {
  menuOptions: MenuOption[];

  meData?: components["schemas"]["UserDto"];
}

export const MobileAvatarMenu = ({
  menuOptions,
  meData,
}: MobileAvatarMenuProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "loading") {
      close();
    }
  }, [navigation.state, close]);

  return (
    <>
      <Drawer
        size="xs"
        position="right"
        opened={opened}
        onClose={close}
        radius="sm"
      >
        <Stack>
          <Group align="center" justify="start" gap="xs">
            <Avatar color="cyan" size="md" radius="xl">
              {meData?.firstName.charAt(0)}
            </Avatar>
            <Stack gap={0}>
              <Text fw="bold" fz="md">
                {meData?.firstName} {meData?.lastName}
              </Text>
              <Text fz="sm" c="dimmed">
                {meData?.email}
              </Text>
            </Stack>
          </Group>
          <Divider />
          <Stack>
            {menuOptions.map((option) => {
              if (option.isShown === false) return null;
              return (
                <Button
                  key={option.label}
                  fullWidth
                  justify="start"
                  size="md"
                  leftSection={option.icon}
                  variant="subtle"
                  color={option.color ?? "gray"}
                  onClick={option.onClick}
                >
                  {option.label}
                </Button>
              );
            })}
          </Stack>
        </Stack>
      </Drawer>

      <Avatar onClick={open} color="cyan" size="md" radius="xl">
        {meData?.firstName.charAt(0)}
      </Avatar>
    </>
  );
};
