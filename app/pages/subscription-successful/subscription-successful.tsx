import { Paper, Title, Text, Stack, Button } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import { QUERY_KEYS } from "~/api/query-keys";
import { Confetti, type ConfettiHandle } from "~/components/ui/confetti";

export const SubscriptionSuccessfulPage = () => {
  const confettiRef = useRef<ConfettiHandle>(null);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const shootConfetti = () => {
    if (confettiRef.current) {
      confettiRef.current.shootConfetti();
    }
  };

  useEffect(() => {
    shootConfetti();
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ME });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PERMISSIONS });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUBSCRIPTION });
  }, [queryClient]);
  // useEffect(() => {

  return (
    <Paper shadow="xs" p="md" withBorder>
      <Confetti />
      <Stack
        className="fade-in-up-animation"
        justify="center"
        align="center"
        gap="md"
      >
        <Star size={32} color="green" />

        <Title>{t("Subscription Successful")}</Title>
        <Text>{t("Your subscription has been successfully activated.")}</Text>

        <NavLink to="/dashboard">
          {({ isPending }) => (
            <Button loading={isPending} variant="subtle" color="dimmed">
              {t("Go to Dashboard")}
            </Button>
          )}
        </NavLink>
      </Stack>
    </Paper>
  );
};
