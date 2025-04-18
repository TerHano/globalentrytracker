import LoginForm from "~/components/login-form/login-form";
import type { Route } from "./+types/login";
import { redirect } from "react-router";
import { createSupabaseServerClient } from "~/utils/supabase/createSupabaseServerClient";

export function meta() {
  return [
    { title: "Login" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const { supabase, headers } = createSupabaseServerClient(request);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message }; // Return error to the client
  }

  if (data.user) {
    // Redirect to the home page or dashboard after successful login

    return redirect("/dashboard", { headers });
  }

  return { error: "An unexpected error occurred." };
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

export default function Login() {
  return <LoginForm />;
}
