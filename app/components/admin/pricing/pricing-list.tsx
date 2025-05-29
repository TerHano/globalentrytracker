import { Badge, Table, type BadgeProps, type TableData } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { planQuery } from "~/api/plans-api";
import { PlanFrequency } from "~/enum/PlanFrequency";
import { AddEditPricingPlanButton } from "./add-edit-pricing-plan-button";
import { Pencil } from "lucide-react";

export const PricingList = () => {
  const usePlansQuery = useQuery(planQuery());
  const tableData: TableData = {
    caption: "Users in the system",
    head: ["ID", "Price", "Name", "Frequency", "Description", "Price ID"],
    body: usePlansQuery.data?.map((plan) => [
      plan.id,
      plan.price,
      badgeForFrequency(plan.frequency),
      plan.name,
      plan.description,
      plan.priceId,
      <AddEditPricingPlanButton
        key={plan.id}
        plan={plan}
        actionIconProps={{
          variant: "default",
          size: "sm",
          children: <Pencil size={12} />,
        }}
      />,
    ]),
  };

  if (usePlansQuery.isLoading) {
    return "Loading...";
  }
  return <Table data={tableData} />;
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
