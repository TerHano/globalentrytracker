import type { Route } from "./+types/reset-password";
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
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");

  if (token_hash && type) {
    const response = await fetchClient.POST("/api/auth/v1/verify-email-reset", {
      credentials: "include",
      body: {
        tokenHash: token_hash,
      },
    });
    console.log("response", response);
    if (response.response.status !== 200) {
      return { linkExpired: true };
    } else {
      const setCookie = response.response.headers.get("set-cookie");

      const headers = new Headers();
      if (setCookie) {
        headers.append("Set-Cookie", setCookie);
      }
      return new Response(JSON.stringify({ linkExpired: false }), {
        status: 200,
        headers,
      });
    }
  } else {
    return { linkExpired: true };
  }
}

export default function ResetPassword({ loaderData }: Route.ComponentProps) {
  const { linkExpired } = loaderData;
  return (
    <Stack
      p="lg"
      align="center"
      justify="center"
      className="fade-in-up-animation"
    >
      {linkExpired ? <PasswordResetLinkExpired /> : <ResetPasswordForm />}
    </Stack>
  );
}
