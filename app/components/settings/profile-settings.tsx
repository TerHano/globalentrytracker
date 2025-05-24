import {
  Button,
  Divider,
  Flex,
  InputWrapper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { Page } from "../ui/page";
import { meQuery } from "~/api/me-api";
import { useQuery } from "@tanstack/react-query";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useUpdateUser } from "~/hooks/api/useUpdateUser";
import { useCallback, useEffect } from "react";
import { useShowNotification } from "~/hooks/useShowNotification";
import { UserRoundCheck } from "lucide-react";

interface ProfileSettingsFormSchema {
  firstName: string;
  lastName: string;
}

export const ProfileSettings = () => {
  const { data: me, isFetching: isMeLoading } = useQuery(meQuery());

  const { showNotification } = useShowNotification();

  const schema = z.object({
    firstName: z
      .string()
      .nonempty("First name is required")
      .min(2, "Must be 2 characters or more"),
    lastName: z
      .string()
      .nonempty("Last name is required")
      .min(2, "Must be 2 characters or more"),
  });

  const form = useForm<ProfileSettingsFormSchema>({
    initialValues: {
      firstName: me?.firstName ?? "",
      lastName: me?.lastName ?? "",
    },
    validate: zodResolver(schema),
  });

  const updateUserMutation = useUpdateUser({
    onSuccess: (_, request) => {
      showNotification({
        title: "Profile updated",
        message: "Your profile has been updated successfully.",
        status: "success",
        icon: <UserRoundCheck size={16} />,
      });
      form.setInitialValues({
        firstName: request.firstName,
        lastName: request.lastName,
      });
    },
    onError: (error) => {
      if (error instanceof Error) {
        showNotification({
          title: "Error updating profile",
          message: error.message,
          status: "error",
          icon: <UserRoundCheck size={16} />,
        });
      }
      console.error("Error updating user:", error);
    },
  });

  const handleSubmit = useCallback(
    async (values: typeof form.values) => {
      // Handle form submission
      updateUserMutation.mutate({
        body: {
          firstName: values.firstName,
          lastName: values.lastName,
        },
      });
    },
    [form, updateUserMutation]
  );

  useEffect(() => {
    if (me && !form.initialized) {
      form.initialize({
        firstName: me.firstName,
        lastName: me.lastName,
      });
    }
  }, [form, me]);

  return (
    <Page.Subsection
      className="fade-in-up-animation"
      header="Profile Settings"
      description="You can change your profile settings here"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <InputWrapper label="Email">
            <Skeleton width="fit-content" visible={isMeLoading}>
              <Text fz={{ base: "sm", xs: "md" }}>
                {me?.email ?? "EMAIL@EMAIL.COM"}
              </Text>
            </Skeleton>
          </InputWrapper>
          <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="lg">
            <Skeleton visible={isMeLoading}>
              <TextInput
                label="First Name"
                placeholder="First Name"
                key={form.key("firstName")}
                {...form.getInputProps("firstName")}
              />
            </Skeleton>
            <Skeleton visible={isMeLoading}>
              <TextInput
                label="Last Name"
                placeholder="Last Name"
                key={form.key("lastName")}
                {...form.getInputProps("lastName")}
              />
            </Skeleton>
          </SimpleGrid>
          <Divider />
          <Flex justify="end">
            <Button
              disabled={updateUserMutation.isPending || isMeLoading}
              loading={updateUserMutation.isPending}
              type="submit"
            >
              Update Profile
            </Button>
          </Flex>
        </Stack>
      </form>
    </Page.Subsection>
  );
};
