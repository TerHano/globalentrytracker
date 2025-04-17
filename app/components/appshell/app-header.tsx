import { Avatar, Group, Text } from "@mantine/core";
import type { me } from "~/api/me-api";

interface AppHeaderProps {
  me: me;
}

export const AppHeader = ({ me }: AppHeaderProps) => {
  return (
    <Group px="xs" h="100%" justify="space-between" align="center">
      <Text fz="lg" fw="bold">
        Global
      </Text>
      <Avatar color="cyan" size="md" radius="xl">
        {me.firstName.charAt(0)}
      </Avatar>
    </Group>
  );
};
