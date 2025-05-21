import { Paper, Title, Text, Stack, Button } from "@mantine/core";
import { Star } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useReward } from "react-rewards";
import { NavLink } from "react-router";

export const SubscriptionSuccessfulPage = () => {
  const { t } = useTranslation();
  const { reward } = useReward("confettiId", "confetti", {
    elementCount: 200,
    lifetime: 300,
    position: "absolute",
    spread: 180,
  });

  useEffect(() => {
    // Start the confetti animation when the component mounts
    reward();
  }, []);
  // useEffect(() => {

  return (
    <Paper shadow="xs" p="md" withBorder>
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
