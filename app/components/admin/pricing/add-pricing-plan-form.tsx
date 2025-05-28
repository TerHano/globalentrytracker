import { Button, Stack, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import type { paths } from "~/types/api";

export type AddPricingPlanFormValues =
  paths["/api/v1/admin/pricing"]["post"]["requestBody"]["content"]["application/json"];

export const AddPricingPlanForm = () => {
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      priceId: "",
      features: [],
    },
    validate: {
      name: (value) =>
        value.length < 3 ? "Name must be at least 3 characters long" : null,
      description: isNotEmpty("Description is required"),
      priceId: (value) =>
        value.length < 3 ? "Price ID must be at least 3 characters long" : null,
      features: (value) =>
        value.length === 0 ? "At least one feature is required" : null,
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    // Handle form submission logic here
    console.log("Form submitted with values:", values);
  };
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput placeholder="Plan Name" {...form.getInputProps("name")} />
        <TextInput
          {...form.getInputProps("description")}
          placeholder="Description"
        />
        <TextInput
          {...form.getInputProps("priceId")}
          placeholder="Price ID"
          description="
            This is the Stripe price ID for the plan. You can find it in your Stripe dashboard."
        />
        <TextInput
          {...form.getInputProps("features")}
          placeholder="Features (comma separated)"
          description="List the features of the plan, separated by commas."
        />
        <Button>Add Price Plan</Button>
      </Stack>
    </form>
  );
};
