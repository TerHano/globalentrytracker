import { Group, Text } from "@mantine/core";
import { Siren } from "lucide-react";
import { NavLink } from "react-router";

export const SiteLogo = () => {
  const size = "1.2rem";
  return (
    <Group align="end" justify="center" gap={4}>
      <Siren size={size} />
      <Text lh="1rem" component={NavLink} to="/" fz={size} fw="bold">
        EntryAlert
      </Text>
    </Group>
  );
};
