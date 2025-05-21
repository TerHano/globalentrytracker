import { Stack, Text } from "@mantine/core";

export const Section = ({
  sectionId,
  title,
  description,
  children,
  className,
}: {
  sectionId: string;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Stack
      justify="center"
      align="center"
      id={sectionId}
      className={className}
      gap="xs"
    >
      <Stack justify="center" align="center" gap={3}>
        <Text span fw={800} lh="1em" fz="2rem">
          {title}
        </Text>
        <Text fw={500} ta="center" fz="1rem" c="dimmed">
          {description}
        </Text>
        {children}
      </Stack>
    </Stack>
  );
};
