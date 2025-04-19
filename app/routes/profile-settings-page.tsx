import type { Route } from "./+types/profile-settings-page";
import { redirect } from "react-router";
import { createSupabaseServerClient } from "~/utils/supabase/createSupabaseServerClient";
import { meQuery } from "~/api/me-api";
import { ProfileSettings } from "~/components/settings/profile-settings";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export function meta() {
  return [
    { title: "Settings - Profile" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    // If the user is already logged in, redirect to the home page
    return redirect("/login", { headers });
  }
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(meQuery(session.access_token));
  return { dehydratedState: dehydrate(queryClient) };
}

export default function ProfileSettingsPage({
  loaderData,
}: Route.ComponentProps) {
  const { dehydratedState } = loaderData;
  return (
    <HydrationBoundary state={dehydratedState}>
      <ProfileSettings />
    </HydrationBoundary>
  );
}
