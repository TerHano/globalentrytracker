import { Stack, Text } from "@mantine/core";

interface EmptyProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const Empty = ({ icon, title, description, action }: EmptyProps) => {
  return (
    <Stack align="center" gap="xs">
      <Stack align="center" gap={0}>
        {icon}
        <Text fw="bold" fz="lg">
          {title}
        </Text>
      </Stack>
      <Text ta="center" fw={500} fz="sm" c="dimmed">
        {description}
      </Text>
      {action}
    </Stack>
  );
};
