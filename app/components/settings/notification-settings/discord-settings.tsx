import {
  Button,
  Divider,
  Group,
  Stack,
  Switch,
  Text,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Send } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import type { DiscordSettings } from "~/api/discord-settings-api";
import { DiscordIcon } from "~/components/ui/icons/DiscordIcon";
import { Page } from "~/components/ui/page";
import {
  useCreateUpdateDiscordSettings,
  type CreateUpdateDiscordSettingsRequest,
} from "~/hooks/api/useCreateUpdateDiscordSettings";
import {
  useTestDiscordSettings,
  type TestDiscordSettingsRequest,
} from "~/hooks/api/useTestDiscordSettings";
import { useShowNotification } from "~/hooks/useShowNotification";

interface DiscordSettingsProps {
  settings: DiscordSettings;
}

interface DiscordSettingsForm {
  webhookUrl: string;
  enabled: boolean;
}

export const DiscordSettingsCard = ({ settings }: DiscordSettingsProps) => {
  const isUpdate = !!settings;
  const { showNotification } = useShowNotification();

  const [isEnabled, setIsEnabled] = useState(settings?.enabled ?? true);
  const discordSettingsMutate = useCreateUpdateDiscordSettings({
    isUpdate,
    onSuccess: (data, body) => {
      showNotification({
        title: "Settings saved",
        message: "Your settings have been saved successfully.",
        status: "success",
        icon: <DiscordIcon size={16} />,
      });
    },
    onError: (error) => {
      showNotification({
        title: "Error saving settings",
        message: "There was an error saving your settings. Please try again.",
        status: "error",
        icon: <DiscordIcon size={16} />,
      });
      console.error("Error saving settings", error);
    },
  });

  const testMessageMutate = useTestDiscordSettings({
    onSuccess: (data, body) => {
      showNotification({
        title: "Test message sent",
        message: "Your test message has been sent successfully.",
        status: "success",
        icon: <DiscordIcon size={16} />,
      });
    },
    onError: (error) => {
      showNotification({
        title: "Error testing settings",
        message: "There was an error testing your settings. Please try again.",
        status: "error",
        icon: <DiscordIcon size={16} />,
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
    <Page.Subsection
      header="Discord Settings"
      description="  This is where you can configure your Discord settings. You can set up
          webhooks, notifications, and other integrations with Discord."
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
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
                  discord article.
                </Link>
              </Text>
            }
            key={form.key("webhookUrl")}
            {...form.getInputProps("webhookUrl")}
          />
          <Divider />
          <Group justify="end" gap="md" wrap="wrap">
            <Button
              size="sm"
              onClick={handleTestMessage}
              loading={testMessageMutate.isPending}
              variant="light"
              leftSection={<Send size={16} />}
            >
              Test Webhook
            </Button>
            <Button
              size="sm"
              loading={discordSettingsMutate.isPending}
              type="submit"
            >
              Save Settings
            </Button>
          </Group>
        </Stack>
      </form>
    </Page.Subsection>
  );
};
