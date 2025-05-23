import type { Route } from "./+types/login";
import { redirect } from "react-router";
import { createSupabaseServerClient } from "~/utils/supabase/createSupabaseServerClient";
import SignUpForm from "~/components/sign-up-form/sign-up-form";
import { SignInSignUpWrapper } from "~/components/ui/SignInSignUpWrapper";

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
  return (
    <SignInSignUpWrapper
      position="right"
      image="https://images.unsplash.com/photo-1571306603861-20c055ab2e5c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    >
      <SignUpForm />
    </SignInSignUpWrapper>
  );
}
