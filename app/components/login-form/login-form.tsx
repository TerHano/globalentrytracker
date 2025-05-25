import {
  Title,
  TextInput,
  PasswordInput,
  Button,
  Anchor,
  Text,
  Input,
  Group,
  Modal,
  Stack,
  useModalsStack,
  Image,
} from "@mantine/core";
import classes from "./login-form.module.css";
import { useNavigate } from "react-router";
import { z } from "zod";
import { useField, useForm, zodResolver } from "@mantine/form";
import { useCallback, useState } from "react";
import { useShowNotification } from "~/hooks/useShowNotification";
import { ArrowLeft, Key, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import emailLinkImg from "~/assets/icons/email-link.png";
import resetPasswordImg from "~/assets/icons/reset-password.png";
import { useSendResetPasswordEmail } from "~/hooks/useSendResetPasswordEmail";
import { useSignInUser } from "~/hooks/useSignIn";

export default function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showNotification } = useShowNotification();
  const { mutate: signInUser, isPending: isSignInUserLoading } = useSignInUser({
    onError: (error) => {
      const firstError = error?.[0];
      if (firstError) {
        showNotification({
          title: "Login Failed",
          message:
            firstError?.message ??
            "An unexpected error occurred. Please try again.",
          status: "error",
          icon: <Key size={16} />,
        });
      }
    },
    onSuccess: () => {
      navigate("/dashboard");
    },
  });
  const {
    mutate: sendResetPasswordEmail,
    isPending: isSendResetPasswordEmailLoading,
  } = useSendResetPasswordEmail({
    onError: (error) => {
      const firstError = error?.[0];
      if (firstError) {
        showNotification({
          title: "Reset Password Failed",
          message:
            firstError.message ??
            "An unexpected error occurred. Please try again.",
          status: "error",
          icon: <Key size={16} />,
        });
      }
    },
    onSuccess: (_, request) => {
      setSetResetPasswordEmail(request.email);
      modalStack.open("reset-link-sent-modal");
    },
  });

  const emailField = useField({
    initialValue: "",
    // validateOnChange: true,
    validate: (value) => {
      if (!value) {
        return "Email is required";
      }
      if (!/\S+@\S+\.\S+/.test(value)) {
        return "Invalid email format";
      }
      return null;
    },
  });
  const [resetPasswordEmail, setSetResetPasswordEmail] = useState("");

  const modalStack = useModalsStack([
    "forgot-password-modal",
    "reset-link-sent-modal",
  ]);

  const schema = z.object({
    email: z
      .string({ message: "Email is required" })
      .nonempty("Email is required")
      .email("Invalid email format"),
    password: z.string().nonempty("Password is required"),
  });

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(schema),
  });

  const handleResetPassword = useCallback(() => {
    emailField.validate().then((error) => {
      if (error) {
        console.error("Email validation error:", error);
        return;
      }
      sendResetPasswordEmail({
        body: {
          email: emailField.getValue(),
        },
      });
      console.log("Resetting password for email:", emailField.getValue());
    });
    // Handle password reset logic here
  }, [emailField, sendResetPasswordEmail]);

  const handleSubmit = useCallback(
    async (values: typeof form.values) => {
      const { email, password } = values;
      signInUser({ body: { email, password } });
    },
    [form, signInUser]
  );

  return (
    <div className="fade-in-up-animation">
      <Title order={2} ta="center" mt="md">
        {t("Welcome back to EntryAlert")}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Input.Label></Input.Label>
        <TextInput
          label="Email"
          placeholder="hello@gmail.com"
          size="md"
          {...form.getInputProps("email")}
          labelProps={{}}
          rightSection={
            <Mail size={16} color="gray" className={classes.icon} />
          }
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          mt="md"
          size="md"
          {...form.getInputProps("password")}
        />

        <Group mt="xs" justify="end" align="center">
          <Button
            onClick={() => {
              modalStack.open("forgot-password-modal");
            }}
            size="xs"
            variant="subtle"
            color="gray"
          >
            Forgot Password?
          </Button>
        </Group>
        <Button
          loading={isSignInUserLoading}
          type="submit"
          fullWidth
          mt="xl"
          size="md"
        >
          Login
        </Button>
      </form>

      <Text ta="center" mt="md">
        Don&apos;t have an account?{" "}
        <Anchor<"a"> href="/signup" fw={700}>
          Register
        </Anchor>
      </Text>
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
              placeholder=""
            />
            <Button
              onClick={() => handleResetPassword()}
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
              onClick={() => modalStack.close("forgot-password-modal")}
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
            <Stack justify="center" align="center" gap={0}>
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
              . Please check your inbox and click the link to reset your
              password.
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
    </div>
  );
}
