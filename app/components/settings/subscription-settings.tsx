import {
  Badge,
  Button,
  Divider,
  Flex,
  Group,
  InputWrapper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { Page } from "../ui/page";
import { useQuery } from "@tanstack/react-query";
import { subscriptionInformationQuery } from "~/api/subscription-information-api";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import { useManageSubscription } from "~/hooks/api/useManageSubscription";
import { useMemo, useState } from "react";
import { LabelValue } from "../ui/label-value";
import { CreditCardIcon } from "../ui/icons/CreditCardIcon";
import { useUpgradeSubscription } from "~/hooks/api/useUpgradeSubscription";

export const SubscriptionSettings = () => {
  const { t } = useTranslation();
  const [isNavigating, setIsNavigating] = useState(false);
  const {
    data: subscriptionInformation,
    isLoading: isSubscriptionInfoLoading,
  } = useQuery({ ...subscriptionInformationQuery(), staleTime: 1000000 });
  const { mutate: mutateManageSubscription } = useManageSubscription({
    onError: () => {
      setIsNavigating(false);
    },
  });
  const { mutate: mutateCheckout } = useUpgradeSubscription({
    onError: () => {
      setIsNavigating(false);
    },
  });

  const isSubscriptionActive = useMemo(() => {
    if (subscriptionInformation?.active) {
      return subscriptionInformation.active;
    }
    return false;
  }, [subscriptionInformation]);

  const subscriptionAmount = useMemo(() => {
    if (subscriptionInformation?.planPrice) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: subscriptionInformation.currency,
      }).format(subscriptionInformation.planPrice / 100);
    }
    return "";
  }, [subscriptionInformation]);

  const intervalText = useMemo(() => {
    if (subscriptionInformation?.planInterval === "month") {
      return t("Month");
    }
    if (subscriptionInformation?.planInterval === "year") {
      return t("Year");
    }
    return t("Unknown");
  }, [subscriptionInformation, t]);

  const paymentAmountText = useMemo(() => {
    if (isSubscriptionActive) {
      return (
        <Text span>
          {subscriptionAmount} / {intervalText}
        </Text>
      );
    } else return "--";
  }, [intervalText, isSubscriptionActive, subscriptionAmount]);

  const nextPaymentDateText = useMemo(() => {
    if (isSubscriptionActive) {
      return (
        <Text>
          {subscriptionInformation?.nextPaymentDate
            ? new Date(
                subscriptionInformation.nextPaymentDate
              ).toLocaleDateString()
            : t("No payment date available")}
        </Text>
      );
    }
    return "--";
  }, [isSubscriptionActive, subscriptionInformation, t]);

  return (
    <Page.Subsection
      className="fade-in-animation"
      header="Subscription Settings"
      description="Check out your subscription information"
    >
      <Stack gap="md">
        <SimpleGrid cols={{ xs: 1, sm: 2 }} spacing="lg">
          <Skeleton visible={isSubscriptionInfoLoading}>
            <LabelValue
              label={t("Plan")}
              labelRightSection={
                <Badge
                  color={subscriptionInformation?.active ? "green" : "red"}
                  variant="light"
                  size="xs"
                  radius="xs"
                >
                  {subscriptionInformation?.active
                    ? t("Active")
                    : t("Inactive")}
                </Badge>
              }
            >
              <Text>{subscriptionInformation?.planName ?? "PLAN_NAME"}</Text>
            </LabelValue>
          </Skeleton>

          <Skeleton visible={isSubscriptionInfoLoading}>
            <LabelValue
              label={
                subscriptionInformation?.isEnding
                  ? t("End Date")
                  : t("Next Payment Date")
              }
            >
              {nextPaymentDateText}
            </LabelValue>
          </Skeleton>

          <Skeleton visible={isSubscriptionInfoLoading}>
            <LabelValue label={t("Amount")}>{paymentAmountText}</LabelValue>
            <InputWrapper></InputWrapper>
          </Skeleton>
          <Skeleton visible={isSubscriptionInfoLoading}>
            <LabelValue label={t("Payment Method")}>
              {isSubscriptionActive ? (
                <Group>
                  <CreditCardIcon name={subscriptionInformation?.cardBrand} />
                  <Text>
                    {subscriptionInformation?.cardLast4Digits
                      ? `**** **** **** ${subscriptionInformation.cardLast4Digits}`
                      : t("No payment method available")}
                  </Text>
                </Group>
              ) : (
                <>--</>
              )}
            </LabelValue>
          </Skeleton>
        </SimpleGrid>
        <Divider my="md" />
        <Flex justify="flex-end">
          <Skeleton width="fit-content" visible={isSubscriptionInfoLoading}>
            {isSubscriptionActive ? (
              <Button
                loading={isNavigating}
                onClick={() => {
                  mutateManageSubscription();
                  setIsNavigating(true);
                }}
                rightSection={<ExternalLink size={16} />}
              >
                {t("Manage Subscription")}
              </Button>
            ) : (
              <Button
                rightSection={<ExternalLink size={16} />}
                loading={isNavigating}
                onClick={() => {
                  mutateCheckout();
                  setIsNavigating(true);
                }}
                color="teal"
              >
                {t("Resubscribe")}
              </Button>
            )}
          </Skeleton>
        </Flex>
      </Stack>
    </Page.Subsection>
  );
};
