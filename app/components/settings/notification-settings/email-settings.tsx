import {
  Alert,
  Button,
  Divider,
  Group,
  NumberInput,
  Stack,
  Switch,
  Text,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { Mail, Send } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import type { EmailNotificationSettings } from "~/api/email-settings-api";
import { LabelValue } from "~/components/ui/label-value";
import { Page } from "~/components/ui/layout/page";
import {
  useCreateUpdateEmailSettings,
  type CreateUpdateEmailSettingsRequest,
} from "~/hooks/api/useCreateUpdateEmailSettings";
import { useTestEmailSettings } from "~/hooks/api/useTestEmailSettings";
import { useShowNotification } from "~/hooks/useShowNotification";

interface EmailSettingsProps {
  settings?: EmailNotificationSettings;
}

interface EmailSettingsForm {
  enabled: boolean;
  limitNotifications: boolean;
  maxNotificationsPerDay: number | undefined;
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
    limitNotifications: z.boolean(),
    maxNotificationsPerDay: z
      .number()
      .int()
      .min(1, "Must be at least 1")
      .optional(),
  }).superRefine((val, ctx) => {
    if (val.limitNotifications && !val.maxNotificationsPerDay) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter a limit",
        path: ["maxNotificationsPerDay"],
      });
    }
  });

  const form = useForm<EmailSettingsForm>({
    initialValues: {
      enabled: false,
      limitNotifications: false,
      maxNotificationsPerDay: undefined,
    },

    validate: zodResolver(schema),
  });

  const handleTestMessage = useCallback(async () => {
    await testMessageMutate.mutateAsync({});
  }, [testMessageMutate]);

  const handleSubmit = useCallback(
    async (values: typeof form.values) => {
      const request: CreateUpdateEmailSettingsRequest = {
        id: settings?.id,
        enabled: values.enabled,
        maxNotificationsPerDay: values.limitNotifications
          ? (values.maxNotificationsPerDay ?? null)
          : null,
      };
      await emailSettingsMutate.mutateAsync({ body: request });
    },
    [emailSettingsMutate, form, settings?.id]
  );

  useEffect(() => {
    if (!form.initialized) {
      form.initialize({
        enabled: settings ? settings.enabled : false,
        limitNotifications: !!settings?.maxNotificationsPerDay,
        maxNotificationsPerDay: settings?.maxNotificationsPerDay ?? undefined,
      });
    }
  }, [form, settings]);
  return (
    <>
      <Alert
        variant="light"
        mb="xs"
        title="Important Note"
        icon={<Mail size={16} />}
        color="blue"
      >
        <Text size="xs">
          {t(
            "Due to the nature of how Gmail and other email providers flag emails, notification emails may end up in your spam or junk folder. Please send a test email and mark the sender as 'Not Spam' to ensure you receive future notifications."
          )}
        </Text>
      </Alert>
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
                  You will not receive notifications for this service if it is
                  not enabled
                </Text>
              }
            />
            <LabelValue label="Email">
              <>{settings?.email}</>
            </LabelValue>
            <Switch
              size="sm"
              label={
                <Text size="sm" fw={500}>
                  Limit daily notifications
                </Text>
              }
              color="green"
              key={form.key("limitNotifications")}
              {...form.getInputProps("limitNotifications")}
              description={
                <Text component="span" size="xs">
                  Cap the number of notifications this channel sends per day
                </Text>
              }
            />
            {form.values.limitNotifications && (
              <NumberInput
                label="Max notifications per day"
                description={
                  <Text component="span" size="xs">
                    You will stop receiving email notifications once this limit
                    is reached. The count resets on a rolling 24-hour window.
                  </Text>
                }
                min={1}
                allowDecimal={false}
                styles={{ wrapper: { width: 160 } }}
                key={form.key("maxNotificationsPerDay")}
                {...form.getInputProps("maxNotificationsPerDay")}
              />
            )}
            <Divider />
            <Group justify="end" gap="md" wrap="wrap">
              <Button
                size="sm"
                onClick={handleTestMessage}
                loading={testMessageMutate.isPending}
                variant="light"
                leftSection={<Send size={16} />}
              >
                Test Email
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
    </>
  );
};
