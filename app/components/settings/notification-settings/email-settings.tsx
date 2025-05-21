import { Button, Divider, Group, Stack, Switch, Text } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { Mail, Send } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import type { EmailSettings } from "~/api/email-settings-api";
import { LabelValue } from "~/components/ui/label-value";
import { Page } from "~/components/ui/page";
import {
  useCreateUpdateEmailSettings,
  type CreateUpdateEmailSettingsRequest,
} from "~/hooks/api/useCreateUpdateEmailSettings";
import { useTestEmailSettings } from "~/hooks/api/useTestEmailSettings";
import { useShowNotification } from "~/hooks/useShowNotification";

interface EmailSettingsProps {
  settings?: EmailSettings;
}

interface EmailSettingsForm {
  enabled: boolean;
}

export const EmailSettingsCard = ({ settings }: EmailSettingsProps) => {
  const isUpdate = !!settings;
  const { t } = useTranslation();
  const { showNotification } = useShowNotification();

  // const [isEnabled, setIsEnabled] = useState(settings?.enabled ?? true);
  const emailSettingsMutate = useCreateUpdateEmailSettings({
    isUpdate,
    onSuccess: () => {
      showNotification({
        title: t("Email Settings Saved"),
        message: t("Email Settings have been saved successfully."),
        status: "success",
        icon: <Mail size={16} />,
      });
    },
    onError: (error) => {
      showNotification({
        title: t("Failed to save Email Settings"),
        message: t(
          "There was an error saving your settings. Please try again."
        ),
        status: "error",
        icon: <Mail size={16} />,
      });
      console.error("Error saving settings", error);
    },
  });

  const testMessageMutate = useTestEmailSettings({
    onSuccess: () => {
      showNotification({
        title: t("Test Email Sent"),
        message: t(
          "A test email has been sent to your email address. Please check your inbox."
        ),
        status: "success",
        icon: <Mail size={16} />,
      });
    },
    onError: (error) => {
      showNotification({
        title: t("Failed To Send Test Email"),
        message: t(
          "There was an error testing your settings. Please try again."
        ),
        status: "error",
        icon: <Mail size={16} />,
      });
      console.error("Error testing settings", error);
    },
  });

  const schema = z.object({
    enabled: z.boolean(),
  });

  const form = useForm<EmailSettingsForm>({
    initialValues: {
      enabled: false,
    },

    validate: zodResolver(schema),
  });

  const handleTestMessage = useCallback(async () => {
    await testMessageMutate.mutateAsync();
  }, [testMessageMutate]);

  const handleSubmit = useCallback(
    async (values: typeof form.values) => {
      // Call your API to save the settings
      const request: CreateUpdateEmailSettingsRequest = {
        id: settings?.id,
        enabled: values.enabled,
      };
      await emailSettingsMutate.mutateAsync(request);
    },
    [emailSettingsMutate, form, settings?.id]
  );

  useEffect(() => {
    if (!form.initialized) {
      form.initialize({
        enabled: settings ? settings.enabled : false,
      });
    }
  }, [form, settings]);
  return (
    <Page.Subsection
      header="Email Settings"
      description="  This is where you can configure your Email settings."
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
            defaultChecked={settings ? settings.enabled : false}
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
          <LabelValue label="Email">
            <>{settings?.email}</>
          </LabelValue>
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
              loading={emailSettingsMutate.isPending}
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
