import {
  TextInput,
  Button,
  Text,
  Stack,
  Modal,
  Image,
  useModalsStack,
} from "@mantine/core";
import { useField } from "@mantine/form";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import emailLinkImg from "~/assets/icons/email-link.png";
import errorImg from "~/assets/icons/500.png";
import resetPasswordImg from "~/assets/icons/reset-password.png";
import { useSendResetPasswordEmail } from "~/hooks/useSendResetPasswordEmail";

interface ForgotPasswordModalProps {
  opened: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({
  opened,
  onClose,
}: ForgotPasswordModalProps) {
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");

  const modalStack = useModalsStack([
    "forgot-password-modal",
    "error-sending-reset-link-modal",
    "reset-link-sent-modal",
  ]);

  const {
    mutate: sendResetPasswordEmail,
    isPending: isSendResetPasswordEmailLoading,
  } = useSendResetPasswordEmail({
    onError: () => {
      modalStack.open("error-sending-reset-link-modal");
    },
    onSuccess: (_, request) => {
      setResetPasswordEmail(request?.email ?? "");
      modalStack.open("reset-link-sent-modal");
    },
  });

  const emailField = useField({
    initialValue: "",
    validate: (value) => {
      if (!value) return "Email is required";
      if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
      return null;
    },
  });

  useEffect(() => {
    if (opened) {
      modalStack.open("forgot-password-modal");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  const handleResetPassword = useCallback(() => {
    emailField.validate().then((error) => {
      if (error) return;
      sendResetPasswordEmail({
        body: {
          email: emailField.getValue(),
        },
      });
    });
  }, [emailField, sendResetPasswordEmail]);

  const handleClose = useCallback(() => {
    modalStack.close("forgot-password-modal");
    emailField.reset();
    onClose();
  }, [modalStack, emailField, onClose]);

  return (
    <Modal.Stack>
      <Modal
        withCloseButton={false}
        {...modalStack.register("forgot-password-modal")}
        transitionProps={{
          transition: "fade-up",
          duration: 200,
          timingFunction: "ease",
        }}
      >
        <Stack>
          <Stack justify="center" align="center" gap="md">
            <Image h="5rem" w="5rem" src={resetPasswordImg} />
            <Stack justify="center" align="center" gap={0}>
              <Text fw={800} size="lg">
                Forgot Password?
              </Text>
              <Text ta="center" size="sm" c="dimmed">
                Don&apos;t worry, we&apos;ll send reset instructions to your
                email.
              </Text>
            </Stack>
          </Stack>
          <TextInput
            {...emailField.getInputProps()}
            label="Email"
            placeholder="hello@gmail.com"
            size="md"
          />
          <Button
            onClick={handleResetPassword}
            loading={isSendResetPasswordEmailLoading}
            type="submit"
            fullWidth
            mt="xs"
            size="sm"
          >
            Send Reset Password Link
          </Button>
          <Button
            variant="subtle"
            leftSection={<ArrowLeft size={16} />}
            color="gray"
            onClick={handleClose}
          >
            Back to Login
          </Button>
        </Stack>
      </Modal>

      <Modal
        withCloseButton={false}
        {...modalStack.register("reset-link-sent-modal")}
      >
        <Stack gap="xs">
          <Stack justify="center" align="center" gap="md">
            <Image h="5rem" w="5rem" src={emailLinkImg} />
            <Text fw={800} size="lg">
              Password Reset Link Sent
            </Text>
          </Stack>
          <Text ta="center" size="sm" c="dimmed">
            We have sent you a password reset link to{" "}
            <Text component="span" c="white" fw={700}>
              {resetPasswordEmail}
            </Text>
            . Please check your inbox and click the link to reset your password.
          </Text>
          <Button
            variant="subtle"
            color="gray"
            onClick={() => modalStack.closeAll()}
          >
            Close
          </Button>
        </Stack>
      </Modal>

      <Modal
        withCloseButton={false}
        {...modalStack.register("error-sending-reset-link-modal")}
      >
        <Stack gap="xs">
          <Stack justify="center" align="center" gap="md">
            <Image h="5rem" w="5rem" src={errorImg} />
            <Text fw={800} size="lg">
              Error Sending Password Reset Link
            </Text>
          </Stack>
          <Text ta="center" size="sm" c="dimmed">
            We encountered an error while sending the password reset link.
            Please try again later.
          </Text>
          <Button
            variant="subtle"
            color="gray"
            onClick={() => modalStack.closeAll()}
          >
            Close
          </Button>
        </Stack>
      </Modal>
    </Modal.Stack>
  );
}
