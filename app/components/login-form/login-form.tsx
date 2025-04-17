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
import { useFetcher } from "react-router";

export default function LoginForm() {
  let fetcher = useFetcher();
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Welcome back to Mantine!
        </Title>
        <fetcher.Form method="post">
          <TextInput
            label="Email address"
            name="email"
            placeholder="hello@gmail.com"
            size="md"
          />
          <PasswordInput
            name="password"
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
          />

          <Checkbox label="Keep me logged in" mt="xl" size="md" />
          <Button
            loading={fetcher.state !== "idle"}
            type="submit"
            fullWidth
            mt="xl"
            size="md"
          >
            Login
          </Button>
        </fetcher.Form>

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
