import type { Route } from "./+types/login";
import { redirect } from "react-router";
import SignUpForm from "~/components/sign-up-form/sign-up-form";
import { SignInSignUpWrapper } from "~/components/ui/sign-in-sign-up-wrapper/sign-in-sign-up-wrapper";
import { RefreshTokenError } from "~/root";
import { isAuthenticated } from "~/utils/auth";

export function meta() {
  return [
    { title: "Sign Up" },
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
  return null;
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
