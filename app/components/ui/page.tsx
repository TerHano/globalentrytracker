import { Breadcrumbs, Paper, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";

export interface PageProps {
  breadcrumbs?: ReactNode[];
  header: string;
  description: string;
  children: ReactNode;
}

export const Page = ({
  header,
  description,
  children,
  breadcrumbs,
}: PageProps) => {
  return (
    <Paper withBorder p="lg">
      <Stack gap="lg">
        {breadcrumbs ? (
          <Breadcrumbs separatorMargin={3}>{breadcrumbs}</Breadcrumbs>
        ) : null}
        <Stack gap={0}>
          <Text fw="bold" size="xl">
            {header}
          </Text>
          <Text size="sm" c="dimmed">
            {description}
          </Text>
        </Stack>
        {children}
      </Stack>
    </Paper>
  );
};
