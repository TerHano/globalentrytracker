import { Outlet, redirect, useNavigate } from "react-router";
import { createSupabaseServerClient } from "~/utils/supabase/createSupabaseServerClient";
import type { Route } from "./+types/protected-layout";
import { meQuery } from "~/api/me-api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { supabaseBrowserClient } from "~/utils/supabase/createSupbaseBrowerClient";
import { GlobalEntryTrackerShell } from "~/components/appshell/global-entry-tracker-shell";

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

  const navigate = useNavigate();

  useEffect(() => {
    const { data: listener } = supabaseBrowserClient.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          // Session expired or user logged out
          navigate("/login"); // or your login route
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <HydrationBoundary state={dehydratedState}>
      <GlobalEntryTrackerShell>
        <Outlet />
      </GlobalEntryTrackerShell>
    </HydrationBoundary>
  );
}
