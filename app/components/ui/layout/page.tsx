import { Breadcrumbs, Flex, Paper, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";

export interface PageProps {
  className?: string;
  breadcrumbs?: ReactNode[];
  header: string;
  description: string;
  children: ReactNode;
  action?: ReactNode;
}

export const Page = ({
  header,
  className,
  description,
  children,
  breadcrumbs,
  action,
}: PageProps) => {
  return (
    <Paper className={className} withBorder p="lg">
      <Flex justify="space-between" align="center" mb="md">
        <Stack w="100%" gap="lg">
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
        {action ? (
          <Flex justify="end" align="center">
            {action}
          </Flex>
        ) : null}
      </Flex>
    </Paper>
  );
};

export interface PageSubsectionProps {
  className?: string;
  header: string | ReactNode;
  description?: string | ReactNode;
  children: ReactNode;
  action?: ReactNode;
}

const PageSubsection = ({
  children,
  className,
  header,
  description,
  action,
}: PageSubsectionProps) => {
  return (
    <Stack className={className} gap="xs">
      <Flex justify="space-between" align="center">
        <Stack w="100%" gap={0}>
          <Text fz={{ base: "md", xs: "lg" }} fw="bold">
            {header}
          </Text>
          {description ? (
            <Text fz={{ base: "xs", xs: "sm" }} c="dimmed">
              {description}
            </Text>
          ) : null}
        </Stack>
        {action ? (
          <Flex justify="end" align="center">
            {action}
          </Flex>
        ) : null}
      </Flex>
      {children}
    </Stack>
  );
};

Page.Subsection = PageSubsection;
//Page.Subsection.displayName = "Page.Subsection";
