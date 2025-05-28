import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/protected-layout";
import { meQuery } from "~/api/me-api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { GlobalEntryTrackerShell } from "~/components/appshell/global-entry-tracker-shell";
import { isAdmin } from "~/utils/auth";

export async function clientLoader({ request }: Route.LoaderArgs) {
  const { isAdmin: isUserAdmin, headers } = await isAdmin(request);
  if (!isUserAdmin) {
    throw redirect("/login");
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(meQuery(request));
  const dehydratedState = dehydrate(queryClient);

  if (headers) {
    return new Response(JSON.stringify({ dehydratedState }), {
      status: 200,
      headers,
    });
  }
  return { dehydratedState: dehydratedState };
}

export default function AdminLayout({ loaderData }: Route.ComponentProps) {
  const { dehydratedState } = loaderData;

  return (
    <HydrationBoundary state={dehydratedState}>
      <GlobalEntryTrackerShell>
        <Outlet />
      </GlobalEntryTrackerShell>
    </HydrationBoundary>
  );
}
