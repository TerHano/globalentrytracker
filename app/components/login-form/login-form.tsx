import {
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Anchor,
  Text,
} from "@mantine/core";
import classes from "./login-form.module.css";
import { useActionData } from "react-router";
import { useSubmit } from "react-router";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { useCallback, useEffect, useState } from "react";
import { useShowNotification } from "~/hooks/useShowNotification";
import { Key } from "lucide-react";

export default function LoginForm() {
  const { showNotification } = useShowNotification();
  const [isLoading, setIsLoading] = useState(false);
  const submit = useSubmit();
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
      const requestBody = {
        email: values.email,
        password: values.password,
      };
      await submit(requestBody, {
        method: "post",
        action: "/login",
      }).finally(() => {
        setIsLoading(false);
      });
    },
    [form, submit]
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
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Welcome back to Mantine!
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email address"
            placeholder="hello@gmail.com"
            size="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            {...form.getInputProps("password")}
          />

          <Checkbox label="Keep me logged in" mt="xl" size="md" />
          <Button loading={isLoading} type="submit" fullWidth mt="xl" size="md">
            Login
          </Button>
        </form>

        <Text ta="center" mt="md">
          Don&apos;t have an account?{" "}
          <Anchor<"a">
            href="#"
            fw={700}
            onClick={(event) => event.preventDefault()}
          >
            Register
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}
