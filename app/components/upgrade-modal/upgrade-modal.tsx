import {
  Button,
  Modal,
  noop,
  Stack,
  Text,
  useModalsStack,
} from "@mantine/core";
import { Star } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { PricingGrid } from "../pricing/pricing-grid";
import { Confetti, type ConfettiHandle } from "../ui/confetti";

export interface UpgradeModalProps {
  stack: ReturnType<typeof useModalsStack<"upgrade-benefits">>;
  onClose?: () => void;
  open: boolean;
}

export const UpgradeModal = ({
  open,
  onClose = noop,
  stack,
}: UpgradeModalProps) => {
  const { t } = useTranslation();
  const confettiRef = useRef<ConfettiHandle>(null);

  const shootConfetti = () => {
    if (confettiRef.current) {
      confettiRef.current.shootConfetti();
    }
  };

  const handleClose = useCallback(() => {
    stack.closeAll();
    onClose();
  }, [onClose, stack]);

  useEffect(() => {
    if (open) {
      stack.open("upgrade-benefits");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Modal.Stack>
      <Modal
        onEnterTransitionEnd={() => {
          shootConfetti();
        }}
        size="xl"
        transitionProps={{ duration: 300, transition: "fade-up" }}
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
          <PricingGrid showFreePlan={false} allowPurchase={true} />
          {/* <SimpleGrid w="100%" cols={{ xs: 1, sm: 2 }} spacing="lg">
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
          </SimpleGrid> */}

          <Button variant="subtle" color="dimmed" onClick={handleClose}>
            {t("Close")}
          </Button>
        </Stack>
      </Modal>
    </Modal.Stack>
  );
};
