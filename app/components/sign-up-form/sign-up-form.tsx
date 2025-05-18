import {
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Anchor,
  Text,
  SimpleGrid,
  Stack,
} from "@mantine/core";
import classes from "./sign-up-form.module.css";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { useCallback, useState } from "react";
import { useShowNotification } from "~/hooks/useShowNotification";
import { Key } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  useSignUpUser,
  type SignUpUserRequest,
} from "~/hooks/api/useSignUpUser";
import { PasswordInputWithStrength } from "../ui/password-input-with-strength";

export default function SignUpForm() {
  const { t } = useTranslation();
  const { showNotification } = useShowNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState<string>("");

  const { mutate: signUpUserMutate } = useSignUpUser({
    onSuccess: () => {
      setIsLoading(false);
      showNotification({
        title: t("Sign Up Successful"),
        message: t(
          "You have successfully signed up! Check your email for a confirmation link."
        ),
        status: "success",
        icon: <Key size={16} />,
      });
    },
    onError: (error) => {
      const firstError = error[0];
      setIsLoading(false);
      showNotification({
        title: t("Sign Up Failed"),
        message: firstError?.message,
        status: "error",
        icon: <Key size={16} />,
      });
    },
  });

  const schema = z
    .object({
      email: z
        .string({ message: "Email is required" })
        .nonempty("Email is required")
        .email("Invalid email format"),
      firstName: z
        .string({ message: "First name is required" })
        .nonempty("First name is required")
        .min(2, "First name must be at least 2 characters long")
        .max(50, "First name must be at most 50 characters long"),
      lastName: z
        .string({ message: "Last name is required" })
        .nonempty("Last name is required")
        .min(2, "Last name must be at least 2 characters long")
        .max(50, "Last name must be at most 50 characters long"),
      password: z.string().nonempty("Password is required"),
      confirmPassword: z.string().nonempty("Confirm password is required"),
    })
    .refine((schema) => schema.password === schema.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
    validate: zodResolver(schema),
    onValuesChange: (values) => {
      setPasswordValue(values.password);
    },
  });

  const handleSubmit = useCallback(
    async (values: typeof form.values) => {
      setIsLoading(true);
      console.log("Submitting form", values);
      const requestBody: SignUpUserRequest = {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        redirectUrl: `${window.location.origin}/dashboard`,
      };
      signUpUserMutate(requestBody);
    },
    [form, signUpUserMutate]
  );

  return (
    <div className={classes.wrapper}>
      <Paper className={`${classes.form} fade-in-animation`} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          {t("Ready To Get That Appointment?")}
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
            <SimpleGrid cols={{ xs: 1, sm: 2 }} spacing="lg">
              <TextInput
                label="First name"
                placeholder="John"
                size="md"
                {...form.getInputProps("firstName")}
              />
              <TextInput
                label="Last name"
                placeholder="Doe"
                size="md"
                {...form.getInputProps("lastName")}
              />
            </SimpleGrid>
            <TextInput
              label="Email address"
              placeholder="hello@gmail.com"
              size="md"
              {...form.getInputProps("email")}
            />
            <PasswordInputWithStrength value={passwordValue}>
              <PasswordInput
                label="Password"
                placeholder="Your password"
                size="md"
                {...form.getInputProps("password")}
              />
            </PasswordInputWithStrength>
            <PasswordInput
              label="Confirm password"
              placeholder="Confirm password"
              size="md"
              {...form.getInputProps("confirmPassword")}
            />
            <Button
              loading={isLoading}
              type="submit"
              fullWidth
              mt="xl"
              size="md"
            >
              Sign Up
            </Button>
          </Stack>
        </form>

        <Text ta="center" mt="md">
          Have an account?{" "}
          <Anchor<"a"> href="/login" fw={700}>
            Login
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}
