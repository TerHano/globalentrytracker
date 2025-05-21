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
import { Cog, DoorClosed, LayoutDashboard } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigation } from "react-router";
import { type me } from "~/api/me-api";

interface MobileAvatarMenuProps {
  onSignOut: () => void;
  meData?: me;
}

export const MobileAvatarMenu = ({
  onSignOut,
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
            <Button
              fullWidth
              justify="start"
              component={Link}
              to="/dashboard"
              size="md"
              leftSection={<LayoutDashboard size={16} />}
              variant="subtle"
              color="gray"
            >
              Dashboard
            </Button>
            <Button
              fullWidth
              component={Link}
              to="/settings"
              size="md"
              justify="start"
              leftSection={<Cog size={16} />}
              variant="subtle"
              color="gray"
            >
              Settings
            </Button>
            <Divider />
            <Button
              fullWidth
              justify="start"
              size="md"
              leftSection={<DoorClosed size={16} />}
              variant="subtle"
              color="red"
              onClick={onSignOut}
            >
              Sign Out
            </Button>
          </Stack>
        </Stack>
      </Drawer>

      <Avatar onClick={open} color="cyan" size="md" radius="xl">
        {meData?.firstName.charAt(0)}
      </Avatar>
    </>
  );
};
