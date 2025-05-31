import {
  ActionIcon,
  Badge,
  SimpleGrid,
  Text,
  Table,
  type BadgeProps,
  type TableData,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { planQuery } from "~/api/plans-api";
import { PlanFrequency } from "~/enum/PlanFrequency";
import { AddEditPricingPlanButton } from "./add-edit-pricing-plan-button";
import { Pencil, Trash } from "lucide-react";
import { modals } from "@mantine/modals";
import { useDeletePricingPlan } from "~/hooks/api/admin/useDeletePricingPlan";
import { useShowNotification } from "~/hooks/useShowNotification";

export const PricingList = () => {
  const { showNotification, showErrorCodeNotification } = useShowNotification();
  const usePlansQuery = useQuery(planQuery());

  const deletePlanMutation = useDeletePricingPlan({
    onSuccess: () => {
      showNotification({
        icon: <Trash size={16} />,
        title: "Plan deleted",
        message: "The plan has been successfully deleted.",
        status: "success",
      });
      // Invalidate the plans query to refresh the list
    },
    onError: (error) => {
      showErrorCodeNotification(error);
    },
  });

  const handleDeletePlan = (planId: number) => {
    modals.openConfirmModal({
      title: "Delete Plan",
      children: (
        <div>
          Are you sure you want to delete this plan? This action cannot be
          undone.
        </div>
      ),
      labels: { confirm: "Delete Plan", cancel: "Cancel" },
      confirmProps: {
        color: "red",
        loading: deletePlanMutation.isPending,
        variant: "light",
      },
      cancelProps: {
        variant: "subtle",
        color: "white",
        loading: deletePlanMutation.isPending,
      },
      onConfirm: async () => {
        await deletePlanMutation.mutateAsync({
          params: { path: { id: planId } },
        });
      },
      onCancel: () => {
        console.log("Delete plan action cancelled");
      },
    });
    // Implement the logic to delete a plan
    console.log(`Deleting plan with ID: ${planId}`);
  };
  const tableData: TableData = {
    caption: "List of Pricing Plans",
    head: ["ID", "Price", "Frequency", "Name", "Description", "Price ID"],
    body: usePlansQuery.data?.map((plan) => [
      plan.id,
      plan.priceFormatted,
      badgeForFrequency(plan.frequency),
      plan.name,
      plan.description,
      <Text key={plan.id} truncate="start" maw={200}>
        {plan.priceId}
      </Text>,
      <SimpleGrid cols={2} spacing="xs" key={plan.id}>
        <AddEditPricingPlanButton
          plan={plan}
          actionIconProps={{
            variant: "default",
            size: "sm",
            children: <Pencil size={12} />,
          }}
        />
        <ActionIcon
          variant="light"
          color="red"
          size="sm"
          onClick={() => handleDeletePlan(plan.id)}
          loading={deletePlanMutation.isPending}
        >
          <Trash size={12} />
        </ActionIcon>
      </SimpleGrid>,
    ]),
  };

  if (usePlansQuery.isLoading) {
    return "Loading...";
  }
  return (
    <Table.ScrollContainer minWidth={500}>
      <Table data={tableData} />
    </Table.ScrollContainer>
  );
};

const badgeForFrequency = (frequency: PlanFrequency) => {
  const sharedBadgeProps: BadgeProps = {
    variant: "light",
    size: "sm",
  };
  switch (frequency) {
    case PlanFrequency.Monthly:
      return (
        <Badge {...sharedBadgeProps} color="blue">
          Monthly
        </Badge>
      );
    case PlanFrequency.Weekly:
      return (
        <Badge {...sharedBadgeProps} color="green">
          Weekly
        </Badge>
      );
    default:
      return (
        <Badge {...sharedBadgeProps} color="gray">
          Unknown
        </Badge>
      );
  }
};
