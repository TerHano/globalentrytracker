import {
  Button,
  Modal,
  noop,
  Stack,
  Text,
  useModalsStack,
} from "@mantine/core";
import { ExternalLink, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUpgradeSubscription } from "~/hooks/api/useUpgradeSubscription";
import { useValidateSubscription } from "~/hooks/api/useValidateSubscription";
import { useReward } from "react-rewards";

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
  const [isNavigating, setIsNavigating] = useState(false);
  // const stack = useModalsStack([
  //   "upgrade-benefits",
  //   "validation-successful",
  //   "validation-failed",
  // ]);

  const { reward } = useReward("confettiId", "confetti", {
    elementCount: 200,
    position: "absolute",
    spread: 90,
  });

  const handleClose = useCallback(() => {
    stack.closeAll();
    onClose();
    // setOpened(false);
  }, [onClose, stack]);

  const { mutate: mutateCheckout } = useUpgradeSubscription({
    onError: (error) => {
      console.error("Error during checkout:", error);
      setIsNavigating(false);
    },
  });
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
  }, [open]);

  return (
    <Modal.Stack>
      <Modal
        {...stack.register("upgrade-benefits")}
        //  opened={opened}
        //    onClose={handleClose}
        withCloseButton={false}
        onClose={handleClose}
      >
        <Stack
          style={{ width: "100%" }}
          align="center"
          justify="center"
          gap="xs"
        >
          <Star size={24} />

          <Text fw="bold" fz="h4">
            {t("Do More With Tracker Pro!")}
          </Text>
          <Text fz="sm" c="dimmed">
            {t("Upgrade to Tracker Pro for more features and benefits.")}
          </Text>

          <Button
            loading={isNavigating}
            onClick={() => {
              setIsNavigating(true);
              mutateCheckout();
            }}
            rightSection={<ExternalLink size={16} />}
          >
            {t("Upgrade Now")}
          </Button>
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
        Nice YOUR A PRO!
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
        WOOPS!!
      </Modal>
    </Modal.Stack>
  );
};
