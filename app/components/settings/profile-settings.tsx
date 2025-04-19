import {
  Button,
  Divider,
  Flex,
  InputWrapper,
  SimpleGrid,
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
import { useCallback } from "react";
import { useShowNotification } from "~/hooks/useShowNotification";
import { UserRoundCheck } from "lucide-react";

export const ProfileSettings = () => {
  const { data: me } = useQuery(meQuery());
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

  const form = useForm({
    initialValues: {
      firstName: me?.firstName ?? "",
      lastName: me?.lastName ?? "",
    },
    validate: zodResolver(schema),
  });

  const updateUserMutation = useUpdateUser({
    onSuccess: (data, request) => {
      console.log("User updated successfully:", data);
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
        firstName: values.firstName,
        lastName: values.lastName,
      });
    },
    [form, updateUserMutation]
  );

  return (
    <Page.Subsection
      className="fade-in-animation"
      header="Profile Settings"
      description="You can change your profile settings here"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <InputWrapper label="Email">
            <Text fz={{ base: "sm", xs: "md" }}>{me?.email}</Text>
          </InputWrapper>
          <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="lg">
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
          </SimpleGrid>
          <Divider />
          <Flex justify="end">
            <Button type="submit">Update Profile</Button>
          </Flex>
        </Stack>
      </form>
    </Page.Subsection>
  );
};
