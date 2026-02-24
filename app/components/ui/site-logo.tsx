import { Group, Image, Text } from "@mantine/core";
import { NavLink } from "react-router";

export const SiteLogo = () => {
  const size = "1.2rem";
  return (
    <Group align="center" justify="center" gap={4}>
      <Image src="/favicon.png" w={20} h={20} />
      <Text lh="1rem" component={NavLink} to="/" fz={size} fw="bold">
        EntryAlert
      </Text>
    </Group>
  );
};
