import { Stack, Text } from "@mantine/core";
import { isValidElement } from "react";

interface EmptyProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode | string;
  action?: React.ReactNode;
}

export const Empty = ({ icon, title, description, action }: EmptyProps) => {
  const renderDescription = () => {
    // Check if description is a string
    if (typeof description === "string") {
      return (
        <Text ta="center" fw={500} fz="sm" c="dimmed">
          {description}
        </Text>
      );
    }

    // Check if description is a valid React element
    if (isValidElement(description)) {
      return description;
    }

    // For other React nodes (fragments, arrays, etc.)
    return <div style={{ textAlign: "center" }}>{description}</div>;
  };
  return (
    <Stack align="center" gap="xs">
      <Stack align="center" gap={0}>
        {icon}
        <Text fw="bold" fz="lg">
          {title}
        </Text>
      </Stack>
      {renderDescription()}
      {action}
    </Stack>
  );
};
