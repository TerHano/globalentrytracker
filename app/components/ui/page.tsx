import { Breadcrumbs, Paper, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";

export interface PageProps {
  className?: string;
  breadcrumbs?: ReactNode[];
  header: string;
  description: string;
  children: ReactNode;
}

export const Page = ({
  header,
  className,
  description,
  children,
  breadcrumbs,
}: PageProps) => {
  return (
    <Paper className={className} withBorder p="lg">
      <Stack gap="lg">
        {breadcrumbs ? (
          <Breadcrumbs separatorMargin={3}>{breadcrumbs}</Breadcrumbs>
        ) : null}
        <Stack gap={0}>
          <Text fz={{ base: "md", xs: "lg" }} fw="bold">
            {header}
          </Text>
          <Text fz={{ base: "xs", xs: "sm" }} c="dimmed">
            {description}
          </Text>
        </Stack>
        {children}
      </Stack>
    </Paper>
  );
};

export interface PageSubsectionProps {
  className?: string;
  header: string;
  description: string;
  children: ReactNode;
}

const PageSubsection = ({
  children,
  className,
  header,
  description,
}: PageSubsectionProps) => {
  return (
    <Stack className={className} gap="xs">
      <Stack gap={0}>
        <Text fz={{ base: "md", xs: "lg" }} fw="bold">
          {header}
        </Text>
        <Text fz={{ base: "xs", xs: "sm" }} c="dimmed">
          {description}
        </Text>
      </Stack>
      {children}
    </Stack>
  );
};

Page.Subsection = PageSubsection;
//Page.Subsection.displayName = "Page.Subsection";
