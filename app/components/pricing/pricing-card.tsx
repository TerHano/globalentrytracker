import {
  Button,
  Group,
  Indicator,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { CircleCheck, ExternalLink, Star } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlanFrequency } from "~/enum/PlanFrequency";
import { useUpgradeSubscription } from "~/hooks/api/useUpgradeSubscription";

interface PricingCardTagProps {
  text: string;
  color: string;
}

export interface PricingCardProps {
  priceId: string;
  isCurrentPlan?: boolean;
  tag?: PricingCardTagProps;
  className?: string;
  title: string;
  description: string;
  price: string;
  discountPrice?: string;
  features: string[];
  buttonText: string;
  frequency: PlanFrequency;
}

export const PricingCard = ({
  priceId,
  className,
  title,
  description,
  discountPrice,
  price,
  features,
  isCurrentPlan,
  tag,
  frequency,
}: PricingCardProps) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const { t } = useTranslation();

  const { mutate: mutateCheckout } = useUpgradeSubscription({
    onError: (error) => {
      console.error("Error during checkout:", error);
      setIsNavigating(false);
    },
  });

  const getPlanFrequencyText = (frequency: PlanFrequency) => {
    switch (frequency) {
      case PlanFrequency.Monthly:
        return t("Month");
      case PlanFrequency.Weekly:
        return t("Week");
      default:
        return t("Unknown");
    }
  };

  const getPlanPriceText = (price: string, frequency: PlanFrequency) => {
    const frequencyText = getPlanFrequencyText(frequency);
    return `$${price} / ${frequencyText}`;
  };

  return (
    <Indicator
      radius="sm"
      disabled={!tag}
      color={tag?.color}
      label={
        <Group gap={5}>
          <Star size={14} />
          <Text fz="xs" fw="bold">
            {tag?.text}
          </Text>
        </Group>
      }
      position="top-center"
      size={25}
    >
      <Paper className={className} withBorder p="sm">
        <Stack gap="xs">
          <Stack gap={0}>
            <Text fz="lg" fw="bold">
              {title}
            </Text>
            <Text c="dimmed" fz="sm">
              {description}
            </Text>
          </Stack>
          <Group align="baseline" gap="xs">
            {discountPrice && (
              <Text fz="xl" fw="bold">
                {getPlanPriceText(discountPrice, frequency)}
              </Text>
            )}
            <Text
              span
              td={discountPrice ? "line-through" : undefined}
              c={discountPrice ? "dimmed" : undefined}
              fz={discountPrice ? "md" : "xl"}
              fw="bold"
            >
              {getPlanPriceText(price, frequency)}
            </Text>
          </Group>
          {isCurrentPlan ? (
            <Button variant="white" disabled>
              Current Plan
            </Button>
          ) : (
            <Button
              loading={isNavigating}
              rightSection={<ExternalLink size={16} color="white" />}
              onClick={() => {
                setIsNavigating(true);
                mutateCheckout(priceId);
              }}
            >
              Select Plan
            </Button>
          )}
          <Stack gap={3}>
            {features.map((feature, index) => (
              <Group gap="xs" key={index}>
                <ThemeIcon color="teal" size={15} radius="xl">
                  <CircleCheck size={12} />
                </ThemeIcon>
                {/* <CircleCheck fill="teal" size={18} /> */}
                <Text fw={600} fz="sm">
                  {feature}
                </Text>
              </Group>
            ))}
          </Stack>
        </Stack>
      </Paper>
    </Indicator>
  );
};
