import { Paper, Stack, Button, Text, Image } from "@mantine/core";
import { NavLink } from "react-router";
import emailImg from "~/assets/icons/email.png";

export const EmailConfirmedPage = () => {
  return (
    <Paper w="100%" maw="40rem" p="lg">
      <Stack w="100%" justify="center" align="center" gap="lg">
        <Stack justify="center" align="center" gap="xs">
          <Image src={emailImg} w="5rem" />
          <Text span fw={800} lh="1em" fz="2rem">
            Email Confirmed
          </Text>
        </Stack>
        <Text fw={500} ta="center" fz="1rem" c="dimmed">
          Your email address has been successfully verified. You can now access
          your account and start tracking your Global Entry appointments.
        </Text>
        <NavLink to="/dashboard">
          {({ isPending }) => (
            <Button loading={isPending} size="md">
              Go to Dashboard
            </Button>
          )}
        </NavLink>
      </Stack>
    </Paper>
  );
};
