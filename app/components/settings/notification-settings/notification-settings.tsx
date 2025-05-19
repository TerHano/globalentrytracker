import { Tabs, TabsList, TabsTab, TabsPanel, Skeleton } from "@mantine/core";
import { DiscordIcon } from "~/components/ui/icons/DiscordIcon";
import { DiscordSettingsCard } from "./discord-settings";
import { allNotificationSettingsQuery } from "~/api/all-notification-settings-api";
import { useQuery } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { EmailSettingsCard } from "./email-settings";

export const NotificationSettings = () => {
  const { data: settings, isLoading: isSettingsLoading } = useQuery(
    allNotificationSettingsQuery()
  );

  if (isSettingsLoading || !settings) {
    return (
      <div className="fade-in-animation">
        <Skeleton h={300} visible />
      </div>
    );
  }
  return (
    <div className="fade-in-animation">
      <Tabs radius="md" defaultValue="discord">
        <TabsList>
          <TabsTab value="email" leftSection={<Mail />}>
            Email
          </TabsTab>
          <TabsTab value="discord" leftSection={<DiscordIcon />}>
            Discord
          </TabsTab>
        </TabsList>

        <TabsPanel mt="sm" value="email">
          <EmailSettingsCard settings={settings.emailSettings} />
        </TabsPanel>

        <TabsPanel mt="sm" value="discord">
          <DiscordSettingsCard settings={settings.discordSettings} />
        </TabsPanel>

        {/* <TabsPanel value="messages">Messages tab content</TabsPanel>
    
            <TabsPanel value="settings">Settings tab content</TabsPanel> */}
      </Tabs>
    </div>
  );
};
