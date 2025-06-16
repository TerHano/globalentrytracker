import { Paper, Stack, Button, Text, Image } from "@mantine/core";
import { ArrowLeft, Mails } from "lucide-react";
import { NavLink } from "react-router";
import verifyEmailImg from "~/assets/icons/email-alert.png";
import { useResendEmailVerification } from "~/hooks/api/useResendEmailVerification";
import { useShowNotification } from "~/hooks/useShowNotification";

interface VerifyEmailErrorProps {
  email: string | null;
}

export const VerifyEmailError = ({ email }: VerifyEmailErrorProps) => {
  const { showNotification, showErrorCodeNotification } = useShowNotification();
  const resendVerifiyEmailMutation = useResendEmailVerification({
    onSuccess: () => {
      // Show success notification
      showNotification({
        title: "Verification Email Sent",
        message:
          "A new verification email has been sent to your email address.",
        status: "success",
        icon: <Mails size={16} />,
      });
    },
    onError: (errors) => {
      // Handle error, e.g., show a notification
      showErrorCodeNotification(errors);
      console.error("Error resending verification email:", errors);
    },
  });
  return (
    <Paper w="100%" maw="40rem" p="lg">
      <Stack w="100%" justify="center" align="center" gap="lg">
        <Stack justify="center" align="center" gap="xs">
          <Image src={verifyEmailImg} w="5rem" />
          <Text span fw={800} lh="1em" fz="2rem">
            Verification Link Expired
          </Text>
        </Stack>
        <Text fw={500} ta="center" fz="1rem" c="dimmed">
          Your email verification link has expired. Please request a new
          verification email to continue using your account.
        </Text>
        <Button
          loading={resendVerifiyEmailMutation.isPending}
          onClick={() => resendVerifiyEmailMutation.mutate({ body: { email } })}
          variant="subtle"
          color="blue"
          leftSection={<Mails size={16} />}
        >
          Resend Verification Email
        </Button>
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
