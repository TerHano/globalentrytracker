import {
  SegmentedControl,
  SimpleGrid,
  Stack,
  Skeleton,
  Button,
  Text,
  Image,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { planQuery } from "~/api/plans-api";
import { PricingCard } from "./pricing-card";
import { PlanFrequency } from "~/enum/PlanFrequency";
import { useState } from "react";
import serverErrorImg from "~/assets/icons/500.png";

export interface PricingGridProps {
  allowPurchase: boolean;
}

export const PricingGrid = ({ allowPurchase }: PricingGridProps) => {
  const {
    data: plans,
    isFetching: isPlansLoading,
    isError: isPlansErrored,
  } = useQuery({
    ...planQuery(),
    throwOnError: false,
  });
  const [selectedFrequency, setSelectedFrequency] = useState(
    PlanFrequency.Monthly.toString()
  );

  if (isPlansErrored) {
    return (
      <Stack maw="40rem" justify="center" align="center" gap="md">
        <Image src={serverErrorImg} w="6rem" />
        <Text span fw={800} lh="1em" fz="1.5rem">
          Uh oh! Something went wrong
        </Text>
        <Text ta="center" span fw={500} lh="1em" fz={14}>
          We encountered an error getting our pricing plans. Please try again
          later.
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap="sm">
      <Stack gap={0} align="center" justify="center">
        <SegmentedControl
          value={selectedFrequency}
          onChange={setSelectedFrequency}
          data={[
            {
              label: "Weekly",
              value: PlanFrequency.Weekly.toString(),
            },

            {
              label: "Monthly",
              value: PlanFrequency.Monthly.toString(),
            },
          ]}
        />
      </Stack>
      <SimpleGrid cols={2} spacing="lg">
        {isPlansLoading ? (
          <>
            <SkeletonPriceCard />
            <SkeletonPriceCard />
          </>
        ) : (
          plans
            ?.filter(
              (p) =>
                p.frequency.toString() == selectedFrequency || p.price === 0
            )
            .map((plan) => (
              <PricingCard
                key={plan.id}
                priceId={plan.priceId}
                title={plan.name}
                price={plan.price}
                frequency={plan.frequency}
                description={plan.description}
                features={plan.features}
                showButton={allowPurchase}
              />
            ))
        )}
      </SimpleGrid>
    </Stack>
  );
};

const SkeletonPriceCard = () => {
  return (
    <Skeleton visible>
      <PricingCard
        key={"key"}
        priceId={""}
        title="Lorem ipsum dolor sit amet"
        price={0}
        frequency={PlanFrequency.Monthly}
        description="Lorem ipsum dolor sit amet"
        features={["Lorem ipsum dolor sit amet"]}
        showButton={false}
      />
    </Skeleton>
  );
};
