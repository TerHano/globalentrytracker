import {
  Button,
  Divider,
  Flex,
  Group,
  InputWrapper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { Page } from "../ui/page";
import { meQuery, type me } from "~/api/me-api";
import { useQuery } from "@tanstack/react-query";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useUpdateUser } from "~/hooks/api/useUpdateUser";
import { notifications } from "@mantine/notifications";
import { useCallback } from "react";

export interface ProfileSettingsProps {
  me: me;
}

export const ProfileSettings = (props: ProfileSettingsProps) => {
  const { data: me } = useQuery({ ...meQuery, initialData: props.me });

  const schema = z.object({
    firstName: z
      .string()
      .nonempty("First name is required")
      .min(2, "First name must be at least 2 characters long"),
    lastName: z
      .string()
      .nonempty("Last name is required")
      .min(2, "Last name must be at least 2 characters long"),
  });

  const form = useForm({
    initialValues: {
      firstName: me.firstName,
      lastName: me.lastName,
    },
    validate: zodResolver(schema),
  });

  const updateUserMutation = useUpdateUser({
    onSuccess: (data, request) => {
      console.log("User updated successfully:", data);
      notifications.show({
        title: "Profile Updated",
        message: "Your profile has been updated successfully.",
        color: "teal",
        withBorder: true,
      });
      form.setInitialValues({
        firstName: request.firstName,
        lastName: request.lastName,
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: "There was an error updating your profile.",
        color: "red",
        withBorder: true,
      });
      console.error("Error updating user:", error);
    },
  });

  const handleSubmit = useCallback(
    async (values: typeof form.values) => {
      // Handle form submission
      updateUserMutation.mutate({
        firstName: values.firstName,
        lastName: values.lastName,
      });
    },
    [form, updateUserMutation]
  );

  return (
    <Page
      className="settings-tab-transition"
      header="Profile Settings"
      description="You can change your profile settings here"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <InputWrapper label="Email">
            <Text>{me.email}</Text>
          </InputWrapper>
          <Group gap="md">
            <TextInput
              label="First Name"
              placeholder="First Name"
              key={form.key("firstName")}
              {...form.getInputProps("firstName")}
            />
            <TextInput
              label="Last Name"
              placeholder="Last Name"
              key={form.key("lastName")}
              {...form.getInputProps("lastName")}
            />
          </Group>
          <Divider />
          <Flex justify="end">
            <Button type="submit">Update Profile</Button>
          </Flex>
        </Stack>
      </form>
    </Page>
  );
};
