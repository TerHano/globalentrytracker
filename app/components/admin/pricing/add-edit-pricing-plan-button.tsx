import {
  ActionIcon,
  Button,
  Divider,
  Modal,
  Stack,
  TextInput,
  type ActionIconProps,
  type ButtonProps,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { z } from "zod";
import type { paths } from "~/types/api";

type AddPricingPlanFormValues =
  paths["/api/v1/admin/pricing"]["post"]["requestBody"]["content"]["application/json"];

type PricingPlan =
  paths["/api/v1/plans"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number];

export const AddEditPricingPlanButton = ({
  buttonProps,
  actionIconProps,
  plan,
}: {
  buttonProps?: ButtonProps;
  actionIconProps?: ActionIconProps;
  plan?: PricingPlan;
}) => {
  if (!buttonProps && !actionIconProps) {
    throw new Error("Either buttonProps or actionIconProps must be provided");
  }
  const isEditMode = !!plan;
  const [opened, { open, close }] = useDisclosure(false);

  const schema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    description: z.string().min(1, "Description is required"),
    priceId: z.string().min(3, "Price ID must be at least 3 characters long"),
    features: z
      .string()
      .min(1, "At least one feature is required")
      .transform((value) => value.split(",").map((feature) => feature.trim())),
  });

  const form = useForm<AddPricingPlanFormValues>({
    initialValues: {
      name: "",
      description: "",
      priceId: "",
      features: [],
    },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    if (plan && !form.initialized) {
      form.initialize({
        name: plan.name,
        description: plan.description,
        priceId: plan.priceId,
        features: plan.features,
      });
    }
  }, [plan, form]);

  const handleSubmit = (values: typeof form.values) => {
    // Handle form submission logic here
    console.log("Form submitted with values:", values);
  };
  return (
    <>
      <Modal opened={opened} onClose={close} title="Add Pricing Plan">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput label="Plan Name" {...form.getInputProps("name")} />
            <TextInput
              label="Description"
              {...form.getInputProps("description")}
            />
            <TextInput
              label="Price ID"
              {...form.getInputProps("priceId")}
              description="
            This is the Stripe price ID for the plan. You can find it in your Stripe dashboard."
            />
            <TextInput
              label="Features"
              {...form.getInputProps("features")}
              description="List the features of the plan, separated by commas."
            />
            <Divider />
            <Button>
              {isEditMode ? "Update Price Plan" : "Add Price Plan"}
            </Button>
          </Stack>
        </form>
      </Modal>
      {actionIconProps ? (
        <ActionIcon {...actionIconProps} onClick={open} />
      ) : (
        <Button {...buttonProps} onClick={open} />
      )}
    </>
  );
};
