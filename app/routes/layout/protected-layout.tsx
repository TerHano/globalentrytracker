import { Outlet, redirect } from "react-router";
import { createSupabaseServerClient } from "~/util/supabase/createSupabaseServerClient";
import type { Route } from "./+types/protected-layout";
import { AppShell, AppShellHeader, AppShellMain } from "@mantine/core";
import { meApi } from "~/api/me-api";
import { AppHeader } from "~/components/appshell/app-header";
import { useEffect } from "react";
import { applyPageLoadTransition } from "~/utils/view-transitions";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return redirect("/login", { headers });
  }
  const me = await meApi(session.access_token);
  return { me };
}

export default function ProtectedLayout({ loaderData }: Route.ComponentProps) {
  const { me } = loaderData;

  useEffect(() => {
    applyPageLoadTransition();
  }, []);

  return (
    <AppShell header={{ height: 50 }}>
      <AppShellHeader>
        <AppHeader me={me} />
      </AppShellHeader>
      <AppShellMain>
        <div className="container body-view-transition">
          <Outlet />
        </div>
      </AppShellMain>
    </AppShell>
  );
}
