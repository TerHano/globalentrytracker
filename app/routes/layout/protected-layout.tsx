import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/protected-layout";
import { meQuery } from "~/api/me-api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { GlobalEntryTrackerShell } from "~/components/appshell/global-entry-tracker-shell";
import { isAuthenticated } from "~/utils/auth";
import { RefreshTokenError } from "~/root";

export async function clientLoader({ request }: Route.LoaderArgs) {
  try {
    const isUserAuthenticated = await isAuthenticated(request);
    if (!isUserAuthenticated) {
      throw redirect("/login");
    }
  } catch (error) {
    if (error instanceof Error && error.message === RefreshTokenError) {
      // Redirect immediately without showing dashboard
      throw redirect("/login");
    }
    // Re-throw other errors
    throw error;
  }
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(meQuery(request));
  return { dehydratedState: dehydrate(queryClient) };
}

export default function ProtectedLayout({ loaderData }: Route.ComponentProps) {
  const { dehydratedState } = loaderData;

  return (
    <HydrationBoundary state={dehydratedState}>
      <GlobalEntryTrackerShell>
        <Outlet />
      </GlobalEntryTrackerShell>
    </HydrationBoundary>
  );
}
