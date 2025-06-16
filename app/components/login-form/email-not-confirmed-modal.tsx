import {
  Modal,
  useModalsStack,
  Text,
  Button,
  Stack,
  Image,
} from "@mantine/core";
import { useEffect } from "react";
import { useResendEmailVerification } from "~/hooks/api/useResendEmailVerification";
import { useShowNotification } from "~/hooks/useShowNotification";
import { Empty } from "../ui/empty";
import emailImg from "~/assets/icons/email-link.png";

interface EmailNotConfirmedModalProps {
  opened: boolean;
  onClose: () => void;
  email?: string;
}

export const EmailNotConfirmedModal = ({
  opened,
  onClose,
  email,
}: EmailNotConfirmedModalProps) => {
  const { showErrorCodeNotification } = useShowNotification();
  const modalStack = useModalsStack([
    "email-not-confirmed-modal",
    "email-sent-modal",
  ]);
  const resendVerifyEmailMutation = useResendEmailVerification({
    onSuccess: () => {
      modalStack.open("email-sent-modal");
    },
    onError: (error) => {
      showErrorCodeNotification(error);
    },
  });
  const handleClose = () => {
    onClose();
    modalStack.close("email-not-confirmed-modal");
  };

  useEffect(() => {
    if (opened && !modalStack.state["email-not-confirmed-modal"]) {
      modalStack.open("email-not-confirmed-modal");
    }
  }, [opened, modalStack]);

  return (
    <Modal.Stack>
      <Modal
        {...modalStack.register("email-not-confirmed-modal")}
        size="sm"
        withCloseButton={false}
      >
        <Empty
          action={
            <Stack justify="center" align="center" gap={5}>
              {email ? (
                <Button
                  size="sm"
                  onClick={() =>
                    resendVerifyEmailMutation.mutate({ body: { email } })
                  }
                  variant="filled"
                  color="blue"
                  loading={resendVerifyEmailMutation.isPending}
                >
                  Resend Confirmation Email
                </Button>
              ) : null}
              <Button onClick={handleClose} variant="subtle" color="blue">
                Close
              </Button>
            </Stack>
          }
          icon={<Image src={emailImg} alt="Email Icon" h="5rem" w="5rem" />}
          title="Email Not Confirmed"
          description="Please check your inbox for a
            confirmation email. Forgot your confirmation email? You can resend it
            by clicking the button below."
        />
      </Modal>
      <Modal
        {...modalStack.register("email-sent-modal")}
        size="sm"
        withCloseButton={false}
      >
        <Empty
          action={
            <Button onClick={handleClose} variant="subtle" color="blue">
              Close
            </Button>
          }
          icon={<Image src={emailImg} alt="Email Icon" h="5rem" w="5rem" />}
          title=" Email Sent"
          description={
            <Text fw={500} ta="center" fz="1rem" c="dimmed">
              A confirmation email has been sent to your email:{" "}
              <Text span fw={800}>
                {email}
              </Text>
              . Please check your inbox.
            </Text>
          }
        />
      </Modal>
    </Modal.Stack>
  );
};
