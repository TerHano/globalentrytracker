import {
  Button,
  Group,
  Indicator,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { CircleCheck, Star } from "lucide-react";

interface PricingCardTagProps {
  text: string;
  color: string;
}

export interface PricingCardProps {
  isCurrentPlan?: boolean;
  tag?: PricingCardTagProps;
  className?: string;
  title: string;
  description: string;
  price: string;
  discountPrice?: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
}

export const PricingCard = ({
  className,
  title,
  description,
  discountPrice,
  price,
  features,
  isCurrentPlan,
  tag,
}: PricingCardProps) => {
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
                ${discountPrice} <Text span>/ month</Text>
              </Text>
            )}
            <Text
              span
              td={discountPrice ? "line-through" : undefined}
              c={discountPrice ? "dimmed" : undefined}
              fz={discountPrice ? "md" : "xl"}
              fw="bold"
            >
              ${price} <Text span>{discountPrice ? undefined : "/ month"}</Text>
            </Text>
          </Group>
          {isCurrentPlan ? (
            <Button variant="white" disabled>
              Current Plan
            </Button>
          ) : (
            <Button>Change Plan</Button>
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
