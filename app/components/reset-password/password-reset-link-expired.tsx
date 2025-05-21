import { Paper, Stack, Button, Text } from "@mantine/core";
import { ArrowLeft, Link2Off } from "lucide-react";
import { Link } from "react-router";

export const PasswordResetLinkExpired = () => {
  return (
    <Paper w="100%" maw="40rem" p="lg">
      <Stack w="100%" justify="center" gap="lg">
        <Stack justify="center" align="center" gap="xs">
          <Link2Off size={48} color="red" />
          <Text span fw={800} lh="1em" fz="2rem">
            Link Expired
          </Text>
        </Stack>
        <Text fw={500} ta="center" fz="1rem" c="dimmed">
          Your password reset link has expired. Please go back to the login page
          and request a new password reset link.
        </Text>
        <Button
          component={Link}
          variant="subtle"
          leftSection={<ArrowLeft size={16} />}
          color="gray"
          to="/login"
        >
          Back to Login
        </Button>
      </Stack>
    </Paper>
  );
};
