import LoginForm from "~/components/login-form/login-form";
import type { Route } from "./+types/login";
import { redirect } from "react-router";
import { SignInSignUpWrapper } from "~/components/ui/sign-in-sign-up-wrapper/sign-in-sign-up-wrapper";
import { isAuthenticated } from "~/utils/auth";
import { RefreshTokenError } from "~/root";

export function meta() {
  return [
    { title: "Login" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader({ request }: Route.LoaderArgs) {
  try {
    const isUserAuthenticated = await isAuthenticated(request);
    if (isUserAuthenticated) {
      return redirect("/dashboard");
    }
  } catch {
    return null;
    // // If auth check fails (e.g., no refresh token), just continue to login
    // if (error instanceof Error && error.message === RefreshTokenError) {
    //   // User needs to log in, don't redirect
    //   return null;
    // }
    // // Re-throw other errors
    // throw error;
  }

  return null; // No action needed if the user is not logged in
}

export default function Login() {
  return (
    <SignInSignUpWrapper image="https://images.unsplash.com/photo-1507812984078-917a274065be?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
      <LoginForm />
    </SignInSignUpWrapper>
  );
}
