import LoginForm from "~/components/login-form/login-form";
import type { Route } from "./+types/login";
import { redirect } from "react-router";
import { SignInSignUpWrapper } from "~/components/ui/sign-in-sign-up-wrapper/sign-in-sign-up-wrapper";
import { isAuthenticated } from "~/utils/auth";

export function meta() {
  return [
    { title: "Login" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const authResult = await isAuthenticated(request);
  if (authResult.user) {
    throw redirect("/dashboard");
  }
  return null;
}

export default function Login() {
  return (
    <SignInSignUpWrapper image="https://images.unsplash.com/photo-1507812984078-917a274065be?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
      <LoginForm />
    </SignInSignUpWrapper>
  );
}
