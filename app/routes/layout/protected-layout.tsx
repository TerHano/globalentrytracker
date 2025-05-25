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

export async function loader({ request }: Route.LoaderArgs) {
  const queryClient = new QueryClient();
  const isUserAuthenticated = await isAuthenticated(request);
  if (!isUserAuthenticated) {
    // If the user is not authenticated, redirect to the login page
    return redirect("/login");
  }

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
