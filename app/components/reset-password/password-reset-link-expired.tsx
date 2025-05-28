import { Paper, Stack, Button, Text, Image } from "@mantine/core";
import { ArrowLeft } from "lucide-react";
import { NavLink } from "react-router";
import expiredPasswordResetLinkImg from "~/assets/icons/expired-password-link.png";

export const PasswordResetLinkExpired = () => {
  return (
    <Paper w="100%" maw="40rem" p="lg">
      <Stack w="100%" justify="center" align="center" gap="lg">
        <Stack justify="center" align="center" gap="xs">
          <Image src={expiredPasswordResetLinkImg} w="5rem" />

          <Text span fw={800} lh="1em" fz="2rem">
            Link Expired
          </Text>
        </Stack>
        <Text fw={500} ta="center" fz="1rem" c="dimmed">
          Your password reset link has expired. Please go back to the login page
          and request a new password reset link.
        </Text>
        <NavLink to="/login">
          {({ isPending }) => (
            <Button
              loading={isPending}
              variant="subtle"
              leftSection={<ArrowLeft size={16} />}
              color="gray"
            >
              Back to Login
            </Button>
          )}
        </NavLink>
      </Stack>
    </Paper>
  );
};
