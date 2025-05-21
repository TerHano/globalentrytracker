import { SegmentedControl, SimpleGrid, Stack, Skeleton } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { planQuery } from "~/api/plans-api";
import { PricingCard } from "./pricing-card";
import { PlanFrequency } from "~/enum/PlanFrequency";
import { useState } from "react";

export interface PricingGridProps {
  allowPurchase: boolean;
}

export const PricingGrid = ({ allowPurchase }: PricingGridProps) => {
  const { data: plans, isFetching: isPlansLoading } = useQuery(planQuery());
  const [selectedFrequency, setSelectedFrequency] = useState(
    PlanFrequency.Monthly.toString()
  );

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
      <SimpleGrid cols={{ xs: 1, sm: 2, lg: 2 }} spacing="lg">
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
