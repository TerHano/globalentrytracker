import type { Route } from "../+types/reset-password";
import { Stack } from "@mantine/core";
import { ResetPasswordForm } from "~/components/reset-password/reset-password-form";
import { PasswordResetLinkExpired } from "~/components/reset-password/password-reset-link-expired";
import { fetchClient } from "~/utils/fetchData";

export function meta() {
  return [
    { title: "Reset Password" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const requestUrl = new URL(request.url);
  const email = requestUrl.searchParams.get("email");
  const code = requestUrl.searchParams.get("code");

  if (!email || !code) {
    return { linkExpired: true };
  } else {
    return { email, code, linkExpired: false };
  }
}

export default function ResetPassword({ loaderData }: Route.ComponentProps) {
  const { linkExpired, email, code } = loaderData;
  return (
    <Stack
      p="lg"
      align="center"
      justify="center"
      className="fade-in-up-animation"
    >
      {linkExpired ? (
        <PasswordResetLinkExpired />
      ) : (
        <ResetPasswordForm email={email} code={code} />
      )}
    </Stack>
  );
}
