import {
  Button,
  Divider,
  Flex,
  Stack,
  Switch,
  Text,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { MessageCircleMore } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import type { DiscordSettings } from "~/api/discord-settings-api";
import { Page } from "~/components/ui/page";
import {
  useCreateUpdateDiscordSettings,
  type CreateUpdateDiscordSettingsRequest,
} from "~/hooks/api/useCreateUpdateDiscordSettings";
import {
  useTestDiscordSettings,
  type TestDiscordSettingsRequest,
} from "~/hooks/api/useTestDiscordSettings";

interface DiscordSettingsProps {
  settings: DiscordSettings;
}

interface DiscordSettingsForm {
  webhookUrl: string;
  enabled: boolean;
}

export const DiscordSettingsCard = ({ settings }: DiscordSettingsProps) => {
  const isUpdate = !!settings;

  const [isEnabled, setIsEnabled] = useState(settings?.enabled ?? true);
  const discordSettingsMutate = useCreateUpdateDiscordSettings({
    isUpdate,
    onSuccess: (data, body) => {
      console.log("Settings saved successfully", data, body);
      notifications.show({
        title: "Settings saved",
        message: "Your settings have been saved successfully.",
        color: "teal",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error saving settings",
        message: "There was an error saving your settings.",
        color: "red",
      });
      console.error("Error saving settings", error);
    },
  });

  const testMessageMutate = useTestDiscordSettings({
    onSuccess: (data, body) => {
      console.log("Settings tested successfully", data, body);
      notifications.show({
        icon: <MessageCircleMore size={16} />,
        title: "Test Message Sent",
        message: "Check your Discord channel for the test message.",
        color: "teal",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error Sending Test Message",
        message:
          "There was an error testing your settings. Please check the webhook URL.",
        color: "red",
      });
      console.error("Error testing settings", error);
    },
  });

  const form = useForm<DiscordSettingsForm>({
    initialValues: {
      webhookUrl: "",
      enabled: false,
    },
    onValuesChange: (values) => {
      setIsEnabled(values.enabled);
    },
  });

  const handleTestMessage = useCallback(async () => {
    const request: TestDiscordSettingsRequest = {
      webhookUrl: form.values.webhookUrl,
    };
    console.log("Testing settings", form.values);
    await testMessageMutate.mutateAsync(request);
  }, [testMessageMutate, form]);

  const handleSubmit = useCallback(
    async (values: typeof form.values) => {
      // Call your API to save the settings
      const request: CreateUpdateDiscordSettingsRequest = {
        id: settings?.id,
        webhookUrl: values.webhookUrl,
        enabled: values.enabled,
      };
      console.log("Saving settings", values);
      await discordSettingsMutate.mutateAsync(request);
    },
    [discordSettingsMutate, form, settings?.id]
  );

  useEffect(() => {
    if (!form.initialized) {
      form.initialize({
        webhookUrl: settings.webhookUrl,
        enabled: settings.enabled,
      });
    }
  }, [form, settings]);
  return (
    <Page
      header="Discord Settings"
      description="  This is where you can configure your Discord settings. You can set up
          webhooks, notifications, and other integrations with Discord."
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack mt="lg">
          <Switch
            size="sm"
            label={
              <Text size="sm" fw={500}>
                Enable
              </Text>
            }
            // labelPosition="left"
            defaultChecked={settings ? settings.enabled : true}
            mt={3}
            color="green"
            key={form.key("enabled")}
            {...form.getInputProps("enabled")}
            description={
              <Text component="span" size="xs">
                You will not receive notifications for this service if the
                setting is disabled
              </Text>
            }
          />
          <Textarea
            disabled={!isEnabled}
            autosize
            minRows={2}
            label="Webhook URL"
            description={
              <Text component="span" size="xs">
                If you need help locating your webhook url, please check out
                this{" "}
                <Link
                  target="_blank"
                  to="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks"
                >
                  discord article
                </Link>
              </Text>
            }
            key={form.key("webhookUrl")}
            {...form.getInputProps("webhookUrl")}
          />
          <Divider />
          <Flex justify="end" gap="md">
            <Button
              onClick={handleTestMessage}
              loading={testMessageMutate.isPending}
              variant="outline"
            >
              Test Webhook
            </Button>
            <Button loading={discordSettingsMutate.isPending} type="submit">
              Save Settings
            </Button>
          </Flex>
        </Stack>
      </form>
    </Page>
  );
};
