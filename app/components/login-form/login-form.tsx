import {
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Anchor,
  Text,
  Input,
  Group,
} from "@mantine/core";
import classes from "./login-form.module.css";
import { useActionData, useNavigate } from "react-router";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { useCallback, useEffect, useState } from "react";
import { useShowNotification } from "~/hooks/useShowNotification";
import { Key, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabaseBrowserClient } from "~/utils/supabase/createSupbaseBrowerClient";

export default function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showNotification } = useShowNotification();
  const [isLoading, setIsLoading] = useState(false);
  //const submit = useSubmit();
  const submitResponse = useActionData<{ error?: string }>();
  const [error, setError] = useState<string | null>(null);

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
      setError(null);
      setIsLoading(true);
      console.log("Submitting form", values);
      // const requestBody = {
      //   email: values.email,
      //   password: values.password,
      // };
      supabaseBrowserClient.auth
        .signInWithPassword({
          email: values.email,
          password: values.password,
        })
        .then(({ error }) => {
          if (error) {
            setError(error.message);
            showNotification({
              title: "Login Failed",
              message: error.message,
              status: "error",
              icon: <Key size={16} />,
            });
          } else {
            navigate("/dashboard");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
      // await submit(requestBody, {
      //   method: "post",
      //   action: "/login",
      // }).finally(() => {
      //   setIsLoading(false);
      // });
    },
    [form, navigate, showNotification]
  );

  useEffect(() => {
    if (error) {
      showNotification({
        title: "Login Failed",
        message: "An unexpected error occurred. Please try again.",
        status: "error",
        icon: <Key size={16} />,
      });
    }
  }, [error, showNotification]);

  useEffect(() => {
    if (submitResponse?.error) {
      setError(submitResponse.error);
    }
  }, [submitResponse]);

  return (
    <div className={classes.wrapper}>
      <Paper className={`${classes.form}`} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md">
          {t("Welcome back to EasyEntry")}
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
            <Button size="xs" variant="subtle" color="gray">
              Forgot Password?
            </Button>
          </Group>
          <Button loading={isLoading} type="submit" fullWidth mt="xl" size="md">
            Login
          </Button>
        </form>

        <Text ta="center" mt="md">
          Don&apos;t have an account?{" "}
          <Anchor<"a"> href="/signup" fw={700}>
            Register
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}
