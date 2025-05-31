import {
  ActionIcon,
  Button,
  Divider,
  Modal,
  Stack,
  Textarea,
  TextInput,
  type ActionIconProps,
  type ButtonProps,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { DollarSign } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";
import { useCreatePricingPlan } from "~/hooks/api/admin/useCreatePricingPlan";
import { useUpdatePricingPlan } from "~/hooks/api/admin/useUpdatePricingPlan";
import { useShowNotification } from "~/hooks/useShowNotification";
import type { paths } from "~/types/api";

type UpdatePricingPlanFormValues =
  paths["/api/v1/admin/pricing"]["put"]["requestBody"]["content"]["application/json"];

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
  const { showNotification, showErrorCodeNotification } = useShowNotification();
  const isEditMode = !!plan;
  const [opened, { open, close }] = useDisclosure(false);

  const addPricingPlanMutation = useCreatePricingPlan({
    onSuccess: (data, requestBody) => {
      console.log("Pricing plan created successfully:", data);
      console.log("Request body:", requestBody);
      showNotification({
        icon: <DollarSign size={16} />,
        title: "Success",
        message: `Pricing plan "${requestBody.name}" created successfully!`,
        status: "success",
      });
      close();
    },
    onError: (errors) => {
      showErrorCodeNotification(errors);
    },
  });

  const updatePricingPlanMutation = useUpdatePricingPlan({
    onSuccess: (data, requestBody) => {
      console.log("Pricing plan updated successfully:", data);
      console.log("Request body:", requestBody);
      showNotification({
        icon: <DollarSign size={16} />,
        title: "Success",
        message: `Pricing plan "${requestBody.name}" updated successfully!`,
        status: "success",
      });
      close();
    },
    onError: (errors) => {
      showErrorCodeNotification(errors);
    },
  });

  const schema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    description: z.string().min(1, "Description is required"),
    priceId: z.string().min(3, "Price ID must be at least 3 characters long"),
    features: z
      .string()
      .min(1, "At least one feature is required")
      .transform((value) => value.split(",").map((feature) => feature.trim())),
  });

  const form = useForm<UpdatePricingPlanFormValues>({
    initialValues: {
      id: 0,
      name: "",
      description: "",
      priceId: "",
      features: "",
    },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    if (plan && !form.initialized) {
      form.initialize({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        priceId: plan.priceId,
        features: plan.features.join(","),
      });
    }
  }, [plan, form]);

  const handleSubmit = (values: typeof form.values) => {
    // Handle form submission logic here
    if (isEditMode) {
      updatePricingPlanMutation.mutate({
        body: {
          id: plan?.id || 0,
          name: values.name,
          description: values.description,
          priceId: values.priceId,
          features: values.features,
        },
      });
    } else {
      addPricingPlanMutation.mutate({
        body: {
          name: values.name,
          description: values.description,
          priceId: values.priceId,
          features: values.features,
        },
      });
    }
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
            <Textarea
              label="Features"
              {...form.getInputProps("features")}
              description="List the features of the plan, separated by commas."
            />
            <Divider />
            <Button
              type="submit"
              loading={
                addPricingPlanMutation.isPending ||
                updatePricingPlanMutation.isPending
              }
            >
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
