import { Anchor, Button, Image, Paper, PasswordInput, Stack, Text } from "@mantine/core";
import { PasswordInputWithStrength } from "../ui/password-input-with-strength";
import { useCallback, useState } from "react";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { useShowNotification } from "~/hooks/useShowNotification";
import { Key } from "lucide-react";
import { useNavigate } from "react-router";
import { useResetPassword } from "~/hooks/useResetPassword";
import resetPasswordImg from "~/assets/icons/reset-password.png";

export interface ResetPasswordFormProps {
  email: string;
  code: string;
}

export const ResetPasswordForm = ({ email, code }: ResetPasswordFormProps) => {
  const { showNotification } = useShowNotification();
  const navigate = useNavigate();
  const [passwordValue, setPasswordValue] = useState<string>("");
  const { mutate: resetPassword, isPending: isResetPasswordLoading } =
    useResetPassword({
      onError: (error) => {
        const errorMessage =
          error?.[0]?.message ??
          "An unexpected error occurred. Please try again.";
        showNotification({
          icon: <Key size={18} />,
          title: "Error",
          message: errorMessage,
          status: "error",
        });
      },
      onSuccess: () => {
        showNotification({
          icon: <Key size={18} />,
          title: "Success",
          message: "Password reset successfully",
          status: "success",
        });
        navigate("/dashboard");
      },
    });
  const schema = z
    .object({
      password: z.string().nonempty("Password is required"),
      confirmPassword: z.string().nonempty("Confirm password is required"),
    })
    .refine((schema) => schema.password === schema.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const form = useForm({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: zodResolver(schema),
    onValuesChange: (values) => {
      setPasswordValue(values.password);
    },
  });

  const onResetPassword = useCallback(
    (values: typeof form.values) => {
      resetPassword({
        body: {
          email,
          newPassword: values.password,
          resetCode: code,
        },
      });
    },
    [form, resetPassword, code, email],
  );
  return (
    <Paper w="100%" maw="40rem" p="xl">
      <form onSubmit={form.onSubmit(onResetPassword)}>
        <Stack w="100%" justify="center" gap="md">
          <Stack justify="center" align="center" gap="xs">
            <Image src={resetPasswordImg} w="5rem" h="5rem" />
            <Stack justify="center" align="center" gap={0}>
              <Text span fw={800} lh="1em" fz="2rem">
                Reset Password
              </Text>
              <Text fw={500} ta="center" fz="1rem" c="dimmed">
                Choose a new secure password for your account
              </Text>
            </Stack>
          </Stack>
          <PasswordInputWithStrength value={passwordValue}>
            <PasswordInput
              {...form.getInputProps("password")}
              label="New Password"
              placeholder="Your new password"
              size="md"
              type="password"
            />
          </PasswordInputWithStrength>
          <PasswordInput
            {...form.getInputProps("confirmPassword")}
            label="Confirm Password"
            placeholder="Confirm your new password"
            size="md"
            type="password"
          />
          <Button loading={isResetPasswordLoading} type="submit" fullWidth size="md" mt="xs">
            Reset Password
          </Button>
          <Text ta="center" size="sm">
            Remember your password?{" "}
            <Anchor href="/login" fw={700}>
              Back to Login
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Paper>
  );
};
