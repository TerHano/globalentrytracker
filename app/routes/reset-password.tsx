import { createSupabaseServerClient } from "~/utils/supabase/createSupabaseServerClient";
import type { Route } from "./+types/reset-password";
import { Stack } from "@mantine/core";
import { ResetPasswordForm } from "~/components/reset-password/reset-password-form";
import type { EmailOtpType } from "@supabase/supabase-js";
import { PasswordResetLinkExpired } from "~/components/reset-password/password-reset-link-expired";

export function meta() {
  return [
    { title: "Reset Password" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  //const next = requestUrl.searchParams.get("next") || "/";
  if (token_hash && type) {
    const { supabase, headers } = createSupabaseServerClient(request);
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (error) {
      return { linkExpired: true };
    }
    return new Response(JSON.stringify({ linkExpired: false }), { headers });
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
