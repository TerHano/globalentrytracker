import { Outlet, redirect } from "react-router";
import { createSupabaseServerClient } from "~/utils/supabase/createSupabaseServerClient";
import type { Route } from "./+types/protected-layout";
import { AppShell, AppShellHeader, AppShellMain } from "@mantine/core";
import { meQuery } from "~/api/me-api";
import { AppHeader } from "~/components/appshell/app-header";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    // If the user is already logged in, redirect to the home page
    return redirect("/login", { headers });
  }
  const token = session.access_token;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(meQuery(token));

  return { dehydratedState: dehydrate(queryClient) };
}

export default function ProtectedLayout({ loaderData }: Route.ComponentProps) {
  const { dehydratedState } = loaderData;

  return (
    <HydrationBoundary state={dehydratedState}>
      <AppShell padding="md" header={{ height: 50 }}>
        <AppShellHeader>
          <AppHeader />
        </AppShellHeader>
        <AppShellMain>
          <div className="container">
            <Outlet />
          </div>
        </AppShellMain>
      </AppShell>
    </HydrationBoundary>
  );
}
