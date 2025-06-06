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
  const authResult = await isAuthenticated(request);
  if (!authResult.user) {
    throw redirect("/login");
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(meQuery(request));

  const dehydratedState = dehydrate(queryClient);

  // If we have new headers (from token refresh), return them
  if (authResult.headers) {
    return new Response(JSON.stringify({ dehydratedState }), {
      status: 200,
      headers: authResult.headers,
    });
  }

  return { dehydratedState };
}

export default function ProtectedLayout({ loaderData }: Route.ComponentProps) {
  // Handle both direct object and JSON response formats
  let dehydratedState;
  if (typeof loaderData === "string") {
    dehydratedState = JSON.parse(loaderData).dehydratedState;
  } else {
    dehydratedState = loaderData.dehydratedState;
  }

  return (
    <HydrationBoundary state={dehydratedState}>
      <GlobalEntryTrackerShell>
        <Outlet />
      </GlobalEntryTrackerShell>
    </HydrationBoundary>
  );
}
