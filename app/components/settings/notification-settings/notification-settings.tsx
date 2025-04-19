import { Tabs, TabsList, TabsTab, TabsPanel } from "@mantine/core";
import { DiscordIcon } from "~/components/ui/icons/DiscordIcon";
import { DiscordSettingsCard } from "./discord-settings";
import { allNotificationSettingsQuery } from "~/api/all-notification-settings-api";
import { useQuery } from "@tanstack/react-query";

export const NotificationSettings = () => {
  const { data: settings, isLoading: isSettingsLoading } = useQuery(
    allNotificationSettingsQuery()
  );

  if (isSettingsLoading || !settings) {
    return <div className="fade-in-animation">Loading...</div>;
  }
  return (
    <div className="fade-in-animation">
      <Tabs radius="md" defaultValue="discord">
        <TabsList>
          <TabsTab value="discord" leftSection={<DiscordIcon />}>
            Discord
          </TabsTab>
        </TabsList>

        <TabsPanel mt="sm" value="discord">
          <DiscordSettingsCard settings={settings.discordSettings} />
        </TabsPanel>

        {/* <TabsPanel value="messages">Messages tab content</TabsPanel>
    
            <TabsPanel value="settings">Settings tab content</TabsPanel> */}
      </Tabs>
    </div>
  );
};
