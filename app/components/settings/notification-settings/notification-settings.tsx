import { Tabs, TabsList, TabsTab, TabsPanel } from "@mantine/core";
import { DiscordIcon } from "~/components/ui/icons/DiscordIcon";
import { DiscordSettingsCard } from "./discord-settings";
import type { AllNotificationSettings } from "~/api/all-notification-settings-api";

interface NotificationSettingsProps {
  settings: AllNotificationSettings;
}

export const NotificationSettings = ({
  settings,
}: NotificationSettingsProps) => {
  return (
    <div className="settings-tab-transition">
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
