import type { Route } from "./+types/notification-settings-page";
import { redirect } from "react-router";
import { createSupabaseServerClient } from "~/utils/supabase/createSupabaseServerClient";
import { allNotificationSettingsQuery } from "~/api/all-notification-settings-api";
import { NotificationSettings } from "~/components/settings/notification-settings/notification-settings";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export function meta() {
  return [
    { title: "Settings - Notification" },
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
  const token = session.access_token;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(allNotificationSettingsQuery(token));
  return { dehydratedState: dehydrate(queryClient) };
}

export default function NotificationSettingsPage({
  loaderData,
}: Route.ComponentProps) {
  const { dehydratedState } = loaderData;
  return (
    <HydrationBoundary state={dehydratedState}>
      <NotificationSettings />
    </HydrationBoundary>
  );
}
