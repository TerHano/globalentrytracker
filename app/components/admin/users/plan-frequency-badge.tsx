import { Badge } from "@mantine/core";
import { PlanFrequency } from "~/enum/PlanFrequency";

export const PlanFrequencyBadge = ({
  frequency,
}: {
  frequency: PlanFrequency;
}) => {
  return (
    <Badge radius="xs" variant="light" color={colorForFrequency(frequency)}>
      {textForFrequency(frequency)}
    </Badge>
  );
};

const textForFrequency = (frequency: PlanFrequency) => {
  switch (frequency) {
    case PlanFrequency.Monthly:
      return "Monthly";
    case PlanFrequency.Weekly:
      return "Weekly";
    default:
      return "Unknown";
  }
};

const colorForFrequency = (frequency: PlanFrequency) => {
  switch (frequency) {
    case PlanFrequency.Monthly:
      return "blue";
    case PlanFrequency.Weekly:
      return "green";
    default:
      return "gray";
  }
};
