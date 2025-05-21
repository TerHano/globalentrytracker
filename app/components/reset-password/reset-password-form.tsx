import { Button, Paper, PasswordInput, Stack, Text } from "@mantine/core";
import { PasswordInputWithStrength } from "../ui/password-input-with-strength";
import { useCallback, useState } from "react";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { supabaseBrowserClient } from "~/utils/supabase/createSupbaseBrowerClient";
import { useShowNotification } from "~/hooks/useShowNotification";
import { Key } from "lucide-react";
import { useNavigate } from "react-router";
import { useResetPassword } from "~/hooks/useResetPassword";

export const ResetPasswordForm = () => {
  const { showNotification } = useShowNotification();
  const navigate = useNavigate();
  const [passwordValue, setPasswordValue] = useState<string>("");
  const { mutate: resetPassword, isPending: isResetPasswordLoading } =
    useResetPassword({
      onError: (error) => {
        showNotification({
          icon: <Key size={18} />,
          title: "Error",
          message:
            error?.message ?? "An unexpected error occurred. Please try again.",
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
        newPassword: values.password,
      });
    },
    [form, resetPassword]
  );
  return (
    <Paper w="100%" maw="40rem" p="lg">
      <form onSubmit={form.onSubmit(onResetPassword)}>
        <Stack w="100%" justify="center">
          <Stack justify="center" align="center" gap={0}>
            <Text span fw={800} lh="1em" fz="2rem">
              Reset Password
            </Text>
            <Text fw={500} ta="center" fz="1rem" c="dimmed">
              Choose a new password
            </Text>
          </Stack>
          <PasswordInputWithStrength value={passwordValue}>
            <PasswordInput
              {...form.getInputProps("password")}
              label="New Password"
              placeholder="Your new password"
              type="password"
            />
          </PasswordInputWithStrength>
          <PasswordInput
            {...form.getInputProps("confirmPassword")}
            label="Confirm Password"
            placeholder="Confirm your new password"
            type="password"
          />
          <Button loading={isResetPasswordLoading} type="submit">
            Reset Password
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};
