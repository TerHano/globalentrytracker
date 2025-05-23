import { Box, Flex, Grid, Paper, Image } from "@mantine/core";
import { SiteLogo } from "./site-logo";

export interface SignInSignUpWrapperProps {
  children: React.ReactNode;
  position?: "left" | "right";
  image: string;
}

export const SignInSignUpWrapper = ({
  children,
  position = "left",
  image,
}: SignInSignUpWrapperProps) => {
  const content = (
    <Flex direction="column" justify="center" align="center" h="100%">
      <SiteLogo />
      <Box maw={400}>{children}</Box>
    </Flex>
  );

  const imageCol = <Image radius="md" visibleFrom="md" src={image} />;

  return (
    <Flex justify="center">
      <Paper m="sm" w="100%" maw={1200} radius="md" p={30}>
        <Grid gutter="lg">
          {position === "left" ? (
            <>
              <Grid.Col span={{ base: 12, md: 6 }}>{content}</Grid.Col>
              <Grid.Col span={6}>{imageCol}</Grid.Col>
            </>
          ) : (
            <>
              <Grid.Col span={6}>{imageCol}</Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>{content}</Grid.Col>
            </>
          )}
        </Grid>
      </Paper>
    </Flex>
  );
};
