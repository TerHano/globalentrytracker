import {
  Button,
  Group,
  Image,
  Paper,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { NavLink } from "react-router";
import { trackedLocationsQuery } from "~/api/tracked-locations-api";
import { Empty } from "../ui/empty";
import noTrackersImg from "~/assets/icons/no-trackers-bell.png";
import { CircleHelp } from "lucide-react";
import { LabelValue } from "../ui/label-value";
import { useTranslation } from "react-i18next";
import { nextNotificationQuery } from "~/api/next-notification-api";
import { DeleteAllTrackers } from "../delete-all-trackers-button";
import { ActionableTrackerCard } from "./actionable-tracker-card";

export const ActiveTrackers = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery(trackedLocationsQuery());
  const { data: nextNotification } = useQuery({
    ...nextNotificationQuery(),
    refetchInterval: 1000 * 60 * 10,
    throwOnError: false,
  });

  const nextNotificationDate = useMemo(() => {
    if (nextNotification) {
      try {
        const date = new Date(nextNotification);
        return date.toLocaleString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      } catch (error) {
        console.warn("Failed to format notification date:", error);
        return "--";
      }
    }
    return "--";
  }, [nextNotification]);

  const trackedLocationsList = useMemo(() => {
    if (!data && isLoading) {
      return <Skeleton height={200} w="full" />;
    }
    if (!data || data.length === 0) {
      return (
        <Empty
          action={
            <NavLink to={"/create-tracker"}>
              {({ isPending }) => (
                <Button loading={isPending}>Add Tracker</Button>
              )}
            </NavLink>
          }
          icon={<Image h={60} w={60} src={noTrackersImg} alt="No Trackers" />}
          title="No Trackers"
          description="You have no active trackers. Add one to start tracking your locations."
        />
      );
    }
    return data.map((location) => (
      <ActionableTrackerCard key={location.id} tracker={location} />
    ));
  }, [data, isLoading]);

  return (
    <section className="flex flex-col gap-4" aria-label="Your active trackers">
      <Paper shadow="sm" p="lg" radius="md" withBorder>
        <Stack>
          <Stack gap={0}>
            <Group justify="space-between">
              <Stack gap={0}>
                <Text fw="bold" fz={{ base: "h5", sm: "h3" }} as="h2">
                  Trackers
                </Text>
                <Text c="dimmed" fz={{ base: "xs", sm: "sm" }}>
                  Here you can see all your trackers
                </Text>
              </Stack>
              <LabelValue
                labelRightSection={
                  <Tooltip
                    multiline
                    w={200}
                    label={t(
                      "This is the next time the application will scan for appointments that match your preferences.",
                    )}
                  >
                    <CircleHelp size={14} />
                  </Tooltip>
                }
                label={t("Next Check By")}
              >
                <Text c="dimmed">{nextNotificationDate}</Text>
              </LabelValue>
            </Group>
          </Stack>

          {trackedLocationsList}
        </Stack>
      </Paper>
      <DeleteAllTrackers visible={(data && data.length > 0) ?? false} />
    </section>
  );
};
