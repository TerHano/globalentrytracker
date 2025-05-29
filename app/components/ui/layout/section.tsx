import { Stack, Text } from "@mantine/core";

export const Section = ({
  sectionId,
  title,
  description,
  children,
  className,
  layout,
}: {
  sectionId: string;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  layout?: "default" | "centered";
}) => {
  const justifyContent = layout === "default" ? "flex-start" : "center";
  const alignItems = layout === "default" ? "flex-start" : "center";
  return (
    <Stack
      justify={justifyContent}
      align={alignItems}
      id={sectionId}
      className={className}
      gap="xs"
    >
      <Stack justify={justifyContent} align={alignItems} gap={3}>
        <Text span fw={800} lh="1em" fz="2rem">
          {title}
        </Text>
        <Text
          fw={500}
          ta={layout === "default" ? undefined : "center"}
          fz="1rem"
          c="dimmed"
        >
          {description}
        </Text>
        {children}
      </Stack>
    </Stack>
  );
};
