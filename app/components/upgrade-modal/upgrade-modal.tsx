import {
  Button,
  Modal,
  noop,
  SimpleGrid,
  Stack,
  Text,
  useModalsStack,
} from "@mantine/core";
import { Star } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useValidateSubscription } from "~/hooks/api/useValidateSubscription";
import { useReward } from "react-rewards";
import { useQuery } from "@tanstack/react-query";
import { planQuery } from "~/api/plans-api";
import { PricingCard } from "../pricing/pricing-card";

export interface UpgradeModalProps {
  stack: ReturnType<
    typeof useModalsStack<
      "upgrade-benefits" | "validation-successful" | "validation-failed"
    >
  >;
  onClose?: () => void;
  open: boolean;
}

export const UpgradeModal = ({
  open,
  onClose = noop,
  stack,
}: UpgradeModalProps) => {
  const { t } = useTranslation();

  const { data: plans } = useQuery(planQuery());
  const { reward } = useReward("confettiId", "confetti", {
    elementCount: 400,
    lifetime: 800,
    position: "absolute",
    spread: 90,
  });

  const handleClose = useCallback(() => {
    stack.closeAll();
    onClose();
  }, [onClose, stack]);
  const {
    mutate: mutateValidateSubscription,
    isPending: isValidateSubscriptionLoading,
  } = useValidateSubscription({
    onSuccess: (isUserSubscribed) => {
      // handleClose();
      if (isUserSubscribed) {
        stack.open("validation-successful");
      }
      if (!isUserSubscribed) {
        stack.open("validation-failed");
      }
    },
  });

  useEffect(() => {
    console.log("open", open, stack);
    if (open) {
      console.log("open");
      stack.open("upgrade-benefits");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Modal.Stack>
      <Modal
        size="xl"
        {...stack.register("upgrade-benefits")}
        //  opened={opened}
        //    onClose={handleClose}
        withCloseButton={false}
        onClose={handleClose}
      >
        <Stack w="100%" align="center" justify="center" gap="xs">
          <Star size={24} />

          <Text fw="bold" fz="h4">
            {t("Do More With Tracker Pro!")}
          </Text>
          <Text fz="sm" c="dimmed">
            {t("Upgrade to Tracker Pro for more features and benefits.")}
          </Text>
          <SimpleGrid w="100%" cols={{ xs: 1, sm: 2 }} spacing="lg">
            {plans?.map((plan) => (
              <PricingCard
                priceId={plan.priceId}
                key={plan.id}
                title={plan.name}
                description={plan.description}
                price={plan.price}
                features={plan.features}
                buttonText={"Upgrade"}
                frequency={plan.frequency}
              />
            ))}
          </SimpleGrid>

          <Button
            variant="subtle"
            c="yellow"
            loading={isValidateSubscriptionLoading}
            onClick={() => {
              mutateValidateSubscription();
            }}
          >
            {t("Validate Subscription")}
          </Button>
          <Button variant="subtle" color="dimmed" onClick={handleClose}>
            {t("Close")}
          </Button>
        </Stack>
      </Modal>
      <Modal
        size="lg"
        withCloseButton={false}
        onEnterTransitionEnd={() => {
          reward();
        }}
        {...stack.register("validation-successful")}
        onClose={handleClose}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none", // So it doesn't block clicks
            overflow: "hidden", // Prevent scrollbars from confetti
            justifyContent: "center",
            justifyItems: "center",
            display: "flex",
          }}
        >
          <span id="confettiId" />
        </div>
        <Stack
          style={{ width: "100%" }}
          align="center"
          justify="center"
          gap="xs"
        >
          <Star size={24} />

          <Text fw="bold" fz="h4">
            {t("You're Now A Pro!")}
          </Text>
          <Text fz="sm" c="dimmed">
            {t("Enjoy all the benefits of Tracker Pro.")}
          </Text>
          <Button variant="subtle" color="dimmed" onClick={handleClose}>
            {t("Close")}
          </Button>
        </Stack>
      </Modal>
      <Modal
        withCloseButton={false}
        onEnterTransitionEnd={() => {
          reward();
        }}
        {...stack.register("validation-failed")}
        onClose={handleClose}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none", // So it doesn't block clicks
            overflow: "hidden", // Prevent scrollbars from confetti
            justifyContent: "center",
            justifyItems: "center",
            display: "flex",
          }}
        >
          <span id="confettiId" />
        </div>
        <Stack
          style={{ width: "100%" }}
          align="center"
          justify="center"
          gap="xs"
        >
          <Star size={24} />

          <Text fw="bold" fz="h4">
            {t("Oops! You're Now A Loser!")}
          </Text>
          <Text fz="sm" c="dimmed">
            {t("Enjoy none of the benefits of Tracker Pro.")}
          </Text>
          <Button variant="subtle" color="dimmed" onClick={handleClose}>
            {t("Close")}
          </Button>
        </Stack>
      </Modal>
    </Modal.Stack>
  );
};
