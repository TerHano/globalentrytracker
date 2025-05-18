import type { Route } from "./+types/login";
import { redirect } from "react-router";
import { createSupabaseServerClient } from "~/utils/supabase/createSupabaseServerClient";
import SignUpForm from "~/components/sign-up-form/sign-up-form";

export function meta() {
  return [
    { title: "Sign Up" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    // If the user is already logged in, redirect to the home page
    return redirect("/dashboard", { headers });
  }
  return { error: "Wrong user" }; // No action needed if the user is not logged in
}

export default function SignUp() {
  return <SignUpForm />;
}
