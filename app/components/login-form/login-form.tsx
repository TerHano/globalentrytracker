import {
  Title,
  TextInput,
  PasswordInput,
  Button,
  Anchor,
  Text,
  Group,
  Stack,
} from "@mantine/core";
import classes from "./login-form.module.css";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { useCallback, useState } from "react";
import { useShowNotification } from "~/hooks/useShowNotification";
import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSignInUser } from "~/hooks/api/useSignIn";
import { EmailNotConfirmedModal } from "./email-not-confirmed-modal";
import { ForgotPasswordModal } from "./forgot-password-modal";

export default function LoginForm() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isEmailNotConfirmedModalOpen, setIsEmailNotConfirmedModalOpen] =
    useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const { t } = useTranslation();
  const { showErrorCodeNotification } = useShowNotification();
  const { mutate: signInUser, isPending: isSignInUserLoading } = useSignInUser({
    onError: (errors) => {
      console.log("errored");
      const hasNotConfirmedEmailError = errors.some(
        (error) => error.code === "EmailNotConfirmed",
      );
      if (hasNotConfirmedEmailError) {
        setIsEmailNotConfirmedModalOpen(true);
        return;
      }
      showErrorCodeNotification(errors);
    },
    onSuccess: () => {
      setIsRedirecting(true);
      // Use full page navigation to ensure cookies are included
      // Add a small delay to prevent hydration issues
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 100);
    },
  });

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

  const handleSubmit = useCallback(
    async (values: typeof form.values) => {
      const { email, password } = values;
      signInUser({ body: { email, password } });
    },
    [form, signInUser],
  );

  return (
    <Stack className="fade-in-up-animation">
      <Stack gap={4} ta="center" mt="md">
        <Title order={2}>{t("Welcome back to EntryAlert")}</Title>
        <Text c="dimmed" size="sm">
          Sign in to monitor your Global Entry appointments
        </Text>
      </Stack>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Email"
            placeholder="hello@gmail.com"
            size="md"
            {...form.getInputProps("email")}
            rightSection={
              <Mail size={16} color="gray" className={classes.icon} />
            }
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            size="md"
            {...form.getInputProps("password")}
          />
        </Stack>

        <Group mt="xs" justify="end" align="center">
          <Button
            onClick={() => setIsForgotPasswordOpen(true)}
            size="xs"
            variant="subtle"
            color="gray"
          >
            Forgot Password?
          </Button>
        </Group>
        <Button
          loading={isSignInUserLoading || isRedirecting}
          type="submit"
          fullWidth
          mt="md"
          size="md"
        >
          Login
        </Button>
      </form>

      <Text ta="center" mt="xs">
        Don&apos;t have an account?{" "}
        <Anchor<"a"> href="/signup" fw={700}>
          Register
        </Anchor>
      </Text>
      <ForgotPasswordModal
        opened={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
      <EmailNotConfirmedModal
        email={form.values.email}
        opened={isEmailNotConfirmedModalOpen}
        onClose={() => {
          setIsEmailNotConfirmedModalOpen(false);
        }}
      />
    </Stack>
  );
}
