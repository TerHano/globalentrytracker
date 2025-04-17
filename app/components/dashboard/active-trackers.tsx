import {
  Button,
  Card,
  Image,
  Paper,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Link, NavLink } from "react-router";
import {
  trackedLocationsQuery,
  type TrackedLocation,
} from "~/api/tracked-locations-api";
import { Empty } from "../ui/empty";
import { TicketsPlane } from "lucide-react";
import notificationBellIcon from "~/assets/icons/notification-bell.png";
import { TrackerCard } from "./tracker-card";

interface ActiveTrackersProps {
  trackedLocations: TrackedLocation[];
}

export const ActiveTrackers = ({ trackedLocations }: ActiveTrackersProps) => {
  const { data, isLoading, isPending } = useQuery({
    ...trackedLocationsQuery,
    initialData: trackedLocations,
  });

  const trackedLocationsList = useMemo(() => {
    if (!data && isLoading) {
      return <Skeleton height={200} w="full" />;
    }
    if (!data || data.length === 0) {
      return (
        <>
          <Empty
            action={
              <NavLink viewTransition to={"/create-tracker"}>
                <Button>Add Tracker</Button>
              </NavLink>
            }
            icon={
              <Image
                h={60}
                w={60}
                src={notificationBellIcon}
                alt="No Trackers"
              />
            }
            title="No Trackers"
            description="You have no active trackers. Add one to start tracking your
            locations."
          />{" "}
        </>
      );
    }
    return data.map((location) => <TrackerCard tracker={location} />);
  }, [data]);

  return (
    <section className="flex flex-col gap-4">
      <Paper shadow="sm" p="lg" radius="md" withBorder>
        <Stack>
          <Stack gap={0}>
            <Text fw="bold" fz={{ base: "h5", sm: "h3" }}>
              Active Trackers
            </Text>
            <Text c="dimmed" fz={{ base: "xs", sm: "sm" }}>
              Here you can see all your active trackers
            </Text>
          </Stack>

          {trackedLocationsList}
        </Stack>
      </Paper>
    </section>
  );
};
