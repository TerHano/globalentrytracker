import type { Route } from "./+types/settings";
import { Welcome } from "../welcome/welcome";
import { Page } from "~/components/ui/page";
import { Tabs, TabsList, TabsTab, TabsPanel } from "@mantine/core";
import { DiscordSettingsCard } from "~/components/settings/discord-settings";
import { DiscordIcon } from "~/components/ui/icons/DiscordIcon";
import { redirect } from "react-router";
import { createSupabaseServerClient } from "~/util/supabase/createSupabaseServerClient";
import { allNotificationSettingsApi } from "~/api/all-notification-settings-api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings" },
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
  const settings = await allNotificationSettingsApi(session.access_token);

  return { settings };
}

export default function Settings({ loaderData }: Route.ComponentProps) {
  const { settings } = loaderData;
  return (
    <Page header="Settings" description="You can change your settings here">
      <Tabs radius="xs" defaultValue="discord">
        <TabsList>
          <TabsTab value="discord" leftSection={<DiscordIcon />}>
            Discord
          </TabsTab>
          {/* <TabsTab
            value="messages"
            leftSection={<IconMessageCircle size={12} />}
          >
            Messages
          </TabsTab>
          <TabsTab value="settings" leftSection={<IconSettings size={12} />}>
            Settings
          </TabsTab> */}
        </TabsList>

        <TabsPanel value="discord">
          <DiscordSettingsCard settings={settings.discordSettings} />
        </TabsPanel>

        {/* <TabsPanel value="messages">Messages tab content</TabsPanel>

        <TabsPanel value="settings">Settings tab content</TabsPanel> */}
      </Tabs>
    </Page>
  );
}
