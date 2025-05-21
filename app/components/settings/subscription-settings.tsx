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
import { useShowUpgradeModalContext } from "~/hooks/useShowUpgradeModal";

export const SubscriptionSettings = () => {
  const { t } = useTranslation();
  const [isNavigating, setIsNavigating] = useState(false);
  const { showUpgradeModal } = useShowUpgradeModalContext();
  const {
    data: subscriptionInformation,
    isLoading: isSubscriptionInfoLoading,
  } = useQuery({ ...subscriptionInformationQuery(), staleTime: 1000000 });
  const { mutate: mutateManageSubscription } = useManageSubscription({
    onError: () => {
      setIsNavigating(false);
    },
  });

  const hasActiveBilling =
    subscriptionInformation?.activeBilledSubscription ?? false;

  const subscriptionAmount = useMemo(() => {
    if (subscriptionInformation?.planPrice !== undefined) {
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
    if (hasActiveBilling) {
      return (
        <Text span>
          {subscriptionAmount} / {intervalText}
        </Text>
      );
    } else return "--";
  }, [intervalText, hasActiveBilling, subscriptionAmount]);

  const nextPaymentDateText = useMemo(() => {
    if (hasActiveBilling) {
      return (
        <Text>
          {subscriptionInformation?.nextPaymentDate
            ? new Date(
                subscriptionInformation.nextPaymentDate
              ).toLocaleDateString()
            : "--"}
        </Text>
      );
    }
    return "--";
  }, [hasActiveBilling, subscriptionInformation]);

  return (
    <Page.Subsection
      className="fade-in-up-animation"
      header="Subscription Settings"
      description="Check out your subscription information"
    >
      <Stack gap="md">
        <SimpleGrid cols={{ xs: 1, sm: 2 }} spacing="lg">
          <Skeleton visible={isSubscriptionInfoLoading}>
            <LabelValue
              label={t("Plan")}
              labelRightSection={
                <Badge color={"green"} variant="light" size="xs" radius="xs">
                  {t("Active")}
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
              {hasActiveBilling ? (
                <Group>
                  <CreditCardIcon name={subscriptionInformation?.cardBrand} />
                  <Text>
                    {subscriptionInformation?.cardLast4Digits
                      ? `**** **** **** ${subscriptionInformation.cardLast4Digits}`
                      : "--"}
                  </Text>
                </Group>
              ) : (
                <>--</>
              )}
            </LabelValue>
          </Skeleton>
        </SimpleGrid>
        <Divider />
        <Flex justify="flex-end">
          <Skeleton width="fit-content" visible={isSubscriptionInfoLoading}>
            {hasActiveBilling ? (
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
              <Button onClick={showUpgradeModal}>{t("Upgrade")}</Button>
            )}
          </Skeleton>
        </Flex>
      </Stack>
    </Page.Subsection>
  );
};
