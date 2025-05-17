import { Group, Input, Stack } from "@mantine/core";

export const LabelValue = ({
  label,
  helperText,
  children,
  labelRightSection,
}: {
  label: string;
  helperText?: string;
  children: React.ReactNode;
  labelRightSection?: React.ReactNode;
}) => {
  return (
    <Stack gap={0}>
      <Input.Label fw={700}>
        <Group gap="xs">
          {label}
          {labelRightSection}
        </Group>
      </Input.Label>
      {children}
      {helperText && (
        <Input.Description fz="sm" color="dimmed">
          {helperText}
        </Input.Description>
      )}
    </Stack>
  );
};
